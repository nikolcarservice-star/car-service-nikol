/**
 * Lokalne strony usług: /[lang]/services/[prefix]-[miasto]
 * Warsztat fizycznie w Jastrowo — teksty jasno to komunikują (E-E-A-T).
 */

/** Klucze usług z wariantami pod miasta (reszta SERVICE_KEYS ma jeden slug jak dotychczas). */
export const SERVICE_CITY_LANDING_KEYS = ['suspension', 'oil', 'brakes', 'diagnostics'];

/** Fragment URL bez miasta — musi się zgadzać z istniejącym slugiem bez sufiksu `-jastrowo`. */
export const SERVICE_LANDING_SLUG_PREFIX = {
  suspension: 'naprawa-zawieszenia',
  oil: 'wymiana-oleju-i-filtrow',
  brakes: 'serwis-hamulcow',
  diagnostics: 'diagnostyka-komputerowa',
};

/**
 * Miasta: slug w URL (ASCII), nazwa do wyświetlania, forma z przyimkiem „w …” (PL) / „в …” (RU).
 */
export const SERVICE_LANDING_CITIES = [
  {
    slug: 'jastrowo',
    namePl: 'Jastrowo',
    nameRu: 'Jastrowo',
    wPl: 'w Jastrowie',
    wRu: 'в Jastrowo',
  },
  {
    slug: 'szamotuly',
    namePl: 'Szamotuły',
    nameRu: 'Шамотулы',
    wPl: 'w Szamotułach',
    wRu: 'в Шамотулах',
  },
  {
    slug: 'poznan',
    namePl: 'Poznań',
    nameRu: 'Познань',
    wPl: 'w Poznaniu',
    wRu: 'в Познани',
  },
  {
    slug: 'oborniki',
    namePl: 'Oborniki',
    nameRu: 'Оборники',
    wPl: 'w Obornikach',
    wRu: 'в Оборниках',
  },
  {
    slug: 'lubon',
    namePl: 'Luboń',
    nameRu: 'Любонь',
    wPl: 'w Luboniu',
    wRu: 'в Любоне',
  },
  {
    slug: 'swarzedz',
    namePl: 'Swarzędz',
    nameRu: 'Сваржед',
    wPl: 'w Swarzędzu',
    wRu: 'в Сваржедзе',
  },
  {
    slug: 'komorniki',
    namePl: 'Komorniki',
    nameRu: 'Коморники',
    wPl: 'w Komornikach',
    wRu: 'в Коморниках',
  },
];

/** Rzeczownik w dopełniaczu / frazie „potrzebujesz …” (PL). */
const SERVICE_NEED_PHRASE_PL = {
  suspension: 'naprawy zawieszenia',
  oil: 'wymiany oleju i filtrów',
  brakes: 'serwisu hamulców',
  diagnostics: 'diagnostyki komputerowej',
};

const SERVICE_NEED_PHRASE_RU = {
  suspension: 'ремонта подвески',
  oil: 'замены масла и фильтров',
  brakes: 'обслуживания тормозов',
  diagnostics: 'компьютерной диагностики',
};

export function buildCityServiceSlug(serviceKey, citySlug) {
  const prefix = SERVICE_LANDING_SLUG_PREFIX[serviceKey];
  if (!prefix) return null;
  return `${prefix}-${citySlug}`;
}

/** Zwraca { serviceKey, city } jeśli slug pasuje do wzorca landing, inaczej null. */
export function parseCityServiceSlug(slug) {
  if (typeof slug !== 'string' || !slug) return null;
  for (const city of SERVICE_LANDING_CITIES) {
    const suf = `-${city.slug}`;
    if (!slug.endsWith(suf)) continue;
    const prefix = slug.slice(0, -suf.length);
    const serviceKey = SERVICE_CITY_LANDING_KEYS.find((k) => SERVICE_LANDING_SLUG_PREFIX[k] === prefix);
    if (serviceKey) return { serviceKey, city };
  }
  return null;
}

/** Teksty SEO + H1 dla wariantu miejskiego (PL/RU). */
export function buildCityLandingCopy(serviceKey, city, basePl, baseRu, lang) {
  const isRu = lang === 'ru';
  const base = isRu ? baseRu : basePl;
  const w = isRu ? city.wRu : city.wPl;
  const cityName = isRu ? city.nameRu : city.namePl;
  const needPhrase = isRu ? SERVICE_NEED_PHRASE_RU[serviceKey] : SERVICE_NEED_PHRASE_PL[serviceKey];

  const h1 = isRu
    ? `${base.name} ${w} — быстро и профессионально | Car Service Nikol`
    : `${base.name} ${w} — Szybko i Fachowo | Car Service Nikol`;

  const seoTitle = isRu
    ? `${base.shortName} ${city.nameRu} — быстро | Car Service Nikol`
    : `${base.name} ${w} — szybko | Car Service Nikol`;

  const seoDescription = isRu
    ? `${base.name} для водителей из ${city.nameRu}. Автосервис Car Service Nikol в Jastrowo — удобный заезд, честные цены, диагностика. Запишитесь или напишите в чат.`
    : `${base.name} dla kierowców z ${cityName} i okolic. Warsztat Car Service Nikol w Jastrowo — dogodny dojazd, uczciwe ceny, szybka diagnostyka. Umów wizytę lub napisz do nas.`;

  const introLead = isRu
    ? `Ищете ${needPhrase} для авто из ${city.nameRu}? Наш автосервис в Jastrowo обслуживает клиентов из региона, в том числе ${city.wRu}. `
    : `Szukasz ${needPhrase} w okolicach ${cityName}? Zapraszamy do warsztatu Car Service Nikol w Jastrowo — obsługujemy klientów z ${cityName} i całego regionu. `;

  const intro = introLead + base.intro;

  const sectionH2 = isRu
    ? `Работаем для водителей из ${city.nameRu}`
    : `Obsługa kierowców z ${cityName} i okolic`;

  return {
    h1,
    seoTitle,
    seoDescription,
    intro,
    sectionH2,
  };
}
