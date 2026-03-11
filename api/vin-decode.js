/**
 * Декодирование VIN: db.vin (Европа) + fallback NHTSA (США/мир).
 * GET /api/vin-decode?vin=WBADT43452G123456
 */

const DBVIN_URL = 'https://db.vin/api/v1/vin';
const NHTSA_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues';

async function decodeDbVin(vin) {
  const response = await fetch(`${DBVIN_URL}/${encodeURIComponent(vin)}`, {
    headers: { Accept: 'application/json' }
  });
  if (!response.ok) return null;
  const data = await response.json();
  if (!data || (!data.brand && !data.model)) return null;
  return {
    vin: data.vin || vin,
    brand: data.brand || '',
    model: data.model || '',
    year: data.year || null,
    fuelType: data.fuelType || '',
    bodyType: data.bodyType || '',
    version: data.version || '',
    registrationCountry: data.registrationCountry || ''
  };
}

async function decodeNhtsa(vin) {
  const response = await fetch(`${NHTSA_URL}/${encodeURIComponent(vin)}?format=json`, {
    headers: { Accept: 'application/json', 'User-Agent': 'CarServiceNikol/1.0' }
  });
  if (!response.ok) return null;
  const json = await response.json();
  const r = json?.Results?.[0];
  if (!r || (r.ErrorCode != null && String(r.ErrorCode) !== '0')) return null;
  const year = r.ModelYear ? parseInt(r.ModelYear, 10) : null;
  return {
    vin: vin,
    brand: r.Make || '',
    model: r.Model || '',
    year: Number.isFinite(year) ? year : null,
    fuelType: r.FuelTypePrimary || r.FuelTypePrimary1 || '',
    bodyType: r.BodyClass || '',
    version: r.Series || r.Trim || '',
    registrationCountry: r.PlantCountry || ''
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const vin = (req.query?.vin || '').trim().toUpperCase().replace(/\s/g, '');
  if (!vin || vin.length !== 17) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).json({ ok: false, error: 'VIN must be 17 characters' });
  }

  try {
    let result = await decodeDbVin(vin);
    if (!result || (!result.brand && !result.model)) {
      result = await decodeNhtsa(vin);
    }
    if (!result || (!result.brand && !result.model)) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(200).json({
        ok: true,
        vin,
        brand: '',
        model: '',
        year: null,
        fuelType: '',
        bodyType: '',
        version: '',
        registrationCountry: '',
        notFound: true
      });
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      ok: true,
      notFound: false,
      ...result
    });
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ ok: false, error: e.message || 'Decode failed' });
  }
}
