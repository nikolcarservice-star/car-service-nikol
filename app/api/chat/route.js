import { getNikolSystemPrompt } from '../../../data/nikolSystemPrompt';
import { LANGUAGES } from '../../../constants/translations';

export const runtime = 'nodejs';
export const maxDuration = 60;

const FETCH_MS = 55_000;

const GEMINI_PRIMARY = process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';
const GEMINI_FALLBACK = process.env.GEMINI_MODEL_FALLBACK?.trim() || 'gemini-1.5-flash';

/** Zawsze 200 + JSON — unika czerwonego błędu statusu w konsoli; błąd w polu `error`. */
function chatJson(payload, status = 200) {
  return Response.json(payload, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function getGeminiApiKey() {
  return (
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    ''
  );
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

function extractGeminiText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts
    .map((p) => (typeof p?.text === 'string' ? p.text : ''))
    .join('')
    .trim();
}

function looksLikeGeminiModelError(status, errBody) {
  if (status === 404) return true;
  if (status !== 400) return false;
  const s = (errBody || '').toLowerCase();
  return s.includes('model') || s.includes('not found') || s.includes('invalid');
}

function toGeminiContents(messages) {
  return messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}

async function geminiGenerateContent(apiKey, model, system, contents, signal) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  return fetch(url, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: {
        temperature: 0.65,
        maxOutputTokens: 900,
      },
    }),
  });
}

async function fetchGeminiOnce(apiKey, model, system, contents) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_MS);
  try {
    return await geminiGenerateContent(apiKey, model, system, contents, controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

async function runGeminiChat(system, messages, apiKey) {
  const contents = toGeminiContents(messages);
  let model = GEMINI_PRIMARY;
  let res = await fetchGeminiOnce(apiKey, model, system, contents);

  if (res.status === 429) {
    await sleep(2000);
    res = await fetchGeminiOnce(apiKey, model, system, contents);
  }

  let errText = '';
  if (!res.ok) {
    errText = await res.text().catch(() => '');
    console.error('[chat] Gemini error', model, res.status, errText.slice(0, 600));

    if (
      GEMINI_FALLBACK &&
      GEMINI_FALLBACK !== GEMINI_PRIMARY &&
      looksLikeGeminiModelError(res.status, errText)
    ) {
      model = GEMINI_FALLBACK;
      console.warn('[chat] Gemini retry fallback model', model);
      res = await fetchGeminiOnce(apiKey, model, system, contents);
      if (res.status === 429) {
        await sleep(2000);
        res = await fetchGeminiOnce(apiKey, model, system, contents);
      }
    }
  }

  if (!res.ok) {
    errText = await res.text().catch(() => '');
    console.error('[chat] Gemini error final', model, res.status, errText.slice(0, 600));
    return { error: 'upstream', upstreamStatus: res.status };
  }

  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.error('[chat] Gemini JSON parse error', e);
    return { error: 'upstream', reason: 'invalid_json_body' };
  }

  const text = extractGeminiText(data);
  if (!text) {
    const reason = data?.candidates?.[0]?.finishReason || 'empty_content';
    console.error('[chat] Gemini empty/blocked', reason, JSON.stringify(data)?.slice(0, 500));
    return { error: 'upstream', reason: String(reason) };
  }

  return { message: text };
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
