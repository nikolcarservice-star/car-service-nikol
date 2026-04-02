'use client';

import { useCallback, useState } from 'react';
import { Loader2, Siren } from 'lucide-react';
import { getTranslations, PHONE_RAW } from '../constants/translations';

function isValidCoord(lat, lon) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180 &&
    !(Math.abs(lat) < 1e-6 && Math.abs(lon) < 1e-6)
  );
}

/** Dwie równoległe próby — często sieć/Wi‑Fi zwraca szybciej niż sam „wysoki” GPS. */
function getPositionParallel(maxWaitMs) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const ok = (pos) => {
      if (settled) return;
      const { latitude: lat, longitude: lon } = pos.coords;
      if (!isValidCoord(lat, lon)) return;
      settled = true;
      clearTimeout(master);
      resolve(pos);
    };
    const master = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error('timeout'));
    }, maxWaitMs);

    navigator.geolocation.getCurrentPosition(ok, () => {}, {
      enableHighAccuracy: false,
      timeout: maxWaitMs,
      maximumAge: 600_000,
    });
    navigator.geolocation.getCurrentPosition(ok, () => {}, {
      enableHighAccuracy: true,
      timeout: maxWaitMs,
      maximumAge: 120_000,
    });
  });
}

function watchFirstFix(options, timeoutMs) {
  return new Promise((resolve, reject) => {
    let done = false;
    let timer;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        if (!isValidCoord(lat, lon) || done) return;
        done = true;
        navigator.geolocation.clearWatch(watchId);
        if (timer !== undefined) clearTimeout(timer);
        resolve(pos);
      },
      () => {},
      options,
    );
    timer = setTimeout(() => {
      if (done) return;
      done = true;
      navigator.geolocation.clearWatch(watchId);
      reject(new Error('watch-timeout'));
    }, timeoutMs);
  });
}

/**
 * Start wywołania synchronicznie z kliknięcia (bez await przed pierwszym getCurrentPosition).
 */
function requestBestPosition() {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    return Promise.reject(new Error('no-api'));
  }

  return getPositionParallel(16_000)
    .catch(() => watchFirstFix({ enableHighAccuracy: false, maximumAge: 300_000 }, 10_000))
    .catch(() => watchFirstFix({ enableHighAccuracy: true, maximumAge: 0 }, 14_000));
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
      setBusy(true);
      requestBestPosition()
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
