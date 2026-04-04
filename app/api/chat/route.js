import { getNikolSystemPrompt } from '../../../data/nikolSystemPrompt';
import { getOfflineNikolReply } from '../../../data/nikolOfflineReplies';
import { LANGUAGES } from '../../../constants/translations';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MODEL = process.env.OPENAI_CHAT_MODEL?.trim() || 'gpt-4o-mini';

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

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const lang = body.lang === LANGUAGES.RU ? LANGUAGES.RU : LANGUAGES.PL;
  const messages = sanitizeMessages(body.messages);
  if (!messages.length) {
    return Response.json({ error: 'no_messages' }, { status: 400 });
  }

  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    const offline = getOfflineNikolReply(lang, lastUser?.content ?? '');
    if (offline) {
      return Response.json({ message: offline, offline: true });
    }
    return Response.json(
      { error: 'missing_key', message: 'Chat is not configured (OPENAI_API_KEY).' },
      { status: 503 }
    );
  }

  const system = getNikolSystemPrompt(lang);
  const lastUserContent =
    [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';

  function tryOfflineOrError(status, errSnippet) {
    const offline = getOfflineNikolReply(lang, lastUserContent);
    if (offline) {
      console.warn('[chat] OpenAI failed; using offline reply.', status, errSnippet?.slice?.(0, 200));
      return Response.json({ message: offline, offline: true, fallback: true });
    }
    return Response.json(
      { error: 'upstream', status, detail: errSnippet?.slice?.(0, 300) },
      { status: 502 }
    );
  }

  let res;
  try {
    res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.65,
        max_tokens: 900,
        messages: [{ role: 'system', content: system }, ...messages],
      }),
    });
  } catch (e) {
    console.error('[chat] OpenAI fetch error', e);
    return tryOfflineOrError(0, String(e?.message ?? e));
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error('[chat] OpenAI error', res.status, errText.slice(0, 500));
    return tryOfflineOrError(res.status, errText);
  }

  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.error('[chat] OpenAI JSON parse error', e);
    return tryOfflineOrError(res.status, 'invalid_json_body');
  }

  const raw = data?.choices?.[0]?.message?.content;
  const text = typeof raw === 'string' ? raw.trim() : '';
  if (!text) {
    console.error('[chat] OpenAI empty content', JSON.stringify(data)?.slice(0, 400));
    return tryOfflineOrError(502, 'empty_content');
  }

  return Response.json({ message: text });
}
