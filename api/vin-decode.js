/**
 * Декодирование VIN: прокси к бесплатному API db.vin (данные по авто для Европы).
 * GET /api/vin-decode?vin=WBADT43452G123456
 */

const DBVIN_URL = 'https://db.vin/api/v1/vin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const vin = (req.query?.vin || '').trim().toUpperCase();
  if (!vin || vin.length < 17) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).json({ ok: false, error: 'VIN must be 17 characters' });
  }

  try {
    const response = await fetch(`${DBVIN_URL}/${encodeURIComponent(vin)}`, {
      headers: { Accept: 'application/json' }
    });
    const data = await response.json();

    if (!response.ok) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(response.status).json({ ok: false, error: data?.message || 'VIN not found' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      ok: true,
      vin: data.vin,
      brand: data.brand || '',
      model: data.model || '',
      year: data.year || null,
      fuelType: data.fuelType || '',
      bodyType: data.bodyType || '',
      version: data.version || '',
      registrationCountry: data.registrationCountry || ''
    });
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ ok: false, error: e.message || 'Decode failed' });
  }
}
