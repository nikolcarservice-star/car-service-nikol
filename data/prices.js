/**
 * Cennik usług – orientacyjne ceny na podstawie rynku okolic Poznania (Poznań, Jastrowo, Szamotuły, okolice).
 * Ceny mogą się różnić w zależności od modelu auta i zakresu prac.
 */

/** Krótki fragment z kwotami pod SERP / meta (widoczny też jako lead na stronie cennika). */
export function getCennikSeoSnippet(lang) {
  if (lang === 'ru') {
    return 'Car Service Nikol, Jastrowo: масло + фильтр от 80 zł (работа), колодки ось от 150 zł, диагностика от 100 zł, шины 4 шт. от 100 zł, ГРМ от 700 zł. Клиенты из Шамотул — полный текст прайса ниже.';
  }
  return 'Car Service Nikol, Jastrowo: olej + filtr od 80 zł (robocizna), klocki oś od 150 zł, diagnostyka od 100 zł, opony 4 szt. od 100 zł, rozrząd od 700 zł. Kierowcy z Szamotuł — pełna tabela cen poniżej.';
}

/** Dłuższy akapit z cenami (tylko strona, niepodwójny względem meta). */
export function getCennikIntroParagraph(lang) {
  if (lang === 'ru') {
    return 'Ниже — ориентировочный прайс по основным работам. Примеры: замена масла и фильтра от 80 zł (только работа) или комплекс с маслом от 220 zł с материалом; тормозные колодки ось от 150 zł; компьютерная диагностика от 100 zł; шиномонтаж 4 колеса от 100 zł; ремень ГРМ для 4-цил. от 700 zł (работа). Итог зависит от марки авто и запчастей — звоните, подскажем.';
  }
  return 'Poniżej orientacyjny cennik najczęstszych usług. Przykłady: wymiana oleju i filtru od 80 zł (sam koszt robocizny) lub komplet z olejem i materiałem od 220 zł; klocki hamulcowe na jedną oś od 150 zł; diagnostyka komputerowa od 100 zł; wymiana czterech opon od 100 zł; rozrząd 4-cyl. od 700 zł (robocizna). Końcowa kwota zależy od modelu auta i części — zadzwoń, wstępnie wycenimy.';
}

export const priceListPl = [
  {
    category: 'Oleje i filtry',
    items: [
      { name: 'Wymiana oleju + filtr oleju (silnik 4-cyl.)', price: 'od 80 zł', note: 'robocizna' },
      {
        name: 'Wymiana oleju + filtr oleju + olej i materiały (osobówka, typowy silnik)',
        price: 'od 220 zł',
        note: 'z materiałem',
      },
      { name: 'Wymiana oleju + filtr (V6 / diesel)', price: 'od 100 zł', note: 'robocizna' },
      { name: 'Wymiana filtra powietrza', price: 'od 35 zł', note: 'robocizna' },
      { name: 'Wymiana filtra kabinowego', price: 'od 45 zł', note: 'robocizna' },
    ],
  },
  {
    category: 'Hamulce',
    items: [
      { name: 'Wymiana klocków hamulcowych (oś)', price: 'od 150 zł', note: 'robocizna' },
      { name: 'Wymiana tarcz + klocków (oś)', price: 'od 280 zł', note: 'robocizna' },
      { name: 'Wymiana płynu hamulcowego', price: 'od 140 zł', note: 'z materiałem' },
      { name: 'Regeneracja zacisku hamulcowego', price: 'od 180 zł', note: 'za sztukę' },
    ],
  },
  {
    category: 'Zawieszenie',
    items: [
      { name: 'Diagnostyka zawieszenia', price: 'od 100 zł', note: '' },
      { name: 'Wymiana amortyzatora (1 szt.)', price: 'od 180 zł', note: 'robocizna' },
      { name: 'Wymiana wahacza (komplet)', price: 'od 220 zł', note: 'robocizna' },
      { name: 'Wymiana tulei wahacza', price: 'od 120 zł', note: 'robocizna' },
    ],
  },
  {
    category: 'Diagnostyka',
    items: [
      { name: 'Komputerowa diagnostyka (odczyt błędów)', price: 'od 100 zł', note: '' },
      { name: 'Pełna diagnostyka (kilka układów)', price: 'od 180 zł', note: '' },
      { name: 'Kodowanie modułu', price: 'wycena', note: 'indywidualnie' },
    ],
  },
  {
    category: 'Rozrząd',
    items: [
      { name: 'Wymiana paska rozrządu (silnik 4-cyl.)', price: 'od 700 zł', note: 'robocizna' },
      { name: 'Wymiana paska + pompa wody', price: 'od 900 zł', note: 'robocizna' },
      { name: 'Wymiana łańcucha rozrządu', price: 'wycena', note: 'indywidualnie' },
    ],
  },
  {
    category: 'Opony i koła',
    items: [
      { name: 'Wymiana opon (4 szt.)', price: 'od 100 zł', note: '' },
      { name: 'Wyważanie kół (4 szt.)', price: 'od 80 zł', note: '' },
      { name: 'Naprawa przebicia', price: 'od 40 zł', note: 'za oponę' },
      { name: 'Geometria / ustawienie zbieżności', price: 'od 120 zł', note: '' },
    ],
  },
  {
    category: 'Klucze',
    items: [
      { name: 'Programowanie kluczyka (dodatkowy)', price: 'od 280 zł', note: 'wycena wg marki' },
      { name: 'Odzyskiwanie / duplikat klucza', price: 'wycena', note: 'indywidualnie' },
    ],
  },
  {
    category: 'Serwis mobilny',
    items: [
      { name: 'Pomoc drogowa (dojazd)', price: 'od 150 zł', note: '+ odległość' },
      { name: 'Awaryjne odpalanie (rozładowany akumulator)', price: 'od 120 zł', note: '' },
    ],
  },
];

