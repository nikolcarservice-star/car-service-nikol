import { getNikolSystemPrompt } from '../../../data/nikolSystemPrompt';
import { LANGUAGES } from '../../../constants/translations';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MODEL = process.env.OPENAI_CHAT_MODEL?.trim() || 'gpt-4o-mini';
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
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { error: 'missing_key', message: 'Chat is not configured (OPENAI_API_KEY).' },
      { status: 503 }
    );
  }

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

  const system = getNikolSystemPrompt(lang);

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
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

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error('[chat] OpenAI error', res.status, errText.slice(0, 500));
    return Response.json({ error: 'upstream', status: res.status }, { status: 502 });
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    return Response.json({ error: 'empty_response' }, { status: 502 });
  }

  return Response.json({ message: text });
}
