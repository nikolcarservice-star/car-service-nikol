import { FileText } from 'lucide-react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { getTranslations, normalizeLang } from '../../../constants/translations';
import { priceListPl, priceListRu } from '../../../data/prices';

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  if (lang === 'ru') {
    return {
      title: 'Прайс-лист – Car Service Nikol Jastrowo',
      description:
        'Цены на услуги автосервиса в Jastrowo и близлежащих местностях. Масло, тормоза, диагностика, шиномонтаж, ключи.',
    };
  }
  return {
    title: 'Cennik usług – Car Service Nikol Jastrowo',
    description:
      'Cennik usług serwisu samochodowego w Jastrowo i okolicznych miejscowościach. Olej, hamulce, diagnostyka, opony, klucze.',
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
      </div>
    </section>
  );
}
