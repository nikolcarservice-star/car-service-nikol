import { NextResponse } from 'next/server';
import { GALLERY_ENABLED, RUSSIAN_LOCALE_ENABLED } from './constants/localeConfig';

function getLangFromPathname(pathname) {
  if (!RUSSIAN_LOCALE_ENABLED) return 'pl';
  const segment = pathname.split('/').filter(Boolean)[0];
  return segment === 'ru' ? 'ru' : 'pl';
}

export function middleware(request) {
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
