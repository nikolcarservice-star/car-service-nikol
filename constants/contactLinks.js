import { PHONE_RAW } from './translations';

/** api.whatsapp.com zwraca 200 od razu; wa.me często 302 → niektóre crawlery raportują „uncertain”. */
export const WHATSAPP_HREF = `https://api.whatsapp.com/send/?phone=${PHONE_RAW}&type=phone_number`;

/** Oficjalna Strona firmowa na Facebooku (Car Service "Nikol"). */
export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61564967009482';
/** Oficjalne konto Instagram powiązane ze Stroną na Facebooku. */
export const INSTAGRAM_URL = 'https://www.instagram.com/car_service_nikol';
/** Publiczny kanał / kontakt Telegram (czat Nikol, treści marketingowe). */
export const TELEGRAM_CHANNEL_HREF = 'https://t.me/car_service_nikol_tvoj_nik';

/** Profile społecznościowe — używane w stopce i w JSON-LD (sameAs). */
export const SOCIAL_LINKS = [
  { href: FACEBOOK_URL, label: 'Facebook' },
  { href: INSTAGRAM_URL, label: 'Instagram' },
];
