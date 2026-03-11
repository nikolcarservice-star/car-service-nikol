'use client';

import { useEffect, useState } from 'react';
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
    }, 8000); // авто‑переключение раз в 8 секунд

    return () => clearInterval(id);
  }, [total]);

  const current = total ? reviews[currentIndex] : null;

  return (
    <section className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h2 className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
          Opinie Google
        </h2>

        {!total && (
          <p className="mt-4 text-center text-sm text-gray-400">
            Dodaj kilka opinii do pliku <span className="font-mono">data/googleReviews.js</span>, aby
            wyświetlić je tutaj.
          </p>
        )}

        {current && (
          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="relative flex w-full items-center justify-center">
              {/* Левая стрелка */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Poprzednia opinia"
                className="hidden sm:inline-flex absolute left-0 z-10 h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-slate-900/80 text-gray-200 shadow-lg backdrop-blur transition hover:border-amber-400/60 hover:text-amber-300"
              >
                <span className="sr-only">Poprzednia opinia</span>
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M12.5 5L8 9.5 12.5 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Карточка отзыва */}
              <article className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-900/60 p-6 text-sm text-gray-200 shadow-2xl shadow-black/40 backdrop-blur">
                <div className="flex items-center gap-3">
                  {current.profile_photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={current.profile_photo_url}
                      alt={current.author_name || 'Autor opinii'}
                      className="h-10 w-10 flex-shrink-0 rounded-full border border-white/20 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-100">
                      {current.author_name || 'Klient Google'}
                    </p>
                    {current.relative_time_description && (
                      <p className="text-xs text-gray-400">
                        {current.relative_time_description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1 text-amber-400">
                  {Number.isFinite(current.rating) &&
                    Array.from({ length: 5 }).map((_, index) => (
                      <span key={index}>{index < current.rating ? '★' : '☆'}</span>
                    ))}
                  {Number.isFinite(current.rating) && (
                    <span className="ml-1 text-xs text-gray-300">
                      {current.rating.toFixed(1)}
                    </span>
                  )}
                </div>

                {current.text && (
                  <p className="mt-4 text-sm leading-relaxed text-gray-100">
                    {current.text}
                  </p>
                )}

                {current.author_url && (
                  <a
                    href={current.author_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex text-xs text-amber-300 underline-offset-2 hover:underline"
                  >
                    Zobacz opinię w Google
                  </a>
                )}
              </article>

              {/* Правая стрелка */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Następna opinia"
                className="hidden sm:inline-flex absolute right-0 z-10 h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-slate-900/80 text-gray-200 shadow-lg backdrop-blur transition hover:border-amber-400/60 hover:text-amber-300"
              >
                <span className="sr-only">Następna opinia</span>
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M7.5 5L12 9.5 7.5 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Мобильные стрелки под карточкой */}
            {total > 1 && (
              <div className="flex items-center justify-center gap-4 sm:hidden">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-slate-900/80 text-gray-200 shadow-lg backdrop-blur transition hover:border-amber-400/60 hover:text-amber-300"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M12.5 5L8 9.5 12.5 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-slate-900/80 text-gray-200 shadow-lg backdrop-blur transition hover:border-amber-400/60 hover:text-amber-300"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M7.5 5L12 9.5 7.5 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Точки-индикаторы */}
            {total > 1 && (
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                {reviews.map((review, index) => (
                  <button
                    key={review.author_name + index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentIndex
                        ? 'w-6 bg-amber-400'
                        : 'w-2 bg-slate-600 hover:bg-slate-400'
                    }`}
                    aria-label={`Pokaż opinię ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Кнопка перехода в Google */}
            <div className="mt-4 flex justify-center">
              <a
                href="https://www.google.com/maps/place/Car+Service+Nikol+%7C+Serwis+samochodowy/@52.5908447,16.5381048,148m/data=!3m1!1e3!4m6!3m5!1s0x47041785835568fb:0xfad9f08b31a08d7!8m2!3d52.5908375!4d16.5384497!16s%2Fg%2F11wv2f39s2?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-amber-400/60 bg-amber-500/10 px-6 py-2 text-sm font-medium text-amber-300 shadow-sm shadow-amber-500/10 transition hover:bg-amber-500/20 hover:text-amber-100"
              >
                Zobacz wszystkie opinie w Google
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

