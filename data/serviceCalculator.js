/**
 * Pozycje kalkulatora orientacyjnego (robocizna w PLN, bez części).
 * ID używane w ?services=id1,id2 dla formularza zapisu.
 */

export const CALCULATOR_ITEMS = [
  {
    id: 'pre_purchase',
    price: 200,
    namePl: 'Przegląd przed zakupem auta',
    nameRu: 'Осмотр перед покупкой авто',
  },
  {
    id: 'inspection_prep',
    price: 250,
    namePl: 'Przygotowanie do przeglądu technicznego',
    nameRu: 'Подготовка к техосмотру',
  },
  {
    id: 'oil_change',
    price: 80,
    namePl: 'Wymiana oleju + filtr (robocizna)',
    nameRu: 'Замена масла + фильтр (работа)',
  },
  {
    id: 'brakes_pads',
    price: 150,
    namePl: 'Wymiana klocków hamulcowych (oś)',
    nameRu: 'Замена тормозных колодок (ось)',
  },
  {
    id: 'brakes_discs',
    price: 280,
    namePl: 'Wymiana tarcz + klocków (oś)',
    nameRu: 'Замена дисков + колодок (ось)',
  },
  {
    id: 'diagnostics',
    price: 100,
    namePl: 'Diagnostyka komputerowa',
    nameRu: 'Компьютерная диагностика',
  },
  {
    id: 'suspension_diag',
    price: 100,
    namePl: 'Diagnostyka zawieszenia',
    nameRu: 'Диагностика подвески',
  },
  {
    id: 'timing_belt',
    price: 700,
    namePl: 'Wymiana rozrządu 4-cyl. (robocizna)',
    nameRu: 'Замена ГРМ 4-цил. (работа)',
  },
  {
    id: 'tires_4',
    price: 100,
    namePl: 'Wymiana opon (4 szt.)',
    nameRu: 'Замена шин (4 шт.)',
  },
  {
    id: 'geometry',
    price: 120,
    namePl: 'Geometria / zbieżność',
    nameRu: 'Развал-схождение',
  },
];

export function getCalculatorItem(id) {
  return CALCULATOR_ITEMS.find((x) => x.id === id);
}

export function getCalculatorLabel(id, lang) {
  const item = getCalculatorItem(id);
  if (!item) return null;
  return lang === 'ru' ? item.nameRu : item.namePl.replace(/^🔧\s*/, '');
}

/** Parsuje ?services= z walidacją ID. */
export function parseCalculatorServiceIds(raw) {
  if (!raw || typeof raw !== 'string') return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((id) => getCalculatorItem(id));
}

export function computeCalculatorLaborTotal(selectedIds, workshopParts) {
  const base = selectedIds.reduce((sum, id) => {
    const it = getCalculatorItem(id);
    return sum + (it ? it.price : 0);
  }, 0);
  if (!workshopParts || base <= 0) {
    return { base, discounted: base, savings: 0 };
  }
  const discounted = Math.round(base * 0.9);
  return { base, discounted, savings: base - discounted };
}

/**
 * Tekst do pola „Rodzaj usługi” w formularzu.
 * @param {'own' | 'workshop' | null} partsMode
 */
export function buildCalculatorBookingLine(selectedIds, lang, partsMode) {
  const labels = selectedIds.map((id) => getCalculatorLabel(id, lang)).filter(Boolean);
  let line = labels.join('; ');
  const isRu = lang === 'ru';
  if (partsMode === 'workshop') {
    line += isRu
      ? ' | Запчасти из сервиса (скидка 10% на работу в расчёте)'
      : ' | Części z serwisu (rabat 10% na robociznę w wycenie)';
  } else if (partsMode === 'own') {
    line += isRu ? ' | Свои запчасти' : ' | Własne części';
  }
  return line;
}
