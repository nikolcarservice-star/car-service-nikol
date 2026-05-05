'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BookingForm({ lang, strings }) {
  const s = strings || {};
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [carModel, setCarModel] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const privacyHref = lang === 'ru' ? '/ru/privacy' : '/pl/privacy';

  async function onSubmit(e) {
    e.preventDefault();
    setMessage('');
    setStatus('sending');

    let pageUri = '';
    if (typeof window !== 'undefined') {
      pageUri = window.location.href;
    }

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname,
          email,
          phone,
          carModel,
          pageUri,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || s.error || 'Error');
        return;
      }

      setStatus('success');
      setFirstname('');
      setEmail('');
      setPhone('');
      setCarModel('');
      setMessage(s.success || '');
    } catch {
      setStatus('error');
      setMessage(s.error || 'Error');
    }
  }

  const disabled = status === 'sending';

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/40 p-5 sm:p-6">
      {s.formTitle ? (
        <p className="mb-4 text-sm font-medium text-gray-300">{s.formTitle}</p>
      ) : null}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-gray-400">{s.firstNameLabel}</span>
            <input
              name="firstname"
              type="text"
              autoComplete="given-name"
              required
              disabled={disabled}
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="rounded-xl border border-slate-600 bg-slate-950/80 px-3 py-2.5 text-white placeholder:text-gray-600 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/25 disabled:opacity-60"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-gray-400">{s.emailLabel}</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={disabled}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-slate-600 bg-slate-950/80 px-3 py-2.5 text-white placeholder:text-gray-600 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/25 disabled:opacity-60"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-gray-400">{s.phoneLabel}</span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              disabled={disabled}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl border border-slate-600 bg-slate-950/80 px-3 py-2.5 text-white placeholder:text-gray-600 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/25 disabled:opacity-60"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-gray-400">{s.carModelLabel}</span>
            <input
              name="car_model"
              type="text"
              autoComplete="off"
              disabled={disabled}
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              placeholder={s.carModelPlaceholder}
              className="rounded-xl border border-slate-600 bg-slate-950/80 px-3 py-2.5 text-white placeholder:text-gray-600 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/25 disabled:opacity-60"
            />
          </label>
        </div>

        {s.privacyLead ? (
          <p className="text-xs leading-relaxed text-gray-500">
            {s.privacyLead}{' '}
            <Link href={privacyHref} className="text-orange-400 underline-offset-2 hover:underline">
              {s.privacyLink}
            </Link>
            {s.privacySuffix ? ` ${s.privacySuffix}` : ''}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={disabled}
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'sending' ? s.sending : s.submit}
        </button>

        {status === 'success' && message ? (
          <p className="text-sm font-medium text-emerald-400" role="status">
            {message}
          </p>
        ) : null}
        {status === 'error' && message ? (
          <p className="text-sm font-medium text-red-400" role="alert">
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
