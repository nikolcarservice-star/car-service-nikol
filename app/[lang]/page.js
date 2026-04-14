import { Suspense } from 'react';
import Hero from '../../components/Hero';
import Services from '../../components/Services';
import BrandsSection from '../../components/BrandsSection';
import AboutBlock from '../../components/AboutBlock';
import BookingForm from '../../components/BookingForm';
import LocationSection from '../../components/LocationSection';
import Reviews from '../../components/Reviews';
import { getTranslations, normalizeLang } from '../../constants/translations';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoserwis-nikol.pl';

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  const canonical = `/${lang}`;
  const languages = { pl: `${SITE_URL}/pl`, ru: `${SITE_URL}/ru` };

  const ogImage = {
    url: '/og-image.jpg',
    width: 1200,
    height: 630,
  };

  if (lang === 'ru') {
    const title = 'Автосервис Nikol Jastrowo | Механик Шамотулы | Ремонт в воскресенье';
    const description =
      'Профессиональный ремонт авто в Jastrowo. Замена ГРМ, ключи, диагностика. Работаем в субботу и воскресенье! Гмина Шамотулы.';
    return {
      title,
      description,
      keywords:
        'автосервис Jastrowo, механик Шамотулы, замена ГРМ, диагностика, гмина Шамотулы, сервис воскресенье, Car Service Nikol',
      alternates: { canonical, languages },
      openGraph: {
        type: 'website',
        locale: 'ru_RU',
        alternateLocale: 'pl_PL',
        url: `${SITE_URL}${canonical}`,
        siteName: 'Car Service Nikol',
        title,
        description,
        images: [{ ...ogImage, alt: 'Автосервис Nikol Jastrowo — механик, ремонт в выходные' }],
      },
      twitter: { card: 'summary_large_image', title, description, images: [ogImage.url] },
    };
  }

  const title = 'Mechanik Jastrowo - Autoserwis Nikol | Rozrządy, Klucze | Niedziela';
  const description =
    'Jedyny serwis samochodowy w gminie Szamotuły otwarty w każdą niedzielę. Jastrowo: wymiana rozrządu, kodowanie i dorabianie kluczyków, diagnostyka, pomoc drogowa z boosterem. Umów wizytę w weekend.';

  return {
    title,
    description,
    keywords:
      'mechanik Jastrowo, mechanik Szamotuły, wymiana rozrządu Szamotuły, kodowanie kluczyków, dorabianie kluczy Jastrowo, serwis samochodowy niedziela, pomoc drogowa booster, Car Service Nikol, gmina Szamotuły',
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      locale: 'pl_PL',
      alternateLocale: 'ru_RU',
      url: `${SITE_URL}${canonical}`,
      siteName: 'Car Service Nikol',
      title,
      description,
      images: [{ ...ogImage, alt: 'Car Service Nikol – mechanik Jastrowo, serwis w niedziele' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export default function LangHomePage({ params }) {
  const lang = normalizeLang(params.lang);
  const t = getTranslations(lang);

  // Schema.org JSON-LD для Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "Car Service Nikol",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Wernisażowa 21",
      "addressLocality": "Jastrowo",
      "addressRegion": "Wielkopolskie",
      "postalCode": "64-500",
      "addressCountry": "PL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "52.6288", // Проверь координаты в Google Maps
      "longitude": "16.5933"
    },
    "url": SITE_URL,
    "telephone": "+48574135546", // Твой номер телефона
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "11"
    }
  };

  return (
    <>
      {/* Вставляем JSON-LD в голову страницы */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Hero t={t} />
      
      <section id="features" className="border-b border-slate-800 bg-slate-950" aria-labelledby="features-heading">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <h2 id="features-heading" className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
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
      
      <Suspense
        fallback={
          <section
            id={t.bookingId}
            className="min-h-[28rem] border-b border-slate-800 bg-slate-950"
            aria-busy="true"
            aria-label={lang === 'ru' ? 'Загрузка формы' : 'Ładowanie formularza'}
          />
        }
      >
        <BookingForm lang={lang} />
      </Suspense>
      
      <LocationSection lang={lang} />
      <Reviews lang={lang} />

      {lang === 'pl' && (
        <footer className="border-t border-slate-800 bg-slate-950" aria-label="Informacje SEO">
          <div className="mx-auto max-w-3xl px-4 py-8 text-center sm:px-6 sm:text-left">
            <p className="text-sm leading-relaxed text-gray-400">
              Szukasz mechanika w okolicy Szamotuł? Nasz warsztat w Jastrowie oferuje profesjonalną diagnostykę,
              wymianę rozrządu oraz kodowanie kluczy. Jesteśmy otwarci w każdą niedzielę.
            </p>
          </div>
        </footer>
      )}
      {lang === 'ru' && (
        <footer className="border-t border-slate-800 bg-slate-950" aria-label="SEO">
          <div className="mx-auto max-w-3xl space-y-4 px-4 py-8 text-center sm:px-6 sm:text-left">
            <p className="text-sm leading-relaxed text-gray-400">
              Ищете надёжного механика в гмине Шамотулы и рядом с Jastrowo? Car Service Nikol выполняет
              компьютерную диагностику, ремонт ходовой и тормозов, замену масла и фильтров, шиномонтаж,
              замену ремня и цепи ГРМ, программирование и изготовление ключей, а также выезд мастера и помощь
              на дороге. Перед началом работ согласуем объём и стоимость — без сюрпризов в счёте.
            </p>
            <p className="text-sm leading-relaxed text-gray-400">
              Мы специализируемся на легковых автомобилях распространённых марок (BMW, VW, Audi, Toyota и др.)
              и понимаем, что в будни машина нужна на работу: поэтому принимаем клиентов в субботу и воскресенье,
              когда многие сервисы в регионе не работают. Удобный подъезд из Шамотул, Jastrowo и соседних
              населённых пунктов — адрес: ul. Wernisażowa 21, 64-500 Jastrowo.
            </p>
            <p className="text-sm leading-relaxed text-gray-400">
              Запишитесь онлайн через форму на сайте, позвоните или напишите в WhatsApp и Telegram — подберём
              время визита и ответим на вопросы по ремонту, ориентировочной цене и запчастям. Car Service Nikol —
              ваш контактный автосервис в Jastrowo для жителей gminy Szamotuły и окрестностей.
            </p>
          </div>
        </footer>
      )}
    </>
  );
}
