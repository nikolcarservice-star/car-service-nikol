import { PHONE_RAW } from './translations';

/** api.whatsapp.com zwraca 200 od razu; wa.me często 302 → niektóre crawlery raportują „uncertain”. */
export const WHATSAPP_HREF = `https://api.whatsapp.com/send/?phone=${PHONE_RAW}&type=phone_number`;
export const TELEGRAM_HREF = `https://t.me/+${PHONE_RAW}`;
