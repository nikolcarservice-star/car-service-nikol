import { createClient } from '@supabase/supabase-js';

// Пытаемся взять URL/ключ как из публичных, так и из серверных переменных (интеграция Vercel+Supabase)
const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;

// На сервере используем service-role ключ, если он есть, чтобы не возиться с RLS
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Supabase env vars are missing for /api/crm-orders');
}

const supabase = SUPABASE_URL && SUPABASE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })
  : null;

function allowOrigin(origin) {
  if (!origin) return '*';
  if (origin.endsWith('.vercel.app') || origin.includes('localhost')) return origin;
  return '*';
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', allowOrigin(origin));
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (!supabase) {
    return res.status(500).json({ ok: false, error: 'Supabase not configured' });
  }

  if (req.method === 'GET') {
    const { id } = req.query || {};
    if (id) {
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      if (error) return res.status(500).json({ ok: false, error: error.message });

      const { data: services, error: svcError } = await supabase
        .from('order_services')
        .select('*')
        .eq('order_id', id)
        .order('created_at', { ascending: true });
      if (svcError) return res.status(500).json({ ok: false, error: svcError.message });

      return res.status(200).json({ ok: true, order, services });
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) return res.status(500).json({ ok: false, error: error.message });

    return res.status(200).json({ ok: true, orders: data });
  }

  if (req.method === 'POST') {
    let body = {};
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    } catch (e) {
      return res.status(400).json({ ok: false, error: 'Invalid JSON' });
    }

    const {
      id,
      createdAt,
      status = 'pending',
      createdBy,
      brand,
      model,
      year,
      comment,
      photoDataUrl,
      clientName,
      clientPhone,
      vin,
      plate,
      services = [],
      total = 0,
      paymentType = 'cash',
      paid = false,
      timeIn,
      timeOut,
      master,
      adminNote
    } = body;

    const orderId = id || crypto.randomUUID();

    const { error: insertError } = await supabase.from('orders').insert({
      id: orderId,
      created_at: createdAt || new Date().toISOString(),
      status,
      created_by: createdBy || master || null,
      brand,
      model,
      year,
      comment,
      photo_url: photoDataUrl || null,
      client_name: clientName,
      client_phone: clientPhone,
      vin,
      plate,
      total,
      payment_type: paymentType,
      paid,
      time_in: timeIn || null,
      time_out: timeOut || null,
      master,
      admin_note: adminNote || null
    });

    if (insertError) {
      return res.status(500).json({ ok: false, error: insertError.message });
    }

    if (Array.isArray(services) && services.length > 0) {
      const rows = services.map((s) => ({
        order_id: orderId,
        name_pl: s.name_pl || null,
        name_ru: s.name_ru || null,
        quantity: s.quantity || 1,
        price: s.price || 0
      }));
      const { error: svcError } = await supabase.from('order_services').insert(rows);
      if (svcError) {
        return res.status(500).json({ ok: false, error: svcError.message });
      }
    }

    return res.status(200).json({ ok: true, id: orderId });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}

