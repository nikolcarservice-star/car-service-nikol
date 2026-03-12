import { NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carservicenikol.pl';
const CRM_HOST = 'car-service-nikol-crm.vercel.app';
const CRM_URL = `https://${CRM_HOST}`;

export function middleware(request) {
  const hostname = request.nextUrl.hostname || request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  const isCrmDomain = hostname === CRM_HOST || hostname.endsWith('.car-service-nikol-crm.vercel.app');

  // Основной сайт: /admin и /crm всегда редирект на CRM-домен (одно место работы)
  if (!isCrmDomain && (pathname === '/admin' || pathname.startsWith('/crm'))) {
    const crmPath = pathname === '/admin' || pathname === '/crm' ? '' : pathname.replace(/^\/crm/, '');
    const target = new URL((crmPath || '/') + request.nextUrl.search, CRM_URL);
    return NextResponse.redirect(target, 302);
  }

  // Домен CRM: показываем CRM с корня (/, /orders, /order/new и т.д.)
  if (isCrmDomain) {
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
      return NextResponse.next();
    }
    if (pathname === '/' || pathname === '/admin') {
      return NextResponse.rewrite(new URL('/crm', request.url));
    }
    if (!pathname.startsWith('/crm')) {
      return NextResponse.rewrite(new URL('/crm' + pathname, request.url));
    }
  }

  if (request.nextUrl.pathname === '/robots.txt') {
    // Явно разрешаем индексацию всего сайта; запрещаем только служебные пути
    const body = `User-agent: *
Allow: /

Disallow: /admin/
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
  return NextResponse.next();
}
