import { GoogleGenerativeAI } from '@google/generative-ai';
import { getNikolSystemPrompt } from '../../../data/nikolSystemPrompt';
import { LANGUAGES } from '../../../constants/translations';

export const runtime = 'nodejs';
export const maxDuration = 60;

const FETCH_MS = 55_000;
const LIST_MODELS_MS = 12_000;

/** Bazowa kolejność (gdy listowanie modeli z API się nie uda). */
function buildGeminiModelTryList() {
  const seen = new Set();
  const list = [];
  const add = (m) => {
    const t = typeof m === 'string' ? m.trim() : '';
    if (!t || seen.has(t)) return;
    seen.add(t);
    list.push(t);
  };
  add(process.env.GEMINI_MODEL);
  add(process.env.GEMINI_MODEL_FALLBACK);
  add('gemini-2.0-flash');
  add('gemini-2.0-flash-001');
  add('gemini-1.5-flash');
  add('gemini-1.5-flash-002');
  add('gemini-1.5-flash-latest');
  return list;
}

/**
 * Pobiera z Google listę modeli z generateContent dla tego klucza — unika „404 model not found”.
 */
async function buildFullModelList(apiKey) {
  const base = buildGeminiModelTryList();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LIST_MODELS_MS);
  const extra = [];
  try {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models?pageSize=100',
      {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
      }
    );
    const raw = await res.text();
    if (!res.ok) {
      console.error('[chat] listModels', res.status, raw.slice(0, 400));
    } else {
      let data;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        console.error('[chat] listModels JSON', e?.message);
        data = { models: [] };
      }
      for (const m of data.models || []) {
        const id = String(m.name || '').replace(/^models\//, '');
        const methods = m.supportedGenerationMethods || [];
        if (!id || !methods.includes('generateContent')) continue;
        if (/embed/i.test(id) && !/flash/i.test(id)) continue;
        extra.push(id);
      }
      extra.sort((a, b) => {
        const rank = (s) => {
          if (/gemini-2\.\d+.*flash/i.test(s)) return 0;
          if (/gemini-2\.0.*flash/i.test(s)) return 1;
          if (/gemini-1\.5.*flash/i.test(s)) return 2;
          if (/flash/i.test(s)) return 3;
          return 50;
        };
        return rank(a) - rank(b);
      });
    }
  } catch (e) {
    console.error('[chat] listModels catch', e?.message || e);
  } finally {
    clearTimeout(timer);
  }

  const seen = new Set();
  const out = [];
  for (const id of [...base, ...extra]) {
    if (!seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

function chatJson(payload, status = 200) {
  return Response.json(payload, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function getGeminiApiKey() {
  let k =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GOOGLE_AI_API_KEY?.trim() ||
    '';
  if (!k) return '';
  k = k.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) {
    k = k.slice(1, -1).trim();
  }
  if (k.toLowerCase().startsWith('bearer ')) {
    k = k.slice(7).trim();
  }
  return k;
}

const MAX_MESSAGES = 24;
const MAX_USER_CHARS = 4000;

function sanitizeMessages(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    if (!m || typeof m !== 'object') continue;
    const role = m.role === 'assistant' ? 'assistant' : m.role === 'user' ? 'user' : null;
    if (!role) continue;
    let content = typeof m.content === 'string' ? m.content.trim() : '';
    if (!content) continue;
    if (content.length > MAX_USER_CHARS) content = `${content.slice(0, MAX_USER_CHARS)}…`;
    out.push({ role, content });
  }
  return out;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function formatGeminiCaughtError(err) {
  if (!err || typeof err !== 'object') return String(err);
  const bits = [];
  if (err.message) bits.push(err.message);
  if (err.status != null) bits.push(`status=${err.status}`);
  if (err.statusText) bits.push(String(err.statusText));
  if (Array.isArray(err.errorDetails) && err.errorDetails.length) {
    try {
      bits.push(JSON.stringify(err.errorDetails).slice(0, 400));
    } catch {
      /* ignore */
    }
  }
  const s = bits.join(' | ');
  return s.length > 900 ? `${s.slice(0, 900)}…` : s;
}

function toGeminiRestContents(messages) {
  return messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}

function extractRestText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts
    .map((p) => (typeof p?.text === 'string' ? p.text : ''))
    .join('')
    .trim();
}

/**
 * POST generateContent: najpierw nagłówek x-goog-api-key, potem ?key= (niektóre środowiska/proxy).
 * Kolejność API: v1beta → v1.
 */
async function geminiRestExecute(apiKey, model, body, signal) {
  const attempts = [
    ['v1beta', false],
    ['v1beta', true],
    ['v1', false],
    ['v1', true],
  ];
  let lastRes = null;
  for (const [ver, useQueryKey] of attempts) {
    const pathVer = ver === 'v1' ? 'v1' : 'v1beta';
    const path = `https://generativelanguage.googleapis.com/${pathVer}/models/${encodeURIComponent(model)}:generateContent`;
    const url = useQueryKey ? `${path}?key=${encodeURIComponent(apiKey)}` : path;
    const headers = {
      'Content-Type': 'application/json',
      ...(useQueryKey ? {} : { 'x-goog-api-key': apiKey }),
    };
    const res = await fetch(url, {
      method: 'POST',
      signal,
      headers,
      body: JSON.stringify(body),
    });
    lastRes = res;
    if (res.ok) return res;
    if (res.status === 429) return res;
  }
  return lastRes;
}

async function runGeminiRestChat(system, messages, apiKey, modelIds) {
  let lastReason = null;

  for (const modelName of modelIds) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_MS);
    try {
      const body = {
        systemInstruction: { parts: [{ text: system }] },
        contents: toGeminiRestContents(messages),
        generationConfig: {
          temperature: 0.65,
          maxOutputTokens: 900,
        },
      };

      let res = await geminiRestExecute(apiKey, modelName, body, controller.signal);
      if (res.status === 429) {
        await sleep(2000);
        res = await geminiRestExecute(apiKey, modelName, body, controller.signal);
      }
      const raw = await res.text();
      if (!res.ok) {
        lastReason = `REST ${res.status}: ${raw.slice(0, 450)}`;
        console.error('[chat] Gemini REST', modelName, lastReason);
        continue;
      }
      let data;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        lastReason = `REST json: ${e?.message}`;
        continue;
      }
      const text = extractRestText(data);
      if (text) return { message: text };
      const fr = data?.candidates?.[0]?.finishReason || data?.promptFeedback?.blockReason;
      lastReason = fr ? `REST empty: ${fr}` : 'REST empty response';
      console.error('[chat] Gemini REST empty', modelName, lastReason, raw.slice(0, 400));
    } catch (e) {
      lastReason = e?.name === 'AbortError' ? 'REST timeout' : e?.message || String(e);
      console.error('[chat] Gemini REST catch', modelName, lastReason);
    } finally {
      clearTimeout(timer);
    }
  }

  return { error: 'upstream', reason: lastReason };
}

