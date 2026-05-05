import { GALLERY_ENABLED, getSitemapLangs } from '../constants/localeConfig';
import { getAllServicePageSlugs } from '../data/services';
import { blogPosts } from '../data/blog';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://autoserwis-nikol.pl').replace(
  /\/$/,
  ''
);

/** @param {string | null} segment — np. `cennik` albo `null` dla strony głównej języka */
function urlForLang(lang, segment) {
  if (!segment) return `${siteUrl}/${lang}`;
  return `${siteUrl}/${lang}/${segment}`;
}

const STATIC_ROUTES = [
  { segment: null, changeFrequency: 'weekly', priority: 1 },
  { segment: 'cennik', changeFrequency: 'monthly', priority: 0.8 },
  { segment: 'services', changeFrequency: 'weekly', priority: 0.8 },
  { segment: 'about', changeFrequency: 'monthly', priority: 0.6 },
  { segment: 'contact', changeFrequency: 'monthly', priority: 0.7 },
  { segment: 'privacy', changeFrequency: 'yearly', priority: 0.5 },
  { segment: 'blog', changeFrequency: 'weekly', priority: 0.7 },
  { segment: 'faq', changeFrequency: 'monthly', priority: 0.75 },
];

/** @returns {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  const langs = getSitemapLangs();
  const lastModified = new Date();
  const useHreflang = langs.length > 1;

  function entry(lang, segment, meta) {
    const url = urlForLang(lang, segment);
    return {
      url,
      lastModified,
      changeFrequency: meta.changeFrequency,
      priority: meta.priority,
      ...(useHreflang && {
        alternates: {
          languages: {
            ...Object.fromEntries(langs.map((l) => [l, urlForLang(l, segment)])),
            'x-default': urlForLang('pl', segment),
          },
        },
      }),
    };
  }

  /** @type {import('next').MetadataRoute.Sitemap} */
  const out = [];

  for (const lang of langs) {
    for (const route of STATIC_ROUTES) {
      out.push(entry(lang, route.segment, route));
    }
    if (GALLERY_ENABLED) {
      out.push(
        entry(lang, 'gallery', { changeFrequency: 'monthly', priority: 0.7 })
      );
    }
    for (const slug of getAllServicePageSlugs()) {
      const segment = `services/${slug}`;
      out.push(entry(lang, segment, { changeFrequency: 'weekly', priority: 0.7 }));
    }
    for (const post of blogPosts) {
      const segment = `blog/${post.slug}`;
      out.push(entry(lang, segment, { changeFrequency: 'monthly', priority: 0.6 }));
    }
  }

  return out;
}
