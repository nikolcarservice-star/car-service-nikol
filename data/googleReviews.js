// Статические отзывы, скопированные из Google Maps.
// Можно дополнять/обновлять вручную при появлении новых отзывов.
//
// ВАЖНО: список ниже — это ВЫБОРКА отзывов с полным текстом (7 из 12).
// Pełna liczba opinii i średnia pochodzą z Google i są trzymane
// w GOOGLE_REVIEWS_TOTAL / GOOGLE_RATING_AVERAGE — tego samego źródła
// używają Hero (schemat społeczny) oraz JSON-LD aggregateRating.

/** Liczba opinii w Google — zweryfikowana 30.09.2026 (profil: 5,0 / 12 opinii). */
export const GOOGLE_REVIEWS_TOTAL = 12;
/** Średnia ocena w Google — wszystkie 12 opinii ma 5 gwiazdek. */
export const GOOGLE_RATING_AVERAGE = 5.0;

const googleReviews = [
  {
    author_name: 'Nika Vasylenko',
    profile_photo_url: '',
    rating: 5,
    relative_time_description: 'год назад',
    relative_time_description_pl: 'rok temu',
    text:
      'Praca wykonana z pełnym profesjonalizmem, pękło nam koło na drodze, Pan przyjechał natychmiast i wszystko załatwił, polecam bardzo, jakbym miała możliwość dodać jeszcze jedną gwiazdkę na pewno bym dodała.',
    author_url: '',
  },
  {
    author_name: 'Aleksandr',
    profile_photo_url: '',
    rating: 5,
    relative_time_description: 'год назад',
    relative_time_description_pl: 'rok temu',
    text:
      'Отличный сервис и честные цены! Обратился для диагностики и замены масла — всё сделали быстро и качественно. Мастера профессионалы, объяснили детали и дали полезные советы. Рад, что нашёл надёжный автосервис. Рекомендую!',
    author_url: '',
  },
  {
    author_name: 'Сергей Шульга',
    profile_photo_url: '',
    rating: 5,
    relative_time_description: 'год назад',
    relative_time_description_pl: 'rok temu',
    text:
      'Дуже гарний сервіс. Механік працює добре та швидко. Авто стає відремонтоване за короткі терміни. Я задоволений роботою та раджу звертатися до даного сервісу.',
    author_url: '',
  },
  {
    author_name: 'Натали Натали',
    profile_photo_url: '',
    rating: 5,
    relative_time_description: 'год назад',
    relative_time_description_pl: 'rok temu',
    text:
      'Bardzo polecam ten serwis! Profesjonalna obsługa, szybka diagnoza i uczciwe podejście do klienta. Przyjechałam z problemem z zawieszeniem, wszystko zostało dokładnie sprawdzone i naprawione. Panowie wszystko wyjaśnili w prosty sposób, a cena była naprawdę rozsądna. Czułam się zaopiekowana i z pełnym zaufaniem wrócę tam ponownie. Dziękuję!',
    author_url: '',
  },
  {
    author_name: 'Саня Нефедов',
    profile_photo_url: '',
    rating: 5,
    relative_time_description: 'год назад',
    relative_time_description_pl: 'rok temu',
    text:
      'Solidny serwis – polecam! Szybka i fachowa naprawa zawieszenia. Mechanicy znają się na rzeczy, wszystko zostało zrobione zgodnie z ustaleniami i bez naciągania. Dostałem konkretną diagnozę i uczciwą wycenę. Dobry kontakt i terminowość – na pewno wrócę przy kolejnej potrzebie. Dzięki!',
    author_url: '',
  },
  {
    author_name: 'Артем Артем',
    profile_photo_url: '',
    rating: 5,
    relative_time_description: 'год назад',
    relative_time_description_pl: 'rok temu',
    text: 'Рекомендую. Быстро, качественно и за приемлемые цены.',
    author_url: '',
  },
  {
    author_name: 'Гордиенко Екатерина',
    profile_photo_url: '',
    rating: 5,
    relative_time_description: 'год назад',
    relative_time_description_pl: 'rok temu',
    text: 'Хороший автомеханик, знает своё дело. Сделал быстро и качественно!',
    author_url: '',
  },
];

export function getGoogleReviewsStats() {
  return { count: GOOGLE_REVIEWS_TOTAL, average: GOOGLE_RATING_AVERAGE };
}

export default googleReviews;
