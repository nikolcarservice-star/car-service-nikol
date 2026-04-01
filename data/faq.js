/** Typowe pytania klientów — PL / RU (SEO + redukcja zapytań telefonicznych). */
export const faqItems = [
  {
    id: 'overnight',
    question: {
      pl: 'Czy mogę zostawić samochód na noc?',
      ru: 'Можно ли оставить машину на ночь?',
    },
    answer: {
      pl: 'Tak — po wcześniejszym uzgodnieniu telefonicznym lub przy zapisie na wizytę można zostawić pojazd na terenie warsztatu. Ustalimy zasady wydania kluczyków i odbioru auta.',
      ru: 'Да — при предварительной договорённости по телефону или при записи можно оставить автомобиль на территории сервиса. Согласуем выдачу ключей и время выдачи авто.',
    },
  },
  {
    id: 'parts-warranty',
    question: {
      pl: 'Czy jest gwarancja na części?',
      ru: 'Есть ли гарантия на запчасти?',
    },
    answer: {
      pl: 'Na nowe części obowiązuje gwarancja producenta lub dystrybutora — warunki zawsze przekazujemy przy wycenie. Na robociznę udzielamy gwarancji zgodnie z zakresem wykonanych prac; szczegóły omawiamy przed rozpoczęciem naprawy.',
      ru: 'На новые запчасти действует гарантия производителя или поставщика — условия сообщаем при расчёте. На выполненные работы даём гарантию в рамках согласованного объёма; детали обсуждаем до начала ремонта.',
    },
  },
  {
    id: 'cards',
    question: {
      pl: 'Czy przyjmujecie płatność kartą?',
      ru: 'Принимаете ли карты?',
    },
    answer: {
      pl: 'Tak — przyjmujemy płatność kartą płatniczą oraz gotówkę. Przed wizytą możesz potwierdzić dostępne metody płatności telefonicznie.',
      ru: 'Да — принимаем банковские карты и наличные. Перед визитом можно уточнить способы оплаты по телефону.',
    },
  },
  {
    id: 'booking',
    question: {
      pl: 'Czy muszę się umawiać z wyprzedzeniem?',
      ru: 'Нужно ли заранее записываться?',
    },
    answer: {
      pl: 'Zalecamy umówienie wizyty online lub telefonicznie — dzięki temu zarezerwujemy czas i często skrócimy oczekiwanie. W pilnych przypadkach zadzwoń: postaramy się znaleźć termin tego samego dnia.',
      ru: 'Рекомендуем запись онлайн или по телефону — так мы зарезервируем время и чаще сократим ожидание. Срочно — позвоните: постараемся найти окно в тот же день.',
    },
  },
  {
    id: 'sunday',
    question: {
      pl: 'Czy pracujecie w niedzielę?',
      ru: 'Работаете ли по воскресеньям?',
    },
    answer: {
      pl: 'Tak — w niedzielę jesteśmy czynni w godzinach podanych na stronie (zwykle 10:00–16:00). Sobota i niedziela to dobry czas na serwis, gdy w tygodniu potrzebujesz auta do pracy.',
      ru: 'Да — в воскресенье работаем в часы, указанные на сайте (обычно 10:00–16:00). Выходные удобны для сервиса, если в будни машина нужна для работы.',
    },
  },
  {
    id: 'invoice',
    question: {
      pl: 'Czy wystawiacie faktury VAT?',
      ru: 'Вы выставляете фактуры VAT?',
    },
    answer: {
      pl: 'Tak — na życzenie wystawiamy fakturę VAT dla firm i klientów indywidualnych zgodnie z obowiązującymi przepisami.',
      ru: 'Да — по запросу выставляем счёт-фактуру VAT для фирм и частных клиентов в соответствии с действующими правилами.',
    },
  },
  {
    id: 'own-parts',
    question: {
      pl: 'Czy mogę dostarczyć własne części?',
      ru: 'Можно ли привезти свои запчасти?',
    },
    answer: {
      pl: 'Czasami tak — zależy od rodzaju naprawy i części. Części muszą być kompletne i pasować do pojazdu; przed montażem omawiamy ewentualne ograniczenia gwarancyjne na robociznę przy częściach powierzonych.',
      ru: 'Иногда да — зависит от вида ремонта и деталей. Запчасти должны быть полными и подходить к авто; до монтажа обсуждаем возможные ограничения гарантии на работы при ваших деталях.',
    },
  },
  {
    id: 'area',
    question: {
      pl: 'Skąd przyjmujecie klientów?',
      ru: 'Откуда к вам приезжают клиенты?',
    },
    answer: {
      pl: 'Warsztat mieści się w Jastrowo (ul. Wernisażowa 21). Regularnie obsługujemy kierowców z Szamotuł i okolicznych miejscowości — dojazd z Szamotuł zajmuje ok. 10 minut.',
      ru: 'Сервис в Jastrowo (ул. Wernisażowa 21). Часто обслуживаем клиентов из Шамотул и соседних населённых пунктов — из Шамотул около 10 минут езды.',
    },
  },
];

export function getFaqItems(lang) {
  const code = lang === 'ru' ? 'ru' : 'pl';
  return faqItems.map((item) => ({
    id: item.id,
    question: item.question[code],
    answer: item.answer[code],
  }));
}
