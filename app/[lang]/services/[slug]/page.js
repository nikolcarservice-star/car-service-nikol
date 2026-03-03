import { notFound } from 'next/navigation';
import { Phone } from 'lucide-react';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import { getServiceBySlug, servicesData, SERVICE_KEYS } from '../../../../data/services';
import { normalizeLang } from '../../../../constants/translations';

export function generateStaticParams() {
  const params = [];
  const langs = ['pl', 'ru'];

  langs.forEach((lang) => {
    SERVICE_KEYS.forEach((key) => {
      const entry = servicesData[key];
      params.push({ lang, slug: entry.slug });
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
  };
}

export default function ServiceDetailPage({ params }) {
  const lang = normalizeLang(params.lang);
  const service = getServiceBySlug(params.slug, lang);

  if (!service) {
    notFound();
  }

  const basePath = `/${lang}`;

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

        <h1 className="text-2xl font-semibold tracking-tight text-gray-50 sm:text-3xl">
          {service.h1}
        </h1>

        <p className="mt-3 max-w-3xl text-sm text-gray-300 sm:text-base">{service.intro}</p>

        <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-gray-200 sm:p-6 sm:text-sm">
            <h2 className="text-sm font-semibold text-gray-100 sm:text-base">
              {lang === 'ru'
                ? 'Как выполняется услуга:'
                : 'Jak przebiega wykonanie usługi:'}
            </h2>
            <ol className="mt-2 space-y-2 list-decimal pl-4">
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
                {lang === 'ru' ? 'Примеры цен' : 'Przykładowe ceny'}
              </h2>
              <p className="mt-1 text-xs text-gray-400 sm:text-sm">{service.pricesIntro}</p>
              <ul className="mt-3 space-y-1.5">
                {service.prices.map((price) => (
                  <li key={price.label} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-300 sm:text-sm">{price.label}</span>
                    <span className="text-xs font-semibold text-orange-300 sm:text-sm">
                      {price.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-orange-500/60 bg-orange-500/10 p-4 text-xs text-gray-100 shadow-glow sm:p-5 sm:text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300 sm:text-[11px]">
                {lang === 'ru'
                  ? 'Лучше позвонить и уточнить'
                  : 'Najlepiej zadzwoń i zapytaj'}
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-50 sm:text-base">
                {lang === 'ru'
                  ? 'Быстро скажем, сколько будет стоить ремонт именно в вашем случае.'
                  : 'Szybko powiemy, ile będzie kosztować naprawa w Twoim konkretnym przypadku.'}
              </p>
              <a
                href="tel:+48600000600"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-orange-400 sm:w-auto"
              >
                <Phone className="h-4 w-4" />
                <span>
                  {lang === 'ru' ? 'Позвонить сейчас' : 'Zadzwoń teraz'} · +48 600 000 600
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

