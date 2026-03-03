/**
 * Cennik usług – orientacyjne ceny na podstawie rynku okolic Poznania (Poznań, Jastrowo, Szamotuły, okolice).
 * Ceny mogą się różnić w zależności od modelu auta i zakresu prac.
 */

export const priceListPl = [
  {
    category: 'Oleje i filtry',
    items: [
      { name: 'Wymiana oleju + filtr oleju (silnik 4-cyl.)', price: 'od 80 zł', note: 'robocizna' },
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
