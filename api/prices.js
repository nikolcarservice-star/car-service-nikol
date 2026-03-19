/**
 * Proxy API /api/prices — мониторинг цен (Poznań i okolice).
 */

const POZNAN_URL = 'https://kb.pl/cenniki/miejskie/warsztat-samochodowy/poznan/';
const SZAMOTULY_URL = 'https://kb.pl/cenniki/miejskie/warsztat-samochodowy/szamotuly/';

const KEYWORDS = [
  { keys: ['oleju i filtr', 'oleju i filtrów'], serviceId: 'oil' },
  { keys: ['tarcz i klocków', 'klocków hamulcowych'], serviceId: '3' },
  { keys: ['płynu hamulcowego'], serviceId: 'brake_fluid' },
  { keys: ['amortyzatorów'], serviceId: 'shock' },
  { keys: ['sprzęgła'], serviceId: 'clutch' }
];

const PRICE_SERVICES = [
  { id: '1', basePrice: 100, competitorAvgPrice: 95 },
  { id: '2', basePrice: 250, competitorAvgPrice: 280 },
  { id: '3', basePrice: 100, competitorAvgPrice: 120 },
  { id: '4', basePrice: 120, competitorAvgPrice: 135 },
  { id: '5', basePrice: 50, competitorAvgPrice: 65 }
];

const INTERNET_SUGGESTIONS = [
  { keys: ['замена двс', 'замена двигателя', 'wymiana silnika', 'silnik'], name_pl: 'Wymiana silnika', name_ru: 'Замена двигателя', competitorAvgPrice: 1800 },
  { keys: ['замена масла', 'wymiana oleju', 'olej'], name_pl: 'Wymiana oleju i filtrów', name_ru: 'Замена масла и фильтров', competitorAvgPrice: 80 },
  { keys: ['диагностика', 'diagnostyka'], name_pl: 'Diagnostyka komputerowa', name_ru: 'Компьютерная диагностика', competitorAvgPrice: 100 },
  { keys: ['замена колодок', 'klocki', 'klocków'], name_pl: 'Wymiana klocków', name_ru: 'Замена колодок', competitorAvgPrice: 250 },
  { keys: ['шиномонтаж', 'wulkanizacja', 'opony'], name_pl: 'Wulkanizacja (komplet)', name_ru: 'Шиномонтаж (комплект)', competitorAvgPrice: 130 },
  { keys: ['выезд', 'dojazd', 'mobilny'], name_pl: 'Serwis mobilny (dojazd)', name_ru: 'Выезд мастера', competitorAvgPrice: 60 },
  { keys: ['ключ', 'klucz', 'кодирование'], name_pl: 'Kodowanie klucza', name_ru: 'Программирование ключа', competitorAvgPrice: 280 },
  { keys: ['тормоз', 'hamulce', 'tarcze', 'диски тормоз'], name_pl: 'Wymiana tarcz i klocków', name_ru: 'Замена дисков и колодок', competitorAvgPrice: 250 },
  { keys: ['амортизаторы', 'amortyzator', 'стойки'], name_pl: 'Wymiana amortyzatorów', name_ru: 'Замена амортизаторов', competitorAvgPrice: 350 },
  { keys: ['сцепление', 'sprzęgło'], name_pl: 'Wymiana sprzęgła', name_ru: 'Замена сцепления', competitorAvgPrice: 900 },
  { keys: ['свечи', 'świece', 'свечи зажигания'], name_pl: 'Wymiana świec zapłonowych', name_ru: 'Замена свечей зажигания', competitorAvgPrice: 95 },
  { keys: ['жидкость тормоз', 'płyn hamulcowy'], name_pl: 'Wymiana płynu hamulcowego', name_ru: 'Замена тормозной жидкости', competitorAvgPrice: 200 }
];

function suggestFromInternet(query) {
  if (!query || typeof query !== 'string') return null;
  const normalized = query.toLowerCase().trim().replace(/\s+/g, ' ');
  for (const term of INTERNET_SUGGESTIONS) {
    if (term.keys.some((k) => normalized.includes(k) || k.includes(normalized))) {
      return { name_pl: term.name_pl, name_ru: term.name_ru, competitorAvgPrice: term.competitorAvgPrice };
    }
  }
  return null;
}

function parseTable(html) {
  const rows = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let tr;
  while ((tr = trRegex.exec(html)) !== null) {
    const rowHtml = tr[1];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const cells = [];
    let td;
    while ((td = tdRegex.exec(rowHtml)) !== null) {
      cells.push(td[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    }
    const prices = rowHtml.match(/[\d.,]+\s*zł/gi);
    if (cells.length >= 1 && prices && prices.length >= 2) {
      const name = cells[0].toLowerCase();
      const brutto = Math.round(parseFloat(prices[1].replace(',', '.').replace(/\s*zł/i, '').trim()));
      rows.push({ name, brutto });
    }
  }
  return rows;
}

function extractPrices(rows) {
  const byServiceId = {};
  for (const row of rows) {
    for (const { keys, serviceId } of KEYWORDS) {
      const match = keys.some((k) => row.name.includes(k));
      if (match) {
        if (!byServiceId[serviceId] || row.brutto < byServiceId[serviceId]) byServiceId[serviceId] = row.brutto;
        break;
      }
    }
  }
  return byServiceId;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  const serviceQuery = (req.query && req.query.service) ? String(req.query.service).trim() : '';
  if (serviceQuery) {
    const suggestion = suggestFromInternet(serviceQuery);
    if (suggestion) return res.status(200).json(suggestion);
    return res.status(200).json({
      name_pl: serviceQuery,
      name_ru: serviceQuery,
      competitorAvgPrice: 0
    });
  }

  const out = PRICE_SERVICES.map((s) => ({ ...s }));

  try {
    const [rPoznan, rSzamotuly] = await Promise.all([
      fetch(POZNAN_URL, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NikolPriceMonitor/1.0)' } }),
      fetch(SZAMOTULY_URL, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NikolPriceMonitor/1.0)' } })
    ]);
    const htmlPoznan = await rPoznan.text();
    const htmlSzamotuly = await rSzamotuly.text();

    const pricesPoznan = extractPrices(parseTable(htmlPoznan));
    const pricesSzamotuly = extractPrices(parseTable(htmlSzamotuly));

    if (pricesPoznan['3'] || pricesSzamotuly['3']) {
      const avg = [pricesPoznan['3'], pricesSzamotuly['3']].filter(Boolean);
      const competitor = Math.round(avg.reduce((a, b) => a + b, 0) / avg.length);
      const item = out.find((s) => s.id === '3');
      if (item) {
        item.competitorAvgPrice = competitor;
        item.basePrice = Math.round(competitor * 0.9);
      }
    }
    if (pricesPoznan['oil'] || pricesSzamotuly['oil']) {
      const avg = [pricesPoznan['oil'], pricesSzamotuly['oil']].filter(Boolean);
      const competitor = Math.round(avg.reduce((a, b) => a + b, 0) / avg.length);
      const item = out.find((s) => s.id === '1');
      if (item) item.competitorAvgPrice = Math.max(item.competitorAvgPrice || 0, competitor);
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }

  return res.status(200).json(out);
}

