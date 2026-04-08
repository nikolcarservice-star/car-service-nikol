/**
 * Cennik — zgodny z arkuszem Car Service Nikol (Google Sheets).
 * Ceny mogą się różnić w zależności od modelu auta i zakresu prac.
 */

/** Krótki fragment z kwotami pod SERP / meta (widoczny też jako lead na stronie cennika). */
export function getCennikSeoSnippet(lang) {
  if (lang === 'ru') {
    return 'Car Service Nikol, Jastrowo: замена масла + фильтр от 120 zł (работа), комплекс с маслом от 320 zł, колодки ось от 180 zł, диагностика ЭБУ от 150 zł, шины 4 шт. от 150 zł, ГРМ от 900 zł. Клиенты из Шамотул — полный прайс ниже.';
  }
  return 'Car Service Nikol, Jastrowo: wymiana oleju + filtr od 120 zł (robocizna), serwis olejowy od 320 zł, klocki oś od 180 zł, diagnostyka od 150 zł, opony 4 szt. od 150 zł, rozrząd od 900 zł. Kierowcy z Szamotuł — pełna tabela cen poniżej.';
}

/** Dłuższy akapit z cenami (tylko strona, niepodwójny względem meta). */
export function getCennikIntroParagraph(lang) {
  if (lang === 'ru') {
    return 'Ниже — актуальный ориентировочный прайс: замена масла и фильтра от 120 zł (работа) или сервис с маслом от 320 zł; тормозные колодки ось от 180 zł; диагностика подвески 100 zł; компьютерная диагностика от 150 zł; замена шин (комплект) от 150 zł; ремень ГРМ 4-цил. от 900 zł. Точная сумма зависит от авто и запчастей — позвоните, подскажем.';
  }
  return 'Poniżej aktualny cennik orientacyjny: wymiana oleju i filtra od 120 zł (robocizna) lub serwis olejowy od 320 zł; klocki na oś od 180 zł; diagnostyka zawieszenia 100 zł; diagnostyka komputerowa od 150 zł; wymiana czterech opon od 150 zł; rozrząd 4-cyl. od 900 zł. Końcowa kwota zależy od modelu i części — zadzwoń, wstępnie wycenimy.';
}

export const priceListPl = [
  {
    category: 'Oleje i filtry',
    items: [
      { name: 'Wymiana oleju + filtr (robocizna)', price: 'od 120 zł', note: 'robocizna' },
      {
        name: 'Serwis olejowy (olej + filtr + materiały)',
        price: 'od 320 zł',
        note: 'z materiałem',
      },
      {
        name: 'Wymiana filtra powietrza / kabinowego',
        price: '50 zł / od 50 zł',
        note: 'wg zakresu',
      },
    ],
  },
  {
    category: 'Hamulce',
    items: [
      { name: 'Wymiana klocków hamulcowych (oś)', price: 'od 180 zł', note: 'robocizna' },
      { name: 'Wymiana tarcz i klocków (oś)', price: 'od 350 zł', note: 'robocizna' },
      { name: 'Regeneracja zacisku hamulcowego (szt.)', price: 'od 200 zł', note: 'za sztukę' },
    ],
  },
  {
    category: 'Zawieszenie',
    items: [
      { name: 'Diagnostyka zawieszenia', price: '100 zł', note: '' },
      { name: 'Wymiana amortyzatora (1 szt.)', price: 'od 220 zł', note: 'robocizna' },
      { name: 'Wymiana wahacza (komplet)', price: 'od 250 zł', note: 'robocizna' },
      { name: 'Geometria / ustawienie zbieżności', price: '200 zł', note: '' },
    ],
  },
  {
    category: 'Diagnostyka',
    items: [
      { name: 'Komputerowy odczyt i kasowanie błędów', price: 'od 150 zł', note: '' },
      { name: 'Pełna diagnostyka (szukanie przyczyny)', price: 'od 250 zł', note: '' },
      { name: 'Kodowanie / programowanie kluczyka', price: 'od 400 zł', note: 'wycena wg marki' },
      { name: 'Odzyskiwanie / duplikat klucza', price: 'wycena indywidualna', note: '' },
    ],
  },
  {
    category: 'Rozrząd',
    items: [
      { name: 'Wymiana paska rozrządu (4-cyl.)', price: 'od 900 zł', note: 'robocizna' },
      { name: 'Wymiana paska + pompa wody', price: '1100 zł', note: 'robocizna' },
      { name: 'Wymiana łańcucha rozrządu', price: 'wycena indywidualna', note: '' },
    ],
  },
  {
    category: 'Opony',
    items: [
      { name: 'Wymiana opon (4 szt. — komplet)', price: 'od 150 zł', note: '' },
      { name: 'Naprawa przebicia (kołek / łata)', price: '80 zł', note: '' },
    ],
  },
  {
    category: 'Serwis mobilny',
    items: [
      { name: 'Pomoc drogowa / dojazd', price: '250 zł', note: '' },
      { name: 'Awaryjne odpalanie (booster)', price: '150 zł', note: '' },
    ],
  },
  {
    category: 'Silnik',
    items: [{ name: 'Wymiana silnika', price: 'od 2500 zł', note: 'robocizna' }],
  },
  {
    category: 'Inne',
    items: [
      { name: 'Przegląd przed zakupem / do dowodu', price: '300 zł', note: '' },
      { name: 'Roboczogodzina pracy', price: '180 zł', note: '' },
    ],
  },
];

