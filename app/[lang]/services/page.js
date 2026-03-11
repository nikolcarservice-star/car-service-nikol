import Link from 'next/link';
import Image from 'next/image';
import { Wrench, CalendarDays, ArrowRight } from 'lucide-react';
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
};

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  if (lang === 'ru') {
    return {
      title: 'Услуги автосервиса в Jastrowo - Car Service Nikol',
      description:
        'Полный список услуг Car Service Nikol в Jastrowo: ремонт ходовой, тормозов, замена масла, компьютерная диагностика и замена ГРМ.',
      alternates: { canonical: `/${lang}/services` },
    };
  }

  return {
    title: 'Usługi serwisu samochodowego w Jastrowo - Car Service Nikol',
    description:
      'Pełna oferta Car Service Nikol w Jastrowo: naprawa zawieszenia, serwis hamulców, wymiana oleju, diagnostyka komputerowa i wymiana rozrządu.',
    alternates: { canonical: `/${lang}/services` },
  };
}

export default function ServicesIndexPage({ params }) {
  const lang = normalizeLang(params.lang);
  const t = getTranslations(lang);
  const services = getAllServices(lang);
  const basePath = `/${lang}`;
  const bookingAnchor = `#${t.bookingId || 'booking'}`;
  const isRu = lang === 'ru';
  const servicesPage = t.servicesPage || {};
  const sundayBadge = servicesPage.sundayBadge || (isRu ? 'Есть записи на ближайшее воскресенье!' : 'Dostępne terminy w najbliższą niedzielę!');
  const serviceDetailsLabel = servicesPage.serviceDetails || (isRu ? 'Подробнее об услуге' : 'Zobacz szczegóły usługi');

  return (
    <section className="relative min-h-screen border-b border-slate-800 bg-slate-950">
      {/* Доступные термины — wysuwany panel z boku (domyślnie ukryty, otwiera się przyciskiem) */}
      <AvailableTermsSlideOut
        sundayBadge={sundayBadge}
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

        <div className="mb-6 flex items-center gap-2">
          <Wrench className="h-6 w-6 text-orange-400" />
          <h1 className="text-2xl font-semibold tracking-tight text-gray-50 sm:text-3xl">
            {isRu ? 'Услуги автосервиса Car Service Nikol' : 'Usługi serwisu Car Service Nikol'}
          </h1>
        </div>
        <p className="mb-8 max-w-2xl text-sm text-gray-300 sm:text-base">
          {isRu
            ? 'Ниже вы найдёте подробное описание основных услуг нашего автосервиса в Jastrowo. Выберите раздел, чтобы узнать цену и этапы работ.'
            : 'Poniżej znajdziesz szczegółowe opisy głównych usług naszego serwisu w Jastrowo. Wybierz interesującą Cię usługę, aby poznać ceny i etapy pracy.'}
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const imageUrl = imageMap[service.key];
            return (
              <article
                key={service.slug}
                className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-xl transition hover:border-orange-500/50 hover:shadow-orange-500/10"
              >
                {/* Фон и градиент */}
                {imageUrl && (
                  <div className="absolute inset-0">
                    <Image
                      src={imageUrl}
                      alt=""
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"
                      aria-hidden
                    />
                  </div>
                )}

                <div className="relative z-10 flex flex-1 flex-col p-5 pt-8">
                  <h2 className="text-lg font-bold text-white sm:text-xl">
                    {service.name}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-200">
                    {service.intro}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-3 pt-4">
                    <Link
                      href={`${basePath}/services/${service.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-400 hover:to-amber-400 hover:shadow-orange-500/40"
                    >
                      <span>{serviceDetailsLabel}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`${basePath}${bookingAnchor}`}
                      className="inline-flex items-center gap-2 rounded-lg border-2 border-white/60 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-orange-400/80 hover:bg-orange-500/20 hover:text-orange-100"
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
      </div>
    </section>
  );
}
