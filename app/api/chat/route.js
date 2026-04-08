import { GoogleGenerativeAI } from '@google/generative-ai';
import { getNikolSystemPrompt } from '../../../data/nikolSystemPrompt';
import { LANGUAGES } from '../../../constants/translations';

export const runtime = 'nodejs';
export const maxDuration = 60;

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

/** Czytelny log z obiektu błędu SDK / Google (bez sekretów). */
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

/**
 * Oficjalny SDK poprawnie składa historię czatu (startChat + sendMessage);
 * surowy REST z pełną tablicą `contents` bywa problematyczny przy wielu turach.
 */
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

  return {
    error: 'upstream',
    reason: lastReason,
  };
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
