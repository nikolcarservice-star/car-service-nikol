'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, Loader2, MessageSquare, Phone, Shield, Wrench } from 'lucide-react';
import { LANGUAGES, PHONE_DISPLAY, PHONE_RAW, translations } from '../constants/translations';

const GA_FORM_CATEGORY = 'booking_form';

function trackFormEvent(action, label = '') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: GA_FORM_CATEGORY,
      event_label: label,
    });
  }
}

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
    trackFormEvent('form_submit');
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
      trackFormEvent('form_success');
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
      trackFormEvent('form_error');
    }
  };

  const phonePattern = /^\d{3}\s?\d{3}\s?\d{3}$/;
  const dateRegister = register('date', { required: t.validation.dateRequired });

  const inputBase =
    'w-full rounded-xl border border-slate-600/80 bg-slate-800/50 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30';

  return (
    <section
      id={translations[lang].bookingId}
      className="relative overflow-hidden border-b border-slate-800 bg-slate-950"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(249,115,22,0.06),transparent)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-8 max-w-2xl"
        >
          <span className="inline-block rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-400">
            {lang === LANGUAGES.RU ? 'Запись' : 'Zapisz się'}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-400 sm:text-base">
            {t.subtitle}
          </p>
          {t.trustLine && (
            <p className="mt-2 flex items-center gap-2 text-xs font-medium text-orange-400/90 sm:text-sm">
              <Clock className="h-3.5 w-3.5" />
              {t.trustLine}
            </p>
          )}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* Form card */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-900/90 to-slate-900/70 shadow-2xl shadow-black/30 ring-1 ring-slate-700/50"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
            <div className="p-5 sm:p-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    className={inputBase}
                    placeholder={lang === LANGUAGES.RU ? 'Иван Иванов' : 'Jan Kowalski'}
                    {...register('name', { required: t.validation.nameRequired })}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    {t.phoneLabel}
                  </label>
                  <div className="flex overflow-hidden rounded-xl border border-slate-600/80 bg-slate-800/60 shadow-inner transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/30">
                    <span className="flex items-center gap-2 border-r border-slate-600/80 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-orange-400">
                      <Phone className="h-4 w-4 shrink-0" />
                      +48
                    </span>
                    <input
                      type="tel"
                      placeholder="123 456 789"
                      className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-gray-100 placeholder-gray-500 outline-none"
                      {...register('phone', {
                        required: t.validation.phoneRequired,
                        pattern: { value: phonePattern, message: t.validation.phoneInvalid },
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-400">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    {t.carLabel}
                  </label>
                  <input
                    type="text"
                    className={inputBase}
                    placeholder={lang === LANGUAGES.RU ? 'Марка, модель' : 'Marka, model'}
                    {...register('car', { required: t.validation.carRequired })}
                  />
                  {errors.car && (
                    <p className="text-xs text-red-400">{errors.car.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    {t.serviceLabel}
                  </label>
                  <div className="flex overflow-hidden rounded-xl border border-slate-600/80 bg-slate-800/60 shadow-inner transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/30">
                    <span className="flex items-center border-r border-slate-600/80 bg-slate-800/80 px-3 py-3 text-orange-400">
                      <Wrench className="h-4 w-4 shrink-0" />
                    </span>
                    <select
                      className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-gray-100 outline-none [color-scheme:dark]"
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
                    <p className="text-xs text-red-400">{errors.service.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_1.2fr]">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    {t.dateLabel}
                  </label>
                  <div className="relative flex overflow-hidden rounded-xl border border-slate-600/80 bg-slate-800/60 shadow-inner transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/30">
                    <input
                      type="date"
                      className="date-input min-w-0 flex-1 bg-transparent py-3 pl-4 pr-11 text-sm text-gray-100 outline-none [color-scheme:dark]"
                      {...dateRegister}
                      ref={(el) => {
                        dateRegister.ref(el);
                        dateInputRef.current = el;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => dateInputRef.current?.showPicker?.()}
                      className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-orange-400 transition hover:bg-slate-700/80 hover:text-orange-300"
                      title={lang === LANGUAGES.RU ? 'Открыть календарь' : 'Otwórz kalendarz'}
                      aria-label={lang === LANGUAGES.RU ? 'Открыть календарь' : 'Otwórz kalendarz'}
                    >
                      <Calendar className="h-5 w-5" />
                    </button>
                  </div>
                  {errors.date && (
                    <p className="text-xs text-red-400">{errors.date.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    {t.messageLabel}
                  </label>
                  <textarea
                    rows={3}
                    className={`${inputBase} resize-none`}
                    placeholder={lang === LANGUAGES.RU ? 'Кратко опишите проблему…' : 'Krótko opisz problem…'}
                    {...register('message')}
                  />
                </div>
              </div>

              {/* CTA block */}
              <div className="mt-7 flex flex-col gap-4 border-t border-slate-700/80 pt-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-7 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-400 hover:to-orange-500 hover:shadow-orange-500/35 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                    )}
                    <span>{t.submitLabel}</span>
                  </button>
                  {t.ctaSubtext && (
                    <p className="mt-2 text-xs text-gray-500">
                      {t.ctaSubtext}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-600/60 bg-slate-800/40 px-4 py-3">
                  <MessageSquare className="h-5 w-5 shrink-0 text-[#25D366]" />
                  <p className="text-xs text-gray-400">
                    {lang === LANGUAGES.RU ? 'Или напишите в' : 'Lub napisz na'}{' '}
                    <a
                      href={`https://wa.me/${PHONE_RAW}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[#25D366] hover:text-[#2ee56a]"
                    >
                      WhatsApp: {PHONE_DISPLAY}
                    </a>
                  </p>
                </div>
              </div>

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
                >
                  <p className="font-semibold">{t.successTitle}</p>
                  <p className="mt-1 text-emerald-200/90">{t.successBody}</p>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                >
                  {t.errorMessage}
                </motion.div>
              )}
            </div>
          </motion.form>

          {/* Sidebar trust card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-900/80 to-slate-900/50 p-5 shadow-xl ring-1 ring-slate-700/50 sm:p-6">
              <div className="flex items-center gap-2 text-orange-400">
                <Phone className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-wider">
                  {lang === LANGUAGES.RU ? 'Позвонить' : 'Zadzwoń'}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-300">
                {lang === LANGUAGES.RU
                  ? 'Также можете позвонить напрямую — подберём удобное время.'
                  : 'Możesz też zadzwonić bezpośrednio – dobierzemy dogodny termin.'}
              </p>
              <Link
                href={`/${lang}/contact`}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-3 text-base font-bold text-white transition hover:bg-slate-700 hover:text-orange-400"
              >
                <Phone className="h-4 w-4" />
                {PHONE_DISPLAY}
              </Link>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-5 sm:p-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="h-5 w-5 text-orange-400/80" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {lang === LANGUAGES.RU ? 'Как мы работаем' : 'Jak działamy'}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {lang === LANGUAGES.RU
                  ? 'Работаем по предварительной записи. Если выбранная дата занята, предложим ближайший свободный срок.'
                  : 'Pracujemy głównie na umówione wizyty. Jeśli wybrany termin będzie zajęty, zaproponujemy najbliższy możliwy.'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
