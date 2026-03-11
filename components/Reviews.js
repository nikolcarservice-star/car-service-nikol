'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import googleReviews from '../data/googleReviews';

export default function Reviews() {
  const reviews = googleReviews;
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = reviews.length;

  const handleNext = () => {
    if (!total) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    if (!total) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (!total) return;

    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 8000);

    return () => clearInterval(id);
  }, [total]);

  const current = total ? reviews[currentIndex] : null;

  return (
    <section className="relative border-t border-slate-800 bg-slate-950 overflow-hidden">
      {/* Tło z delikatnym gradientem */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(251,191,36,0.08),transparent)] pointer-events-none" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {/* Nagłówek */}
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            Opinie Google
          </span>
          <p className="text-sm text-gray-500">
            Co mówią o nas klienci
          </p>
        </div>

        {!total && (
          <p className="mt-8 text-center text-sm text-gray-400">
            Dodaj kilka opinii do pliku <span className="font-mono text-gray-300">data/googleReviews.js</span>, aby
            wyświetlić je tutaj.
          </p>
        )}

        {current && (
          <div className="mt-10 flex flex-col items-center gap-8">
            <div className="relative flex w-full max-w-4xl items-center justify-center">
              {/* Strzałki */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Poprzednia opinia"
                className="hidden sm:flex absolute left-0 top-1/2 z-10 h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-900/90 text-gray-300 shadow-xl backdrop-blur transition hover:border-amber-400/50 hover:bg-amber-500/10 hover:text-amber-300"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
                  <path d="M12.5 5L8 9.5 12.5 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Kartka opinii */}
              <AnimatePresence mode="wait">
                <motion.article
                  key={currentIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="relative w-full max-w-3xl rounded-3xl border border-amber-400/20 bg-gradient-to-br from-slate-900/95 via-slate-900 to-slate-900/95 p-6 shadow-2xl shadow-black/50 ring-1 ring-white/5 backdrop-blur sm:p-8"
                >
                  {/* Delikatna poświata u góry */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" aria-hidden />

                  {/* Ikona cytatu */}
                  <div className="absolute right-6 top-6 opacity-20 sm:right-8 sm:top-8">
                    <Quote className="h-10 w-10 text-amber-400 sm:h-12 sm:w-12" />
                  </div>

                  <div className="flex items-start gap-4">
                    {current.profile_photo_url ? (
                      <img
                        src={current.profile_photo_url}
                        alt=""
                        className="h-12 w-12 flex-shrink-0 rounded-full border-2 border-amber-400/30 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-amber-400/30 bg-amber-500/20 text-lg font-bold text-amber-300">
                        {(current.author_name || 'K')[0]}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-gray-100">
                        {current.author_name || 'Klient Google'}
                      </p>
                      {current.relative_time_description && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          {current.relative_time_description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Gwiazdki */}
                  <div className="mt-4 flex items-center gap-1">
                    {Number.isFinite(current.rating) &&
                      Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 sm:h-6 sm:w-6 ${i < current.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-700 text-slate-600'}`}
                          aria-hidden
                        />
                      ))}
                    {Number.isFinite(current.rating) && (
                      <span className="ml-2 text-sm font-medium text-amber-300">
                        {current.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {current.text && (
                    <p className="mt-5 text-sm leading-relaxed text-gray-200 sm:text-base">
                      &ldquo;{current.text}&rdquo;
                    </p>
                  )}

                  {current.author_url && (
                    <a
                      href={current.author_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex text-xs font-medium text-amber-300 underline-offset-2 hover:underline"
                    >
                      Zobacz opinię w Google →
                    </a>
                  )}
                </motion.article>
              </AnimatePresence>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Następna opinia"
                className="hidden sm:flex absolute right-0 top-1/2 z-10 h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-900/90 text-gray-300 shadow-xl backdrop-blur transition hover:border-amber-400/50 hover:bg-amber-500/10 hover:text-amber-300"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
                  <path d="M7.5 5L12 9.5 7.5 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Strzałki mobilne */}
            {total > 1 && (
              <div className="flex justify-center gap-4 sm:hidden">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Poprzednia opinia"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-slate-800/90 text-gray-300 shadow-lg transition hover:border-amber-400/50 hover:text-amber-300"
                >
                  <svg viewBox="0 0 20 20" className="h-5 w-5"><path d="M12.5 5L8 9.5 12.5 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Następna opinia"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-slate-800/90 text-gray-300 shadow-lg transition hover:border-amber-400/50 hover:text-amber-300"
                >
                  <svg viewBox="0 0 20 20" className="h-5 w-5"><path d="M7.5 5L12 9.5 7.5 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            )}

            {/* Paginacja */}
            {total > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`rounded-full transition-all ${
                      index === currentIndex
                        ? 'h-2 w-8 bg-amber-400'
                        : 'h-2 w-2 bg-slate-600 hover:bg-slate-500'
                    }`}
                    aria-label={`Opinia ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* CTA Google */}
            <a
              href="https://www.google.com/maps/place/Car+Service+Nikol+%7C+Serwis+samochodowy/@52.5908447,16.5381048,148m/data=!3m1!1e3!4m6!3m5!1s0x47041785835568fb:0xfad9f08b31a08d7!8m2!3d52.5908375!4d16.5384497!16s%2Fg%2F11wv2f39s2?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-amber-400/50 bg-gradient-to-r from-amber-500/20 to-amber-600/10 px-6 py-3.5 text-sm font-semibold text-amber-200 shadow-lg shadow-amber-500/10 transition hover:border-amber-400 hover:from-amber-500/30 hover:to-amber-600/20 hover:text-amber-100"
            >
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              Zobacz wszystkie opinie w Google
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

