/**
 * Tekst powiadomienia o zapisie (Telegram) — PL / RU.
 */

import { LANGUAGES } from '../constants/translations';

const PHOTO_PL =
  'Załączone zdjęcia ({count}): proszę przesłać je w Telegramie w odpowiedzi na to powiadomienie.';
const PHOTO_RU =
  'Фото ({count}): отправьте в Telegram в ответ на это сообщение.';

/**
 * @param {{
 *   name: string;
 *   phone: string;
 *   car: string;
 *   service: string;
 *   date: string;
 *   message: string;
 *   preferredTimeStr: string;
 *   photoCount: number;
 *   lang: string;
 * }} p
 */
export function buildBookingNotifyText(p) {
  const isRu = p.lang === LANGUAGES.RU;
  const lines = [];
  if (isRu) {
    lines.push('🚗 Запись в Car Service Nikol (Jastrowo)');
    lines.push('');
    lines.push(`Имя: ${p.name}`);
    lines.push(`Телефон: ${p.phone}`);
    lines.push(`Авто: ${p.car}`);
    lines.push(`Услуга: ${p.service}`);
    lines.push(`Дата: ${p.date}`);
    lines.push(`Время: ${p.preferredTimeStr}`);
    if (p.message?.trim()) lines.push(`Комментарий: ${p.message.trim()}`);
    if (p.photoCount > 0) lines.push('', PHOTO_RU.replace('{count}', String(p.photoCount)));
  } else {
    lines.push('🚗 Zapis do Car Service Nikol (Jastrowo)');
    lines.push('');
    lines.push(`Imię i nazwisko: ${p.name}`);
    lines.push(`Telefon: ${p.phone}`);
    lines.push(`Auto: ${p.car}`);
    lines.push(`Usługa: ${p.service}`);
    lines.push(`Preferowana data: ${p.date}`);
    lines.push(`Preferowany przedział godzin: ${p.preferredTimeStr}`);
    if (p.message?.trim()) lines.push(`Uwagi: ${p.message.trim()}`);
    if (p.photoCount > 0) lines.push('', PHOTO_PL.replace('{count}', String(p.photoCount)));
  }
  return lines.join('\n');
}
