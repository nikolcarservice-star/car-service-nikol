import Hero from '../../components/Hero';
import Services from '../../components/Services';
import BrandsSection from '../../components/BrandsSection';
import AboutBlock from '../../components/AboutBlock';
import BookingForm from '../../components/BookingForm';
import LocationSection from '../../components/LocationSection';
import Reviews from '../../components/Reviews';
import { getTranslations, normalizeLang } from '../../constants/translations';

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  if (lang === 'ru') {
    return {
      title: 'Car Service Nikol – автосервис Jastrowo',
      description:
        'Car Service Nikol – автосервис Jastrowo и Шамотулы. Ходовая, тормоза, масло, диагностика. Работаем по воскресеньям.',
      keywords:
        'Механик Jastrowo, Автосервис Шамотулы, Ремонт авто Jastrowo, Car Service Nikol',
      alternates: { canonical: `/${lang}` },
    };
  }

  return {
    title: 'Car Service Nikol – serwis Jastrowo, Szamotuły',
    description:
      'Car Service Nikol – serwis Jastrowo, mechanik Szamotuły. Weekendowy serwis, diagnostyka, hamulce, wymiana oleju. Otwarte w niedzielę.',
    keywords:
      'serwis samochodowy Jastrowo, weekendowy serwis Jastrowo, mechanik Szamotuły, diagnostyka samochodowa Jastrowo, naprawa hamulców Szamotuły, wymiana oleju i filtrów Jastrowo, Car Service Nikol',
    alternates: { canonical: `/${lang}` },
  };
}

export default function LangHomePage({ params }) {
  const lang = normalizeLang(params.lang);
  const t = getTranslations(lang);

  return (
    <>
      <Hero t={t} />
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
            {t.features.title}
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {t.features.items.map((item) => (
              <div
                key={item.key}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-gray-300 shadow-lg backdrop-blur-xl sm:text-sm"
              >
                <p className="text-sm font-semibold text-gray-100 sm:text-base">{item.title}</p>
                <p className="mt-1 text-xs text-gray-300 sm:text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Services t={t} lang={lang} />
      <BrandsSection t={t} />
      <AboutBlock t={t} />
      <BookingForm lang={lang} />
      <LocationSection lang={lang} />
      <Reviews />
    </>
  );
}

