/**
 * Dedykowane strony SEO: /[lang]/services/[slug]
 * Osobne slugi pod konkretne frazy (np. „wymiana filtrów poznań”).
 */

export const SERVICE_SEO_LANDING_SLUGS = ['wymiana-filtrow-poznan'];

const LANDING_PL = {
  key: 'oil',
  slug: 'wymiana-filtrow-poznan',
  name: 'Wymiana filtrów',
  shortName: 'Filtry',
  weekendEmphasis: true,
  embedBooking: true,
  h1: 'Wymiana filtrów Poznań — Serwis w weekendy',
  seoTitle: 'Wymiana filtrów Poznań — sobota i niedziela | Car Service Nikol',
  seoDescription:
    'Wymiana filtrów powietrza, kabinowego i oleju dla kierowców z Poznania. Warsztat w Jastrowo — przyjmujemy w SOBOTĘ 8:00–18:00 i NIEDZIELĘ 10:00–16:00. Filtr od 50 zł, serwis olejowy od 350 zł. Zadzwoń lub umów wizytę.',
  sectionH2: 'Pracujemy w sobotę i niedzielę — dla kierowców z Poznania',
  intro:
    'Szukasz wymiany filtrów w Poznaniu, ale w tygodniu nie możesz oddać auta na serwis? Car Service Nikol w Jastrowo (ok. 25 km od Poznania) przyjmuje klientów wyłącznie w weekend: w sobotę od 8:00 do 18:00 oraz w niedzielę od 10:00 do 16:00. Wymieniamy filtr oleju, filtr powietrza i kabinowy — możesz przywieźć własne części lub dobierzemy filtry u nas. Przed wizytą podamy dokładną kwotę dla Twojego modelu.',
  weekendLead:
    'Warsztat stacjonarny jest czynny tylko w weekend — to nasza przewaga dla kierowców z Poznania i aglomeracji, którzy w poniedziałek–piątek potrzebują auta do pracy.',
  pricesIntro: 'Aktualny cennik (PLN, brutto) — wymiana filtrów i serwis olejowy:',
  prices: [
    { label: 'Wymiana filtra powietrza / kabinowego', value: 'od 50 zł' },
    { label: 'Wymiana oleju + filtr oleju (robocizna)', value: 'od 120 zł' },
    { label: 'Serwis olejowy (olej + filtr + materiały)', value: 'od 350 zł' },
  ],
  process: [
    'Dzwonisz lub piszesz na WhatsApp — podajesz markę, model i które filtry chcesz wymienić (oleju, powietrza, kabiny). Ustalamy termin na najbliższą sobotę lub niedzielę.',
    'W warsztacie w Jastrowo (ul. Wernisażowa 21) wymieniamy filtry według procedury producenta; przy wymianie oleju kontrolujemy poziom i szczelność.',
    'Po usłudze omawiamy kolejny interwał serwisowy — bez nacisku na niepotrzebne dodatkowe prace.',
  ],
  symptoms: [
    'Zbliża się termin wymiany filtra kabinowego lub powietrza wg książki serwisowej.',
    'Słabszy nawiew ogrzewania / klimatyzacji — często zużyty filtr kabinowy.',
    'Wyższe spalanie lub „cięższy” silnik — warto sprawdzić filtr powietrza i oleju.',
    'Ciemne olej na bagnetcie lub komunikat o serwisie olejowym — wymiana oleju z filtrem.',
    'Wolisz zrobić serwis filtrów w sobotę lub niedzielę, gdy masz czas — u nas to standard.',
  ],
  bookingTitle: 'Umów wymianę filtrów na weekend',
  bookingSubtitle:
    'Zadzwoń lub napisz na WhatsApp — podpowiemy cenę filtrów i oleju oraz zarezerwujemy termin w sobotę lub niedzielę (warsztat w Jastrowo, dojazd z Poznania ok. 25 km).',
};

const LANDING_RU = {
  key: 'oil',
  slug: 'wymiana-filtrow-poznan',
  name: 'Замена фильтров',
  shortName: 'Фильтры',
  weekendEmphasis: true,
  embedBooking: true,
  h1: 'Замена фильтров Познань — сервис в выходные',
  seoTitle: 'Замена фильтров Познань — суббота и воскресенье | Car Service Nikol',
  seoDescription:
    'Замена воздушного, салонного и масляного фильтра для водителей из Познани. Мастерская в Jastrowo — приём в СУББОТУ 8:00–18:00 и ВОСКРЕСЕНЬЕ 10:00–16:00. Фильтр от 50 zł, сервис с маслом от 350 zł.',
  sectionH2: 'Работаем в субботу и воскресенье — для клиентов из Познани',
  intro:
    'Нужна замена фильтров в Познани, но в будни нельзя оставить машину? Car Service Nikol в Jastrowo (около 25 км от Познани) принимает на месте только в выходные: суббота 8:00–18:00, воскресенье 10:00–16:00. Меняем масляный, воздушный и салонный фильтры — можно со своими запчастями или подберём у нас. Точную сумму назовём до визита.',
  weekendLead:
    'Стационарная мастерская открыта только в выходные — удобно для тех, кому в понедельник–пятницу нужна машина на работу.',
  pricesIntro: 'Актуальные цены (PLN) — фильтры и маслообслуживание:',
  prices: [
    { label: 'Замена воздушного / салонного фильтра', value: 'от 50 zł' },
    { label: 'Замена масла + масляный фильтр (работа)', value: 'от 120 zł' },
    { label: 'Маслообслуживание (масло + фильтр + материалы)', value: 'от 350 zł' },
  ],
  process: [
    'Звоните или пишете в WhatsApp — марка, модель и какие фильтры менять. Согласуем субботу или воскресенье.',
    'В Jastrowo (ul. Wernisażowa 21) выполняем замену по регламенту; при замене масла проверяем уровень и течи.',
    'После работы напоминаем следующий интервал сервиса — без лишних навязанных услуг.',
  ],
  symptoms: [
    'Подошёл срок замены салонного или воздушного фильтра.',
    'Слабый обдув печки / кондиционера — часто износ салонного фильтра.',
    'Расход вырос — проверить воздушный фильтр и масло.',
    'Тёмное масло на щупе — замена масла с фильтром.',
    'Удобнее приехать в субботу или воскресенье — у нас это основной график.',
  ],
  bookingTitle: 'Запись на замену фильтров в выходные',
  bookingSubtitle:
    'Позвоните или напишите в WhatsApp — подскажем цену и время в субботу или воскресенье (Jastrowo, ~25 км от Познани).',
};

const LANDINGS = {
  'wymiana-filtrow-poznan': { pl: LANDING_PL, ru: LANDING_RU },
};

export function getServiceSeoLanding(slug, lang) {
  const entry = LANDINGS[slug];
  if (!entry) return null;
  const code = lang === 'ru' ? 'ru' : 'pl';
  return entry[code] ?? entry.pl;
}

export function getAllServiceSeoLandingSlugs() {
  return [...SERVICE_SEO_LANDING_SLUGS];
}
