import { NextResponse } from 'next/server';
import { appendSheetRows, getDefaultSpreadsheetId } from '../../../lib/googleSheets';
import { isTelegramBookingConfigured, sendBookingTelegramNotification } from '../../../lib/telegramBookingNotify';

export const runtime = 'nodejs';

const APPEND_RANGE =
  (process.env.GOOGLE_SHEETS_BOOKING_APPEND_RANGE || 'Sheet1!A1').trim() || 'Sheet1!A1';

const MAX_MSG = 2000;
const MAX_NAME = 120;

function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

function normalizePhone(raw) {
  const n = String(raw || '').replace(/\D/g, '');
  if (n.length < 9 || n.length > 15) return null;
  return n;
}

function validEmail(s) {
  const t = String(s || '').trim();
  if (!t) return '';
  if (t.length > 120) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return null;
  return t;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  if (typeof body?.website === 'string' && body.website.trim() !== '') {
    return json({ ok: true });
  }

  const lang = body.lang === 'ru' ? 'ru' : 'pl';
  const name = String(body.name || '').trim();
  const phoneRaw = String(body.phone || '').trim();
  const phone = normalizePhone(phoneRaw);
  const emailResult = validEmail(body.email);
  if (emailResult === null) {
    return json({ ok: false, error: 'validation', field: 'email' }, 400);
  }
  const service = String(body.service || '').trim().slice(0, 64);
  if (service && !/^[a-z0-9_-]+$/i.test(service)) {
    return json({ ok: false, error: 'validation', field: 'service' }, 400);
  }
  let message = String(body.message || '').trim().slice(0, MAX_MSG);

  if (name.length < 2 || name.length > MAX_NAME) {
    return json({ ok: false, error: 'validation', field: 'name' }, 400);
  }
  if (!phone) {
    return json({ ok: false, error: 'validation', field: 'phone' }, 400);
  }

  const spreadsheetId = getDefaultSpreadsheetId();
  const useSheets = Boolean(spreadsheetId);
  const useTelegram = isTelegramBookingConfigured();

  if (!useSheets && !useTelegram) {
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  const ts = new Date().toISOString();
  const row = [ts, lang, name, phone, emailResult, service || '', message];

  let sheetsOk = false;
  let telegramOk = false;

  if (useSheets) {
    try {
      await appendSheetRows(spreadsheetId, APPEND_RANGE, [row]);
      sheetsOk = true;
    } catch (e) {
      console.error('[booking] Google Sheets:', e?.message || e);
    }
  }

  if (useTelegram) {
    try {
      await sendBookingTelegramNotification({
        lang,
        name,
        phone,
        email: emailResult,
        service: service || '',
        message,
        isoTime: ts,
      });
      telegramOk = true;
    } catch (e) {
      console.error('[booking] Telegram:', e?.message || e);
    }
  }

  const anyOk = sheetsOk || telegramOk;
  if (!anyOk) {
    return json({ ok: false, error: 'upstream' }, 502);
  }

  return json({ ok: true });
}
