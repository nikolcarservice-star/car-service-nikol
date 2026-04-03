'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  ImagePlus,
  Loader2,
  MessageSquare,
  Phone,
  Shield,
  Wrench,
  X,
} from 'lucide-react';
import { WHATSAPP_HREF } from '../constants/contactLinks';
import { LANGUAGES, PHONE_DISPLAY, translations } from '../constants/translations';
import { parseCalculatorServiceIds, buildCalculatorBookingLine } from '../data/serviceCalculator';

const GA_FORM_CATEGORY = 'booking_form';

const MAX_PHOTO_FILES = 3;
const MAX_PHOTO_BYTES = 1_500_000;

function localISODate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function preferredTimeLabel(val, t) {
  if (val === 'morning') return t.timeMorning;
  if (val === 'afternoon') return t.timeAfternoon;
  return t.timeAny;
}

function trackFormEvent(action, label = '') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: GA_FORM_CATEGORY,
      event_label: label,
    });
  }
}

function getBookingServiceLabel(serviceItem, lang) {
  if (lang === LANGUAGES.RU && serviceItem.nameRu) return serviceItem.nameRu;
  return serviceItem.name;
}

export default function BookingForm({ lang, embed }) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [submitErrorDetail, setSubmitErrorDetail] = useState('');
  const [notifyNotDelivered, setNotifyNotDelivered] = useState(false);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoError, setPhotoError] = useState('');
  const dateInputRef = useRef(null);
  const photosInputRef = useRef(null);
  const searchParams = useSearchParams();
  const t = translations[lang].booking;
  const todayIso = useMemo(() => localISODate(), []);
  /** Tylko najbliższe terminy weekendowe (sob.–niedz.) — zgodnie z profilem serwisu. */
  const quickDates = useMemo(() => {
    const out = [];
    const loc = lang === LANGUAGES.RU ? 'ru-RU' : 'pl-PL';
    const fmt = new Intl.DateTimeFormat(loc, { weekday: 'short', day: 'numeric', month: 'short' });
    const start = new Date();
    start.setHours(12, 0, 0, 0);
    const todayIso = localISODate(start);
    const maxWeekendSlots = 8;
    const maxDaysScan = 70;

    for (let dayOffset = 0; dayOffset < maxDaysScan && out.length < maxWeekendSlots; dayOffset++) {
      const d = new Date(start);
      d.setDate(start.getDate() + dayOffset);
      const wd = d.getDay();
      if (wd !== 0 && wd !== 6) continue;
      const iso = localISODate(d);
      let label = fmt.format(d);
      if (iso === todayIso) {
        label = lang === LANGUAGES.RU ? 'Сегодня' : 'Dziś';
      }
      out.push({ iso, label });
    }
    return out;
  }, [lang]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      car: '',
      service: '',
      date: '',
      preferredTime: 'any',
      message: '',
    },
  });

  const readFileAsAttachment = (file) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => {
        const res = r.result;
        const data = typeof res === 'string' ? res.replace(/^data:[^;]+;base64,/, '') : '';
        resolve({ name: file.name.slice(0, 120), type: file.type || 'image/jpeg', data });
      };
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  const onSubmit = async (values) => {
    setPhotoError('');
    setSubmitErrorDetail('');
    setNotifyNotDelivered(false);
    setStatus('loading');
    trackFormEvent('form_submit');
    const phoneFull = values.phone.replace(/\D/g, '').length > 0 ? '+48' + values.phone.replace(/\D/g, '') : '';
    try {
      const attachments = [];
      for (const f of photoFiles) {
        if (!f.type.startsWith('image/')) {
          setPhotoError(t.photoWrongType);
          setStatus('idle');
          return;
        }
        if (f.size > MAX_PHOTO_BYTES) {
          setPhotoError(t.photoTooBig);
          setStatus('idle');
          return;
        }
        attachments.push(await readFileAsAttachment(f));
      }

      const payload = {
        source: 'car-service-nikol-booking',
        name: values.name,
        phone: phoneFull || values.phone,
        car: values.car,
        service: values.service,
        date: values.date,
        message: values.message,
        preferredTime: preferredTimeLabel(values.preferredTime, t),
        attachments,
        lang: lang === LANGUAGES.RU ? 'ru' : 'pl',
        createdAt: new Date().toISOString(),
      };

      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (typeof window !== 'undefined') {
        console.info('[booking] POST /api/booking →', {
          ok: data.ok,
          telegramSent: data.telegramSent,
          status: res.status,
        });
      }

      if (!res.ok) {
        setSubmitErrorDetail(typeof data.error === 'string' ? data.error : '');
        throw new Error(data.error || 'booking failed');
      }

      setNotifyNotDelivered(data.telegramSent === false);
      if (data.telegramSent === false && typeof window !== 'undefined') {
        console.warn(
          '[booking] Powiadomienie nie wyszło (telegramSent=false). Otwórz w nowej karcie: /api/booking — sprawdź hasToken / tokenLength. Na Vercel: Environment Variables → Production → TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID → Redeploy.'
        );
      }

      setStatus('success');
      trackFormEvent('form_success');
      setPhotoFiles([]);
      if (photosInputRef.current) photosInputRef.current.value = '';
      reset({
        name: '',
        phone: '',
        car: '',
        service: '',
        date: '',
        preferredTime: 'any',
        message: '',
      });
    } catch (e) {
      console.error(e);
      setStatus('error');
      trackFormEvent('form_error');
    }
  };

  const addPhotos = (list) => {
    setPhotoError('');
    const next = [...photoFiles];
    for (const f of list) {
      if (next.length >= MAX_PHOTO_FILES) break;
      if (!f.type.startsWith('image/')) {
        setPhotoError(t.photoWrongType);
        return;
      }
      if (f.size > MAX_PHOTO_BYTES) {
        setPhotoError(t.photoTooBig);
        return;
      }
      next.push(f);
    }
    setPhotoFiles(next);
  };

  const phonePattern = /^\d{3}\s?\d{3}\s?\d{3}$/;
  const dateRegister = register('date', { required: t.validation.dateRequired });
  const serviceRegister = register('service', { required: t.validation.serviceRequired });
  const servicesList = translations[lang].services.list;
  const selectedService = watch('service');
  const preferredTimeValue = watch('preferredTime');
  const [serviceOpen, setServiceOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const timeDropdownRef = useRef(null);

  useEffect(() => {
    if (!timeOpen) return;
    const onDocMouseDown = (e) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(e.target)) {
        setTimeOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [timeOpen]);
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const multi = searchParams.get('services');
    if (multi) {
      const ids = parseCalculatorServiceIds(multi);
      if (ids.length > 0) {
        const cp = searchParams.get('calc_parts');
        const partsMode = cp === 'workshop' ? 'workshop' : cp === 'own' ? 'own' : null;
        const line = buildCalculatorBookingLine(ids, lang, partsMode);
        setValue('service', line, { shouldValidate: true });
        const bid = translations[lang].bookingId;
        const id = window.requestAnimationFrame(() => {
          document.getElementById(bid)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return () => window.cancelAnimationFrame(id);
      }
    }

    const key = searchParams.get('service');
    if (!key) return;
    const item = servicesList.find((s) => s.key === key);
    if (!item) return;
    setValue('service', getBookingServiceLabel(item, lang), { shouldValidate: true });
    const bid = translations[lang].bookingId;
    const id = window.requestAnimationFrame(() => {
      document.getElementById(bid)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => window.cancelAnimationFrame(id);
  }, [searchParams, servicesList, lang, setValue]);

  const inputBase =
    'w-full rounded-xl border border-slate-600/80 bg-slate-800/50 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30';

  const formContent = (
    <motion.form
            lang={lang === LANGUAGES.RU ? 'ru' : 'pl'}
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

                  {/* Custom styled dropdown (bez natywnego selecta) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setServiceOpen((open) => !open)}
                      className="flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl border border-slate-600/80 bg-slate-800/60 px-4 py-3 text-left text-sm text-gray-100 shadow-inner transition hover:border-orange-500 focus:outline-none focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/30"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex items-center justify-center rounded-lg bg-slate-800/80 px-2 py-1 text-orange-400">
                          <Wrench className="h-4 w-4 shrink-0" />
                        </span>
                        <span className={selectedService ? '' : 'text-gray-500'}>
                          {selectedService || t.servicePlaceholder}
                        </span>
                      </span>
                      <span className="text-xs text-gray-400">▼</span>
                    </button>
                    {serviceOpen && (
                      <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900/95 text-sm text-gray-100 shadow-xl">
                        <button
                          type="button"
                          className="block w-full px-4 py-2 text-left text-gray-400 hover:bg-slate-800"
                          onClick={() => {
                            setValue('service', '', { shouldValidate: true });
                            setServiceOpen(false);
                          }}
                        >
                          {t.servicePlaceholder}
                        </button>
                        <div className="h-px bg-slate-800" />
                        {servicesList.map((service) => (
                          <button
                            key={service.key}
                            type="button"
                            className="block w-full px-4 py-2 text-left hover:bg-slate-800"
                            onClick={() => {
                              setValue('service', getBookingServiceLabel(service, lang), { shouldValidate: true });
                              setServiceOpen(false);
                            }}
                          >
                            {getBookingServiceLabel(service, lang)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.service && (
                    <p className="text-xs text-red-400">{errors.service.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-5 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    {t.dateLabel}
                  </label>
                  {t.dateQuickHint && (
                    <p className="text-[11px] leading-relaxed text-gray-500 sm:text-xs">{t.dateQuickHint}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {quickDates.map(({ iso, label }) => (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => setValue('date', iso, { shouldValidate: true })}
                        className="rounded-lg border border-slate-600/90 bg-slate-800/70 px-3 py-1.5 text-xs font-medium text-gray-200 transition hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-200"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="relative flex overflow-hidden rounded-xl border border-slate-600/80 bg-slate-800/60 shadow-inner transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/30">
                    <input
                      type="date"
                      min={todayIso}
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
                  {t.calendarHelp && (
                    <p className="text-[11px] leading-relaxed text-gray-500 sm:text-xs">{t.calendarHelp}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    {t.timePreferenceLabel}
                  </label>
                  <input type="hidden" {...register('preferredTime')} />
                  <div ref={timeDropdownRef} className="relative">
                    <button
                      type="button"
                      id="preferred-time-trigger"
                      aria-haspopup="listbox"
                      aria-expanded={timeOpen}
                      onClick={() => setTimeOpen((o) => !o)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-600/80 bg-slate-800/60 px-4 py-3 text-left text-sm text-gray-100 shadow-inner transition hover:border-orange-500/70 focus:outline-none focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/30"
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-orange-400 ring-1 ring-orange-500/20">
                          <Clock className="h-4 w-4 shrink-0" aria-hidden />
                        </span>
                        <span className="truncate">
                          {preferredTimeLabel(preferredTimeValue, t)}
                        </span>
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-orange-400/80 transition ${timeOpen ? 'rotate-180' : ''}`}
                        aria-hidden
                      />
                    </button>
                    {timeOpen && (
                      <ul
                        role="listbox"
                        aria-labelledby="preferred-time-trigger"
                        className="absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-orange-500/25 bg-slate-900/98 py-1 text-sm shadow-xl ring-1 ring-slate-700/60 backdrop-blur-sm"
                      >
                        {[
                          { value: 'any', label: t.timeAny },
                          { value: 'morning', label: t.timeMorning },
                          { value: 'afternoon', label: t.timeAfternoon },
                        ].map(({ value, label }) => {
                          const active = preferredTimeValue === value;
                          return (
                            <li key={value} role="presentation">
                              <button
                                type="button"
                                role="option"
                                aria-selected={active}
                                className={`w-full px-4 py-2.5 text-left transition ${
                                  active
                                    ? 'bg-orange-500/20 text-orange-100'
                                    : 'text-gray-200 hover:bg-slate-800/90 hover:text-orange-100'
                                }`}
                                onClick={() => {
                                  setValue('preferredTime', value, { shouldValidate: true });
                                  setTimeOpen(false);
                                }}
                              >
                                {label}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    {t.photosLabel}
                  </label>
                  {t.photosHint && (
                    <p className="text-[11px] leading-relaxed text-gray-500 sm:text-xs">{t.photosHint}</p>
                  )}
                  <input
                    ref={photosInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="sr-only"
                    tabIndex={-1}
                    onChange={(e) => {
                      addPhotos(Array.from(e.target.files || []));
                      e.target.value = '';
                    }}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => photosInputRef.current?.click()}
                      disabled={photoFiles.length >= MAX_PHOTO_FILES}
                      className="inline-flex items-center gap-2 rounded-xl border border-dashed border-orange-500/50 bg-slate-800/40 px-4 py-2.5 text-sm font-medium text-orange-200 transition hover:border-orange-400 hover:bg-orange-500/10 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <ImagePlus className="h-4 w-4 shrink-0" aria-hidden />
                      {lang === LANGUAGES.RU ? 'Добавить фото' : 'Dodaj zdjęcia'}
                    </button>
                    <span className="text-[11px] text-gray-500">
                      {photoFiles.length}/{MAX_PHOTO_FILES}
                    </span>
                  </div>
                  {photoFiles.length > 0 && (
                    <ul className="flex flex-wrap gap-2 pt-1">
                      {photoFiles.map((f, idx) => (
                        <li
                          key={`${f.name}-${idx}`}
                          className="flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800/80 py-1 pl-2 pr-1 text-xs text-gray-200"
                        >
                          <span className="max-w-[140px] truncate">{f.name}</span>
                          <button
                            type="button"
                            onClick={() => setPhotoFiles((prev) => prev.filter((_, i) => i !== idx))}
                            className="rounded-md p-1 text-gray-400 hover:bg-slate-700 hover:text-white"
                            aria-label={t.photoRemove}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {photoError && <p className="text-xs text-red-400">{photoError}</p>}
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
                      href={WHATSAPP_HREF}
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
                <div className="mt-5 space-y-3">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
                  >
                    <p className="font-semibold">{t.successTitle}</p>
                    <p className="mt-1 text-emerald-200/90">{t.successBody}</p>
                  </motion.div>
                  {notifyNotDelivered && t.notifyNotDelivered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-amber-500/45 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
                    >
                      {t.notifyNotDelivered}
                    </motion.div>
                  )}
                </div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                >
                  <p>{t.errorMessage}</p>
                  {submitErrorDetail && (
                    <p className="mt-2 text-xs text-red-300/90 break-words">{submitErrorDetail}</p>
                  )}
                </motion.div>
              )}
            </div>
          </motion.form>
  );

  if (embed) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-50 sm:text-xl">{t.title}</h2>
        <p className="text-sm text-gray-400">{t.subtitle}</p>
        {formContent}
      </div>
    );
  }

  return (
    <section
      id={translations[lang].bookingId}
      className="relative overflow-hidden border-b border-slate-800 bg-slate-950"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(249,115,22,0.06),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
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
          {formContent}
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
