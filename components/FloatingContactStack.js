'use client';

import { Phone } from 'lucide-react';
import { siTelegram } from 'simple-icons';
import { getTranslations, PHONE_RAW } from '../constants/translations';
import { WHATSAPP_HREF, TELEGRAM_HREF } from '../constants/contactLinks';

const fabBase =
  'flex min-h-[52px] min-w-[52px] items-center justify-center rounded-full text-white shadow-xl transition hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950';

export default function FloatingContactStack({ lang = 'pl' }) {
  const t = getTranslations(lang);
  const waLabel = t?.location?.whatsapp ?? 'WhatsApp';
  const tgLabel = t?.location?.telegram ?? 'Telegram';
  const callLabel = t?.navigation?.phoneCta ?? 'Zadzwoń';

  return (
    <div
      className="fixed bottom-5 right-4 z-[55] flex flex-col-reverse items-end gap-3 pb-[env(safe-area-inset-bottom,0)] sm:bottom-6 sm:right-6"
      aria-label={lang === 'ru' ? 'Быстрый контакт' : 'Szybki kontakt'}
    >
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={waLabel}
        title={waLabel}
        className={`${fabBase} h-14 w-14 bg-[#25D366] focus:ring-[#25D366] animate-cta-glow-whatsapp sm:h-16 sm:w-16`}
      >
        <svg className="h-7 w-7 sm:h-8 sm:w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.865 9.865 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      <a
        href={TELEGRAM_HREF}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={tgLabel}
        title={tgLabel}
        className={`${fabBase} h-12 w-12 bg-[#229ED9] focus:ring-[#229ED9] sm:h-14 sm:w-14`}
      >
        <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" role="img" viewBox="0 0 24 24" aria-hidden>
          <path d={siTelegram.path} />
        </svg>
      </a>

      <a
        href={`tel:${PHONE_RAW}`}
        aria-label={callLabel}
        title={callLabel}
        className={`${fabBase} h-12 w-12 bg-gradient-to-br from-orange-500 to-amber-500 focus:ring-orange-400 animate-cta-glow sm:h-14 sm:w-14`}
      >
        <Phone className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} aria-hidden />
      </a>
    </div>
  );
}
