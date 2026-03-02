/**
 * Мониторинг цен с интернета: Познань и окрестности (KB.pl).
 * Запуск: node run.js   или   node run.js > prices.json
 * Раз в неделю: запустите по расписанию (cron / Планировщик заданий) и в CRM нажмите «Загрузить JSON» или укажите URL выгрузки.
 */

const POZNAN_URL = 'https://kb.pl/cenniki/miejskie/warsztat-samochodowy/poznan/';
const SZAMOTULY_URL = 'https://kb.pl/cenniki/miejskie/warsztat-samochodowy/szamotuly/';

// Соответствие фраз из таблицы KB.pl → id в CRM (1–5)
const KEYWORDS = [
  { keys: ['oleju i filtr', 'oleju i filtrów'], crmId: 'oil' },
  { keys: ['tarcz i klocków', 'klocków hamulcowych'], crmId: '3' },
  { keys: ['płynu hamulcowego'], crmId: 'brake_fluid' },
  { keys: ['amortyzatorów'], crmId: 'shock' },
  { keys: ['sprzęgła'], crmId: 'clutch' }
];

// Итоговый формат для CRM: id 1–5
const CRM_SERVICES = [
  { id: '1', basePrice: 100, competitorAvgPrice: 95 },
  { id: '2', basePrice: 250, competitorAvgPrice: 280 },
  { id: '3', basePrice: 100, competitorAvgPrice: 120 },
  { id: '4', basePrice: 120, competitorAvgPrice: 135 },
  { id: '5', basePrice: 50, competitorAvgPrice: 65 }
];

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
  const byCrmId = {};
  for (const row of rows) {
    for (const { keys, crmId } of KEYWORDS) {
      const match = keys.some((k) => row.name.includes(k));
      if (match) {
        if (!byCrmId[crmId] || row.brutto < byCrmId[crmId]) byCrmId[crmId] = row.brutto;
        break;
      }
    }
  }
  return byCrmId;
}

async function fetchUrl(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NikolPriceMonitor/1.0)' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function main() {
  const out = CRM_SERVICES.map((s) => ({ ...s }));

  try {
    const [htmlPoznan, htmlSzamotuly] = await Promise.all([
      fetchUrl(POZNAN_URL),
      fetchUrl(SZAMOTULY_URL)
    ]);

    const rowsPoznan = parseTable(htmlPoznan);
    const rowsSzamotuly = parseTable(htmlSzamotuly);
    const pricesPoznan = extractPrices(rowsPoznan);
    const pricesSzamotuly = extractPrices(rowsSzamotuly);

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
    console.error(JSON.stringify({ error: e.message }));
  }

  console.log(JSON.stringify(out, null, 2));
}

main();
