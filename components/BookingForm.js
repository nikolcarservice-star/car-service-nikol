'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Loader2, MessageSquare, Phone, Wrench } from 'lucide-react';
import { LANGUAGES, PHONE_DISPLAY, PHONE_RAW, translations } from '../constants/translations';

export default function BookingForm({ lang }) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const dateInputRef = useRef(null);
  const t = translations[lang].booking;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      car: '',
      service: '',
      date: '',
      message: '',
    },
  });

  const onSubmit = async (values) => {
    setStatus('loading');
    const phoneFull = values.phone.replace(/\D/g, '').length > 0 ? '+48' + values.phone.replace(/\D/g, '') : '';
    try {
      const payload = {
        source: 'car-service-nikol-booking',
        name: values.name,
        phone: phoneFull || values.phone,
        car: values.car,
        service: values.service,
        date: values.date,
        message: values.message,
        lang: lang === LANGUAGES.RU ? 'ru' : 'pl',
        createdAt: new Date().toISOString(),
      };

      await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setStatus('success');
      reset({
        name: '',
        phone: '',
        car: '',
        service: '',
        date: '',
        message: '',
      });
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  const phonePattern = /^\d{3}\s?\d{3}\s?\d{3}$/;
  const dateRegister = register('date', { required: t.validation.dateRequired });

  return (
    <section
      id={translations[lang].bookingId}
      className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-6 max-w-2xl"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-gray-50 sm:text-3xl">
            {t.title}
          </h2>
          <p className="mt-2 text-sm text-gray-300 sm:text-base">{t.subtitle}</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl sm:p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-200">{t.nameLabel}</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-100 outline-none ring-orange-500/0 transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40"
                  {...register('name', { required: t.validation.nameRequired })}
                />
                {errors.name && (
                  <p className="text-[11px] text-red-400">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-200">{t.phoneLabel}</label>
                <div className="flex overflow-hidden rounded-lg border border-slate-700 bg-slate-950 shadow-sm ring-orange-500/0 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/40">
                  <span className="flex items-center gap-2 border-r border-slate-700 bg-slate-800/80 px-3 py-2 text-sm font-medium text-orange-400">
                    <Phone className="h-4 w-4 shrink-0" />
                    +48
                  </span>
                  <input
                    type="tel"
                    placeholder="123 456 789"
                    className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-gray-100 placeholder-gray-500 outline-none"
                    {...register('phone', {
                      required: t.validation.phoneRequired,
                      pattern: { value: phonePattern, message: t.validation.phoneInvalid },
                    })}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-red-400">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-200">{t.carLabel}</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-100 outline-none ring-orange-500/0 transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40"
                  {...register('car', { required: t.validation.carRequired })}
                />
                {errors.car && (
                  <p className="text-[11px] text-red-400">{errors.car.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-200">{t.serviceLabel}</label>
                <div className="flex items-center gap-2">
                  <Wrench className="hidden h-4 w-4 text-orange-400 sm:block" />
                  <select
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-100 outline-none ring-orange-500/0 transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40"
                    defaultValue=""
                    {...register('service', { required: t.validation.serviceRequired })}
                  >
                    <option value="" disabled>
                      {t.servicePlaceholder}
                    </option>
                    {translations[lang].services.list.map((service) => (
                      <option key={service.key} value={service.name}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.service && (
                  <p className="text-[11px] text-red-400">{errors.service.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-200">{t.dateLabel}</label>
                <div className="relative flex overflow-hidden rounded-lg border border-slate-700 bg-slate-950 shadow-sm ring-orange-500/0 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/40">
                  <span className="flex items-center border-r border-slate-700 bg-slate-800/80 px-3 py-2 text-orange-400">
                    <Calendar className="h-4 w-4 shrink-0" />
                  </span>
                  <input
                    type="date"
                    className="min-w-0 flex-1 bg-transparent py-2 pl-3 pr-10 text-sm text-gray-100 outline-none [color-scheme:dark]"
                    {...dateRegister}
                    ref={(el) => {
                      dateRegister.ref(el);
                      dateInputRef.current = el;
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => dateInputRef.current?.showPicker?.()}
                    className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1.5 text-orange-400 transition hover:bg-slate-800 hover:text-orange-300"
                    title={lang === LANGUAGES.RU ? 'Открыть календарь' : 'Otwórz kalendarz'}
                    aria-label={lang === LANGUAGES.RU ? 'Открыть календарь' : 'Otwórz kalendarz'}
                  >
                    <Calendar className="h-5 w-5" />
                  </button>
                </div>
                {errors.date && (
                  <p className="text-[11px] text-red-400">{errors.date.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-200">{t.messageLabel}</label>
                <textarea
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-gray-100 outline-none ring-orange-500/0 transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40"
                  {...register('message')}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === 'loading' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                <span>{t.submitLabel}</span>
              </button>

              <div className="flex items-center gap-2 text-[11px] text-gray-400 sm:text-xs">
                <MessageSquare className="h-3.5 w-3.5 text-orange-400" />
                <p>
                  WhatsApp:&nbsp;
                  <a
                    href={`https://wa.me/${PHONE_RAW}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-300 hover:text-orange-200"
                  >
                    {PHONE_DISPLAY}
                  </a>
                </p>
              </div>
            </div>

            {status === 'success' && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                <p className="font-semibold">{t.successTitle}</p>
                <p className="mt-1">{t.successBody}</p>
              </div>
            )}
            {status === 'error' && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {t.errorMessage}
              </div>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-gray-300 sm:p-6 sm:text-sm"
          >
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-orange-400" />
              <p className="font-medium">
                {lang === LANGUAGES.RU
                  ? 'Также можете позвонить напрямую:'
                  : 'Możesz też zadzwonić bezpośrednio:'}{' '}
                <Link
                  href={`/${lang}/contact`}
                  className="text-orange-300 hover:text-orange-200"
                >
                  {PHONE_DISPLAY}
                </Link>
              </p>
            </div>
            <p>
              {lang === LANGUAGES.RU
                ? 'Работаем по предварительной записи. Если дата занята, предложим ближайший свободный термин.'
                : 'Pracujemy głównie na umówione wizyty. Jeśli wybrany termin będzie zajęty, zaproponujemy najbliższy możliwy.'}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

