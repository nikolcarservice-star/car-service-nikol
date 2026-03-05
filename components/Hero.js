'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Check, Clock, PhoneCall } from 'lucide-react';
import { PHONE_DISPLAY } from '../constants/translations';

export default function Hero({ t }) {
  const hero = t.hero;

  const handleBookClick = () => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(t.bookingId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id={t.heroId}
      className="relative border-b border-slate-800"
    >
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?q=80&w=2000&auto=format&fit=crop"
          alt="Profesjonalny warsztat samochodowy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-12 pt-10 md:flex-row md:items-center md:pb-20 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex-1 space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/50 bg-orange-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">
            <Clock className="h-4 w-4" />
            <span>{hero.sundayBadge}</span>
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {hero.title}
          </h1>

          <p className="max-w-xl text-balance text-sm leading-relaxed text-gray-100 sm:text-base">
            {hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleBookClick}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-7 py-3 text-sm font-bold text-slate-950 shadow-glow transition transform hover:scale-[1.03] hover:bg-orange-400 active:scale-100"
            >
              <CalendarDays className="h-4 w-4" />
              <span>{hero.ctaPrimary}</span>
            </button>
            <a
              href={`tel:${PHONE_DISPLAY.replace(/[^+\d]/g, '')}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/50 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <PhoneCall className="h-4 w-4" />
              <span>{hero.ctaSecondary}</span>
            </a>
          </div>

          {hero.trustSignals?.length > 0 && (
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-200 sm:text-sm" aria-label="Trust signals">
              {hero.trustSignals.map((label, i) => (
                <li key={i} className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400" aria-hidden>
                    <Check className="h-3 w-3 stroke-[2.5]" />
                  </span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="relative mt-2 flex-1 md:mt-0"
        >
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-200">
                  Car Service Nikol
                </p>
                <p className="text-sm text-gray-100">{t.location.addressValue}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-300" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-100">
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-gray-300">
                  {t.footer.scheduleTitle}
                </p>
                <p className="mt-2 text-orange-300">{t.footer.saturday}</p>
                <p className="mt-1 text-emerald-300">{t.footer.sunday}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-gray-300">
                  WhatsApp / Telegram
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-50">{PHONE_DISPLAY}</p>
                <p className="mt-1 text-[11px] text-gray-300">
                  Preferujesz czat? Napisz, a oddzwonimy i potwierdzimy termin.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

