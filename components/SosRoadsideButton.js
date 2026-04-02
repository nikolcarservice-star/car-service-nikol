'use client';

import { useCallback, useState } from 'react';
import { Loader2, Siren } from 'lucide-react';
import { getTranslations, PHONE_DISPLAY, PHONE_RAW } from '../constants/translations';

function whatsAppSendHref(text) {
  return `https://api.whatsapp.com/send/?phone=${PHONE_RAW}&text=${encodeURIComponent(text)}`;
}

export default function SosRoadsideButton({ lang }) {
  const t = getTranslations(lang);
  const copy = t.sosRoadside;
  const [busy, setBusy] = useState(false);

  const handleClick = useCallback(() => {
    if (busy || !copy) return;

    const withPhoneFooter = (body) => `${body.trim()}\n${PHONE_DISPLAY}`;

    const openWhatsApp = (message) => {
      setBusy(false);
      window.location.assign(whatsAppSendHref(withPhoneFooter(message)));
    };

    setBusy(true);

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      openWhatsApp(copy.messageNoLocation);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const link = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
        openWhatsApp(copy.messageWithLocation.replace('{link}', link));
      },
      () => {
        openWhatsApp(copy.messageNoLocation);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
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
