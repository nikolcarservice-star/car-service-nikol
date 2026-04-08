import { LANGUAGES, getNikolChatStringsRawLocale } from '../constants/translations';

/**
 * Teksty błędów czatu dopasowane do języka ostatniej wiadomości użytkownika
 * (np. cyrylica → RU), niezależnie od języka interfejsu strony.
 */
export function nikolErrorCopyForUserMessage(siteNikolChat, userMessageText) {
  switch (inferScriptHint(userMessageText)) {
    case 'cyrillic':
      return getNikolChatStringsRawLocale(LANGUAGES.RU);
    case 'latin':
      return getNikolChatStringsRawLocale(LANGUAGES.PL);
    default:
      return siteNikolChat;
  }
}

function inferScriptHint(text) {
  if (!text || typeof text !== 'string') return 'neutral';
  const trimmed = text.trim();
  if (!trimmed) return 'neutral';
  const cyr = (trimmed.match(/[\u0400-\u04FF]/g) || []).length;
  const lat = (trimmed.match(/[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g) || []).length;
  if (cyr > 0 && cyr >= lat) return 'cyrillic';
  if (lat > 0 && lat > cyr) return 'latin';
  return 'neutral';
}
