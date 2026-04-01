import { Suspense } from 'react';
import Hero from '../../components/Hero';
import Services from '../../components/Services';
import BrandsSection from '../../components/BrandsSection';
import AboutBlock from '../../components/AboutBlock';
import BookingForm from '../../components/BookingForm';
import LocationSection from '../../components/LocationSection';
import Reviews from '../../components/Reviews';
import { getTranslations, normalizeLang } from '../../constants/translations';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://carservicenikol.pl';

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  const canonical = `/${lang}`;
  const languages = { pl: `${SITE_URL}/pl`, ru: `${SITE_URL}/ru` };

  const ogImage = {
    url: '/images/services/mechanic-changing-tires-car-service.jpg',
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

  const title = 'Car Service Nikol – Serwis samochodowy Jastrowo, Szamotuły | Otwarte w niedziele';
  const description =
    'Car Service Nikol – profesjonalny serwis samochodowy Jastrowo i Szamotuły. Mechanik, diagnostyka, naprawa zawieszenia i hamulców, wymiana oleju. Otwarte w soboty i niedziele. Umów wizytę online.';
  return {
    title,
    description,
    keywords:
      'serwis samochodowy Jastrowo, weekendowy serwis Jastrowo, mechanik Szamotuły, diagnostyka samochodowa, naprawa hamulców, wymiana oleju i filtrów, warsztat w niedzielę, Car Service Nikol',
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      locale: 'pl_PL',
      alternateLocale: 'ru_RU',
      url: `${SITE_URL}${canonical}`,
      siteName: 'Car Service Nikol',
      title,
      description,
      images: [{ ...ogImage, alt: 'Car Service Nikol – serwis samochodowy Jastrowo, Szamotuły' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage.url] },
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

