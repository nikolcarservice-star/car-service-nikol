import { Suspense } from 'react';
import Hero from '../../components/Hero';
import Services from '../../components/Services';
import ServiceCalculator from '../../components/ServiceCalculator';
import BrandsSection from '../../components/BrandsSection';
import AboutBlock from '../../components/AboutBlock';
import BookingForm from '../../components/BookingForm';
import LocationSection from '../../components/LocationSection';
import Reviews from '../../components/Reviews';
import { getTranslations, normalizeLang } from '../../constants/translations';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoserwis-nikol.pl';

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  const canonical = `/${lang}`;
  const languages = { pl: `${SITE_URL}/pl`, ru: `${SITE_URL}/ru` };

  const ogImage = {
    url: '/og-image.jpg',
    width: 1200,
    height: 630,
  };

  if (lang === 'ru') {
    const title = 'Car Service Nikol – автосервис в Jastrowo и Шамотулы | Работаем в воскресенье';
    const description =
      'Car Service Nikol – профессиональный автосервис Jastrowo и Шамотулы. Механик, диагностика, ремонт подвески и тормозов, замена масла. Работаем в субботу и воскресенье. Запишитесь онлайн.';
    return {
      title,
      description,
      keywords:
        'автосервис Jastrowo, механик Шамотулы, ремонт авто Jastrowo, диагностика авто, замена масла, сервис в воскресенье, Car Service Nikol',
      alternates: { canonical, languages },
      openGraph: {
        type: 'website',
        locale: 'ru_RU',
        alternateLocale: 'pl_PL',
        url: `${SITE_URL}${canonical}`,
        siteName: 'Car Service Nikol',
        title,
        description,
        images: [{ ...ogImage, alt: 'Car Service Nikol – автосервис Jastrowo, Шамотулы' }],
      },
      twitter: { card: 'summary_large_image', title, description, images: [ogImage.url] },
    };
  }

  const title = 'Mechanik Jastrowo - Car Service Nikol | Otwarte w niedziele';
  const description =
    'Mechanik w Jastrowo i Szamotułach. Naprawy, diagnostyka i wymiana oleju. Pracujemy w soboty i niedziele! Umów wizytę online.';
  const openGraphTitle = 'Car Service Nikol - Serwis w Niedziele';
  const openGraphDescription =
    'Naprawimy Twój samochód, gdy inni odpoczywają. Jastrowo i okolice.';
  return {
    title,
    description,
    keywords:
      'mechanik Jastrowo, mechanik Szamotuły, serwis samochodowy Jastrowo, weekendowy serwis Jastrowo, diagnostyka samochodowa, wymiana oleju Jastrowo, serwis w niedziele, Car Service Nikol',
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      locale: 'pl_PL',
      alternateLocale: 'ru_RU',
      url: `${SITE_URL}${canonical}`,
      siteName: 'Car Service Nikol',
      title: openGraphTitle,
      description: openGraphDescription,
      images: [{ ...ogImage, alt: 'Car Service Nikol – mechanik Jastrowo, serwis w niedziele' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: openGraphTitle,
      description: openGraphDescription,
      images: [ogImage.url],
    },
  };
}

export default function LangHomePage({ params }) {
  const lang = normalizeLang(params.lang);
  const t = getTranslations(lang);

  return (
    <>
      <Hero t={t} />
      <section id="features" className="border-b border-slate-800 bg-slate-950" aria-labelledby="features-heading">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <h2 id="features-heading" className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
            {t.features.title}
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {t.features.items.map((item) => (
              <div
                key={item.key}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-gray-300 shadow-lg backdrop-blur-xl sm:text-sm"
              >
                <p className="text-sm font-semibold text-gray-100 sm:text-base">{item.title}</p>
                <p className="mt-1 text-xs text-gray-300 sm:text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Services t={t} lang={lang} />
      <section className="border-b border-slate-800 bg-slate-950" aria-labelledby="calculator-heading">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
          <h2 id="calculator-heading" className="sr-only">
            {lang === 'ru' ? 'Калькулятор услуг' : 'Kalkulator usług'}
          </h2>
          <ServiceCalculator lang={lang} />
        </div>
      </section>
      <BrandsSection t={t} />
      <AboutBlock t={t} />
      <Suspense
        fallback={
          <section
            id={t.bookingId}
            className="min-h-[28rem] border-b border-slate-800 bg-slate-950"
            aria-busy="true"
            aria-label={lang === 'ru' ? 'Загрузка формы' : 'Ładowanie formularza'}
          />
        }
      >
        <BookingForm lang={lang} />
      </Suspense>
      <LocationSection lang={lang} />
      <Reviews lang={lang} />
    </>
  );
}