async function runGeminiMergedFirstTurn(system, userText, apiKey, modelIds) {
  const combined = `[Instrukcja systemowa dla asystenta]\n${system}\n\n---\n[Wiadomość klienta]\n${userText}`;
  let lastReason = null;

  for (const modelName of modelIds) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_MS);
    try {
      const body = {
        contents: [{ role: 'user', parts: [{ text: combined }] }],
        generationConfig: { temperature: 0.65, maxOutputTokens: 900 },
      };
      let res = await geminiRestExecute(apiKey, modelName, body, controller.signal);
      const raw = await res.text();
      if (!res.ok) {
        lastReason = `merged REST ${res.status}: ${raw.slice(0, 350)}`;
        continue;
      }
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        lastReason = 'merged invalid JSON';
        continue;
      }
      const text = extractRestText(data);
      if (text) return { message: text };
      lastReason = 'merged empty';
    } catch (e) {
      lastReason = e?.message || String(e);
    } finally {
      clearTimeout(timer);
    }
  }
  return { error: 'upstream', reason: lastReason };
}

async function runGeminiSdkChat(system, messages, apiKey, modelIds) {
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user') {
    return { error: 'upstream', reason: 'last_not_user' };
  }

  let lastReason = null;

  for (const modelName of modelIds) {
    const runOnce = async () => {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: system,
        generationConfig: {
          temperature: 0.65,
          maxOutputTokens: 900,
        },
      });

      let text;
      if (messages.length === 1) {
        const result = await model.generateContent(last.content);
        text = result.response.text();
      } else {
        const history = messages.slice(0, -1).map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(last.content);
        text = result.response.text();
      }

      const trimmed = typeof text === 'string' ? text.trim() : '';
      if (trimmed) return { message: trimmed };
      lastReason = 'empty_response';
      console.error('[chat] Gemini SDK empty text', modelName);
      return null;
    };

    try {
      const out = await runOnce();
      if (out) return out;
    } catch (e) {
      const msg = e?.message || String(e);
      const is429 =
        msg.includes('429') ||
        msg.toLowerCase().includes('resource exhausted') ||
        msg.toLowerCase().includes('too many requests');
      if (is429) {
        await sleep(2500);
        try {
          const out2 = await runOnce();
          if (out2) return out2;
        } catch (e2) {
          lastReason = formatGeminiCaughtError(e2);
          console.error('[chat] Gemini SDK error after 429 retry', modelName, lastReason);
        }
      } else {
        lastReason = formatGeminiCaughtError(e);
        console.error('[chat] Gemini SDK error', modelName, lastReason);
      }
    }
  }

  return { error: 'upstream', reason: lastReason };
}

