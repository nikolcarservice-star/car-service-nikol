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

function looksLikeTelegramToken(s) {
  return typeof s === 'string' && /^\d+:[A-Za-z0-9_-]+$/.test(s.trim());
}

function getTelegramToken() {
  const primary =
    process.env.TELEGRAM_BOT_TOKEN?.trim() ||
    process.env.TELEGRAM_TOKEN?.trim() ||
    '';
  if (primary) return primary;
  // Vercel UI mistake: env name "Key" instead of TELEGRAM_BOT_TOKEN
  const keyMistake = process.env.Key?.trim();
  if (looksLikeTelegramToken(keyMistake)) return keyMistake;
  return '';
}

function getTelegramChatId() {
  const raw =
    process.env.TELEGRAM_CHAT_ID ??
    process.env.TELEGRAM_BOT_CHAT_ID ??
    '';
  const primary = String(raw).trim();
  if (primary) return primary;
  // Vercel UI mistake: env name "Value" instead of TELEGRAM_CHAT_ID
  const valueMistake = process.env.Value?.trim();
  if (valueMistake && /^-?\d+$/.test(valueMistake)) return valueMistake;
  return '';
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
/** Zgodnie z limitem w BookingForm (na klientcie) — pojedyncze zdjęcie */
const MAX_SINGLE_ATTACHMENT_BYTES = 1_500_000;
const MAX_TELEGRAM_TEXT = 4090;
/** Telegram sendPhoto file limit (bytes) */
const MAX_TELEGRAM_PHOTO_BYTES = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function isAllowedImageType(type, name) {
  const t = String(type || '').trim().toLowerCase();
  if (ALLOWED_IMAGE_TYPES.has(t)) return true;
  return /\.(jpe?g|png|webp)$/i.test(String(name || ''));
}

function sanitizeAttachments(raw) {
  if (!Array.isArray(raw)) return [];
  const list = [];
  let total = 0;
  for (const item of raw.slice(0, MAX_ATTACHMENTS)) {
    if (!item || typeof item !== 'object') continue;
    const name = String(item.name || 'photo').slice(0, 120);
    let type = String(item.type || 'image/jpeg').slice(0, 80);
    if (!isAllowedImageType(type, name)) continue;

    let buf;
    if (Buffer.isBuffer(item.buffer)) {
      buf = item.buffer;
    } else {
      const data = typeof item.data === 'string' ? item.data.replace(/\s+/g, '') : '';
      buf = Buffer.from(data, 'base64');
    }
    if (!buf.length) continue;
    if (buf.length > MAX_SINGLE_ATTACHMENT_BYTES) continue;
    total += buf.length;
    if (total > MAX_TOTAL_ATTACHMENT_BYTES) break;
    if (!type || !ALLOWED_IMAGE_TYPES.has(type.toLowerCase())) {
      const lower = String(name).toLowerCase();
      if (lower.endsWith('.png')) type = 'image/png';
      else if (lower.endsWith('.webp')) type = 'image/webp';
      else type = 'image/jpeg';
    }
    list.push({ name, type, data: buf.toString('base64') });
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

async function sendTelegramPhotos(token, chatIdRaw, items) {
  const chatId = normalizeTelegramChatId(chatIdRaw);
  if (chatId === null || !items?.length) {
    return { sent: 0, errors: [] };
  }

  const errors = [];
  let sent = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const buf = Buffer.from(item.data, 'base64');
    if (!buf.length || buf.length > MAX_TELEGRAM_PHOTO_BYTES) {
      errors.push(`photo ${i + 1}: invalid or too large for Telegram`);
      console.error('[booking] Telegram sendPhoto skip:', errors[errors.length - 1]);
      continue;
    }

    const url = `https://api.telegram.org/bot${token}/sendPhoto`;
    const safeName = String(item.name || `photo-${i + 1}.jpg`)
      .replace(/[^\w.\-]/g, '_')
      .slice(0, 80) || `photo-${i + 1}.jpg`;

    const form = new FormData();
    form.append('chat_id', String(chatId));
    const mime = item.type || 'image/jpeg';
    form.append('photo', new Blob([buf], { type: mime }), safeName);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: form,
        signal: controller.signal,
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || j.ok === false) {
        const errMsg = j.description || j.error || res.statusText || 'sendPhoto failed';
        errors.push(`photo ${i + 1}: ${errMsg}`);
        console.error('[booking] Telegram sendPhoto failed:', errMsg, JSON.stringify(j));
      } else {
        sent += 1;
      }
    } catch (e) {
      const msg = e?.name === 'AbortError' ? 'Telegram API timeout' : String(e?.message || e);
      errors.push(`photo ${i + 1}: ${msg}`);
      console.error('[booking] Telegram sendPhoto error:', msg);
    } finally {
      clearTimeout(timeout);
    }
  }

  return { sent, errors };
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
  const contentType = request.headers.get('content-type') || '';
  let body;
  let attachmentRaw = [];

  if (contentType.includes('multipart/form-data')) {
    let fd;
    try {
      fd = await request.formData();
    } catch (e) {
      console.error('[booking] formData parse failed:', e?.message || e);
      return json({ ok: false, error: 'Invalid multipart body' }, { status: 400 });
    }
    const payloadField = fd.get('payload');
    if (typeof payloadField !== 'string') {
      return json({ ok: false, error: 'Missing payload' }, { status: 400 });
    }
    try {
      body = JSON.parse(payloadField);
    } catch {
      return json({ ok: false, error: 'Invalid payload JSON' }, { status: 400 });
    }

    const files = fd.getAll('photos');
    for (const file of files) {
      if (!file || typeof file.arrayBuffer !== 'function') continue;
      const ab = await file.arrayBuffer();
      const buffer = Buffer.from(ab);
      attachmentRaw.push({
        name: String(file.name || 'photo.jpg').slice(0, 120),
        type: file.type || '',
        buffer,
      });
    }
  } else {
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
    }
    attachmentRaw = body.attachments;
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

  const attachments = sanitizeAttachments(
    contentType.includes('multipart/form-data') ? attachmentRaw : attachmentRaw || []
  );

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
    photoCount: attachments.length,
    lang: langT,
  });

  let telegramSent = false;
  let telegramPhotosSent = 0;
  const telegramPhotoErrors = [];

  if (hasTelegram) {
    const tg = await sendTelegramNotification(notifyText);
    if (!tg.ok) {
      return json(
        { ok: false, error: tg.error || 'Telegram notification failed' },
        { status: 502 }
      );
    }
    telegramSent = true;

    if (attachments.length) {
      const pr = await sendTelegramPhotos(token, chatIdEnv, attachments);
      telegramPhotosSent = pr.sent;
      telegramPhotoErrors.push(...pr.errors);
    }
  }

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

  const responseBody = {
    ok: true,
    received: true,
    telegramSent,
    ...(attachments.length
      ? {
          telegramPhotosSent,
          ...(telegramPhotoErrors.length ? { telegramPhotoErrors } : {}),
        }
      : {}),
  };

  return json(responseBody, {
    headers: {
      'X-Booking-Telegram-Sent': telegramSent ? '1' : '0',
    },
  });
}
