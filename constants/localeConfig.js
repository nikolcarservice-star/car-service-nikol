/**
 * RU-версия временно отключена. Включить снова:
 * в .env.local задать NEXT_PUBLIC_RUSSIAN_LOCALE_ENABLED=true и пересобрать.
 */
export const RUSSIAN_LOCALE_ENABLED =
  typeof process.env.NEXT_PUBLIC_RUSSIAN_LOCALE_ENABLED === 'string' &&
  process.env.NEXT_PUBLIC_RUSSIAN_LOCALE_ENABLED === 'true';

/** Galeria — wyłączona domyślnie. Włącz: NEXT_PUBLIC_GALLERY_ENABLED=true */
export const GALLERY_ENABLED =
  typeof process.env.NEXT_PUBLIC_GALLERY_ENABLED === 'string' &&
  process.env.NEXT_PUBLIC_GALLERY_ENABLED === 'true';

/** Языки для sitemap и статической генерации вспомогательных списков */
export function getSitemapLangs() {
  return RUSSIAN_LOCALE_ENABLED ? ['pl', 'ru'] : ['pl'];
}
