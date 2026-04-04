import { PHONE_DISPLAY, PHONE_RAW } from '../constants/translations';
import { TELEGRAM_CHANNEL_HREF } from '../constants/contactLinks';

const MAPS_DIR = 'https://www.google.com/maps/dir/?api=1&destination=52.5908375,16.5384497';

function contactHtml() {
  return [
    `Telefon: <a href="tel:+${PHONE_RAW}">${PHONE_DISPLAY}</a>`,
    `WhatsApp: <a href="https://wa.me/${PHONE_RAW}">Napisz na WhatsApp</a>`,
    `Telegram: <a href="${TELEGRAM_CHANNEL_HREF}">Napisz na Telegram</a>`,
    `Adres: ul. Wernisażowa 21, 64-500 Jastrowo — <a href="${MAPS_DIR}">Otwórz w Mapach Google</a>`,
  ].join('\n');
}

/**
 * Gdy brak OPENAI_API_KEY — krótka odpowiedź „jak Nikol” dla typowych pytań (bez LLM).
 * Zwraca null, jeśli nie rozpoznano intencji (wtedy API zwraca 503).
 */
export function getOfflineNikolReply(lang, lastUserContent) {
  const raw = (lastUserContent || '').trim();
  if (!raw) return null;
  const s = raw.toLowerCase();
  const ru = lang === 'ru' || /[а-яёА-ЯЁ]/.test(raw);

  const contacts = contactHtml();

  if (
    /olej|oleju|масл|масла|масло|oil|wymiana oleju|wymiany oleju|jaki olej|jakie olej|цена.*масл|замен.*масл|сколько.*масл|wymienić olej/i.test(
      s
    )
  ) {
    if (ru) {
      return (
        `Привет! Замена масла и фильтра — ориентировочно от ок. 80 zł (только работа), комплект с маслом и расходниками часто от ок. 220 zł. Окончательную цену подтвердит мастер после контакта или осмотра авто.\n\n` +
        `Мы в Jastrowo (около Szamotuł), работаем и в выходные — суббота 8–18, воскресенье 10–16.\n\n` +
        `${contacts}\n\n` +
        `Напишите марку авто и когда удобно приехать — подберём время ориентировочно.`
      );
    }
    return (
      `Cześć! Wymiana oleju i filtra — orientacyjnie od ok. 80 zł (sama robocizna), komplet z olejem i materiałem często od ok. 220 zł. Ostateczną cenę potwierdzi mistrz po kontakcie lub oględzinach pojazdu.\n\n` +
      `Jesteśmy w Jastrowo (okolica Szamotuł), pracujemy też w weekend — sobota 8–18, niedziela 10–16.\n\n` +
      `${contacts}\n\n` +
      `Napisz, jakim samochodem jeździsz i kiedy pasuje wizyta — chętnie umówimy orientacyjnie.`
    );
  }

  if (/hamulc|klock|tarcz|тормоз|колодк|диск|brake/i.test(s)) {
    if (ru) {
      return (
        `Hamulce: wymiana klocków na jedną oś — orientacyjnie od ok. 150 zł (robocizna); klocki + tarcze na oś od ok. 280 zł. Dokładną wycenę poda mistrz po kontakcie.\n\n` +
        `${contacts}\n\n` +
        `Napisz markę, model i co dokładnie słychać / widać — zaproponujemy wizytę.`
      );
    }
    return (
      `Hamulce: wymiana klocków na jedną oś — orientacyjnie od ok. 150 zł (robocizna); klocki + tarcze na oś od ok. 280 zł. Dokładną wycenę poda mistrz po kontakcie.\n\n` +
      `${contacts}\n\n` +
      `Napisz markę, model i objawy — umówimy wizytę orientacyjnie.`
    );
  }

  if (/diagnost|диагност|błąd|check engine|komputerow/i.test(s)) {
    if (ru) {
      return (
        `Diagnostyka komputerowa — orientacyjnie od ok. 100 zł (odczyt błędów), szerszy zakres od ok. 180 zł. Ostatecznie po kontakcie.\n\n` +
        `${contacts}\n\n` +
        `Opisz proszę objawy lub kod błędu, jeśli masz — umówimy termin.`
      );
    }
    return (
      `Diagnostyka komputerowa — orientacyjnie od ok. 100 zł (odczyt błędów), szerszy zakres od ok. 180 zł. Ostatecznie po kontakcie.\n\n` +
      `${contacts}\n\n` +
      `Opisz objawy lub kod błędu — umówimy termin orientacyjnie.`
    );
  }

  if (/rozrząd|rozrzadu|грм|ремень|łańcuch/i.test(s)) {
    if (ru) {
      return (
        `Rozrząd (np. pasek 4-cyl.) — orientacyjnie od ok. 700 zł robocizna; z pompą wody od ok. 900 zł. Wycena zależy od silnika — potwierdzi mistrz.\n\n` +
        `${contacts}\n\n` +
        `Podaj markę, model i silnik — wstępnie umówimy wizytę.`
      );
    }
    return (
      `Rozrząd (np. pasek 4-cyl.) — orientacyjnie od ok. 700 zł robocizna; z pompą wody od ok. 900 zł. Końcowa wycena zależy od silnika — potwierdzi mistrz.\n\n` +
      `${contacts}\n\n` +
      `Podaj markę, model i pojemność — umówimy wizytę wstępnie.`
    );
  }

  return null;
}
