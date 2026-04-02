'use client';

import { useCallback } from 'react';
import { Siren } from 'lucide-react';
import { getTranslations, PHONE_DISPLAY, PHONE_RAW } from '../constants/translations';

function whatsAppSendHref(text) {
  return `https://api.whatsapp.com/send/?phone=${PHONE_RAW}&text=${encodeURIComponent(text)}`;
}

export default function SosRoadsideButton({ lang }) {
  const t = getTranslations(lang);
  const copy = t.sosRoadside;

  const handleClick = useCallback(() => {
    if (!copy) return;
    const body = `${copy.whatsAppMessage.trim()}\n${PHONE_DISPLAY}`;
    window.location.assign(whatsAppSendHref(body));
  }, [copy]);

  if (!copy) return null;

  return (
    <div
      className="fixed bottom-5 left-4 z-[58] pb-[env(safe-area-inset-bottom,0)] md:hidden"
      role="region"
      aria-label={copy.ariaLabel}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={copy.ariaLabel}
        title={copy.ariaLabel}
        className="flex max-w-[min(100vw-2rem,14rem)] items-center gap-2 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-500 px-3.5 py-3 text-left text-xs font-bold uppercase leading-tight tracking-wide text-white shadow-lg ring-2 ring-red-300/90 transition hover:from-red-500 hover:via-rose-500 hover:to-red-400 hover:ring-red-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/80 sm:text-[13px] animate-sos-beacon"
      >
        <Siren className="h-5 w-5 shrink-0" strokeWidth={2.25} aria-hidden />
        <span className="min-w-0">{copy.label}</span>
      </button>
    </div>
  );
}
