import Link from 'next/link';
import { FileText, Phone, CalendarDays } from 'lucide-react';
import Breadcrumbs from '../../../components/Breadcrumbs';
// import ServiceCalculator from '../../../components/ServiceCalculator';
import {
  getPhoneContactPageHref,
  getTranslations,
  normalizeLang,
  PHONE_DISPLAY,
} from '../../../constants/translations';
import {
  priceListPl,
  priceListRu,
  getCennikSeoSnippet,
  getCennikIntroParagraph,
} from '../../../data/prices';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoserwis-nikol.pl';

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  const canonical = `/${lang}/cennik`;
  const languages = { pl: `${SITE_URL}/pl/cennik`, ru: `${SITE_URL}/ru/cennik` };

  const ogImage = { url: '/images/services/mechanic-changing-tires-car-service.jpg', width: 1200, height: 630 };

  if (lang === 'ru') {
    const title = 'Прайс-лист – Car Service Nikol Jastrowo, Шамотулы | Цены на услуги';
    const description = `${getCennikSeoSnippet('ru')} Полная таблица: масла, тормоза, диагностика, ГРМ, шины, ключи.`;
    return {
      title,
      description,
      keywords: 'прайс автосервис Jastrowo, цены ремонт авто, замена масла, тормоза, диагностика, Car Service Nikol',
      alternates: { canonical, languages },
      openGraph: {
        type: 'website',
        locale: 'ru_RU',
        alternateLocale: 'pl_PL',
        url: `${SITE_URL}${canonical}`,
        siteName: 'Car Service Nikol',
        title,
        description,
        images: [{ ...ogImage, alt: 'Прайс-лист Car Service Nikol – Jastrowo' }],
      },
      twitter: { card: 'summary_large_image', title, description },
    };
  }
  const title = 'Cennik usług – Car Service Nikol Jastrowo, Szamotuły | Ceny orientacyjne';
  const description = `${getCennikSeoSnippet('pl')} Pełna tabela: oleje, hamulce, diagnostyka, rozrząd, opony, klucze.`;
  return {
    title,
    description,
    keywords: 'cennik serwis Jastrowo, ceny naprawa auta, wymiana oleju, hamulce, diagnostyka, Car Service Nikol',
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      locale: 'pl_PL',
      alternateLocale: 'ru_RU',
      url: `${SITE_URL}${canonical}`,
      siteName: 'Car Service Nikol',
      title,
      description,
      images: [{ ...ogImage, alt: 'Cennik Car Service Nikol – Jastrowo' }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function CennikPage({ params }) {
  const lang = normalizeLang(params.lang);
  const t = getTranslations(lang);
  const basePath = `/${lang}`;
  const priceList = lang === 'ru' ? priceListRu : priceListPl;

  const title = lang === 'ru' ? 'Прайс-лист' : 'Cennik usług';
  const subtitle =
    lang === 'ru'
      ? 'Текстовый прайс ниже — ориентировочные цены в злотых. Уточнение по телефону перед визитом.'
      : 'Poniżej pełny cennik tekstowy — kwoty orientacyjne w złotych. Przed wizytą możesz dopytać telefonicznie.';
  const introParagraph = getCennikIntroParagraph(lang);

  return (
    <section className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <Breadcrumbs
          items={[
            { label: lang === 'ru' ? 'Главная' : 'Strona główna', href: basePath },
            { label: t.navigation.cennik ?? (lang === 'ru' ? 'Прайс-лист' : 'Cennik') },
          ]}
        />

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-50 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
          </div>
        </div>

        <p className="mb-8 rounded-2xl border border-orange-500/25 bg-orange-500/5 px-4 py-4 text-sm leading-relaxed text-gray-200 sm:px-5 sm:text-base">
          {introParagraph}
        </p>

        {/* Калькулятор временно скрыт — раскомментируйте импорт и блок */}
        {/* <div className="mb-10">
          <ServiceCalculator lang={lang} />
        </div> */}

        <div className="space-y-6">
          {priceList.map((group) => (
            <div
              key={group.category}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-6"
            >
              <h2 className="mb-4 border-b border-orange-500/30 pb-2 text-lg font-semibold text-orange-300">
                {group.category}
              </h2>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 py-2 last:border-0"
                  >
                    <span className="text-sm text-gray-200 sm:text-base">{item.name}</span>
                    <span className="shrink-0 font-semibold text-orange-400">
                      {item.price}
                      {item.note && (
                        <span className="ml-1 text-xs font-normal text-gray-400">
                          {item.note}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-gray-500 sm:text-sm">
          {lang === 'ru'
            ? 'Цены ориентировочные. Позиции с пометкой «работа» — без стоимости запчастей, если не указано «с материалом». Итог — после осмотра автомобиля.'
            : 'Kwoty orientacyjne. Przy dopisku „robocizna” nie wliczamy kosztu części, chyba że przy pozycji jest „z materiałem”. Końcowa wycena po oględzinach pojazdu.'}
        </p>

        {/* CTA — Umów wizytę / Zadzwoń */}
        <div className="mt-12 rounded-2xl border border-orange-500/30 bg-gradient-to-b from-orange-500/10 to-transparent p-6 text-center sm:p-8">
          <h2 className="text-lg font-bold text-gray-50 sm:text-xl">
            {lang === 'ru'
              ? 'Готовы записаться? Позвоните или оставьте заявку'
              : 'Gotowy na wizytę? Zadzwoń lub wypełnij formularz'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {lang === 'ru'
              ? 'Подберём удобную дату и рассчитаем точную стоимость.'
              : 'Dopasujemy dogodny termin i podamy dokładną wycenę.'}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href={getPhoneContactPageHref(lang)}
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:from-orange-400 hover:to-amber-400"
            >
              <Phone className="h-5 w-5" />
              {PHONE_DISPLAY}
            </Link>
            <Link
              href={`/${lang}#booking`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-orange-500/60 bg-slate-800/80 px-5 py-3.5 text-sm font-bold text-white transition hover:border-orange-400 hover:bg-orange-500/20"
            >
              <CalendarDays className="h-5 w-5" />
              {lang === 'ru' ? 'Записаться онлайн' : 'Umów wizytę online'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
