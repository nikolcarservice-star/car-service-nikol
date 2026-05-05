import { NextResponse } from 'next/server';
import { GALLERY_ENABLED, RUSSIAN_LOCALE_ENABLED } from './constants/localeConfig';

/** Kanoniczny host (bez www) — produkcja zawsze https://autoserwis-nikol.pl */
const CANONICAL_HOST = 'autoserwis-nikol.pl';
const DEFAULT_SITE_URL = `https://${CANONICAL_HOST}`;

function forwardedProto(request) {
  const raw = request.headers.get('x-forwarded-proto');
  if (raw) return raw.split(',')[0].trim().toLowerCase();
  return (request.nextUrl.protocol || 'https:').replace(':', '').toLowerCase() || 'https';
}

/** Kanoniczny host bez „www” (z NEXT_PUBLIC_SITE_URL). */
function getApexHostname() {
  try {
    const raw = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
    let h = new URL(raw).hostname.toLowerCase();
    if (h.startsWith('www.')) h = h.slice(4);
    return h;
  } catch {
    return CANONICAL_HOST;
  }
}

function getLangFromPathname(pathname) {
  if (!RUSSIAN_LOCALE_ENABLED) return 'pl';
  const segment = pathname.split('/').filter(Boolean)[0];
  return segment === 'ru' ? 'ru' : 'pl';
}

export function middleware(request) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? '';
  const apex = getApexHostname();
  const skipWwwRedirect =
    !host ||
    host === 'localhost' ||
    host.startsWith('127.') ||
    host === '0.0.0.0' ||
    host.endsWith('.vercel.app');

  if (!skipWwwRedirect && host === `www.${apex}`) {
    const dest = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${apex}`);
    return NextResponse.redirect(dest, 301);
  }

  if (!skipWwwRedirect && host === apex && forwardedProto(request) === 'http') {
    const dest = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${apex}`);
    return NextResponse.redirect(dest, 301);
  }

  const pathname = request.nextUrl.pathname || '';

  if (!RUSSIAN_LOCALE_ENABLED && (pathname === '/ru' || pathname.startsWith('/ru/'))) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/ru/, '/pl') || '/pl';
    return NextResponse.redirect(url, 307);
  }

  if (!GALLERY_ENABLED && /^\/(pl|ru)\/gallery(\/|$)/.test(pathname)) {
    const url = request.nextUrl.clone();
    const seg = pathname.split('/').filter(Boolean)[0] || 'pl';
    url.pathname = `/${seg === 'ru' && RUSSIAN_LOCALE_ENABLED ? 'ru' : 'pl'}`;
    return NextResponse.redirect(url, 307);
  }

  const lang = getLangFromPathname(pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-lang', lang);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

/** Bez middleware dla statycznych plików z /public (png, xml…) — zawsze serwuje się prawdziwy asset, nie HTML strony. */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt|woff2?)$).*)',
  ],
};
