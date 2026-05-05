import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, Phone, Stethoscope } from 'lucide-react';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import {
  getAllServicePageSlugs,
  getServiceBySlug,
  getLowestFromPricePln,
} from '../../../../data/services';
import { getPhoneContactPageHref, getTranslations, normalizeLang } from '../../../../constants/translations';
import { getSitemapLangs } from '../../../../constants/localeConfig';

function displayPriceInPln(value) {
  if (value == null || value === '') return '';
  return String(value).replace(/\s*zł\b/gi, ' PLN').replace(/\bzł\b/gi, 'PLN');
}

export function generateStaticParams() {
  const params = [];
  const langs = getSitemapLangs();
  const slugs = getAllServicePageSlugs();

  langs.forEach((lang) => {
    slugs.forEach((slug) => {
      params.push({ lang, slug });
    });
  });

  return params;
}

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  const service = getServiceBySlug(params.slug, lang);

  if (!service) {
    return {};
  }

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: { canonical: `/${lang}/services/${params.slug}` },
  };
}

export default function ServiceDetailPage({ params }) {
  const lang = normalizeLang(params.lang);
  const service = getServiceBySlug(params.slug, lang);
  const t = getTranslations(lang);
  const sd = t.serviceDetail || {};

  if (!service) {
    notFound();
  }

  const basePath = `/${lang}`;
  const bookingId = t.bookingId || 'booking';
  const bookingHref = `${basePath}?service=${encodeURIComponent(service.key)}#${bookingId}`;
  const lowest = getLowestFromPricePln(service.prices);
  const fromBandText =
    lowest != null && sd.fromPriceBand
      ? sd.fromPriceBand.replace('{amount}', String(lowest))
      : null;
  const symptoms = Array.isArray(service.symptoms) ? service.symptoms : [];

  return (
    <section className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Breadcrumbs
          items={[
            {
              label: lang === 'ru' ? 'Главная' : 'Strona główna',
              href: basePath,
            },
            {
              label: lang === 'ru' ? 'Услуги' : 'Usługi',
              href: `${basePath}/services`,
            },
            { label: service.name },
          ]}
        />

        <h1 className="text-2xl font-semibold tracking-tight text-gray-50 sm:text-3xl">{service.h1}</h1>

        {service.sectionH2 ? (
          <h2 className="mt-4 text-lg font-semibold tracking-tight text-orange-100/95 sm:text-xl">
            {service.sectionH2}
          </h2>
        ) : null}

        <p className="mt-3 max-w-3xl text-sm text-gray-300 sm:text-base">{service.intro}</p>

        {fromBandText && (
          <p className="mt-4 inline-flex max-w-3xl items-center rounded-xl border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-100">
            {fromBandText}
          </p>
        )}

        {symptoms.length > 0 && (
          <div className="mt-6 rounded-2xl border border-amber-500/35 bg-gradient-to-br from-amber-500/10 via-slate-900/80 to-slate-900/60 p-4 sm:p-6">
            <div className="flex items-center gap-2 text-amber-200">
              <Stethoscope className="h-5 w-5 shrink-0" aria-hidden />
              <h2 className="text-base font-bold tracking-tight text-gray-50 sm:text-lg">
                {sd.symptomsHeading ||
                  (lang === 'ru' ? 'Когда пора обратиться в сервис?' : 'Kiedy warto zająć się tym w serwisie?')}
              </h2>
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-200 sm:text-base">
              {symptoms.map((item) => (
                <li key={item} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-gray-200 sm:p-6 sm:text-sm">
            <h2 className="text-sm font-semibold text-gray-100 sm:text-base">
              {lang === 'ru' ? 'Как выполняется услуга:' : 'Jak przebiega wykonanie usługi:'}
            </h2>
            <ol className="mt-2 list-decimal space-y-2 pl-4">
              {service.process.map((step, index) => (
                <li key={index} className="text-xs text-gray-300 sm:text-sm">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-gray-200 shadow-lg sm:p-5 sm:text-sm">
              <h2 className="text-sm font-semibold text-gray-100 sm:text-base">
                {lang === 'ru' ? 'Примерные цены (PLN)' : 'Przykładowe ceny (PLN)'}
              </h2>
              <p className="mt-1 text-xs text-gray-400 sm:text-sm">{service.pricesIntro}</p>
              {sd.pricesDisclaimer && (
                <p className="mt-2 text-[11px] leading-relaxed text-gray-500 sm:text-xs">{sd.pricesDisclaimer}</p>
              )}
              <ul className="mt-3 space-y-1.5">
                {service.prices.map((price) => (
                  <li key={price.label} className="flex items-start justify-between gap-2">
                    <span className="text-xs text-gray-300 sm:text-sm">{price.label}</span>
                    <span className="shrink-0 text-xs font-semibold tabular-nums text-orange-300 sm:text-sm">
                      {displayPriceInPln(price.value)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={bookingHref}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-400 hover:to-amber-400"
            >
              <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
              <span>{sd.bookCta || (lang === 'ru' ? 'Записаться' : 'Umów wizytę')}</span>
            </Link>
            {sd.bookCtaHint && <p className="text-center text-[11px] text-gray-500 sm:text-xs">{sd.bookCtaHint}</p>}

            <div className="rounded-2xl border border-orange-500/60 bg-orange-500/10 p-4 text-xs text-gray-100 shadow-glow sm:p-5 sm:text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300 sm:text-[11px]">
                {lang === 'ru' ? 'Лучше позвонить и уточнить' : 'Najlepiej zadzwoń i zapytaj'}
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-50 sm:text-base">
                {lang === 'ru'
                  ? 'Быстро скажем, сколько будет стоить ремонт именно в вашем случае.'
                  : 'Szybko powiemy, ile będzie kosztować naprawa w Twoim konkretnym przypadku.'}
              </p>
              <Link
                href={getPhoneContactPageHref(lang)}
                prefetch={false}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-orange-400 sm:w-auto"
              >
                <Phone className="h-4 w-4" />
                <span>
                  {lang === 'ru' ? 'Позвонить сейчас' : 'Zadzwoń teraz'} · +48 794 935 734
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
