import Image from 'next/image';
import { Images } from 'lucide-react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { getTranslations, normalizeLang } from '../../../constants/translations';
import { getGalleryItems } from '../../../data/gallery';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoserwis-nikol.pl';

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  const canonical = `/${lang}/gallery`;
  const languages = { pl: `${SITE_URL}/pl/gallery`, ru: `${SITE_URL}/ru/gallery` };
  const ogImage = { url: '/images/services/mechanic-changing-tires-car-service.jpg', width: 1200, height: 630 };

  if (lang === 'ru') {
    const title = 'Галерея работ – Car Service Nikol Jastrowo, Шамотулы';
    const description =
      'Фото автосервиса в Jastrowo: ремонт, диагностика, шиномонтаж. Car Service Nikol — клиенты из Jastrowo и Шамотул.';
    return {
      title,
      description,
      alternates: { canonical, languages },
      openGraph: {
        type: 'website',
        locale: 'ru_RU',
        alternateLocale: 'pl_PL',
        url: `${SITE_URL}${canonical}`,
        siteName: 'Car Service Nikol',
        title,
        description,
        images: [{ ...ogImage, alt: 'Галерея Car Service Nikol' }],
      },
      twitter: { card: 'summary_large_image', title, description },
    };
  }

  const title = 'Galeria realizacji – Car Service Nikol Jastrowo, Szamotuły';
  const description =
    'Zdjęcia z warsztatu w Jastrowo: naprawy, diagnostyka, opony. Car Service Nikol — kierowcy z Jastrowo i Szamotuł.';
  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      locale: 'pl_PL',
      alternateLocale: 'ru_RU',
      url: `${SITE_URL}${canonical}`,
      siteName: 'Car Service Nikol',
      title,
      description,
      images: [{ ...ogImage, alt: 'Galeria Car Service Nikol' }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function GalleryPage({ params }) {
  const lang = normalizeLang(params.lang);
  const t = getTranslations(lang);
  const basePath = `/${lang}`;
  const isRu = lang === 'ru';
  const page = t.galleryPage || {};
  const items = getGalleryItems();
  const prefix = page.photoAltPrefix || (isRu ? 'Галерея –' : 'Galeria –');

  return (
    <section className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: isRu ? 'Главная' : 'Strona główna', href: basePath },
            { label: t.navigation?.gallery ?? (isRu ? 'Галерея' : 'Galeria') },
          ]}
        />

        <h1 className="mt-4 flex flex-wrap items-center gap-3 text-2xl font-semibold tracking-tight text-gray-50 sm:text-3xl">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30">
            <Images className="h-6 w-6" aria-hidden />
          </span>
          {isRu ? 'Галерея' : 'Galeria'}
        </h1>
        {page.intro && (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400 sm:text-base">{page.intro}</p>
        )}

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const title = item.title[lang] || item.title.pl;
            const caption = item.caption[lang] || item.caption.pl;
            return (
              <li
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 shadow-lg shadow-black/20"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-900">
                  <Image
                    src={item.src}
                    alt={`${prefix} ${title}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                <div className="p-4 sm:p-5">
                  <h2 className="text-base font-semibold text-gray-100 sm:text-lg">{title}</h2>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400 sm:text-sm">{caption}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
