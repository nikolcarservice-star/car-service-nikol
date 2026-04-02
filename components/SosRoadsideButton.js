'use client';

import { useCallback, useState } from 'react';
import { Loader2, Siren } from 'lucide-react';
import { getTranslations, PHONE_DISPLAY, PHONE_RAW } from '../constants/translations';

function whatsAppSendHref(text) {
  return `https://api.whatsapp.com/send/?phone=${PHONE_RAW}&text=${encodeURIComponent(text)}`;
}

function isValidGeo(lat, lng) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180 &&
    !(Math.abs(lat) < 1e-6 && Math.abs(lng) < 1e-6)
  );
}

/** Dwie równoległe próby getCurrentPosition — pierwsza poprawna wygrywa (szybsza niż szeregowe długie timeouty). */
function getPositionParallel(maxWaitMs) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const ok = (pos) => {
      if (settled) return;
      const { latitude: lat, longitude: lng } = pos.coords;
      if (!isValidGeo(lat, lng)) return;
      settled = true;
      clearTimeout(master);
      resolve(pos);
    };
    const master = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error('parallel-timeout'));
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

/** Krótki watch, gdy oba getCurrentPosition się nie zdążą lub zwrócą błąd. */
function watchFirstFix(options, timeoutMs) {
  return new Promise((resolve, reject) => {
    let done = false;
    let timer;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        if (!isValidGeo(lat, lng) || done) return;
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

async function requestBestPosition() {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new Error('no geolocation');
  }

  try {
    const perm = await navigator.permissions?.query?.({ name: 'geolocation' });
    if (perm?.state === 'denied') throw new Error('denied');
  } catch (e) {
    if (e?.message === 'denied') throw e;
  }

  try {
    return await getPositionParallel(8_000);
  } catch {
    try {
      return await watchFirstFix({ enableHighAccuracy: false, maximumAge: 300_000 }, 5_000);
    } catch {
      try {
        return await watchFirstFix({ enableHighAccuracy: true, maximumAge: 0 }, 6_000);
      } catch {
        throw new Error('geolocation-failed');
      }
    }
  }
}

function buildMapsUrl(lat, lng) {
  const la = lat.toFixed(7);
  const lo = lng.toFixed(7);
  return `https://www.google.com/maps?q=${encodeURIComponent(`${la},${lo}`)}`;
}

export default function SosRoadsideButton({ lang }) {
  const t = getTranslations(lang);
  const copy = t.sosRoadside;
  const [busy, setBusy] = useState(false);

  const handleClick = useCallback(() => {
    if (busy || !copy) return;

    const withPhoneFooter = (body) => `${body.trim()}\n${PHONE_DISPLAY}`;

    /** Po async zawsze pełna nawigacja — window.open po długim oczekiwaniu jest blokowany (Safari / iOS). */
    const openWhatsApp = (message) => {
      setBusy(false);
      window.location.assign(whatsAppSendHref(withPhoneFooter(message)));
    };

    setBusy(true);

    void (async () => {
      try {
        const pos = await requestBestPosition();
        const { latitude: lat, longitude: lng } = pos.coords;
        const mapsUrl = buildMapsUrl(lat, lng);
        const coordsPlain = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        const body = `${copy.messageWithLocation.replace('{link}', mapsUrl)}\n${coordsPlain}`;
        openWhatsApp(body);
      } catch {
        openWhatsApp(copy.messageNoLocation);
      }
    })();
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