export const priceListRu = [
  {
    category: 'Масла и фильтры',
    items: [
      { name: 'Замена масла + масляный фильтр (4-цил.)', price: 'от 80 zł', note: 'работа' },
      { name: 'Замена масла + фильтр (V6 / дизель)', price: 'от 100 zł', note: 'работа' },
      { name: 'Замена воздушного фильтра', price: 'от 35 zł', note: 'работа' },
      { name: 'Замена салонного фильтра', price: 'от 45 zł', note: 'работа' },
    ],
  },
  {
    category: 'Тормоза',
    items: [
      { name: 'Замена тормозных колодок (ось)', price: 'от 150 zł', note: 'работа' },
      { name: 'Замена дисков + колодок (ось)', price: 'от 280 zł', note: 'работа' },
      { name: 'Замена тормозной жидкости', price: 'от 140 zł', note: 'с материалами' },
      { name: 'Регенерация суппорта', price: 'от 180 zł', note: 'за штуку' },
    ],
  },
  {
    category: 'Ходовая часть',
    items: [
      { name: 'Диагностика ходовой', price: 'от 100 zł', note: '' },
      { name: 'Замена амортизатора (1 шт.)', price: 'от 180 zł', note: 'работа' },
      { name: 'Замена рычага (в сборе)', price: 'от 220 zł', note: 'работа' },
      { name: 'Замена сайлентблока рычага', price: 'от 120 zł', note: 'работа' },
    ],
  },
  {
    category: 'Диагностика',
    items: [
      { name: 'Компьютерная диагностика (считывание ошибок)', price: 'от 100 zł', note: '' },
      { name: 'Полная диагностика (несколько систем)', price: 'от 180 zł', note: '' },
      { name: 'Кодирование модуля', price: 'по запросу', note: 'индивидуально' },
    ],
  },
  {
    category: 'ГРМ',
    items: [
      { name: 'Замена ремня ГРМ (4-цил.)', price: 'от 700 zł', note: 'работа' },
      { name: 'Замена ремня + помпа воды', price: 'от 900 zł', note: 'работа' },
      { name: 'Замена цепи ГРМ', price: 'по запросу', note: 'индивидуально' },
    ],
  },
  {
    category: 'Шины и колёса',
    items: [
      { name: 'Замена шин (4 шт.)', price: 'от 100 zł', note: '' },
      { name: 'Балансировка колёс (4 шт.)', price: 'от 80 zł', note: '' },
      { name: 'Ремонт прокола', price: 'от 40 zł', note: 'за шину' },
      { name: 'Сход-развал / регулировка углов', price: 'от 120 zł', note: '' },
    ],
  },
  {
    category: 'Ключи',
    items: [
      { name: 'Программирование ключа (доп. ключ)', price: 'от 280 zł', note: 'по марке авто' },
      { name: 'Восстановление / дубликат ключа', price: 'по запросу', note: 'индивидуально' },
    ],
  },
  {
    category: 'Выезд мастера',
    items: [
      { name: 'Помощь на дороге (выезд)', price: 'от 150 zł', note: '+ расстояние' },
      { name: 'Прикуривание (разряженный аккумулятор)', price: 'от 120 zł', note: '' },
    ],
  },
];
