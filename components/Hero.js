'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { CalendarDays, Check, Clock, ExternalLink, PhoneCall, Star } from 'lucide-react';
import { PHONE_DISPLAY } from '../constants/translations';
import { GOOGLE_BUSINESS_REVIEWS_URL } from '../constants/googleBusiness';
import { getGoogleReviewsStats } from '../data/googleReviews';

function formatGoogleReviewsCount(n, lang) {
  if (lang === 'ru') {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return `${n} отзыв в Google`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${n} отзыва в Google`;
    return `${n} отзывов в Google`;
  }
  if (n === 1) return `${n} opinia w Google`;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${n} opinie w Google`;
  return `${n} opinii w Google`;
}

export default function Hero({ t }) {
  const pathname = usePathname() || '/pl';
  const lang = (pathname.split('/').filter(Boolean)[0] === 'ru') ? 'ru' : 'pl';
  const hero = t.hero;
  const reviewsT = t.reviews || {};
  const googleStats = getGoogleReviewsStats();
  const ratingLabel =
    googleStats.count > 0
      ? formatGoogleReviewsCount(googleStats.count, lang)
      : lang === 'ru'
        ? 'Отзывы Google'
        : 'Opinie Google';
  const ratingDisplay =
    googleStats.count > 0
      ? googleStats.average.toLocaleString(lang === 'ru' ? 'ru-RU' : 'pl-PL', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
      : '—';
  const filledStars =
    googleStats.count > 0 ? Math.min(5, Math.max(0, Math.round(googleStats.average))) : 0;

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
          alt={hero.heroImageAlt || 'Profesjonalny warsztat samochodowy Car Service Nikol Jastrowo'}
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-12 pt-10 md:flex-row md:items-center md:pb-20 md:pt-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex-1 space-y-6 px-0 sm:px-0"
        >
          {/* USP — jedyny czynny serwis w niedzielę w okolicy */}
          <div className="inline-flex max-w-xl items-start gap-3 rounded-2xl border-2 border-amber-400/55 bg-gradient-to-br from-amber-500/25 via-amber-600/15 to-orange-600/10 px-4 py-3 shadow-lg shadow-amber-900/30 sm:gap-3.5 sm:px-5 sm:py-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/35 ring-2 ring-amber-400/40">
              <Clock className="h-6 w-6 text-amber-200" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-amber-200/90 sm:text-xs">
                {hero.sundayBadge}
              </p>
              <p className="mt-1 text-sm font-bold leading-snug text-white sm:text-base">
                {hero.sundayUniqueBadge ?? hero.sundayBadge}
              </p>
            </div>
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {hero.title}
          </h1>

          <p className="max-w-xl text-balance text-sm leading-relaxed text-gray-100 sm:text-base">
            {hero.subtitle}
          </p>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <button
              type="button"
              onClick={handleBookClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/40 ring-2 ring-orange-400/40 transition hover:scale-[1.03] hover:from-orange-400 hover:to-amber-400 hover:shadow-orange-500/50 active:scale-100"
            >
              <CalendarDays className="h-4 w-4" />
              <span>{hero.ctaPrimary}</span>
            </button>
            <Link
              href={`/${lang}/contact`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/50 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <PhoneCall className="h-4 w-4" />
              <span>{hero.ctaSecondary}</span>
            </Link>
          </div>

          {/* Social proof — ocena Google (dane z lokalnej listy opinii) */}
          {googleStats.count > 0 && (
            <a
              href={GOOGLE_BUSINESS_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group/rating flex w-full max-w-xl flex-col gap-3 rounded-2xl border border-white/20 bg-black/35 px-4 py-3 shadow-xl backdrop-blur-md transition hover:border-amber-400/45 hover:bg-black/45 sm:flex-row sm:items-center sm:justify-between sm:py-3.5"
              aria-label={`${hero.googleRatingLead ?? ''}. ${ratingLabel}, ${ratingDisplay}`}
            >
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-0.5" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem] ${
                        i < filledStars
                          ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                          : 'fill-white/10 text-white/15'
                      }`}
                    />
                  ))}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-200/95">
                    {hero.googleRatingLead}
                  </p>
                  <p className="text-lg font-bold tabular-nums text-white sm:text-xl">
                    {ratingDisplay}
                    <span className="ml-2 text-sm font-normal text-gray-300 sm:text-base">
                      {ratingLabel}
                    </span>
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-amber-200 transition group-hover/rating:text-amber-100 sm:shrink-0">
                <span>{reviewsT.viewAllReviews ?? (lang === 'ru' ? 'Отзывы' : 'Zobacz opinie')}</span>
                <ExternalLink className="h-4 w-4 opacity-80" aria-hidden />
              </span>
            </a>
          )}

          {hero.trustSignals?.length > 0 && (
            <ul className="flex flex-col gap-2 text-xs text-gray-200 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2 sm:text-sm" aria-label="Trust signals">
              {hero.trustSignals.map((label, i) => (
                <li key={i} className="flex items-center gap-2">
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

