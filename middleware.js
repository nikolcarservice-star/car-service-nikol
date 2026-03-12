import { NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carservicenikol.pl';
// CRM только здесь, нигде больше: https://car-service-nikol-crm.vercel.app/
const CRM_URL = 'https://car-service-nikol-crm.vercel.app/';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // На основном сайте CRM нет — только редирект на единственный адрес CRM.
  if (pathname === '/admin' || pathname.startsWith('/crm')) {
    return NextResponse.redirect(CRM_URL + request.nextUrl.search, 302);
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
