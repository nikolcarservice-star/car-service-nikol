import { getNikolSystemPrompt } from '../../../data/nikolSystemPrompt';
import { LANGUAGES } from '../../../constants/translations';

export const runtime = 'nodejs';
export const maxDuration = 60;

const FETCH_MS = 55_000;

const OPENAI_PRIMARY = process.env.OPENAI_CHAT_MODEL?.trim() || 'gpt-4o-mini';
const OPENAI_FALLBACK = process.env.OPENAI_CHAT_FALLBACK_MODEL?.trim() || 'gpt-3.5-turbo';

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

function getOpenAIApiKey() {
  return (
    process.env.OPENAI_API_KEY?.trim() ||
    process.env.OPENAI_KEY?.trim() ||
    ''
  );
}

/**
 * CHAT_AI_PROVIDER: gemini | openai | (puste = auto: Gemini jeśli jest klucz, inaczej OpenAI).
 */
function resolveChatBackend() {
  const geminiKey = getGeminiApiKey();
  const openaiKey = getOpenAIApiKey();
  const pref = (process.env.CHAT_AI_PROVIDER || '').trim().toLowerCase();

  if (pref === 'openai') {
    if (openaiKey) return { provider: 'openai', key: openaiKey };
    if (geminiKey) return { provider: 'gemini', key: geminiKey };
    return null;
  }
  if (pref === 'gemini') {
    if (geminiKey) return { provider: 'gemini', key: geminiKey };
    if (openaiKey) return { provider: 'openai', key: openaiKey };
    return null;
  }
  if (geminiKey) return { provider: 'gemini', key: geminiKey };
  if (openaiKey) return { provider: 'openai', key: openaiKey };
  return null;
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

function extractOpenAIText(data) {
  const msg = data?.choices?.[0]?.message;
  if (!msg) return '';
  const c = msg.content;
  if (typeof c === 'string') return c.trim();
  if (Array.isArray(c)) {
    return c
      .map((p) => {
        if (typeof p === 'string') return p;
        if (p?.type === 'text' && typeof p.text === 'string') return p.text;
        return '';
      })
      .join('')
      .trim();
  }
  return '';
}

function extractGeminiText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts
    .map((p) => (typeof p?.text === 'string' ? p.text : ''))
    .join('')
    .trim();
}

function looksLikeOpenAIModelError(status, errBody) {
  if (status === 404) return true;
  if (status !== 400) return false;
  const s = (errBody || '').toLowerCase();
  return (
    s.includes('model') ||
    s.includes('invalid') ||
    s.includes('does not exist') ||
    s.includes('not found')
  );
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

async function openaiChatCompletion(apiKey, model, system, messages, signal) {
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.65,
      max_tokens: 900,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  });
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

async function fetchOpenAIOnce(apiKey, model, system, messages) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_MS);
  try {
    return await openaiChatCompletion(apiKey, model, system, messages, controller.signal);
  } finally {
    clearTimeout(timer);
  }
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

async function runOpenAIChat(system, messages, apiKey) {
  let model = OPENAI_PRIMARY;
  let res = await fetchOpenAIOnce(apiKey, model, system, messages);

  if (res.status === 429) {
    await sleep(2000);
    res = await fetchOpenAIOnce(apiKey, model, system, messages);
  }

  let errText = '';
  if (!res.ok) {
    errText = await res.text().catch(() => '');
    console.error('[chat] OpenAI error', model, res.status, errText.slice(0, 600));

    if (
      OPENAI_FALLBACK &&
      OPENAI_FALLBACK !== OPENAI_PRIMARY &&
      looksLikeOpenAIModelError(res.status, errText)
    ) {
      model = OPENAI_FALLBACK;
      console.warn('[chat] OpenAI retry fallback model', model);
      res = await fetchOpenAIOnce(apiKey, model, system, messages);
      if (res.status === 429) {
        await sleep(2000);
        res = await fetchOpenAIOnce(apiKey, model, system, messages);
      }
    }
  }

  if (!res.ok) {
    errText = await res.text().catch(() => '');
    console.error('[chat] OpenAI error final', model, res.status, errText.slice(0, 600));
    return { error: 'upstream', upstreamStatus: res.status };
  }

  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.error('[chat] OpenAI JSON parse error', e);
    return { error: 'upstream', reason: 'invalid_json_body' };
  }

  const text = extractOpenAIText(data);
  if (!text) {
    console.error('[chat] OpenAI empty content', JSON.stringify(data)?.slice(0, 500));
    return { error: 'upstream', reason: 'empty_content' };
  }

  return { message: text };
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

    const backend = resolveChatBackend();
    if (!backend) {
      return chatJson({ error: 'missing_key' });
    }

    const system = getNikolSystemPrompt(lang);

    const out =
      backend.provider === 'gemini'
        ? await runGeminiChat(system, messages, backend.key)
        : await runOpenAIChat(system, messages, backend.key);

    if (out.error) {
      return chatJson(out);
    }

    return chatJson({ message: out.message });
  } catch (e) {
    console.error('[chat] unhandled', e);
    return chatJson({ error: 'server' });
  }
}
