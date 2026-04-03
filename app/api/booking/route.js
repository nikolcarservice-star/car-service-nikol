/**
 * Zgłoszenia z formularza: powiadomienie WhatsApp (CallMeBot) i/lub webhook / Supabase.
 * Ustaw CALLMEBOT_API_KEY (patrz dokumentacja CallMeBot) — wiadomość trafia na numer bez otwierania WhatsApp u klienta.
 */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PHONE_RAW } from '../../../constants/translations';
import { buildBookingNotifyText } from '../../../data/bookingNotifyText';

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
const MAX_WHATSAPP_TEXT = 3800;

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

async function sendWhatsAppViaCallMeBot(text) {
  const apikey = process.env.CALLMEBOT_API_KEY;
  if (!apikey) return { ok: false, skipped: true };

  const rawPhone = process.env.CALLMEBOT_NOTIFY_PHONE || PHONE_RAW;
  const phoneParam = String(rawPhone).replace(/\s/g, '').startsWith('+')
    ? String(rawPhone).replace(/\s/g, '')
    : `+${String(rawPhone).replace(/^\+/, '')}`;

  const body = text.length > MAX_WHATSAPP_TEXT ? `${text.slice(0, MAX_WHATSAPP_TEXT)}…` : text;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phoneParam)}&text=${encodeURIComponent(body)}&apikey=${encodeURIComponent(apikey)}`;

  const res = await fetch(url, { method: 'GET', cache: 'no-store' });
  const txt = await res.text();
  if (!res.ok) {
    return { ok: false, error: txt || res.statusText };
  }
  const trimmed = txt.trim();
  if (trimmed.toUpperCase().startsWith('ERROR')) {
    return { ok: false, error: txt };
  }
  return { ok: true };
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

  const hasCallMe = !!process.env.CALLMEBOT_API_KEY;
  const webhookUrl = process.env.BOOKING_WEBHOOK_URL;

  if (hasCallMe) {
    const wa = await sendWhatsAppViaCallMeBot(notifyText);
    if (!wa.ok) {
      return NextResponse.json(
        { ok: false, error: wa.error || 'WhatsApp notification failed' },
        { status: 502 }
      );
    }
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
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
  }

  if (!hasCallMe && !webhookUrl && !supabase) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Booking backend not configured. Set CALLMEBOT_API_KEY (WhatsApp), or BOOKING_WEBHOOK_URL, or Supabase.',
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, received: true });
}