async function runGeminiChat(system, messages, apiKey) {
  const modelIds = await buildFullModelList(apiKey);
  console.info('[chat] models to try (first 8):', modelIds.slice(0, 8).join(', '));

  const rest = await runGeminiRestChat(system, messages, apiKey, modelIds);
  if (rest.message) return rest;

  if (messages.length === 1 && messages[0].role === 'user') {
    console.warn('[chat] REST failed, merged first-turn fallback');
    const merged = await runGeminiMergedFirstTurn(system, messages[0].content, apiKey, modelIds);
    if (merged.message) return merged;
  }

  console.warn('[chat] merged failed, SDK');
  const sdk = await runGeminiSdkChat(system, messages, apiKey, modelIds);
  if (sdk.message) return sdk;

  return {
    error: 'upstream',
    reason: sdk.reason || rest.reason,
  };
}

export async function GET() {
  const key = getGeminiApiKey();
  const rawGemini = process.env.GEMINI_API_KEY;
  const rawGoogleGen = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  return Response.json(
    {
      ok: true,
      service: 'nikol-chat',
      geminiKeyChars: key.length,
      /** Czy nazwa zmiennej w ogóle istnieje w środowisku (bez ujawniania wartości). */
      envPresent: {
        GEMINI_API_KEY: typeof rawGemini === 'string' && rawGemini.length > 0,
        GOOGLE_GENERATIVE_AI_API_KEY: typeof rawGoogleGen === 'string' && rawGoogleGen.length > 0,
      },
      hint:
        key.length === 0
          ? 'geminiKeyChars=0: add GEMINI_API_KEY for Production in Vercel, Save, Redeploy. If envPresent.GEMINI_API_KEY is false, the variable is missing or not deployed to this environment.'
          : 'Key resolved. If chat still fails, check POST response `error` and `reason`.',
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return chatJson({ error: 'invalid_json' });
    }

    const lang = body.lang === LANGUAGES.RU ? LANGUAGES.RU : LANGUAGES.PL;
    const messages = sanitizeMessages(body.messages);
    if (!messages.length) {
      return chatJson({ error: 'no_messages' });
    }

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      console.error('[chat] missing_key — GEMINI_API_KEY empty after normalize; check Vercel Production + Redeploy');
      return chatJson({
        error: 'missing_key',
        hint: 'Server has no usable GEMINI_API_KEY. Vercel → Env → Production → Redeploy.',
      });
    }

    const system = getNikolSystemPrompt(lang);
    const out = await runGeminiChat(system, messages, apiKey);

    if (out.error) {
      return chatJson(out);
    }

    return chatJson({ message: out.message });
  } catch (e) {
    console.error('[chat] unhandled', e);
    return chatJson({ error: 'server' });
  }
}
