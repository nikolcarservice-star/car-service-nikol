/**
 * Zdjęcia z realizacji / warsztatu.
 * Aby podmienić na własne: wrzuć pliki do public/images/gallery/ i zaktualizuj ścieżki `src` oraz opisy.
 */
export const galleryItems = [
  {
    id: 'diag-lift',
    src: '/images/services/diagnostics.jpg',
    title: {
      pl: 'Diagnostyka na podnośniku',
      ru: 'Диагностика на подъёмнике',
    },
    caption: {
      pl: 'Komputerowa diagnostyka i oględziny podwozia — standard przed każdą naprawą.',
      ru: 'Компьютерная диагностика и осмотр снизу — стандарт перед ремонтом.',
    },
  },
  {
    id: 'brakes',
    src: '/images/services/brakes.jpg',
    title: {
      pl: 'Serwis hamulców',
      ru: 'Обслуживание тормозов',
    },
    caption: {
      pl: 'Wymiana klocków i tarcz, kontrola zacisków i płynu hamulcowego.',
      ru: 'Замена колодок и дисков, проверка суппортов и тормозной жидкости.',
    },
  },
  {
    id: 'tires',
    src: '/images/services/mechanic-changing-tires-car-service.jpg',
    title: {
      pl: 'Wymiana opon i sezonówka',
      ru: 'Шиномонтаж и сезонная замена',
    },
    caption: {
      pl: 'Montaż, wyważanie i kontrola ciśnienia — Jastrowo.',
      ru: 'Монтаж, балансировка и проверка давления.',
    },
  },
  {
    id: 'oil',
    src: '/images/services/oil.jpg',
    title: {
      pl: 'Wymiana oleju i filtrów',
      ru: 'Замена масла и фильтров',
    },
    caption: {
      pl: 'Szybka obsługa przy zachowaniu procedur producenta pojazdu.',
      ru: 'Быстрое обслуживание с соблюдением регламента производителя.',
    },
  },
  {
    id: 'suspension',
    src: '/images/services/suspension.jpg',
    title: {
      pl: 'Zawieszenie i geometria',
      ru: 'Подвеска и геометрия',
    },
    caption: {
      pl: 'Naprawy układu kierowniczego i elementów amortyzacji.',
      ru: 'Ремонт рулевого и элементов амортизации.',
    },
  },
  {
    id: 'timing',
    src: '/images/services/timing.jpg',
    title: {
      pl: 'Układ rozrządu',
      ru: 'Система ГРМ',
    },
    caption: {
      pl: 'Wymiana kompletów rozrządu zgodnie z interwałem producenta.',
      ru: 'Замена комплектов ГРМ по регламенту производителя.',
    },
  },
];

export function getGalleryItems() {
  return galleryItems;
}
