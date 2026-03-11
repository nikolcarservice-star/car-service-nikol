import { CalendarDays, MapPin, Phone, Send } from 'lucide-react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import BookingForm from '../../../components/BookingForm';
import {
  getTranslations,
  normalizeLang,
  PHONE_DISPLAY,
  PHONE_RAW,
} from '../../../constants/translations';

const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2419.658250238475!2d16.5413491!3d52.5714312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470438d011197777%3A0x6b82504818617777!2sWernisa%C5%BCowa%2021%2C%2064-500%20Jastrowo!5e0!3m2!1spl!2spl!4v1710000000000!5m2!1spl!2spl';

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  if (lang === 'ru') {
    return {
      title: 'Контакты Car Service Nikol – Jastrowo, Шамотулы',
      description:
        'Контакт с Car Service Nikol: адрес, телефон, WhatsApp, Telegram и форма записи. Сервис в Jastrowo и окрестностях Шамотул.',
      alternates: { canonical: `/${lang}/contact` },
    };
  }

  return {
    title: 'Kontakt - Car Service Nikol Jastrowo, Szamotuły',
    description:
      'Skontaktuj się z Car Service Nikol w Jastrowo. Adres ul. Wernisażowa 21, telefon, WhatsApp, Telegram oraz formularz umówienia wizyty.',
    alternates: { canonical: `/${lang}/contact` },
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
                ? 'Контакт и как нас найти'
                : 'Kontakt i jak do nas trafić'}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
              {lang === 'ru'
                ? 'Звоните, пишите в мессенджеры или оставляйте заявку через форму — ответим и подскажем удобное время визита.'
                : 'Zadzwoń, napisz na komunikator lub skorzystaj z formularza – doradzimy i zaproponujemy dogodny termin wizyty.'}
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
                  href={`tel:${PHONE_RAW}`}
                  className="group inline-flex min-h-[52px] min-w-[52px] items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-6 py-4 text-base font-bold text-white shadow-xl shadow-orange-500/25 ring-2 ring-orange-400/20 transition hover:scale-[1.02] hover:from-orange-400 hover:to-amber-400 hover:shadow-orange-500/35 hover:ring-orange-400/40"
                  title={lang === 'ru' ? 'Позвонить' : 'Zadzwoń'}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                    <Phone className="h-5 w-5" />
                  </span>
                  <span>{PHONE_DISPLAY}</span>
                </a>
                <a
                  href={`https://wa.me/${PHONE_RAW}`}
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
                  href="https://t.me/+48794935734"
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

            {/* Right column: booking form */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-b from-slate-900/80 to-slate-900/50 p-6 shadow-2xl shadow-black/30 ring-1 ring-orange-500/10 sm:p-8">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500/80 via-orange-400 to-amber-500/80" />
              <BookingForm lang={lang} embed />
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
            src={MAP_EMBED_URL}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[320px] w-full sm:h-[420px]"
          />
        </div>
      </section>
    </>
  );
}
