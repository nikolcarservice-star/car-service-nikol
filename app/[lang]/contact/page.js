import { MapPin, Phone, Send } from 'lucide-react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import BookingForm from '../../../components/BookingForm';
import LocationSection from '../../../components/LocationSection';
import { getTranslations, normalizeLang, PHONE_DISPLAY, PHONE_RAW } from '../../../constants/translations';

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

          <div className="mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-orange-400" />
            <h1 className="text-2xl font-semibold tracking-tight text-gray-50 sm:text-3xl">
              {lang === 'ru'
                ? 'Контакт и как нас найти'
                : 'Kontakt i jak do nas trafić'}
            </h1>
          </div>

          <div className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-gray-200 sm:p-6 sm:text-sm">
              <p>
                {lang === 'ru'
                  ? 'Звоните, пишите в мессенджеры или оставляйте заявку через форму — ответим и подскажем удобное время визита.'
                  : 'Zadzwoń, napisz na komunikator lub skorzystaj z formularza – doradzimy i zaproponujemy dogodny termin wizyty.'}
              </p>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  {t.location.addressLabel}
                </p>
                <p className="text-gray-100">{t.location.addressValue}</p>
                <p className="text-[11px] text-gray-400">{t.location.mapNote}</p>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  {lang === 'ru' ? 'Телефон' : 'Telefon'}
                </p>
                <a
                  href={`tel:${PHONE_DISPLAY.replace(/[^+\d]/g, '')}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-300 hover:text-orange-200"
                >
                  <Phone className="h-4 w-4" />
                  <span>{PHONE_DISPLAY}</span>
                </a>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  WhatsApp / Telegram
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/${PHONE_RAW}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md hover:bg-emerald-400"
                  >
                    <Send className="h-4 w-4" />
                    <span>{t.location.whatsapp}</span>
                  </a>
                  <a
                    href="https://t.me/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-semibold text-gray-100 shadow-md hover:border-orange-500 hover:text-orange-300"
                  >
                    <Send className="h-4 w-4 text-orange-400" />
                    <span>{t.location.telegram}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <LocationSection lang={lang} />
            </div>
          </div>
        </div>
      </section>

      <BookingForm lang={lang} />
    </>
  );
}

