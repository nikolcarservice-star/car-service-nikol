import { NextResponse } from 'next/server';
import { RUSSIAN_LOCALE_ENABLED } from './constants/localeConfig';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carservicenikol.pl';

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

  const lang = getLangFromPathname(pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-lang', lang);

  if (request.nextUrl.pathname === '/robots.txt') {
    // Явно разрешаем индексацию всего сайта; запрещаем только служебные пути
    const body = `User-agent: *
Allow: /

Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
  return NextResponse.next({ request: { headers: requestHeaders } });
}
