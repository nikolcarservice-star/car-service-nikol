'use client';

import { useCallback, useState } from 'react';
import { Loader2, Siren } from 'lucide-react';
import { getTranslations, PHONE_RAW } from '../constants/translations';

function isValidCoord(lat, lon) {
  const la = Number(lat);
  const lo = Number(lon);
  return (
    Number.isFinite(la) &&
    Number.isFinite(lo) &&
    Math.abs(la) <= 90 &&
    Math.abs(lo) <= 180 &&
    !(Math.abs(la) < 1e-6 && Math.abs(lo) < 1e-6)
  );
}

/**
 * Jeden „pakiet” wywołań w synchronicznym executorze Promise — to samo kliknięcie użytkownika.
 * Kolejne getCurrentPosition w .catch() tracą user activation (Safari/iOS) i mogą nigdy nie dostać fixu.
 *
 * watchPosition + jedno getCurrentPosition — pierwsza poprawna pozycja wygrywa; wspólny limit czasu.
 */
function requestBestPosition() {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    return Promise.reject(new Error('no-api'));
  }

  if (typeof window !== 'undefined' && window.isSecureContext === false) {
    return Promise.reject(new Error('insecure'));
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    let watchId;

    const cleanup = () => {
      if (watchId != null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = undefined;
      }
    };

    const finishOk = (pos) => {
      if (settled) return;
      const lat = Number(pos.coords.latitude);
      const lon = Number(pos.coords.longitude);
      if (!isValidCoord(lat, lon)) return;
      settled = true;
      clearTimeout(masterTimer);
      cleanup();
      resolve(pos);
    };

    const masterTimer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('timeout'));
    }, 32_000);

    watchId = navigator.geolocation.watchPosition(
      finishOk,
      () => {},
      { enableHighAccuracy: true, maximumAge: 0 },
    );

    navigator.geolocation.getCurrentPosition(
      finishOk,
      () => {},
      {
        enableHighAccuracy: false,
        timeout: 30_000,
        maximumAge: 600_000,
      },
    );
  });
}

function openWhatsAppWaMe(message) {
  const url = `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(message)}`;
  window.location.assign(url);
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
      const geoPromise = requestBestPosition();
      setBusy(true);
      geoPromise
        .then((position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const mapLink = `https://www.google.com/maps?q=${lat},${lon}`;
          const fullMessage = `${base}${copy.locationPrefix} ${mapLink}`;
          finish(fullMessage);
        })
        .catch(() => {
          finish(`${base}${copy.noGpsSuffix}`);
        });
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
