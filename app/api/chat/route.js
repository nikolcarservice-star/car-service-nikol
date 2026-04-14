import { GoogleGenerativeAI } from '@google/generative-ai';
import { getNikolSystemPrompt } from '../../../data/nikolSystemPrompt';
import { LANGUAGES } from '../../../constants/translations';

export const runtime = 'nodejs';
export const maxDuration = 60;

const FETCH_MS = 55_000;

/** Kolejność: env → modele stabilne dla AI Studio. */
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
    '';
  if (!k) return '';
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

async function geminiRestGenerateContent(apiVersion, apiKey, model, system, messages, signal) {
  const ver = apiVersion === 'v1' ? 'v1' : 'v1beta';
  const url = `https://generativelanguage.googleapis.com/${ver}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: toGeminiRestContents(messages),
    generationConfig: {
      temperature: 0.65,
      maxOutputTokens: 900,
    },
  };
  return fetch(url, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** Jedno żądanie REST: v1beta, przy 404 ten sam payload na v1. */
async function geminiRestTryModel(apiKey, modelName, system, messages, signal) {
  let res = await geminiRestGenerateContent('v1beta', apiKey, modelName, system, messages, signal);
  if (res.status === 404) {
    res = await geminiRestGenerateContent('v1', apiKey, modelName, system, messages, signal);
  }
  return res;
}

async function runGeminiRestChat(system, messages, apiKey) {
  const models = buildGeminiModelTryList();
  let lastReason = null;

  for (const modelName of models) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_MS);
    try {
      let res = await geminiRestTryModel(apiKey, modelName, system, messages, controller.signal);
      if (res.status === 429) {
        await sleep(2000);
        res = await geminiRestTryModel(apiKey, modelName, system, messages, controller.signal);
      }
      const raw = await res.text();
      if (!res.ok) {
        lastReason = `REST ${res.status}: ${raw.slice(0, 400)}`;
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

/**
 * Obejście: czasem API odrzuca `systemInstruction`; jedna wiadomość user = instrukcja + treść.
 * Tylko pierwsza wiadomość w wątku (najczęstszy case „czat nie działa”).
 */
async function runGeminiMergedFirstTurn(system, userText, apiKey) {
  const combined = `[Instrukcja systemowa dla asystenta]\n${system}\n\n---\n[Wiadomość klienta]\n${userText}`;
  const models = buildGeminiModelTryList();
  let lastReason = null;

  for (const modelName of models) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_MS);
    try {
      const verTry = async (apiVersion) => {
        const ver = apiVersion === 'v1' ? 'v1' : 'v1beta';
        const url = `https://generativelanguage.googleapis.com/${ver}/models/${encodeURIComponent(modelName)}:generateContent?key=${encodeURIComponent(apiKey)}`;
        return fetch(url, {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: combined }] }],
            generationConfig: { temperature: 0.65, maxOutputTokens: 900 },
          }),
        });
      };

      let res = await verTry('v1beta');
      if (res.status === 404) res = await verTry('v1');
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

async function runGeminiSdkChat(system, messages, apiKey) {
  const models = buildGeminiModelTryList();
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user') {
    return { error: 'upstream', reason: 'last_not_user' };
  }

  let lastReason = null;

  for (const modelName of models) {
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
  const rest = await runGeminiRestChat(system, messages, apiKey);
  if (rest.message) return rest;

  if (messages.length === 1 && messages[0].role === 'user') {
    console.warn('[chat] REST failed, trying merged first-turn fallback');
    const merged = await runGeminiMergedFirstTurn(system, messages[0].content, apiKey);
    if (merged.message) return merged;
  }

  console.warn('[chat] merged failed, trying SDK');
  const sdk = await runGeminiSdkChat(system, messages, apiKey);
  if (sdk.message) return sdk;

  return {
    error: 'upstream',
    reason: sdk.reason || rest.reason,
  };
}

export async function GET() {
  const key = getGeminiApiKey();
  return Response.json(
    {
      ok: true,
      service: 'nikol-chat',
      geminiKeyChars: key.length,
      hint:
        key.length === 0
          ? 'Set GEMINI_API_KEY on Vercel, then Redeploy.'
          : 'Key loaded. If chat fails: DevTools → Network → POST /api/chat → `reason`. AI Studio: enable billing if quota errors. Key must work for server (not referrer-only).',
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
      return chatJson({ error: 'missing_key' });
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
