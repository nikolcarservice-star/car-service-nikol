import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Scale, Clock, Activity, CalendarDays, ArrowRight } from 'lucide-react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { getTranslations, normalizeLang } from '../../../constants/translations';

const HERO_IMAGE = '/images/services/diagnostics.jpg';

const valueIcons = {
  honesty: Scale,
  terms: Clock,
  diagnostics: Activity,
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://carservicenikol.pl';

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  const canonical = `/${lang}/about`;
  const languages = { pl: `${SITE_URL}/pl/about`, ru: `${SITE_URL}/ru/about` };

  if (lang === 'ru') {
    return {
      title: 'О компании Car Service Nikol – автосервис Jastrowo, Шамотулы',
      description:
        'Узнайте больше о Car Service Nikol в Jastrowo: опыт, ценности сервиса, работа в воскресенье. Честность, сроки, диагностика. Запишитесь на визит.',
      alternates: { canonical, languages },
    };
  }

  return {
    title: 'O nas – Car Service Nikol Jastrowo, Szamotuły | Wartości, niedziele',
    description:
      'Poznaj Car Service Nikol w Jastrowo: doświadczenie, wartości serwisu, praca w niedzielę. Uczciwość, terminy, diagnostyka. Umów wizytę w serwisie.',
    alternates: { canonical, languages },
  };
}

export default function AboutPage({ params }) {
  const lang = normalizeLang(params.lang);
  const t = getTranslations(lang);
  const basePath = `/${lang}`;
  const isRu = lang === 'ru';
  const footer = t.footer || {};
  const aboutPage = t.aboutPage || {};
  const showDaneFirmy =
    footer.nipValue && footer.regonValue &&
    !footer.nipValue.includes('placeholder') && !footer.regonValue.includes('placeholder');

  const heroTitle = aboutPage.heroTitle || (isRu ? 'Car Service Nikol — ваш надёжный сервис в Jastrowo' : 'Car Service Nikol — Twój zaufany serwis w Jastrowo');
  const heroSubtitle = aboutPage.heroSubtitle || (isRu ? 'Опыт, честность и соблюдение сроков. Работаем и по воскресеньям.' : 'Doświadczenie, uczciwość i terminowość. Pracujemy także w niedziele.');
  const values = aboutPage.values || [];
  const sundayParagraph = aboutPage.sundayParagraph;
  const ctaTitle = aboutPage.ctaTitle || (isRu ? 'Хотите проверить автомобиль? Запишитесь на визит!' : 'Chcesz sprawdzić swój samochód? Umów się na wizytę!');
  const ctaButton = aboutPage.ctaButton || (t.navigation?.bookCta || (isRu ? 'Записаться' : 'Umów wizytę'));

  return (
    <div className="border-b border-slate-800 bg-slate-950">
      {/* Hero */}
      <div className="relative h-[280px] w-full overflow-hidden sm:h-[320px] md:h-[380px]">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            {heroTitle}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-gray-200 sm:text-base">
            {heroSubtitle}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: isRu ? 'Главная' : 'Strona główna', href: basePath },
            { label: isRu ? 'О компании' : 'O nas' },
          ]}
        />

        {/* 3 value cards */}
        {values.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {values.map((value, i) => {
              const keys = ['honesty', 'terms', 'diagnostics'];
              const Icon = valueIcons[keys[i]] || ShieldCheck;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-5 shadow-lg transition hover:border-orange-500/40"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-4 text-base font-semibold text-gray-100">
                    {value.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-300">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Sunday USP */}
        {sundayParagraph && (
          <div className="mt-10 flex flex-col gap-3 rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/10 p-5 sm:p-6">
            <p className="flex items-center gap-3 text-base font-medium text-emerald-100 sm:text-lg">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/30">
                <CalendarDays className="h-5 w-5 text-emerald-300" />
              </span>
              {sundayParagraph}
            </p>
          </div>
        )}

        {/* Dane firmy — only if no placeholders */}
        {showDaneFirmy && (
          <div className="mt-10">
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold text-gray-100">
                <ShieldCheck className="h-5 w-5 text-orange-400" />
                <span>{isRu ? 'Данные компании' : 'Dane firmy'}</span>
              </h2>
              <p className="mt-3 text-sm text-gray-400">
                {isRu ? 'Работаем официально и по всем требованиям польского права.' : 'Działamy legalnie i zgodnie z polskimi przepisami.'}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm">
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
        )}

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-slate-700 bg-slate-900/60 px-6 py-8 text-center sm:px-8 sm:py-10">
          <h2 className="text-xl font-bold text-gray-50 sm:text-2xl">
            {ctaTitle}
          </h2>
          <Link
            href={`${basePath}#${t.bookingId || 'booking'}`}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-400 hover:to-amber-400 hover:shadow-orange-500/40"
          >
            <span>{ctaButton}</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
