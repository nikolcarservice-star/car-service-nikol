/**
 * Powiadomienia o zgłoszeniach z formularza zapisu — Telegram Bot API.
 *
 * @see https://core.telegram.org/bots/api#sendmessage
 *
 * Zmienne:
 * - TELEGRAM_BOOKING_BOT_TOKEN — token z @BotFather
 * - TELEGRAM_BOOKING_CHAT_ID — Twój chat_id (lub grupy); np. @userinfobot / raw ID ujemny dla grup
 */
function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function isTelegramBookingConfigured() {
  const token = process.env.TELEGRAM_BOOKING_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_BOOKING_CHAT_ID?.trim();
  return Boolean(token && chatId);
}

/**
 * @param {{ lang: 'pl' | 'ru', name: string, phone: string, email: string, service: string, message: string, isoTime: string }} p
 */
export async function sendBookingTelegramNotification(p) {
  const token = process.env.TELEGRAM_BOOKING_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_BOOKING_CHAT_ID?.trim();
  if (!token || !chatId) {
    throw new Error('Telegram booking env not set');
  }

  const { lang, name, phone, email, service, message, isoTime } = p;
  const isRu = lang === 'ru';

  const title = isRu ? '🔧 <b>Новая заявка с сайта</b>' : '🔧 <b>Nowe zgłoszenie z formularza</b>';
  const lines = [
    title,
    '',
    isRu ? `<b>Язык:</b> ${escapeHtml(lang)}` : `<b>Język:</b> ${escapeHtml(lang)}`,
    isRu ? `<b>Имя:</b> ${escapeHtml(name)}` : `<b>Imię:</b> ${escapeHtml(name)}`,
    isRu
      ? `<b>Телефон:</b> <code>${escapeHtml(phone)}</code>`
      : `<b>Telefon:</b> <code>${escapeHtml(phone)}</code>`,
  ];

  if (email) {
    lines.push(isRu ? `<b>Email:</b> ${escapeHtml(email)}` : `<b>E-mail:</b> ${escapeHtml(email)}`);
  }
  if (service) {
    lines.push(isRu ? `<b>Услуга (key):</b> ${escapeHtml(service)}` : `<b>Usługa (key):</b> ${escapeHtml(service)}`);
  }
  if (message) {
    lines.push(
      isRu
        ? `<b>Сообщение:</b>\n${escapeHtml(message)}`
        : `<b>Wiadomość:</b>\n${escapeHtml(message)}`,
    );
  }
  lines.push('', `<i>${escapeHtml(isoTime)}</i>`);

  const text = lines.join('\n');
  const url = `https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12_000);

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(t);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok !== true) {
    const desc = typeof data.description === 'string' ? data.description : `HTTP ${res.status}`;
    throw new Error(desc);
  }
}
