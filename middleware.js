import { NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carservicenikol.pl';

export function middleware(request) {
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
  return NextResponse.next();
}
