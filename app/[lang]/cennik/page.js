import Link from 'next/link';
import { FileText, Phone, CalendarDays } from 'lucide-react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { getTranslations, normalizeLang, PHONE_RAW, PHONE_DISPLAY } from '../../../constants/translations';
import { priceListPl, priceListRu } from '../../../data/prices';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://carservicenikol.pl';

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  const canonical = `/${lang}/cennik`;
  const languages = { pl: `${SITE_URL}/pl/cennik`, ru: `${SITE_URL}/ru/cennik` };

  if (lang === 'ru') {
    return {
      title: 'Прайс-лист – Car Service Nikol Jastrowo | Цены на услуги',
      description:
        'Цены на услуги автосервиса в Jastrowo и близлежащих местностях. Масло, тормоза, диагностика, шиномонтаж, ключи. Ориентировочные цены.',
      alternates: { canonical, languages },
    };
  }
  return {
    title: 'Cennik usług – Car Service Nikol Jastrowo | Ceny orientacyjne',
    description:
      'Cennik usług serwisu samochodowego w Jastrowo i okolicznych miejscowościach. Olej, hamulce, diagnostyka, opony, klucze. Ceny orientacyjne.',
    alternates: { canonical, languages },
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
      ? 'Ориентировочные цены на услуги в Jastrowo и ближайших населённых пунктах. Точную стоимость уточняйте по телефону.'
      : 'Ceny orientacyjne na usługi w Jastrowo i pobliskich miejscowościach. Dokładną wycenę podamy telefonicznie.';

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

        <p className="mt-8 text-center text-xs text-gray-500">
          {lang === 'ru'
            ? 'Цены netto. Окончательная стоимость зависит от марки и модели автомобиля.'
            : 'Ceny netto. Ostateczny koszt zależy od marki i modelu pojazdu.'}
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
            <a
              href={`tel:${PHONE_RAW}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:from-orange-400 hover:to-amber-400"
            >
              <Phone className="h-5 w-5" />
              {PHONE_DISPLAY}
            </a>
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
