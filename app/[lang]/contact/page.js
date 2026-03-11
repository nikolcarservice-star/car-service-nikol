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
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <Breadcrumbs
            items={[
              { label: lang === 'ru' ? 'Главная' : 'Strona główna', href: basePath },
              { label: lang === 'ru' ? 'Контакт' : 'Kontakt' },
            ]}
          />

          <div className="mb-8 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-orange-400" />
            <h1 className="text-2xl font-semibold tracking-tight text-gray-50 sm:text-3xl">
              {lang === 'ru'
                ? 'Контакт и как нас найти'
                : 'Kontakt i jak do nas trafić'}
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            {/* Left column: contact info + schedule + CTAs */}
            <div className="space-y-6">
              <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
                {lang === 'ru'
                  ? 'Звоните, пишите в мессенджеры или оставляйте заявку через форму — ответим и подскажем удобное время визита.'
                  : 'Zadzwoń, napisz na komunikator lub skorzystaj z formularza – doradzimy i zaproponujemy dogodny termin wizyty.'}
              </p>

              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  {t.location.addressLabel}
                </p>
                <p className="mt-1 text-gray-100">{t.location.addressValue}</p>
                <p className="mt-1 text-[11px] text-gray-400">{t.location.mapNote}</p>
              </div>

              {/* Schedule with Sunday highlight */}
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-5 sm:p-6">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  <CalendarDays className="h-4 w-4 text-orange-400" />
                  {t.footer.scheduleTitle}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-gray-200">
                  {t.footer.saturday && (
                    <li>{t.footer.saturday}</li>
                  )}
                  {t.footer.sunday && (
                    <li className="flex flex-wrap items-center gap-2 rounded-xl border-2 border-emerald-500/50 bg-emerald-500/10 px-3 py-2 font-semibold text-emerald-200">
                      {t.footer.sunday}
                    </li>
                  )}
                </ul>
                <p className="mt-3 text-sm font-medium text-emerald-400">
                  {t.location.scheduleSundayHighlight}
                </p>
              </div>

              {/* Trust phrase */}
              <p className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-medium text-orange-200">
                {t.location.trustPhrase}
              </p>

              {/* Large CTA buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={`tel:${PHONE_RAW}`}
                  className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-400 hover:to-amber-400 hover:shadow-orange-500/40"
                  title={lang === 'ru' ? 'Позвонить' : 'Zadzwoń'}
                >
                  <Phone className="h-6 w-6 shrink-0" />
                  <span>{PHONE_DISPLAY}</span>
                </a>
                <a
                  href={`https://wa.me/${PHONE_RAW}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-3 rounded-xl bg-[#25D366] px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#20bd5a]"
                >
                  <Send className="h-6 w-6 shrink-0" />
                  <span>{t.location.whatsapp}</span>
                </a>
                <a
                  href="https://t.me/+48794935734"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-3 rounded-xl border-2 border-slate-600 bg-slate-800 px-6 py-4 text-base font-bold text-gray-100 transition hover:border-orange-500 hover:bg-slate-700 hover:text-orange-300"
                >
                  <Send className="h-6 w-6 shrink-0 text-sky-400" />
                  <span>{t.location.telegram}</span>
                </a>
              </div>
            </div>

            {/* Right column: booking form */}
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/50 p-5 sm:p-6">
              <BookingForm lang={lang} embed />
            </div>
          </div>
        </div>
      </section>

      {/* Full-width Google Maps */}
      <section className="border-b border-slate-800 bg-slate-950" aria-label={lang === 'ru' ? 'Карта' : 'Mapa'}>
        <div className="w-full">
          <iframe
            title={lang === 'ru' ? 'Карта – адрес сервиса' : 'Mapa – adres serwisu'}
            src={MAP_EMBED_URL}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[320px] w-full sm:h-[400px]"
          />
        </div>
      </section>
    </>
  );
}
