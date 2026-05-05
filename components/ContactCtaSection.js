import { Phone, Send } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_TEL_HREF } from '../constants/translations';
import { WHATSAPP_HREF } from '../constants/contactLinks';
import BookingForm from './BookingForm';

export default function ContactCtaSection({ lang, t, id }) {
  const bc = t?.bookingContact;
  const title = bc?.title ?? (lang === 'ru' ? 'Записаться в сервис' : 'Umów wizytę');
  const subtitle =
    bc?.subtitle ??
    (lang === 'ru'
      ? 'Позвоните или напишите в WhatsApp — подскажем по услуге и согласуем удобное время визита.'
      : 'Zadzwoń lub napisz na WhatsApp — podpowiemy w sprawie usługi i ustalimy dogodny termin wizyty.');
  const badge = bc?.badge ?? (lang === 'ru' ? 'Запись' : 'Zapis');

  return (
    <section id={id} className="border-b border-slate-800 bg-slate-950" aria-label={title}>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
          <div>
            <span className="inline-block rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-400">
              {badge}
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">{subtitle}</p>
          </div>

          <div className="flex flex-col gap-4">
            <a
              href={PHONE_TEL_HREF}
              className="group inline-flex min-h-[54px] items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-6 py-4 text-base font-bold text-white shadow-xl shadow-orange-500/25 ring-2 ring-orange-400/20 transition hover:scale-[1.02] hover:from-orange-400 hover:to-amber-400 hover:shadow-orange-500/35 hover:ring-orange-400/40"
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
              className="group inline-flex min-h-[54px] items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-4 text-base font-bold text-white shadow-xl shadow-[#25D366]/25 transition hover:scale-[1.02] hover:bg-[#20bd5a] hover:shadow-[#25D366]/35"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                <Send className="h-5 w-5" />
              </span>
              <span>{lang === 'ru' ? 'Написать в WhatsApp' : 'Napisz na WhatsApp'}</span>
            </a>
          </div>
        </div>

        {bc?.form ? (
          <div className="mt-10 max-w-2xl lg:max-w-none">
            <BookingForm lang={lang} strings={bc.form} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
