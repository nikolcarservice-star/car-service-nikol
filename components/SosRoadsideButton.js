'use client';

import { useCallback, useState } from 'react';
import { Loader2, Siren } from 'lucide-react';
import { getTranslations, PHONE_RAW } from '../constants/translations';

function openWhatsAppWaMe(message) {
  const url = `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(message)}`;
  const win = typeof window !== 'undefined' ? window.open(url, '_blank', 'noopener,noreferrer') : null;
  if (!win) {
    window.location.assign(url);
  }
}

export default function SosRoadsideButton({ lang }) {
  const t = getTranslations(lang);
  const copy = t.sosRoadside;
  const [busy, setBusy] = useState(false);

  const handleClick = useCallback(() => {
    if (!copy || busy) return;

    const base = copy.whatsAppMessageBase;

    const finish = (text) => {
      setBusy(false);
      openWhatsAppWaMe(text);
    };

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      setBusy(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const mapLink = `https://www.google.com/maps?q=${lat},${lon}`;
          const fullMessage = `${base}${copy.locationPrefix} ${mapLink}`;
          finish(fullMessage);
        },
        () => {
          finish(`${base}${copy.noGpsSuffix}`);
        },
        { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 },
      );
    } else {
      openWhatsAppWaMe(base.trimEnd());
    }
  }, [busy, copy]);

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
        disabled={busy}
        aria-busy={busy}
        aria-label={copy.ariaLabel}
        title={copy.ariaLabel}
        className="flex max-w-[min(100vw-2rem,14rem)] items-center gap-2 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-500 px-3.5 py-3 text-left text-xs font-bold uppercase leading-tight tracking-wide text-white shadow-lg ring-2 ring-red-300/90 transition hover:from-red-500 hover:via-rose-500 hover:to-red-400 hover:ring-red-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/80 disabled:cursor-wait disabled:opacity-95 sm:text-[13px] animate-sos-beacon"
      >
        {busy ? (
          <Loader2 className="h-5 w-5 shrink-0 animate-spin" strokeWidth={2.5} aria-hidden />
        ) : (
          <Siren className="h-5 w-5 shrink-0" strokeWidth={2.25} aria-hidden />
        )}
        <span className="min-w-0">{busy ? copy.busyLabel : copy.label}</span>
      </button>
    </div>
  );
}
