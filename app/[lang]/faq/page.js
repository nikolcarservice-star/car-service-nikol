import { CircleHelp } from 'lucide-react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { getTranslations, normalizeLang } from '../../../constants/translations';
import { faqItems, getFaqItems } from '../../../data/faq';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://carservicenikol.pl';

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  const canonical = `/${lang}/faq`;
  const languages = { pl: `${SITE_URL}/pl/faq`, ru: `${SITE_URL}/ru/faq` };
  const ogImage = { url: '/images/services/mechanic-changing-tires-car-service.jpg', width: 1200, height: 630 };

  if (lang === 'ru') {
    const title = 'Вопросы и ответы – Car Service Nikol Jastrowo, Шамотулы';
    const description =
      'Частые вопросы: ночная стоянка, гарантия на запчасти, оплата картой, запись, воскресенье. Автосервис Jastrowo, клиенты из Шамотул.';
    return {
      title,
      description,
      alternates: { canonical, languages },
      openGraph: {
        type: 'website',
        locale: 'ru_RU',
        alternateLocale: 'pl_PL',
        url: `${SITE_URL}${canonical}`,
        siteName: 'Car Service Nikol',
        title,
        description,
        images: [{ ...ogImage, alt: 'FAQ Car Service Nikol' }],
      },
      twitter: { card: 'summary_large_image', title, description },
    };
  }

  const title = 'FAQ – pytania i odpowiedzi | Car Service Nikol Jastrowo, Szamotuły';
  const description =
    'Najczęstsze pytania: parkowanie na noc, gwarancja na części, płatność kartą, umówienie wizyty, niedziele. Serwis Jastrowo, Szamotuły.';
  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      locale: 'pl_PL',
      alternateLocale: 'ru_RU',
      url: `${SITE_URL}${canonical}`,
      siteName: 'Car Service Nikol',
      title,
      description,
      images: [{ ...ogImage, alt: 'FAQ Car Service Nikol' }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function buildFaqJsonLd(lang) {
  const code = lang === 'ru' ? 'ru' : 'pl';
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question[code],
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer[code],
      },
    })),
  };
}

export default function FaqPage({ params }) {
  const lang = normalizeLang(params.lang);
  const t = getTranslations(lang);
  const basePath = `/${lang}`;
  const isRu = lang === 'ru';
  const page = t.faqPage || {};
  const items = getFaqItems(lang);
  const jsonLd = buildFaqJsonLd(lang);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
          <Breadcrumbs
            items={[
              { label: isRu ? 'Главная' : 'Strona główna', href: basePath },
              { label: t.navigation?.faq ?? (isRu ? 'Вопросы и ответы' : 'FAQ') },
            ]}
          />

          <h1 className="mt-4 flex flex-wrap items-center gap-3 text-2xl font-semibold tracking-tight text-gray-50 sm:text-3xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30">
              <CircleHelp className="h-6 w-6" aria-hidden />
            </span>
            {isRu ? 'Вопросы и ответы' : 'Najczęstsze pytania'}
          </h1>
          {page.intro && (
            <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:text-base">{page.intro}</p>
          )}

          <div className="mt-8 space-y-3">
            {items.map((item) => (
              <details
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 text-left ring-1 ring-white/[0.04] open:border-orange-500/25 open:ring-orange-500/10"
              >
                <summary className="cursor-pointer list-none px-4 py-4 text-sm font-semibold text-gray-100 outline-none transition hover:bg-white/[0.03] sm:px-5 sm:text-base [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    <span>{item.question}</span>
                    <span className="shrink-0 text-orange-400 transition group-open:rotate-180" aria-hidden>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </span>
                </summary>
                <div className="border-t border-slate-800/80 px-4 py-4 text-sm leading-relaxed text-gray-400 sm:px-5 sm:text-base">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
