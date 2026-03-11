'use client';

import { PHONE_RAW, getTranslations } from '../constants/translations';

export default function FloatingCall({ lang = 'pl' }) {
  const t = getTranslations(lang);
  const label = t?.navigation?.phoneCta ?? 'Zadzwoń';

  return (
    <a
      href={`tel:${PHONE_RAW}`}
      aria-label={label}
      className="fixed bottom-24 right-6 z-40 flex h-14 w-14 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-950 md:bottom-28 md:right-8 md:h-16 md:w-16 animate-cta-glow"
    >
      <svg
        className="h-7 w-7 md:h-8 md:w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V21a2 2 0 01-2 2h-1C9.716 23 3 16.284 3 8V5z"
        />
      </svg>
    </a>
  );
}
