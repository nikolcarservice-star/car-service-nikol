import { Suspense } from 'react';
import { CalendarDays, MapPin, Phone, Send } from 'lucide-react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { GOOGLE_BUSINESS_PROFILE_URL, GOOGLE_MAPS_EMBED_URL } from '../../../constants/googleBusiness';
import { TELEGRAM_HREF, WHATSAPP_HREF } from '../../../constants/contactLinks';
import {
  getTranslations,
  normalizeLang,
  PHONE_CONTACT_ANCHOR_ID,
  PHONE_DISPLAY,
  PHONE_TEL_HREF,
} from '../../../constants/translations';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoserwis-nikol.pl';

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  const canonical = `/${lang}/contact`;
  const languages = { pl: `${SITE_URL}/pl/contact`, ru: `${SITE_URL}/ru/contact` };

  const ogImage = { url: '/images/services/mechanic-changing-tires-car-service.jpg', width: 1200, height: 630 };

  if (lang === 'ru') {
    const title = 'Контакты — Jastrowo, в Шамотулах | Car Service Nikol | Адрес и запись';
    const description =
      'Контакт с Car Service Nikol: адрес ул. Wernisażowa 21, Jastrowo, телефон, WhatsApp и Telegram. Обслуживаем клиентов из Jastrowo, Шамотул и окрестностей. Работаем в воскресенье.';
    return {
      title,
      description,
      keywords: 'контакты Car Service Nikol, адрес Jastrowo, телефон автосервиса, запись в сервис, Шамотулы',
      alternates: { canonical, languages },
      openGraph: {
        type: 'website',
        locale: 'ru_RU',
        alternateLocale: 'pl_PL',
        url: `${SITE_URL}${canonical}`,
        siteName: 'Car Service Nikol',
        title,
        description,
        images: [{ ...ogImage, alt: 'Car Service Nikol – контакты, Jastrowo' }],
      },
      twitter: { card: 'summary_large_image', title, description },
    };
  }

  const title = 'Kontakt — Jastrowo, w Szamotułach | Car Service Nikol | Adres i wizyta';
  const description =
    'Skontaktuj się z Car Service Nikol: Jastrowo (ul. Wernisażowa 21), obsługa kierowców z Szamotuł i okolic. Telefon, WhatsApp i Telegram. Otwarte w niedziele.';
  return {
    title,
    description,
    keywords: 'kontakt Car Service Nikol, adres Jastrowo, telefon serwis, umów wizytę, Szamotuły',
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      locale: 'pl_PL',
      alternateLocale: 'ru_RU',
      url: `${SITE_URL}${canonical}`,
      siteName: 'Car Service Nikol',
      title,
      description,
      images: [{ ...ogImage, alt: 'Car Service Nikol – kontakt, Jastrowo' }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function ContactPage({ params }) {
  const lang = normalizeLang(params.lang);
  const t = getTranslations(lang);
  const basePath = `/${lang}`;

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(249,115,22,0.08),transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:py-12">
          <Breadcrumbs
            items={[
              { label: lang === 'ru' ? 'Главная' : 'Strona główna', href: basePath },
              { label: lang === 'ru' ? 'Контакт' : 'Kontakt' },
            ]}
          />

          <div className="mb-10">
            <span className="inline-block rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-400">
              {lang === 'ru' ? 'Контакт' : 'Kontakt'}
            </span>
            <h1 className="mt-4 flex items-center gap-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30">
                <MapPin className="h-6 w-6" />
              </span>
              {lang === 'ru'
                ? 'Контакт — Jastrowo, в Шамотулах'
                : 'Kontakt — Jastrowo, w Szamotułach'}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
              {lang === 'ru'
                ? 'Звоните или пишите в мессенджеры — ответим и подскажем удобное время визита.'
                : 'Zadzwoń lub napisz na komunikator – doradzimy i zaproponujemy dogodny termin wizyty.'}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            {/* Left column: contact info + schedule + CTAs */}
            <div className="space-y-6">
              {/* Address card */}
              <div className="group relative overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-900/90 to-slate-900/60 p-6 shadow-xl shadow-black/20 ring-1 ring-slate-700/50 transition hover:border-slate-600/80 hover:ring-orange-500/20">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-orange-400 ring-1 ring-slate-700">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                      {t.location.addressLabel}
                    </p>
                    <p className="mt-2 text-lg font-medium text-white">{t.location.addressValue}</p>
                    <p className="mt-1.5 text-sm text-gray-400">{t.location.mapNote}</p>
                  </div>
                </div>
              </div>

              {/* Schedule with Sunday highlight */}
              <div className="group relative overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-900/90 to-slate-900/60 p-6 shadow-xl shadow-black/20 ring-1 ring-slate-700/50 transition hover:border-slate-600/80">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
                <div className="flex items-center gap-2">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-orange-400 ring-1 ring-slate-700">
                    <CalendarDays className="h-5 w-5" />
                  </span>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    {t.footer.scheduleTitle}
                  </p>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-gray-200">
                  {t.footer.saturday && (
                    <li className="rounded-lg bg-slate-800/50 px-3 py-2 font-medium">
                      {t.footer.saturday}
                    </li>
                  )}
                  {t.footer.sunday && (
                    <li className="rounded-xl border-2 border-emerald-500/60 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 px-4 py-3 font-semibold text-emerald-100 shadow-lg shadow-emerald-500/10">
                      {t.footer.sunday}
                    </li>
                  )}
                </ul>
                <p className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  {t.location.scheduleSundayHighlight}
                </p>
              </div>

              {/* Trust phrase */}
              <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/15 to-amber-500/10 px-5 py-4 shadow-lg shadow-orange-500/5">
                <p className="flex items-center gap-3 text-sm font-semibold text-orange-200 sm:text-base">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
                    <MapPin className="h-5 w-5" />
                  </span>
                  {t.location.trustPhrase}
                </p>
              </div>

              {/* Large CTA buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <a
                  id={PHONE_CONTACT_ANCHOR_ID}
                  href={PHONE_TEL_HREF}
                  className="group inline-flex min-h-[52px] min-w-[52px] items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-6 py-4 text-base font-bold text-white shadow-xl shadow-orange-500/25 ring-2 ring-orange-400/20 transition hover:scale-[1.02] hover:from-orange-400 hover:to-amber-400 hover:shadow-orange-500/35 hover:ring-orange-400/40"
                  title={lang === 'ru' ? 'Позвонить' : 'Zadzwoń'}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                    <Phone className="h-5 w-5" />
                  </span>
                  <span>{PHONE_DISPLAY}</span>
                </a>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex min-h-[52px] min-w-[52px] items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-4 text-base font-bold text-white shadow-xl shadow-[#25D366]/25 transition hover:scale-[1.02] hover:bg-[#20bd5a] hover:shadow-[#25D366]/35"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                    <Send className="h-5 w-5" />
                  </span>
                  <span>{t.location.whatsapp}</span>
                </a>
                <a
                  href={TELEGRAM_HREF}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex min-h-[52px] min-w-[52px] items-center justify-center gap-3 rounded-2xl border-2 border-slate-600 bg-slate-800/80 px-6 py-4 text-base font-bold text-gray-100 shadow-lg transition hover:scale-[1.02] hover:border-orange-500/60 hover:bg-slate-700/80 hover:text-orange-300 hover:shadow-orange-500/10"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/20">
                    <Send className="h-5 w-5 text-sky-400" />
                  </span>
                  <span>{t.location.telegram}</span>
                </a>
              </div>
            </div>

            {/* Right column: map (desktop), contact highlight */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-b from-slate-900/80 to-slate-900/50 p-6 shadow-2xl shadow-black/30 ring-1 ring-orange-500/10 sm:p-8">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500/80 via-orange-400 to-amber-500/80" />
              <Suspense fallback={<div className="min-h-[18rem]" aria-busy="true" />}>
                <div className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {lang === 'ru' ? 'Маршрут в Google Maps' : 'Trasa w Google Maps'}
                  </h2>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {lang === 'ru'
                      ? 'Откройте карту и постройте маршрут — адрес: ul. Wernisażowa 21, 64-500 Jastrowo.'
                      : 'Otwórz mapę i wyznacz trasę — adres: ul. Wernisażowa 21, 64-500 Jastrowo.'}
                  </p>
                  <iframe
                    title={lang === 'ru' ? 'Карта – адрес сервиса' : 'Mapa – adres serwisu'}
                    src={GOOGLE_MAPS_EMBED_URL}
                    width="100%"
                    height="320"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[280px] w-full rounded-2xl border border-slate-700/70 sm:h-[320px]"
                  />
                  <a
                    href={GOOGLE_BUSINESS_PROFILE_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-700/80 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-orange-300 transition hover:border-orange-500/60 hover:bg-slate-800/70"
                  >
                    {lang === 'ru'
                      ? 'Открыть профиль в Google (отзывы и маршрут)'
                      : 'Otwórz profil w Google (opinie i nawigacja)'}
                  </a>
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width Google Maps */}
      <section
        className="border-b border-slate-800 bg-slate-950"
        aria-label={lang === 'ru' ? 'Карта' : 'Mapa'}
      >
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:pt-10">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-200 sm:text-xl">
            <MapPin className="h-5 w-5 text-orange-400" />
            {lang === 'ru' ? 'Как нас найти' : 'Jak do nas trafić'}
          </h2>
        </div>
        <div className="mt-4 w-full overflow-hidden">
          <iframe
            title={lang === 'ru' ? 'Карта – адрес сервиса' : 'Mapa – adres serwisu'}
            src={GOOGLE_MAPS_EMBED_URL}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[320px] w-full sm:h-[420px]"
          />
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-4 text-sm">
          <a
            href={GOOGLE_BUSINESS_PROFILE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-orange-400 hover:text-orange-300"
          >
            {lang === 'ru'
              ? 'Открыть профиль Car Service Nikol в Google Maps (отзывы и маршрут)'
              : 'Otwórz profil Car Service Nikol w Google Maps (opinie i nawigacja)'}
          </a>
        </div>
      </section>
    </>
  );
}
