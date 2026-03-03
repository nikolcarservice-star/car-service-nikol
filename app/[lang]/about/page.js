import { Building2, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { getTranslations, normalizeLang } from '../../../constants/translations';

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  if (lang === 'ru') {
    return {
      title: 'О компании Car Service Nikol – автосервис Jastrowo',
      description:
        'Узнайте больше о Car Service Nikol в Jastrowo: опыт, оборудование, ценности сервиса, данные компании (NIP, REGON).',
    };
  }

  return {
    title: 'O nas - Car Service Nikol Jastrowo, Szamotuły',
    description:
      'Poznaj Car Service Nikol w Jastrowo: doświadczenie, wyposażenie, wartości serwisu oraz dane firmy (NIP, REGON). Wystawiamy faktury VAT.',
  };
}

export default function AboutPage({ params }) {
  const lang = normalizeLang(params.lang);
  const t = getTranslations(lang);
  const basePath = `/${lang}`;

  const footer = t.footer;

  return (
    <section className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: lang === 'ru' ? 'Главная' : 'Strona główna', href: basePath },
            { label: lang === 'ru' ? 'О компании' : 'O nas' },
          ]}
        />

        <div className="mb-6 flex items-center gap-2">
          <Building2 className="h-6 w-6 text-orange-400" />
          <h1 className="text-2xl font-semibold tracking-tight text-gray-50 sm:text-3xl">
            {lang === 'ru'
              ? 'Car Service Nikol — современный автосервис в Познани'
              : 'Car Service Nikol — nowoczesny serwis samochodowy w Poznaniu'}
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-4 text-xs text-gray-200 sm:text-sm">
            <p>
              {lang === 'ru'
                ? 'Мы работаем с легковыми и лёгкими коммерческими автомобилями, сочетая опыт механиков с современным диагностическим оборудованием. Наша цель — честный сервис, понятные цены и конкретные сроки.'
                : 'Pracujemy z samochodami osobowymi i dostawczymi, łącząc doświadczenie mechaników z nowoczesną diagnostyką. Stawiamy na uczciwość, jasne ceny i dotrzymywanie terminów.'}
            </p>
            <p>
              {lang === 'ru'
                ? 'Перед началом naprawы szczegółowo omawiamy wyniki diagnostyki i możliwe warianty. Клиент сам выбирает, czy использовать оригинальные детали или проверенные zamienniki.'
                : 'Przed rozpoczęciem naprawy szczegółowo omawiamy wyniki diagnostyki i możliwe warianty. Klient decyduje, czy zastosować części oryginalne, czy wysokiej jakości zamienniki.'}
            </p>
            <p>
              {lang === 'ru'
                ? 'Мы уважительно относимся к вашему времени — многие стандартные работы (замена масла, тормоза, диагностика) стараемся выполнять в этот же день.'
                : 'Szanujemy Twój czas – wiele standardowych usług (wymiana oleju, hamulce, diagnostyka) wykonujemy tego samego dnia.'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-gray-200 sm:p-6 sm:text-sm">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-100 sm:text-base">
                <ShieldCheck className="h-5 w-5 text-orange-400" />
                <span>{lang === 'ru' ? 'Данные компании' : 'Dane firmy'}</span>
              </h2>
              <p className="mt-3 text-[11px] text-gray-400 sm:text-xs">
                {lang === 'ru'
                  ? 'Работаем официально и по всем требованиям польского права.'
                  : 'Działamy legalnie i zgodnie z polskimi przepisami.'}
              </p>
              <ul className="mt-3 space-y-1.5 text-[11px] sm:text-xs">
                <li>
                  <span className="text-gray-400">{footer.nipLabel}:</span>{' '}
                  <span className="text-gray-100">{footer.nipValue}</span>
                </li>
                <li>
                  <span className="text-gray-400">{footer.regonLabel}:</span>{' '}
                  <span className="text-gray-100">{footer.regonValue}</span>
                </li>
                <li className="mt-2 text-gray-300">{footer.invoices}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

