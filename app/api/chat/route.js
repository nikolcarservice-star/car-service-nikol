import { getNikolSystemPrompt } from '../../../data/nikolSystemPrompt';
import { LANGUAGES } from '../../../constants/translations';

export const runtime = 'nodejs';
export const maxDuration = 60;

const PRIMARY_MODEL = process.env.OPENAI_CHAT_MODEL?.trim() || 'gpt-4o-mini';
const FALLBACK_MODEL = process.env.OPENAI_CHAT_FALLBACK_MODEL?.trim() || 'gpt-3.5-turbo';
const FETCH_MS = 55_000;

/** Zawsze 200 + JSON — unika czerwonego „502” w konsoli przeglądarki; błąd w polu `error`. */
function chatJson(payload, status = 200) {
  return Response.json(payload, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function getOpenAIApiKey() {
  return (
    process.env.OPENAI_API_KEY?.trim() ||
    process.env.OPENAI_KEY?.trim() ||
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

function extractAssistantText(data) {
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

function looksLikeModelError(status, errBody) {
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

async function fetchOnce(apiKey, model, system, messages) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_MS);
  try {
    return await openaiChatCompletion(apiKey, model, system, messages, controller.signal);
  } finally {
    clearTimeout(timer);
  }
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

    const apiKey = getOpenAIApiKey();
    if (!apiKey) {
      return chatJson({ error: 'missing_key' });
    }

    const system = getNikolSystemPrompt(lang);

    let model = PRIMARY_MODEL;
    let res = await fetchOnce(apiKey, model, system, messages);

    if (res.status === 429) {
      await sleep(2000);
      res = await fetchOnce(apiKey, model, system, messages);
    }

    let errText = '';
    if (!res.ok) {
      errText = await res.text().catch(() => '');
      console.error('[chat] OpenAI error', model, res.status, errText.slice(0, 600));

      if (
        FALLBACK_MODEL &&
        FALLBACK_MODEL !== PRIMARY_MODEL &&
        looksLikeModelError(res.status, errText)
      ) {
        model = FALLBACK_MODEL;
        console.warn('[chat] Retrying with fallback model', model);
        res = await fetchOnce(apiKey, model, system, messages);
        if (res.status === 429) {
          await sleep(2000);
          res = await fetchOnce(apiKey, model, system, messages);
        }
      }
    }

    if (!res.ok) {
      errText = await res.text().catch(() => '');
      console.error('[chat] OpenAI error final', model, res.status, errText.slice(0, 600));
      return chatJson({
        error: 'upstream',
        upstreamStatus: res.status,
      });
    }

    let data;
    try {
      data = await res.json();
    } catch (e) {
      console.error('[chat] OpenAI JSON parse error', e);
      return chatJson({ error: 'upstream', reason: 'invalid_json_body' });
    }

    const text = extractAssistantText(data);
    if (!text) {
      console.error('[chat] OpenAI empty content', JSON.stringify(data)?.slice(0, 500));
      return chatJson({ error: 'upstream', reason: 'empty_content' });
    }

    return chatJson({ message: text });
  } catch (e) {
    console.error('[chat] unhandled', e);
    return chatJson({ error: 'server' });
  }
}
