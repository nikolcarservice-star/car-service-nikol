import Link from 'next/link';
import { Wrench } from 'lucide-react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { getAllServices } from '../../../data/services';
import { getTranslations, normalizeLang } from '../../../constants/translations';

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

  return (
    <section className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: lang === 'ru' ? 'Главная' : 'Strona główna', href: basePath },
            { label: t.navigation.services },
          ]}
        />

        <div className="mb-6 flex items-center gap-2">
          <Wrench className="h-6 w-6 text-orange-400" />
          <h1 className="text-2xl font-semibold tracking-tight text-gray-50 sm:text-3xl">
            {lang === 'ru'
              ? 'Услуги автосервиса Car Service Nikol'
              : 'Usługi serwisu Car Service Nikol'}
          </h1>
        </div>
        <p className="mb-6 max-w-2xl text-sm text-gray-300 sm:text-base">
          {lang === 'ru'
            ? 'Ниже вы найдёте подробное описание основных услуг нашего автосервиса в Jastrowo. Выберите раздел, чтобы узнать цену и этапы работ.'
            : 'Poniżej znajdziesz szczegółowe opisy głównych usług naszego serwisu w Jastrowo. Wybierz interesującą Cię usługę, aby poznać ceny i etapy pracy.'}
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`${basePath}/services/${service.slug}`}
              className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-gray-300 shadow-lg transition hover:-translate-y-1 hover:border-orange-500/70 hover:shadow-glow sm:text-sm"
            >
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-100 sm:text-base">
                <Wrench className="h-4 w-4 text-orange-400" />
                <span>{service.name}</span>
              </h2>
              <p className="mt-2 text-xs text-gray-300 sm:text-sm">{service.intro}</p>
              <span className="mt-3 inline-flex text-xs font-semibold text-orange-300 group-hover:text-orange-200">
                {lang === 'ru' ? 'Подробнее o usłudze' : 'Zobacz szczegóły usługi'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

