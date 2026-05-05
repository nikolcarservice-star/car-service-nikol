import { RUSSIAN_LOCALE_ENABLED } from './localeConfig';

export const LANGUAGES = {
  PL: 'pl',
  RU: 'ru',
};

export const SUPPORTED_LANGS = [LANGUAGES.PL, LANGUAGES.RU];

export const PHONE_DISPLAY = '+48 794 935 734';
export const PHONE_RAW = '48794935734';
/** RFC 3966 — zawsze z prefiksem kraju `+` dla `tel:`. */
export const PHONE_TEL_HREF = `tel:+${PHONE_RAW}`;

/** Kotwica na stronie kontaktu — link „Więcej” / crawlery mogą użyć strony z pełnymi danymi. */
export const PHONE_CONTACT_ANCHOR_ID = 'telefon';

export function getPhoneContactPageHref(lang) {
  const l = lang === LANGUAGES.RU ? 'ru' : 'pl';
  return `/${l}/contact#${PHONE_CONTACT_ANCHOR_ID}`;
}

export const translations = {
  pl: {
    langLabel: 'PL',
    heroId: 'hero',
    servicesId: 'services',
    bookingId: 'booking',
    locationId: 'location',
    navigation: {
      logo: 'Car Service Nikol',
      home: 'Strona główna',
      services: 'Usługi',
      servicesAll: 'Wszystkie usługi',
      about: 'O nas',
      contact: 'Kontakt',
      cennik: 'Cennik',
      blog: 'Blog',
      gallery: 'Galeria',
      faq: 'FAQ',
      phoneCta: 'Zadzwoń',
      bookCta: 'Kontakt',
      languageToggleLabel: 'Wybierz język',
      openMenu: 'Otwórz menu',
      closeMenu: 'Zamknij menu',
      menuLabel: 'Menu nawigacji',
    },
    hero: {
      title: 'Autoserwis Jastrowo, w Szamotułach — mechanik | Weekendy',
      subtitle:
        'Serwis samochodowy Jastrowo i Szamotuły. Weekendowy serwis, szybka diagnostyka, naprawa hamulców i wymiana oleju – Twój zaufany mechanik.',
      ctaPrimary: 'Skontaktuj się',
      ctaSecondary: 'Zadzwoń teraz',
      sundayBadge: 'Otwarte w niedziele!',
      sundayUniqueBadge:
        'Jedyny serwis w okolicy otwarty w niedziele',
      googleRatingLead: 'Ocena klientów w Google',
      scheduleTitle: 'Weekendowe godziny otwarcia',
      saturday: 'SOBOTA: 08:00 – 18:00',
      sunday: 'NIEDZIELA: 10:00 – 16:00',
      trustSignals: [
        'Gwarancja na części',
        'Szybka diagnostyka',
        'Konkurencyjne ceny',
      ],
      heroImageAlt: 'Warsztat samochodowy Car Service Nikol w Jastrowo – mechanik przy pojeździe.',
    },
    brands: {
      title: 'Serwisujemy marki',
      subtitle: 'Doświadczenie w obsłudze popularnych marek.',
      names: ['BMW', 'Volkswagen', 'Audi', 'Opel', 'Mercedes', 'Ford', 'Skoda', 'Toyota', 'Renault', 'Peugeot'],
    },
    features: {
      title: 'Dlaczego warto wybrać nasz serwis',
      items: [
        {
          key: 'fast',
          title: 'Szybka obsługa',
          description: 'Większość napraw wykonujemy tego samego lub następnego dnia.',
        },
        {
          key: 'fair',
          title: 'Uczciwe ceny',
          description: 'Przed rozpoczęciem prac jasno omawiamy zakres naprawy i koszt.',
        },
        {
          key: 'weekend',
          title: 'Otwarte w weekendy',
          description: 'Pracujemy w soboty i niedziele, gdy inni mają wolne.',
        },
      ],
    },
    services: {
      title: 'Zakres usług',
      subtitle: 'Kompleksowy serwis mechaniczny i diagnostyka dla Twojego auta.',
      list: [
        {
          key: 'suspension',
          name: 'Zawieszenie',
          nameRu: 'Ходовая',
          description:
            'Naprawa i wymiana amortyzatorów, wahaczy, sprężyn oraz elementów układu kierowniczego.',
        },
        {
          key: 'oil',
          name: 'Oleje i filtry',
          nameRu: 'Масла и фильтры',
          description:
            'Kompleksowa wymiana oleju silnikowego oraz wszystkich filtrów (powietrza, kabiny, paliwa).',
        },
        {
          key: 'brakes',
          name: 'Hamulce',
          nameRu: 'Тормоза',
          description:
            'Wymiana klocków, tarcz, płynu hamulcowego oraz regeneracja zacisków.',
        },
        {
          key: 'diagnostics',
          name: 'Diagnostyka',
          nameRu: 'Диагностика',
          description:
            'Komputerowe sprawdzanie błędów, kodowanie modułów i pełna diagnostyka elektroniki.',
        },
        {
          key: 'timing',
          name: 'Rozrząd',
          nameRu: 'ГРМ',
          description:
            'Precyzyjna wymiana paska lub łańcucha rozrządu wraz z pompą wody i napinaczami.',
        },
        {
          key: 'tires',
          name: 'Opony',
          nameRu: 'Шиномонтаж',
          description:
            'Sezonowa wymiana opon, wyważanie kół oraz profesjonalna naprawa przebić.',
        },
        {
          key: 'mobileService',
          name: 'Serwis Mobilny',
          nameRu: 'Выезд мастера',
          description:
            'Pomoc drogowa, awaryjne odpalanie auta i drobne naprawy z dojazdem do klienta.',
        },
        {
          key: 'keys',
          name: 'Klucze',
          nameRu: 'Ключи',
          description:
            'Programowanie i odzyskiwanie kluczy do samochodów.',
        },
      ],
    },
    servicesPage: {
      sundayBadge: 'Dostępne terminy w najbliższą niedzielę!',
      serviceDetails: 'Zobacz szczegóły usługi',
    },
    serviceDetail: {
      symptomsHeading: 'Kiedy warto zająć się tym w serwisie?',
      pricesDisclaimer:
        'Orientacyjne ceny brutto w PLN (1 PLN = 1 zł). Końcowa wycena zależy od modelu auta, części i zakresu prac.',
      fromPriceBand: 'Wiele pozycji w tej kategorii już od {amount} PLN.',
      bookCta: 'Skontaktuj się — ta usługa',
      bookCtaHint: 'Przejdziesz do kontaktu i szybko ustalimy dogodny termin.',
    },
    aboutPage: {
      heroTitle: 'Car Service Nikol — Twój serwis w Jastrowo i w Szamotułach',
      heroSubtitle: 'Doświadczenie, uczciwość i terminowość. Pracujemy także w niedziele.',
      values: [
        { title: 'Uczciwość', description: 'Przed naprawą omawiamy wyniki diagnostyki i warianty. Klient wybiera części – oryginały lub sprawdzone zamienniki. Bez ukrytych kosztów.' },
        { title: 'Terminy', description: 'Szanujemy Twój czas. Wiele usług – wymiana oleju, hamulce, diagnostyka – wykonujemy tego samego dnia.' },
        { title: 'Diagnostyka', description: 'Nowoczesny sprzęt i doświadczenie. Szybka diagnoza to podstawa trafnego i ekonomicznego naprawy.' },
      ],
      sundayParagraph: 'Rozumiemy, że w tygodniu potrzebujesz auta do pracy – dlatego jako nieliczni w regionie Jastrowo i Szamotuły pracujemy dla Ciebie także w niedzielę.',
      ctaTitle: 'Chcesz sprawdzić swój samochód? Skontaktuj się z nami!',
      ctaButton: 'Kontakt',
    },
    aboutBlock: {
      title: 'O nas — pasja i profesjonalizm | Jastrowo, w Szamotułach',
      paragraph1:
        'Car Service Nikol powstał z myślą o kierowcach, którzy cenią swój czas i szukają niezawodnego mechanika w okolicy Szamotuł i Jastrowo. Wiemy, że awaria auta nie wybiera godziny, dlatego jako jedni z nielicznych jesteśmy do Twojej dyspozycji również w soboty i niedziele.',
      paragraph2:
        'Specjalizujemy się w kompleksowej mechanice: od diagnostyki komputerowej, przez serwis zawieszenia, aż po kodowanie kluczy. Nasz priorytet to uczciwe podejście — zawsze tłumaczymy zakres prac i dbamy o to, by Twój samochód wrócił na drogę w idealnym stanie.',
    },
    serviceCalculator: {
      title: 'Kalkulator orientacyjny — robocizna',
      subtitle: 'Rabat −10% na robociznę obowiązuje przy wyborze części z serwisu.',
      partsLegend: 'Części',
      servicesLegend: 'Usługi',
      partsOwn: 'Własne części',
      partsWorkshop:
        'Części z serwisu (gwarancja na montaż; −10% na robociznę w końcowej wycenie)',
      sumLabel: 'Suma robocizny (orientacyjnie)',
      sumDiscounted: 'Po rabacie −10% przy częściach z serwisu',
      savingsLine: 'Oszczędzasz ok. {amount} PLN na robociznie w wycenie.',
      bookCta: 'Skontaktuj się w sprawie tych usług',
      selectHint: 'Wybierz co najmniej jedną pozycję.',
      disclaimer:
        '*Orientacyjna robocizna bez kosztu części i materiałów. Dokładną kwotę podamy po kontakcie lub oględzinach pojazdu.',
    },
    location: {
      title: 'Lokalizacja i kontakt',
      subtitle: 'Łatwy dojazd z Jastrowo, Szamotuł i okolicznych miejscowości.',
      addressLabel: 'Adres warsztatu',
      addressValue: 'ul. Wernisażowa 21, 64-500 Jastrowo, Polska',
      mapNote: 'Dokładny dojazd potwierdzimy telefonicznie przy umawianiu wizyty.',
      whatsapp: 'Napisz na WhatsApp',
      telegram: 'Napisz na Telegram',
      scheduleSundayHighlight: 'Pracujemy, gdy inni są zamknięci!',
      trustPhrase: 'Dojazd z Szamotuł zajmuje tylko 10 minut!',
    },
    footer: {
      scheduleTitle: 'Weekendowe godziny otwarcia',
      monFri: '',
      saturday: 'SOBOTA: 08:00 – 18:00',
      sunday: 'NIEDZIELA: 10:00 – 16:00 (warsztat czynny w niedzielę)',
      nipLabel: 'NIP',
      nipValue: '[placeholder]',
      regonLabel: 'REGON',
      regonValue: '[placeholder]',
      privacy: 'Polityka Prywatności (RODO)',
      invoices: 'Dokumentacja sprzedaży na życzenie — szczegóły przy umówieniu wizyty',
      mapLinkLabel: 'Google Maps — profil i opinie (Jastrowo)',
      seoKeywordsLine:
        'Serwis samochodowy Jastrowo · Weekendowy serwis · Mechanik Szamotuły · Diagnostyka · Naprawa hamulców · Wymiana oleju i filtrów',
      rights: '© ' + new Date().getFullYear() + ' Car Service Nikol. Wszystkie prawa zastrzeżone.',
    },
    prompt: {
      title: 'Potrzebujesz pomocy z autem?',
      text: 'Zadzwoń lub napisz – pomożemy w Jastrowo i okolicach. Pracujemy też w weekendy.',
      ctaCall: 'Zadzwoń',
      ctaBook: 'Kontakt',
      close: 'Zamknij',
    },
    galleryPage: {
      intro:
        'Zdjęcia z naszego warsztatu w Jastrowo — prace serwisowe, stanowiska i sprzęt. Galerię regularnie uzupełniamy o nowe realizacje (także dla klientów z Szamotuł i okolic).',
      photoAltPrefix: 'Galeria Car Service Nikol –',
    },
    faqPage: {
      intro:
        'Odpowiedzi na typowe pytania — wiele z nich pada przy pierwszym kontakcie telefonicznym. Jeśli nie znalazłeś odpowiedzi, zadzwoń lub napisz do nas.',
    },
    nikolChat: {
      assistantName: 'Nikol',
      headerDisplayName: 'Nikol',
      headerTagline: 'Twój Asystent Nikol',
      statusOnline: 'Online',
      headerSubtitle: 'recepcja online',
      avatarAlt: 'Nikol — wirtualna recepcjonistka Car Service Nikol',
      fabAria: 'Otwórz czat z Nikol — wirtualną recepcjonistką',
      nudgeTitle: 'Jesteśmy do Twojej dyspozycji',
      nudgeBody:
        'Orientacyjna wycena, termin wizyty albo pytanie o auto — napisz w czacie. Nikol odpowie tak szybko, jak to możliwe.',
      nudgeCta: 'Otwórz czat',
      nudgeDismissAria: 'Zamknij powiadomienie',
      title: 'Nikol — recepcja online',
      welcome:
        'Cześć! Tu Nikol z Car Service Nikol w Jastrowo. Jak mogę pomóc — orientacyjna wycena, termin wizyty, czy coś z autem? Napisz krótko.',
      placeholder: 'Napisz wiadomość…',
      send: 'Wyślij',
      close: 'Zamknij czat',
      thinking: 'Nikol pisze…',
      errorGeneric: 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń.',
      errorUpstream:
        'Asystent chwilowo nie mógł wygenerować odpowiedzi (problem z usługą AI). Spróbuj za chwilę albo zadzwoń — pomożemy.',
      errorUnavailable:
        'Czat chwilowo niedostępny. Zadzwoń (+48 794 935 734) lub napisz na WhatsApp — pomożemy tak samo.',
      errorMissingKey:
        'Czat nie ma klucza API na serwerze (GEMINI_API_KEY). W Vercel: Settings → Environment Variables → dodaj zmienną dla środowiska Production, zapisz i wykonaj Redeploy. Tymczasem: zadzwoń (+48 794 935 734) lub napisz na WhatsApp.',
    },
    sosRoadside: {
      label: 'SOS / Pomoc drogowa',
      ariaLabel: 'SOS — wyślij wiadomość WhatsApp z prośbą o pomoc drogową',
      whatsAppMessage: 'SOS! Potrzebuję pilnej pomocy drogowej — proszę o kontakt.',
    },
    reviews: {
      title: 'Opinia Google',
      subtitle: 'Co mówią o nas klienci',
      viewAllReviews: 'Zobacz wszystkie opinie w Google',
      prevReview: 'Poprzednia opinia',
      nextReview: 'Następna opinia',
      reviewN: 'Opinia',
      noReviewsHint: 'Dodaj opinie w pliku data/googleReviews.js, aby wyświetlić je tutaj.',
    },
  },
  ru: {
    langLabel: 'RU',
    heroId: 'hero',
    servicesId: 'services',
    bookingId: 'booking',
    locationId: 'location',
    navigation: {
      logo: 'Car Service Nikol',
      home: 'Главная',
      services: 'Услуги',
      servicesAll: 'Все услуги',
      about: 'О компании',
      contact: 'Контакт',
      cennik: 'Прайс-лист',
      blog: 'Блог',
      gallery: 'Галерея',
      faq: 'Вопросы и ответы',
      phoneCta: 'Позвонить',
      bookCta: 'Контакт',
      languageToggleLabel: 'Выбор языка',
      openMenu: 'Открыть меню',
      closeMenu: 'Закрыть меню',
      menuLabel: 'Меню навигации',
    },
    hero: {
      title: 'Автосервис Jastrowo, в Шамотулах — механик | Выходные',
      subtitle:
        'Ваш надёжный автосервис в Ястрове. Специализируемся на быстрой диагностике и ремонтах в выходные дни.',
      ctaPrimary: 'Связаться с нами',
      ctaSecondary: 'Позвонить сейчас',
      sundayBadge: 'Работаем по воскресеньям!',
      sundayUniqueBadge:
        'Единственный работающий сервис в округе по воскресеньям',
      googleRatingLead: 'Оценка клиентов в Google',
      scheduleTitle: 'График работы по выходным',
      saturday: 'СУББОТА: 08:00 – 18:00',
      sunday: 'ВОСКРЕСЕНЬЕ: 10:00 – 16:00',
      trustSignals: [
        'Гарантия на запчасти',
        'Быстрая диагностика',
        'Конкурентные цены',
      ],
      heroImageAlt: 'Автосервис Car Service Nikol в Jastrowo – механик и автомобиль.',
    },
    brands: {
      title: 'Обслуживаем марки',
      subtitle: 'Опыт работы с популярными марками автомобилей.',
      names: ['BMW', 'Volkswagen', 'Audi', 'Opel', 'Mercedes', 'Ford', 'Skoda', 'Toyota', 'Renault', 'Peugeot'],
    },
    features: {
      title: 'Преимущества нашего сервиса',
      items: [
        {
          key: 'fast',
          title: 'Быстрое обслуживание',
          description: 'Большинство работ выполняем в тот же или на следующий день.',
        },
        {
          key: 'fair',
          title: 'Честные цены',
          description: 'Перед началом ремонта согласуем объём работ и стоимость.',
        },
        {
          key: 'weekend',
          title: 'Открыты в выходные',
          description: 'Работаем по субботам и воскресеньям, когда другие закрыты.',
        },
      ],
    },
    services: {
      title: 'Наши услуги',
      subtitle: 'Полный спектр механических работ и компьютерная диагностика для вашего авто.',
      list: [
        {
          key: 'suspension',
          name: 'Zawieszenie',
          nameRu: 'Ходовая',
          description:
            'Ремонт и замена амортизаторов, рычагов, пружин и элементов рулевого управления.',
        },
        {
          key: 'oil',
          name: 'Oleje i filtry',
          nameRu: 'Масла и фильтры',
          description:
            'Комплексная замена моторного масла и всех фильтров (воздушный, салонный, топливный).',
        },
        {
          key: 'brakes',
          name: 'Hamulce',
          nameRu: 'Тормоза',
          description:
            'Замена колодок, дисков, тормозной жидкости и регенерация суппортов.',
        },
        {
          key: 'diagnostics',
          name: 'Diagnostyka',
          nameRu: 'Диагностика',
          description:
            'Компьютерная проверка ошибок, кодирование модулей и полная диагностика электроники.',
        },
        {
          key: 'timing',
          name: 'Rozrząd',
          nameRu: 'ГРМ',
          description:
            'Точная замена ремня или цепи ГРМ вместе с водяной помпой и натяжителями.',
        },
        {
          key: 'tires',
          name: 'Opony',
          nameRu: 'Шиномонтаж',
          description:
            'Сезонная замена шин, балансировка колёс и профессиональный ремонт проколов.',
        },
        {
          key: 'mobileService',
          name: 'Serwis Mobilny',
          nameRu: 'Выезд мастера',
          description:
            'Помощь на дороге, аварийный запуск авто и мелкий ремонт с выездом к клиенту.',
        },
        {
          key: 'keys',
          name: 'Klucze',
          nameRu: 'Ключи',
          description:
            'Восстановление и программирование ключей.',
        },
      ],
    },
    servicesPage: {
      sundayBadge: 'Есть записи на ближайшее воскресенье!',
      serviceDetails: 'Подробнее об услуге',
    },
    serviceDetail: {
      symptomsHeading: 'Когда пора обратиться в сервис?',
      pricesDisclaimer:
        'Ориентировочные цены в PLN-брутто (1 PLN = 1 zł). Итоговая стоимость зависит от модели авто, запчастей и объёма работ.',
      fromPriceBand: 'Многие позиции в этой категории уже от {amount} PLN.',
      bookCta: 'Связаться по этой услуге',
      bookCtaHint: 'Перейдёте к контактам и быстро согласуем удобное время визита.',
    },
    aboutPage: {
      heroTitle: 'Car Service Nikol — ваш сервис в Jastrowo и в Шамотулах',
      heroSubtitle: 'Опыт, честность и соблюдение сроков. Работаем и по воскресеньям.',
      values: [
        { title: 'Честность', description: 'Перед ремонтом обсуждаем результаты диагностики и варианты. Клиент выбирает запчасти – оригинал или проверенные аналоги. Без скрытых доплат.' },
        { title: 'Сроки', description: 'Уважаем ваше время. Многие услуги – замена масла, тормоза, диагностика – делаем в тот же день.' },
        { title: 'Диагностика', description: 'Современное оборудование и опыт. Быстрая и точная диагностика – основа правильного и выгодного ремонта.' },
      ],
      sundayParagraph: 'Мы понимаем, что в будни машина нужна для работы – поэтому мы одни из немногих в районе Jastrowo и Шамотул работаем для вас и в воскресенье.',
      ctaTitle: 'Хотите проверить автомобиль? Свяжитесь с нами!',
      ctaButton: 'Контакт',
    },
    aboutBlock: {
      title: 'О нас — страсть и профессионализм | Jastrowo, в Шамотулах',
      paragraph1:
        'Car Service Nikol был создан для водителей, которые ценят свое время и ищут надежного механика в районе Шамотулы и Ястрово. Мы знаем, что поломка случается неожиданно, поэтому мы — одни из немногих, кто доступен для вас также в субботу и воскресенье.',
      paragraph2:
        'Мы специализируемся на комплексной механике: от компьютерной диагностики и ремонта ходовой до программирования ключей. Наш приоритет — честность: мы всегда объясняем объем работ и заботимся о том, чтобы ваш автомобиль вернулся на дорогу в идеальном состоянии.',
    },
    serviceCalculator: {
      title: 'Ориентировочный калькулятор — работа',
      subtitle: 'Скидка −10% на работу действует при выборе запчастей из сервиса.',
      partsLegend: 'Запчасти',
      servicesLegend: 'Услуги',
      partsOwn: 'Свои запчасти',
      partsWorkshop:
        'Запчасти из сервиса (гарантия на монтаж; −10% на работу в итоговой смете)',
      sumLabel: 'Сумма работ (ориентировочно)',
      sumDiscounted: 'После скидки −10% при запчастях из сервиса',
      savingsLine: 'Экономия ок. {amount} PLN на работе в смете.',
      bookCta: 'Связаться по этим позициям',
      selectHint: 'Выберите хотя бы одну позицию.',
      disclaimer:
        '*Ориентировочная работа без стоимости запчастей и расходников. Точную сумму сообщим после контакта или осмотра.',
    },
    location: {
      title: 'Локация и контакты',
      subtitle: 'Удобный подъезд из Ястрово, Шамотул и ближайших населённых пунктов.',
      addressLabel: 'Адрес сервиса',
      addressValue: 'ул. Wernisażowa 21, 64-500 Jastrowo, Польша',
      mapNote: 'Если нужно — подскажем маршрут по телефону или в мессенджере.',
      whatsapp: 'Написать в WhatsApp',
      telegram: 'Написать в Telegram',
      scheduleSundayHighlight: 'Работаем, когда другие закрыты!',
      trustPhrase: 'Из Шамотул до нас всего 10 минут!',
    },
    footer: {
      scheduleTitle: 'График работы по выходным',
      monFri: '',
      saturday: 'СУББОТА: 08:00 – 18:00',
      sunday: 'ВОСКРЕСЕНЬЕ: 10:00 – 16:00 (работаем по воскресеньям)',
      nipLabel: 'NIP',
      nipValue: '[placeholder]',
      regonLabel: 'REGON',
      regonValue: '[placeholder]',
      privacy: 'Политика конфиденциальности (RODO)',
      invoices: 'Документы по продаже по запросу — детали при обращении',
      mapLinkLabel: 'Google Maps — профиль и отзывы (Jastrowo)',
      seoKeywordsLine:
        'Автосервис Ястрово · Механик Шамотулы · Ремонт авто Jastrowo · Сервис по воскресеньям',
      rights: '© ' + new Date().getFullYear() + ' Car Service Nikol. Все права защищены.',
    },
    prompt: {
      title: 'Нужна помощь с авто?',
      text: 'Позвоните или напишите – поможем в Jastrowo и окрестностях. Работаем и в выходные.',
      ctaCall: 'Позвонить',
      ctaBook: 'Контакт',
      close: 'Закрыть',
    },
    galleryPage: {
      intro:
        'Фото из нашего сервиса в Jastrowo — работы, подъёмники и оборудование. Регулярно добавляем новые снимки (в том числе для клиентов из Шамотул и окрестностей).',
      photoAltPrefix: 'Галерея Car Service Nikol –',
    },
    faqPage: {
      intro:
        'Ответы на типичные вопросы — многие звучат при первом звонке. Если не нашли ответ, позвоните или напишите нам.',
    },
    nikolChat: {
      assistantName: 'Nikol',
      headerDisplayName: 'Nikol',
      headerTagline: 'Ваш ассистент Nikol',
      statusOnline: 'Online',
      headerSubtitle: 'онлайн-приёмная',
      avatarAlt: 'Николь Автосервис Чатик',
      fabAria: 'Открыть чат с Nikol — виртуальным администратором',
      nudgeTitle: 'Чем можем помочь?',
      nudgeBody:
        'Ориентир по цене, запись в сервис или вопрос по авто — напишите в чат. Nikol ответит как можно скорее.',
      nudgeCta: 'Открыть чат',
      nudgeDismissAria: 'Закрыть уведомление',
      title: 'Nikol — онлайн-приёмная',
      welcome:
        'Привет! Это Nikol из Car Service Nikol в Jastrowo. Чем помочь — ориентировочная цена, запись на визит или вопрос по авто? Напишите коротко.',
      placeholder: 'Ваше сообщение…',
      send: 'Отправить',
      close: 'Закрыть чат',
      thinking: 'Nikol печатает…',
      errorGeneric: 'Не удалось отправить сообщение. Попробуйте снова или позвоните.',
      errorUpstream:
        'Ассистент сейчас не смог получить ответ от сервиса ИИ. Попробуйте чуть позже или позвоните — поможем.',
      errorUnavailable:
        'Чат временно недоступен. Позвоните (+48 794 935 734) или напишите в WhatsApp — поможем так же.',
      errorMissingKey:
        'На сервере не задан ключ чата (GEMINI_API_KEY). В Vercel: Settings → Environment Variables — добавьте переменную для окружения Production, сохраните и сделайте Redeploy. Пока так: звоните (+48 794 935 734) или пишите в WhatsApp.',
    },
    sosRoadside: {
      label: 'SOS / Помощь на дороге',
      ariaLabel: 'SOS — отправить в WhatsApp сообщение о помощи на дороге',
      whatsAppMessage: 'SOS! Нужна срочная помощь на дороге — прошу связаться.',
    },
    reviews: {
      title: 'Отзывы Google',
      subtitle: 'Что говорят о нас клиенты',
      viewAllReviews: 'Смотреть все отзывы в Google',
      prevReview: 'Предыдущий отзыв',
      nextReview: 'Следующий отзыв',
      reviewN: 'Отзыв',
      noReviewsHint: 'Добавьте отзывы в файл data/googleReviews.js для отображения здесь.',
    },
  },
};

export function normalizeLang(lang) {
  if (!lang) return LANGUAGES.PL;
  const lower = String(lang).toLowerCase();
  if (!RUSSIAN_LOCALE_ENABLED && lower === LANGUAGES.RU) return LANGUAGES.PL;
  return SUPPORTED_LANGS.includes(lower) ? lower : LANGUAGES.PL;
}

export function getTranslations(lang) {
  const code = normalizeLang(lang);
  return translations[code];
}

/** Sekcja `nikolChat` zawsze z PL lub RU (także gdy RU jest wyłączone na stronie). */
export function getNikolChatStringsRawLocale(langCode) {
  const code = langCode === LANGUAGES.RU ? LANGUAGES.RU : LANGUAGES.PL;
  return translations[code]?.nikolChat ?? translations[LANGUAGES.PL].nikolChat;
}


