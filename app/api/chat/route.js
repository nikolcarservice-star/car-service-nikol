import { GoogleGenerativeAI } from '@google/generative-ai';
import { getNikolSystemPrompt } from '../../../data/nikolSystemPrompt';
import { LANGUAGES } from '../../../constants/translations';

export const runtime = 'nodejs';
export const maxDuration = 60;

const FETCH_MS = 55_000;

/** Kolejność: env → potem modele najczęściej działające z kluczem AI Studio. */
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
  add('gemini-1.5-flash');
  add('gemini-1.5-flash-latest');
  add('gemini-1.5-flash-002');
  add('gemini-2.0-flash');
  add('gemini-2.0-flash-001');
  return list;
}

function chatJson(payload, status = 200) {
  return Response.json(payload, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

/**
 * Vercel/UI czasem wkleja wartość w cudzysłowach; bearer też się zdarza.
 */
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

/** Zapasowe wywołanie HTTP, gdy SDK na serwerze zawiedzie (bundler / wersja API). */
async function geminiRestGenerateContent(apiKey, model, system, messages, signal) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  return fetch(url, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: toGeminiRestContents(messages),
      generationConfig: {
        temperature: 0.65,
        maxOutputTokens: 900,
      },
    }),
  });
}

async function runGeminiRestChat(system, messages, apiKey) {
  const models = buildGeminiModelTryList();
  let lastReason = null;

  for (const modelName of models) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_MS);
    try {
      let res = await geminiRestGenerateContent(apiKey, modelName, system, messages, controller.signal);
      if (res.status === 429) {
        await sleep(2000);
        res = await geminiRestGenerateContent(apiKey, modelName, system, messages, controller.signal);
      }
      const raw = await res.text();
      if (!res.ok) {
        lastReason = `REST ${res.status}: ${raw.slice(0, 350)}`;
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

async function runGeminiChat(system, messages, apiKey) {
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

  console.warn('[chat] SDK path failed, trying REST fallback');
  return runGeminiRestChat(system, messages, apiKey);
}

/** Szybki test w przeglądarce: czy endpoint żyje i czy klucz jest wczytany (tylko długość). */
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
          : 'Key loaded. If chat still fails: open DevTools → Network → POST /api/chat → Response field `reason`; in Google Cloud set API key Application restrictions to None for server-side use.',
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
