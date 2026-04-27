import Link from 'next/link';
import Image from 'next/image';
import { Wrench, CalendarDays, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import AvailableTermsSlideOut from '../../../components/AvailableTermsSlideOut';
import { getAllServices } from '../../../data/services';
import { getTranslations, normalizeLang } from '../../../constants/translations';

const imageMap = {
  suspension: '/images/services/suspension.jpg',
  oil: '/images/services/oil.jpg',
  brakes: '/images/services/brakes.jpg',
  timing: '/images/services/timing.jpg',
  diagnostics: '/images/services/diagnostics.jpg',
  tires: '/images/services/mechanic-changing-tires-car-service.jpg',
  mobileService: '/images/services/emergency-auto-mechanic-changing-flat-tire-road.jpg',
  keys: '/images/services/high-angle-hand-holding-car-key.jpg',
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoserwis-nikol.pl';

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  const canonical = `/${lang}/services`;
  const languages = { pl: `${SITE_URL}/pl/services`, ru: `${SITE_URL}/ru/services` };
  const ogImage = { url: '/images/services/mechanic-changing-tires-car-service.jpg', width: 1200, height: 630 };

  if (lang === 'ru') {
    const title = 'Услуги автосервиса — Jastrowo, в Шамотулах | Nikol | Воскресенье';
    const description =
      'Услуги в Jastrowo: ГРМ, кодирование ключей, диагностика, ходовая, шины, выезд и бустер. Удобный сервис для гмины Шамотулы — работаем в воскресенье.';
    return {
      title,
      description,
      keywords:
        'услуги автосервис Jastrowo, механик Шамотулы, замена ГРМ, программирование ключей, сервис воскресенье, помощь на дороге бустер, Car Service Nikol',
      alternates: { canonical, languages },
      openGraph: {
        type: 'website',
        locale: 'ru_RU',
        alternateLocale: 'pl_PL',
        url: `${SITE_URL}${canonical}`,
        siteName: 'Car Service Nikol',
        title,
        description,
        images: [{ ...ogImage, alt: 'Услуги Car Service Nikol – Jastrowo' }],
      },
      twitter: { card: 'summary_large_image', title, description },
    };
  }

  const title = 'Usługi mechaniczne — Jastrowo, w Szamotułach | Autoserwis Nikol | Niedziela';
  const description =
    'Pełna oferta: wymiana rozrządu Szamotuły, kodowanie kluczyków, dorabianie kluczy Jastrowo, diagnostyka, pomoc drogowa z boosterem. Jedyny serwis w gminie Szamotuły otwarty w każdą niedzielę.';

  return {
    title,
    description,
    keywords:
      'usługi mechanik Jastrowo, serwis samochodowy Szamotuły, wymiana rozrządu Szamotuły, kodowanie kluczyków, dorabianie kluczy Jastrowo, serwis samochodowy niedziela, pomoc drogowa booster, gmina Szamotuły, Car Service Nikol',
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      locale: 'pl_PL',
      alternateLocale: 'ru_RU',
      url: `${SITE_URL}${canonical}`,
      siteName: 'Car Service Nikol',
      title,
      description,
      images: [{ ...ogImage, alt: 'Usługi Car Service Nikol – Jastrowo, Szamotuły' }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function ServicesIndexPage({ params }) {
  const lang = normalizeLang(params.lang);
  const t = getTranslations(lang);
  const services = getAllServices(lang);
  const basePath = `/${lang}`;
  const bookingAnchor = `#${t.bookingId || 'booking'}`;
  const isRu = lang === 'ru';
  
  // JSON-LD для Google (Список услуг)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": services.map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": service.name,
      "url": `${SITE_URL}${basePath}/services/${service.slug}`
    }))
  };

  return (
    <section className="relative min-h-screen border-b border-slate-800 bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AvailableTermsSlideOut
        sundayBadge={isRu ? 'Есть записи на ближайшее воскресенье!' : 'Dostępne terminy w najbliższą niedzielę!'}
        bookCtaLabel={t.navigation?.bookCta || (isRu ? 'Записаться' : 'Umów wizytę')}
        bookingHref={`${basePath}${bookingAnchor}`}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: isRu ? 'Главная' : 'Strona główna', href: basePath },
            { label: t.navigation.services },
          ]}
        />

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Wrench className="h-6 w-6 text-orange-400" />
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {isRu ? 'Услуги — Jastrowo, в Шамотулах' : 'Usługi serwisowe — Jastrowo, w Szamotułach'}
              </h1>
            </div>
            <p className="max-w-2xl text-base text-gray-400">
              {isRu
                ? 'Car Service Nikol в Jastrowo — это гарантия качества и доступности. Мы специализируемся на сложном ремонте электроники и механики, работая тогда, когда другие отдыхают.'
                : 'Car Service Nikol w Jastrowo to gwarancja jakości i dostępności. Specjalizujemy się w zaawansowanej mechanice i elektronice, pracując wtedy, gdy inni odpoczywają.'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-full border-2 border-amber-400/50 bg-amber-500/15 px-4 py-2 text-xs font-semibold text-amber-200 shadow-md shadow-amber-900/20">
              <Clock className="h-4 w-4 shrink-0 text-amber-300" aria-hidden />
              {isRu ? 'Открыты каждое воскресенье' : 'Otwarte w każdą niedzielę'}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-medium text-orange-400">
              <Clock className="h-4 w-4" aria-hidden />
              {isRu ? 'Работаем в Сб и Вс' : 'Czynne w Soboty i Niedziele'}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-medium text-green-400">
              <ShieldCheck className="h-4 w-4" />
              {isRu ? 'Гарантия на работу' : 'Gwarancja na usługi'}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const imageUrl = imageMap[service.key];
            return (
              <article
                key={service.slug}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 transition-all duration-300 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={service.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-800">
                      <Wrench className="h-12 w-12 text-slate-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                     <h2 className="text-xl font-bold text-white shadow-black drop-shadow-md">
                      {service.name}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-6 text-sm leading-relaxed text-gray-400">
                    {service.intro}
                  </p>

                  <div className="mt-auto flex flex-col gap-3">
                    <Link
                      href={`${basePath}/services/${service.slug}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      {isRu ? 'Подробнее' : 'Szczegóły oferty'}
                      <ArrowRight className="h-4 w-4 text-orange-500" />
                    </Link>
                    <Link
                      href={`${basePath}?service=${encodeURIComponent(service.key)}${bookingAnchor}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-500 shadow-lg shadow-orange-900/20"
                    >
                      <CalendarDays className="h-4 w-4" />
                      {t.navigation?.bookCta || (isRu ? 'Записаться' : 'Umów wizytę')}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        
        {/* SEO-подвал страницы */}
        <div className="mt-16 border-t border-slate-800 pt-8 text-center">
          <p className="text-sm text-gray-500">
            {isRu
              ? 'Ищете надежного механика в районе Шамотулы? Наш автосервис в Ястрово (Jastrowo) предлагает профессиональную диагностику, замену ГРМ и программирование ключей. Мы открыты для вас каждую субботу и воскресенье.'
              : 'Szukasz zaufanego mechanika w Szamotułach na weekend? Car Service Nikol w Jastrowo to najlepszy wybór dla Twojego auta.'}
          </p>
        </div>
      </div>
    </section>
  );
}