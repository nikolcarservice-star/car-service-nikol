/**
 * Google Business / Maps — jeden profil firmy (bez „technicznych” URL-i googleusercontent).
 * @see https://www.google.com/maps — udostępnij mapę → iframe dla GOOGLE_MAPS_EMBED_URL
 */

/** Profil wizytówki + opinie (bezpośredni link dla użytkownika i SEO lokalne). */
export const GOOGLE_BUSINESS_PROFILE_URL =
  'https://www.google.com/maps/place/Car+Service+Nikol+%7C+Serwis+samochodowy/@52.5908375,16.5384497,17z/data=!4m6!3m5!1s0x47041785835568fb%3A0xfad9f08b31a08d7!8m2!3d52.5908375!4d16.5384497!16s%2Fg%2F11wv2f39s2';

/** @deprecated Użyj GOOGLE_BUSINESS_PROFILE_URL — ten sam adres. */
export const GOOGLE_BUSINESS_REVIEWS_URL = GOOGLE_BUSINESS_PROFILE_URL;

/**
 * Mapa osadzona (iframe) — Car Service Nikol, ul. Wernisażowa 21, Jastrowo.
 * Skopiowana z Google Maps → Udostępnij → Mapa osadzona.
 */
export const GOOGLE_MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s52.5908375%2C16.5384497!6i17!3m1!1spl!5m1!1spl';
