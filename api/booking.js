/**
 * Vercel Serverless: приём заявок с формы записи и отправка в CRM.
 * В настройках Vercel задайте переменную CRM_WEBHOOK_URL (URL вашей CRM или Make/Zapier webhook).
 * Метод: POST, тело: JSON { name, phone, car, service, date, message, lang }
 */

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8'
  };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const origin = req.headers.origin || '';
  const headers = corsHeaders(origin);

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (e) {
    Object.assign(res, { statusCode: 400, headers });
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

  const webhookUrl = process.env.CRM_WEBHOOK_URL || process.env.BOOKING_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        console.error('CRM webhook error:', response.status, await response.text());
      }
    } catch (err) {
      console.error('CRM webhook fetch error:', err.message);
    }
  }

  res.setHeader('Access-Control-Allow-Origin', headers['Access-Control-Allow-Origin']);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(200).json({ ok: true, received: true });
}