export const priceListRu = [
  {
    category: 'Масла и фильтры',
    items: [
      { name: 'Замена масла + фильтр (работа)', price: 'от 120 zł', note: 'работа' },
      { name: 'Маслообслуживание (масло + фильтр + материалы)', price: 'от 320 zł', note: 'с материалами' },
      {
        name: 'Замена воздушного / салонного фильтра',
        price: '50 zł / от 50 zł',
        note: 'по объёму работ',
      },
    ],
  },
  {
    category: 'Тормоза',
    items: [
      { name: 'Замена тормозных колодок (ось)', price: 'от 180 zł', note: 'работа' },
      { name: 'Замена дисков и колодок (ось)', price: 'от 350 zł', note: 'работа' },
      { name: 'Регенерация суппорта (шт.)', price: 'от 200 zł', note: 'за штуку' },
    ],
  },
  {
    category: 'Подвеска',
    items: [
      { name: 'Диагностика подвески', price: '100 zł', note: '' },
      { name: 'Замена амортизатора (1 шт.)', price: 'от 220 zł', note: 'работа' },
      { name: 'Замена рычага (комплект)', price: 'от 250 zł', note: 'работа' },
      { name: 'Сход-развал / установка схождения', price: '200 zł', note: '' },
    ],
  },
  {
    category: 'Диагностика',
    items: [
      { name: 'Компьютерное считывание и сброс ошибок', price: 'от 150 zł', note: '' },
      { name: 'Полная диагностика (поиск причины)', price: 'от 250 zł', note: '' },
      { name: 'Кодирование / программирование ключа', price: 'от 400 zł', note: 'по марке авто' },
      { name: 'Восстановление / дубликат ключа', price: 'индивидуальная оценка', note: '' },
    ],
  },
  {
    category: 'ГРМ',
    items: [
      { name: 'Замена ремня ГРМ (4-цил.)', price: 'от 900 zł', note: 'работа' },
      { name: 'Замена ремня + помпа воды', price: '1100 zł', note: 'работа' },
      { name: 'Замена цепи ГРМ', price: 'индивидуальная оценка', note: '' },
    ],
  },
  {
    category: 'Шины',
    items: [
      { name: 'Замена шин (4 шт. — комплект)', price: 'от 150 zł', note: '' },
      { name: 'Ремонт прокола (жгут / заплатка)', price: '80 zł', note: '' },
    ],
  },
  {
    category: 'Мобильный сервис',
    items: [
      { name: 'Помощь на дороге / выезд', price: '250 zł', note: '' },
      { name: 'Аварийный запуск (бустер)', price: '150 zł', note: '' },
    ],
  },
  {
    category: 'Двигатель',
    items: [{ name: 'Замена двигателя', price: 'от 2500 zł', note: 'работа' }],
  },
  {
    category: 'Прочее',
    items: [
      { name: 'Осмотр перед покупкой / для ПТС', price: '300 zł', note: '' },
      { name: 'Нормо-час работы', price: '180 zł', note: '' },
    ],
  },
];
