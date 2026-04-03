/**
 * Zgłoszenia z formularza: powiadomienie Telegram (Bot API) i/lub webhook / Supabase.
 * Na Vercel ustaw TELEGRAM_BOT_TOKEN (sekret). TELEGRAM_CHAT_ID może być w vercel.json lub w zmiennych.
 */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { buildBookingNotifyText } from '../../../data/bookingNotifyText';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })
    : null;

const MAX_ATTACHMENTS = 3;
const MAX_TOTAL_ATTACHMENT_BYTES = 4 * 1024 * 1024;
const MAX_TELEGRAM_TEXT = 4090;

function sanitizeAttachments(raw) {
  if (!Array.isArray(raw)) return [];
  const list = [];
  let total = 0;
  for (const item of raw.slice(0, MAX_ATTACHMENTS)) {
    if (!item || typeof item !== 'object') continue;
    const name = String(item.name || 'photo').slice(0, 120);
    const type = String(item.type || 'image/jpeg').slice(0, 80);
    const data = typeof item.data === 'string' ? item.data : '';
    const buf = Buffer.from(data, 'base64');
    if (!buf.length) continue;
    total += buf.length;
    if (total > MAX_TOTAL_ATTACHMENT_BYTES) break;
    list.push({ name, type, data });
  }
  return list;
}

function normalizeTelegramChatId(raw) {
  const s = String(raw ?? '').trim();
  if (!s) return null;
  if (/^-?\d+$/.test(s)) {
    const n = Number(s);
    if (Number.isSafeInteger(n)) return n;
  }
  return s;
}

function sanitizeTelegramText(text) {
  return String(text).replace(/\0/g, '');
}

async function sendTelegramNotification(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatIdRaw = process.env.TELEGRAM_CHAT_ID;
  if (!token || chatIdRaw === undefined || String(chatIdRaw).trim() === '') {
    return { ok: false, skipped: true };
  }

  const chatId = normalizeTelegramChatId(chatIdRaw);
  if (chatId === null) {
    return { ok: false, error: 'Invalid TELEGRAM_CHAT_ID' };
  }

  const messageText = sanitizeTelegramText(
    text.length > MAX_TELEGRAM_TEXT ? `${text.slice(0, MAX_TELEGRAM_TEXT - 1)}…` : text
  );
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: messageText,
      disable_web_page_preview: true,
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.ok === false) {
    const errMsg = json.description || json.error || res.statusText || 'Telegram sendMessage failed';
    console.error('[booking] Telegram sendMessage failed:', errMsg, json);
    return { ok: false, error: errMsg };
  }
  return { ok: true };
}

/** Diagnostyka: GET /api/booking — czy na serwerze ustawiono Telegram (bez ujawniania sekretów). */
export async function GET() {
  return NextResponse.json({
    telegramConfigured: !!(
      process.env.TELEGRAM_BOT_TOKEN?.trim() && process.env.TELEGRAM_CHAT_ID?.trim()
    ),
  });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    name = '',
    phone = '',
    car = '',
    service = '',
    date = '',
    message = '',
    lang = 'pl',
    preferredTime = '',
  } = body;

  const attachments = sanitizeAttachments(body.attachments);

  const extras = [];
  if (preferredTime) extras.push(`Przedział godzin (orientacyjnie): ${preferredTime}`);
  if (attachments.length) extras.push(`Załączone zdjęcia: ${attachments.length} (szczegóły w powiadomieniu)`);

  const messageCombined = [String(message).trim(), ...extras].filter(Boolean).join('\n\n');

  const payload = {
    source: 'car-service-nikol-booking',
    name: String(name).trim(),
    phone: String(phone).trim(),
    car: String(car).trim(),
    service: String(service).trim(),
    date: String(date).trim(),
    message: messageCombined,
    lang: lang === 'ru' ? 'ru' : 'pl',
    preferredTime: String(preferredTime).trim(),
    attachments,
    createdAt: new Date().toISOString(),
  };

  const notifyText = buildBookingNotifyText({
    name: payload.name,
    phone: payload.phone,
    car: payload.car,
    service: payload.service,
    date: payload.date,
    message: String(message).trim(),
    preferredTimeStr: payload.preferredTime || '—',
    photoCount: attachments.length,
    lang: payload.lang,
  });

  const hasTelegram =
    !!process.env.TELEGRAM_BOT_TOKEN?.trim() &&
    process.env.TELEGRAM_CHAT_ID !== undefined &&
    String(process.env.TELEGRAM_CHAT_ID).trim() !== '';
  const webhookUrl = process.env.BOOKING_WEBHOOK_URL;

  let telegramSent = false;
  if (hasTelegram) {
    const tg = await sendTelegramNotification(notifyText);
    if (!tg.ok) {
      return NextResponse.json(
        { ok: false, error: tg.error || 'Telegram notification failed' },
        { status: 502 }
      );
    }
    telegramSent = true;
  }

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      /* optional */
    }
  }

  if (supabase) {
    const { error } = await supabase.from('booking_requests').insert({
      name: payload.name,
      phone: payload.phone,
      car: payload.car,
      service: payload.service,
      date: payload.date,
      message: payload.message,
      lang: payload.lang,
    });
    if (error) {
      if (telegramSent) {
        console.error('[booking] Supabase insert failed after Telegram OK:', error.message);
      } else {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }
    }
  }

  if (!hasTelegram && !webhookUrl && !supabase) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Booking backend not configured. Set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID, or BOOKING_WEBHOOK_URL, or Supabase.',
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    received: true,
    /** true tylko gdy faktycznie wysłano na Telegram (sprawdź na Vercel: TELEGRAM_*) */
    telegramSent,
  });
}
