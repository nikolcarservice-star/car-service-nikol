import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

  const webhookUrl = process.env.BOOKING_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      /* webhook optional */
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

  if (!supabase && !webhookUrl) {
    return NextResponse.json(
      { ok: false, error: 'Booking backend not configured (Supabase or BOOKING_WEBHOOK_URL)' },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, received: true });
}
