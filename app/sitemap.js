import { SERVICE_KEYS, servicesData } from '../data/services';
import { getAllBlogSlugs } from '../data/blog';
import { getSitemapLangs } from '../constants/localeConfig';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carservicenikol.pl';

function url(path) {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export default function sitemap() {
  const langs = getSitemapLangs();
  const routes = [];
  for (const lang of langs) {
    routes.push(
      { path: `/${lang}`, priority: 1, changeFrequency: 'weekly' },
      { path: `/${lang}/cennik`, priority: 0.8, changeFrequency: 'monthly' },
      { path: `/${lang}/services`, priority: 0.8, changeFrequency: 'weekly' },
      { path: `/${lang}/about`, priority: 0.6, changeFrequency: 'monthly' },
      { path: `/${lang}/contact`, priority: 0.7, changeFrequency: 'monthly' },
      { path: `/${lang}/privacy`, priority: 0.5, changeFrequency: 'yearly' },
      { path: `/${lang}/blog`, priority: 0.7, changeFrequency: 'weekly' },
      { path: `/${lang}/gallery`, priority: 0.65, changeFrequency: 'weekly' },
      { path: `/${lang}/faq`, priority: 0.75, changeFrequency: 'monthly' }
    );
  }

  const entries = routes.map(({ path, priority, changeFrequency }) => ({
    url: url(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const serviceSlugs = SERVICE_KEYS.map((key) => servicesData[key].slug);
  for (const lang of langs) {
    for (const slug of serviceSlugs) {
      entries.push({
        url: url(`/${lang}/services/${slug}`),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  const blogSlugs = getAllBlogSlugs();
  for (const lang of langs) {
    for (const slug of blogSlugs) {
      entries.push({
        url: url(`/${lang}/blog/${slug}`),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
