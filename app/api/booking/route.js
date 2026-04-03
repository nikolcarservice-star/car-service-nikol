/**
 * Zgłoszenia z formularza: powiadomienie Telegram (Bot API) i/lub webhook / Supabase.
 * Zmienne: TELEGRAM_BOT_TOKEN (lub TELEGRAM_TOKEN) + TELEGRAM_CHAT_ID — Vercel → Environment Variables → Production → Redeploy.
 */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { buildBookingNotifyText } from '../../../data/bookingNotifyText';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function json(data, init = {}) {
  const headers = new Headers(init.headers);
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  return NextResponse.json(data, { ...init, headers });
}

function getTelegramToken() {
  return (
    process.env.TELEGRAM_BOT_TOKEN?.trim() ||
    process.env.TELEGRAM_TOKEN?.trim() ||
    ''
  );
}

function getTelegramChatId() {
  const raw =
    process.env.TELEGRAM_CHAT_ID ??
    process.env.TELEGRAM_BOT_CHAT_ID ??
    '';
  return String(raw).trim();
}

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

function countAttachmentSlots(raw) {
  if (!Array.isArray(raw)) return 0;
  return Math.min(raw.length, MAX_ATTACHMENTS);
}

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
  const token = getTelegramToken();
  const chatIdRaw = getTelegramChatId();
  if (!token || !chatIdRaw) {
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });

    const j = await res.json().catch(() => ({}));
    if (!res.ok || j.ok === false) {
      const errMsg = j.description || j.error || res.statusText || 'Telegram sendMessage failed';
      console.error('[booking] Telegram sendMessage failed:', errMsg, JSON.stringify(j));
      return { ok: false, error: errMsg };
    }
    return { ok: true };
  } catch (e) {
    const msg = e?.name === 'AbortError' ? 'Telegram API timeout' : String(e?.message || e);
    console.error('[booking] Telegram fetch error:', msg);
    return { ok: false, error: msg };
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const token = getTelegramToken();
  const chatId = getTelegramChatId();
  return json({
    telegramConfigured: !!(token && chatId),
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    hasChatId: !!chatId,
    chatIdSuffix: chatId ? String(chatId).slice(-4) : null,
    hint:
      !token || !chatId
        ? 'Ustaw TELEGRAM_BOT_TOKEN i TELEGRAM_CHAT_ID w Vercel → Environment Variables (Production), potem Redeploy.'
        : 'OK — sprawdź konsolę przeglądarki (F12) po wysłaniu formularza: pole telegramSent w odpowiedzi POST.',
  });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
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

  const attachmentSlots = countAttachmentSlots(body.attachments);

  const token = getTelegramToken();
  const chatIdEnv = getTelegramChatId();
  const hasTelegram = !!token && !!chatIdEnv;
  const webhookUrl = process.env.BOOKING_WEBHOOK_URL;

  const nameT = String(name).trim();
  const phoneT = String(phone).trim();
  const carT = String(car).trim();
  const serviceT = String(service).trim();
  const dateT = String(date).trim();
  const langT = lang === 'ru' ? 'ru' : 'pl';
  const preferredTimeT = String(preferredTime).trim();

  const notifyText = buildBookingNotifyText({
    name: nameT,
    phone: phoneT,
    car: carT,
    service: serviceT,
    date: dateT,
    message: String(message).trim(),
    preferredTimeStr: preferredTimeT || '—',
    photoCount: attachmentSlots,
    lang: langT,
  });

  let telegramSent = false;
  if (hasTelegram) {
    const tg = await sendTelegramNotification(notifyText);
    if (!tg.ok) {
      return json(
        { ok: false, error: tg.error || 'Telegram notification failed' },
        { status: 502 }
      );
    }
    telegramSent = true;
  }

  const attachments = sanitizeAttachments(body.attachments);

  const extras = [];
  if (preferredTimeT) extras.push(`Przedział godzin (orientacyjnie): ${preferredTimeT}`);
  if (attachments.length) extras.push(`Załączone zdjęcia: ${attachments.length} (szczegóły w powiadomieniu)`);

  const messageCombined = [String(message).trim(), ...extras].filter(Boolean).join('\n\n');

  const payload = {
    source: 'car-service-nikol-booking',
    name: nameT,
    phone: phoneT,
    car: carT,
    service: serviceT,
    date: dateT,
    message: messageCombined,
    lang: langT,
    preferredTime: preferredTimeT,
    attachments,
    createdAt: new Date().toISOString(),
  };

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
        return json({ ok: false, error: error.message }, { status: 500 });
      }
    }
  }

  if (!hasTelegram && !webhookUrl && !supabase) {
    return json(
      {
        ok: false,
        error:
          'Booking backend not configured. Set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID, or BOOKING_WEBHOOK_URL, or Supabase.',
      },
      { status: 503 }
    );
  }

  if (telegramSent) {
    console.log('[booking] Telegram sendMessage OK');
  } else {
    console.error(
      '[booking] OK 200 BUT notify NOT sent — add TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID to this Vercel project (Production), Redeploy. hasToken=%s hasChatId=%s',
      String(!!token),
      String(!!chatIdEnv)
    );
  }

  return json(
    {
      ok: true,
      received: true,
      telegramSent,
    },
    {
      headers: {
        'X-Booking-Telegram-Sent': telegramSent ? '1' : '0',
      },
    }
  );
}
