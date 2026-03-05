import { SERVICE_KEYS, servicesData } from '../data/services';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carservicenikol.pl';
const langs = ['pl', 'ru'];

function url(path) {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export default function sitemap() {
  const routes = [
    { path: '/pl', priority: 1, changeFrequency: 'weekly' },
    { path: '/ru', priority: 1, changeFrequency: 'weekly' },
    { path: '/pl/cennik', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/ru/cennik', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/pl/services', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/ru/services', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/pl/about', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/ru/about', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/pl/contact', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/ru/contact', priority: 0.7, changeFrequency: 'monthly' },
  ];

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

  return entries;
}
