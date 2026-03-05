/**
 * Vercel Serverless: заявки с формы записи.
 * POST: получает заявку, сохраняет в Supabase (booking_requests) и, при желании, шлёт webhook.
 * GET: возвращает список заявок для CRM.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = SUPABASE_URL && SUPABASE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })
  : null;

const ALLOWED_ORIGINS = [
  'https://carservicenikol.pl',
  'https://www.carservicenikol.pl',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

function corsHeaders(origin) {
  const allowOrigin = (origin && (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app')))
    ? origin
    : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8'
  };
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const headers = corsHeaders(origin);

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', headers['Access-Control-Allow-Origin']);
    res.setHeader('Access-Control-Allow-Methods', headers['Access-Control-Allow-Methods']);
    res.setHeader('Access-Control-Allow-Headers', headers['Access-Control-Allow-Headers']);
    return res.status(204).end();
  }

  if (!supabase) {
    res.setHeader('Access-Control-Allow-Origin', headers['Access-Control-Allow-Origin']);
    return res.status(500).json({ ok: false, error: 'Supabase not configured' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('booking_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    res.setHeader('Access-Control-Allow-Origin', headers['Access-Control-Allow-Origin']);
    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, bookings: data || [] });
  }

  if (req.method === 'DELETE') {
    const { id: queryId } = req.query || {};
    let id = queryId;
    if (!id && req.body) {
      try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        id = body && body.id;
      } catch {
        // ignore JSON parse error, we'll handle missing id below
      }
    }

    res.setHeader('Access-Control-Allow-Origin', headers['Access-Control-Allow-Origin']);
    if (!id) {
      return res.status(400).json({ ok: false, error: 'Missing id' });
    }

    const { error } = await supabase
      .from('booking_requests')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.status(200).json({ ok: true, deleted: true });
  }

  if (req.method !== 'POST') {
    res.setHeader('Access-Control-Allow-Origin', headers['Access-Control-Allow-Origin']);
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', headers['Access-Control-Allow-Origin']);
    return res.status(400).json({ ok: false, error: 'Invalid JSON' });
  }

  const {
    name = '',
    phone = '',
    car = '',
    service = '',
    date = '',
    message = '',
    lang = 'pl'
  } = body;

  const payload = {
    source: 'car-service-nikol-booking',
    name: String(name).trim(),
    phone: String(phone).trim(),
    car: String(car).trim(),
    service: String(service).trim(),
    date: String(date).trim(),
    message: String(message).trim(),
    lang: lang === 'ru' ? 'ru' : 'pl',
    createdAt: new Date().toISOString()
  };

  // Сохраняем в Supabase
  const { error } = await supabase.from('booking_requests').insert({
    name: payload.name,
    phone: payload.phone,
    car: payload.car,
    service: payload.service,
    date: payload.date,
    message: payload.message,
    lang: payload.lang
  });

  const webhookUrl = process.env.CRM_WEBHOOK_URL || process.env.BOOKING_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // игнорируем ошибки вебхука
    }
  }

  res.setHeader('Access-Control-Allow-Origin', headers['Access-Control-Allow-Origin']);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (error) return res.status(500).json({ ok: false, error: error.message });
  return res.status(200).json({ ok: true, received: true });
}
