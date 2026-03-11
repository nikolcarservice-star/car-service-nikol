import googleReviews from '../data/googleReviews';

export default function Reviews() {
  const reviews = googleReviews;

  return (
    <section className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h2 className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
          Opinie Google
        </h2>

        {!reviews.length && (
          <p className="mt-4 text-center text-sm text-gray-400">
            Dodaj kilka opinii do pliku <span className="font-mono">data/googleReviews.js</span>, aby
            wyświetlić je tutaj.
          </p>
        )}

        {!!reviews.length && (
          <>
            <div className="mt-6">
              <div className="relative">
                {/* Простая “карусель” с горизонтальным скроллом */}
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700">
                  {reviews.map((review) => (
                    <article
                      key={review.time || review.author_name}
                      className="relative flex w-80 flex-shrink-0 flex-col rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200 shadow-lg backdrop-blur-xl"
                    >
                      <div className="flex items-center gap-3">
                        {review.profile_photo_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={review.profile_photo_url}
                            alt={review.author_name || 'Autor opinii'}
                            className="h-9 w-9 flex-shrink-0 rounded-full border border-white/20 object-cover"
                            loading="lazy"
                          />
                        )}
                        <div>
                          <p className="text-sm font-semibold">
                            {review.author_name || 'Klient Google'}
                          </p>
                          {review.relative_time_description && (
                            <p className="text-xs text-gray-400">
                              {review.relative_time_description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-1 text-amber-400">
                        {Number.isFinite(review.rating) &&
                          Array.from({ length: 5 }).map((_, index) => (
                            <span key={index}>{index < review.rating ? '★' : '☆'}</span>
                          ))}
                        {Number.isFinite(review.rating) && (
                          <span className="ml-1 text-xs text-gray-300">
                            {review.rating.toFixed(1)}
                          </span>
                        )}
                      </div>

                      {review.text && (
                        <p className="mt-3 line-clamp-6 text-sm text-gray-200">
                          {review.text}
                        </p>
                      )}

                      {review.author_url && (
                        <a
                          href={review.author_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex text-xs text-amber-300 underline-offset-2 hover:underline"
                        >
                          Zobacz opinię w Google
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <a
                href="https://www.google.com/maps/place/Car+Service+Nikol+%7C+Serwis+samochodowy/@52.5908447,16.5381048,148m/data=!3m1!1e3!4m6!3m5!1s0x47041785835568fb:0xfad9f08b31a08d7!8m2!3d52.5908375!4d16.5384497!16s%2Fg%2F11wv2f39s2?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-amber-400/50 bg-amber-500/10 px-6 py-2 text-sm font-medium text-amber-300 shadow-sm transition hover:bg-amber-500/20 hover:text-amber-200"
              >
                Zobacz wszystkie opinie w Google
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

