'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarCheck, Loader2 } from 'lucide-react';

export default function BookingForm({ lang, copy, serviceOptions = [] }) {
  const [status, setStatus] = useState('idle');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      service: '',
      message: '',
      website: '',
    },
  });

  const onSubmit = async (data) => {
    setStatus('sending');
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          name: data.name,
          phone: data.phone,
          email: data.email,
          service: data.service,
          message: data.message,
          website: data.website,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (res.ok && payload.ok) {
        setStatus('success');
        reset();
        return;
      }
      if (payload.error === 'not_configured') {
        setStatus('not_configured');
        return;
      }
      setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  const f = copy || {};
  const inputClass =
    'mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/80 px-3 py-2.5 text-[15px] text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500';
  const labelClass = 'text-sm font-medium text-slate-200';

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/40 p-5 shadow-xl ring-1 ring-white/5 sm:p-6">
      <div className="mb-4 flex items-center gap-2 text-orange-300">
        <CalendarCheck className="h-5 w-5 shrink-0" aria-hidden />
        <h3 className="text-base font-bold text-white">{f.formTitle}</h3>
      </div>

      {status === 'success' && (
        <p
          className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-200"
          role="status"
        >
          {f.success}
        </p>
      )}
      {status === 'not_configured' && (
        <p
          className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-sm text-amber-100"
          role="alert"
        >
          {f.notConfigured}
        </p>
      )}
      {status === 'error' && (
        <p className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-sm text-red-200" role="alert">
          {f.errorGeneric}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <input type="text" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden {...register('website')} />

        <div>
          <label htmlFor="booking-name" className={labelClass}>
            {f.nameLabel}
          </label>
          <input
            id="booking-name"
            type="text"
            autoComplete="name"
            className={inputClass}
            {...register('name', {
              required: f.errName,
              minLength: { value: 2, message: f.errName },
              maxLength: { value: 120, message: f.errName },
            })}
          />
          {(errors.name?.message || errors.name) && (
            <p className="mt-1 text-xs text-red-400">{errors.name?.message || f.errName}</p>
          )}
        </div>

        <div>
          <label htmlFor="booking-phone" className={labelClass}>
            {f.phoneLabel}
          </label>
          <input
            id="booking-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className={inputClass}
            {...register('phone', {
              required: f.errPhone,
              validate: (v) => {
                const n = String(v || '').replace(/\D/g, '');
                return n.length >= 9 || f.errPhone;
              },
            })}
          />
          {(errors.phone?.message || errors.phone) && (
            <p className="mt-1 text-xs text-red-400">{errors.phone?.message || f.errPhone}</p>
          )}
        </div>

        <div>
          <label htmlFor="booking-email" className={labelClass}>
            {f.emailLabel}{' '}
            <span className="font-normal text-slate-500">({f.emailOptional})</span>
          </label>
          <input
            id="booking-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            {...register('email', {
              validate: (v) => {
                const t = String(v || '').trim();
                if (!t) return true;
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) || f.errEmail;
              },
            })}
          />
          {(errors.email?.message || errors.email) && (
            <p className="mt-1 text-xs text-red-400">{errors.email?.message || f.errEmail}</p>
          )}
        </div>

        <div>
          <label htmlFor="booking-service" className={labelClass}>
            {f.serviceLabel}
          </label>
          <select id="booking-service" className={`${inputClass} cursor-pointer`} {...register('service')}>
            <option value="">{f.serviceNone}</option>
            {serviceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="booking-message" className={labelClass}>
            {f.messageLabel}
          </label>
          <textarea
            id="booking-message"
            rows={4}
            className={`${inputClass} resize-y min-h-[100px]`}
            placeholder={f.messagePlaceholder}
            {...register('message', { maxLength: 2000 })}
          />
        </div>

        <p className="text-[11px] leading-relaxed text-slate-500">{f.privacyNote}</p>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="flex w-full min-h-[52px] touch-manipulation items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-3 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'sending' ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              {f.sending}
            </>
          ) : (
            f.submit
          )}
        </button>
      </form>
    </div>
  );
}
