const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoserwis-nikol.pl';

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
