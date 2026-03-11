async function fetchGoogleReviews() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACES_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn(
      'Brak GOOGLE_PLACES_API_KEY lub GOOGLE_PLACES_PLACE_ID — opinie Google nie zostaną pobrane.'
    );
    return [];
  }

  const params = new URLSearchParams({
    place_id: placeId,
    fields: 'rating,user_ratings_total,reviews',
    language: 'pl',
    reviews_sort: 'newest',
    key: apiKey,
  });

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`,
    {
      // revalidate raz na godzinę, żeby nie przekraczać limitów API
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    console.error('Błąd pobierania opinii Google:', res.status, await res.text());
    return [];
  }

  const data = await res.json();

  const reviews = data?.result?.reviews || [];

  // zostawим максимум 6 свежих отзывов
  return reviews.slice(0, 6);
}

export default async function Reviews() {
  const reviews = await fetchGoogleReviews();

  return (
    <section className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h2 className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
          Opinie Google
        </h2>

        {(!reviews || reviews.length === 0) && (
          <p className="mt-4 text-center text-sm text-gray-400">
            Opinie z Google pojawią się tutaj, gdy tylko zostaną poprawnie
            skonfigurowane.
          </p>
        )}

        {reviews && reviews.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.time || review.author_name}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200 shadow-lg backdrop-blur-xl"
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
                  <p className="mt-3 line-clamp-5 text-sm text-gray-200">
                    {review.text}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

