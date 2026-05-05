'use client';

import { useCallback } from 'react';
import { Siren } from 'lucide-react';
import { getTranslations, PHONE_RAW } from '../constants/translations';

function openWhatsAppWaMe(message) {
  const url = `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(message)}`;
  window.location.assign(url);
}

export default function SosRoadsideButton({ lang }) {
  const t = getTranslations(lang);
  const copy = t.sosRoadside;

  const handleClick = useCallback(() => {
    if (!copy) return;
    openWhatsAppWaMe(copy.whatsAppMessage);
  }, [copy]);

  if (!copy) return null;

  return (
    <div
      className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] left-4 z-[58] md:hidden"
      role="region"
      aria-label={copy.ariaLabel}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={copy.ariaLabel}
        title={copy.ariaLabel}
        className="flex max-w-[min(100vw-8.5rem,12.5rem)] items-center gap-2 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-500 px-3 py-2.5 text-left text-[11px] font-bold uppercase leading-tight tracking-wide text-white shadow-lg ring-2 ring-red-300/90 transition hover:from-red-500 hover:via-rose-500 hover:to-red-400 hover:ring-red-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/80 sm:text-[13px] animate-sos-beacon"
      >
        <Siren className="h-5 w-5 shrink-0" strokeWidth={2.25} aria-hidden />
        <span className="min-w-0">{copy.label}</span>
      </button>
    </div>
  );
}
