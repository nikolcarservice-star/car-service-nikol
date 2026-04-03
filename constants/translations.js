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

/**
 * Kotwica na /[lang]/contact przy głównym przycisku z href={PHONE_TEL_HREF}.
 * Nawigacja (header, FAB) wskazuje tu zamiast tel:, żeby crawlery nie raportowały „uncertain”.
 */
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
      bookCta: 'Umów wizytę',
      languageToggleLabel: 'Wybierz język',
      openMenu: 'Otwórz menu',
      closeMenu: 'Zamknij menu',
      menuLabel: 'Menu nawigacji',
    },
    hero: {
      title: 'Naprawimy Twój samochód, gdy inni odpoczywają',
      subtitle:
        'Serwis samochodowy Jastrowo i Szamotuły. Weekendowy serwis, szybka diagnostyka, naprawa hamulców i wymiana oleju – Twój zaufany mechanik.',
      ctaPrimary: 'Umów wizytę online',
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
      bookCta: 'Umów wizytę — ta usługa',
      bookCtaHint: 'Formularz na dole strony głównej otworzy się z wybraną usługą.',
    },
    aboutPage: {
      heroTitle: 'Car Service Nikol — Twój zaufany serwis w Jastrowo',
      heroSubtitle: 'Doświadczenie, uczciwość i terminowość. Pracujemy także w niedziele.',
      values: [
        { title: 'Uczciwość', description: 'Przed naprawą omawiamy wyniki diagnostyki i warianty. Klient wybiera części – oryginały lub sprawdzone zamienniki. Bez ukrytych kosztów.' },
        { title: 'Terminy', description: 'Szanujemy Twój czas. Wiele usług – wymiana oleju, hamulce, diagnostyka – wykonujemy tego samego dnia.' },
        { title: 'Diagnostyka', description: 'Nowoczesny sprzęt i doświadczenie. Szybka diagnoza to podstawa trafnego i ekonomicznego naprawy.' },
      ],
      sundayParagraph: 'Rozumiemy, że w tygodniu potrzebujesz auta do pracy – dlatego jako nieliczni w regionie Jastrowo i Szamotuły pracujemy dla Ciebie także w niedzielę.',
      ctaTitle: 'Chcesz sprawdzić swój samochód? Umów się na wizytę!',
      ctaButton: 'Umów wizytę',
    },
    aboutBlock: {
      title: 'O nas — Pasja i Profesjonalizm w Jastrowo',
      paragraph1:
        'Car Service Nikol powstał z myślą o kierowcach, którzy cenią swój czas i szukają niezawodnego mechanika w okolicy Szamotuł i Jastrowo. Wiemy, że awaria auta nie wybiera godziny, dlatego jako jedni z nielicznych jesteśmy do Twojej dyspozycji również w soboty i niedziele.',
      paragraph2:
        'Specjalizujemy się w kompleksowej mechanice: od diagnostyki komputerowej, przez serwis zawieszenia, aż po kodowanie kluczy. Nasz priorytet to uczciwe podejście — zawsze tłumaczymy zakres prac i dbamy o to, by Twój samochód wrócił na drogę w idealnym stanie.',
    },
    booking: {
      title: 'Umów wizytę online',
      subtitle:
        'Zostaw dane — zgłoszenie trafi do warsztatu. Oddzwonimy lub odpowiemy, aby potwierdzić termin.',
      trustLine: 'Szybka odpowiedź · Termin dopasowany do Ciebie',
      ctaSubtext: 'Odpowiadamy w ciągu kilku godzin',
      nameLabel: 'Imię i nazwisko',
      phoneLabel: 'Telefon',
      carLabel: 'Marka i model samochodu',
      serviceLabel: 'Rodzaj usługi',
      dateLabel: 'Preferowana data',
      dateQuickHint: 'Szybki wybór weekendów (sob.–niedz.); inny dzień ustawisz w kalendarzu:',
      calendarHelp:
        'Kalendarz poniżej — możesz wybrać dowolny dzień; proponowana data jest orientacyjna, dokładny termin potwierdzimy telefonicznie.',
      timePreferenceLabel: 'Preferowany przedział godzin (orientacyjnie)',
      timeAny: 'Dowolna pora (w godzinach otwarcia)',
      timeMorning: 'Rano 8:00–12:00',
      timeAfternoon: 'Popołudnie 12:00–16:00',
      photosLabel: 'Zdjęcia (opcjonalnie)',
      photosHint:
        'Np. dowód rejestracyjny, miejsce wycieku — do 3 zdjęć (JPG, PNG, WebP), ok. 4 MB łącznie. Ułatwia wstępną wycenę.',
      photoRemove: 'Usuń',
      photoTooBig: 'Plik jest za duży (max ok. 1,5 MB na zdjęcie).',
      photoWrongType: 'Dozwolone są tylko pliki graficzne (JPG, PNG, WebP).',
      messageLabel: 'Dodatkowy opis (opcjonalnie)',
      servicePlaceholder: 'Wybierz usługę',
      submitLabel: 'Wyślij zgłoszenie',
      successTitle: 'Dziękujemy! Zgłoszenie zostało wysłane.',
      successBody: 'Skontaktujemy się z Tobą, aby potwierdzić termin i szczegóły naprawy.',
      errorMessage:
        'Nie udało się wysłać zgłoszenia. Spróbuj ponownie za chwilę lub zadzwoń do nas.',
      notifyNotDelivered:
        'Zgłoszenie zapisane, ale automatyczne powiadomienie do warsztatu nie wyszło (brak konfiguracji na serwerze). Zadzwoń lub napisz — żeby nic nie umknęło.',
      validation: {
        nameRequired: 'Podaj imię i nazwisko.',
        phoneRequired: 'Podaj numer telefonu.',
        phoneInvalid: 'Podaj poprawny numer telefonu w formacie +48 XXX XXX XXX.',
        carRequired: 'Podaj markę i model samochodu.',
        serviceRequired: 'Wybierz rodzaj usługi.',
        dateRequired: 'Wybierz preferowaną datę.',
      },
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
      bookCta: 'Umów wizytę na te usługi',
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
      text: 'Umów wizytę lub zadzwoń – pomożemy w Jastrowo i okolicach. Pracujemy też w weekendy.',
      ctaCall: 'Zadzwoń',
      ctaBook: 'Umów wizytę',
      close: 'Zamknij',
    },
    galleryPage: {
      intro:
        'Zdjęcia z naszego warsztatu w Jastrowo — prace serwisowe, stanowiska i sprzęt. Galerię regularnie uzupełniamy o nowe realizacje (także dla klientów z Szamotuł i okolic).',
      photoAltPrefix: 'Galeria Car Service Nikol –',
    },
    faqPage: {
      intro:
        'Odpowiedzi na typowe pytania — wiele z nich pada przy pierwszym kontakcie telefonicznym. Jeśli nie znalazłeś odpowiedzi, zadzwoń lub umów wizytę online.',
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
      bookCta: 'Записаться',
      languageToggleLabel: 'Выбор языка',
      openMenu: 'Открыть меню',
      closeMenu: 'Закрыть меню',
      menuLabel: 'Меню навигации',
    },
    hero: {
      title: 'Починим ваш авто, пока другие отдыхают',
      subtitle:
        'Ваш надёжный автосервис в Ястрове. Специализируемся на быстрой диагностике и ремонтах в выходные дни.',
      ctaPrimary: 'Записаться онлайн',
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
      bookCta: 'Записаться на эту услугу',
      bookCtaHint: 'В форме на главной странице услуга будет выбрана автоматически.',
    },
    aboutPage: {
      heroTitle: 'Car Service Nikol — ваш надёжный сервис в Jastrowo',
      heroSubtitle: 'Опыт, честность и соблюдение сроков. Работаем и по воскресеньям.',
      values: [
        { title: 'Честность', description: 'Перед ремонтом обсуждаем результаты диагностики и варианты. Клиент выбирает запчасти – оригинал или проверенные аналоги. Без скрытых доплат.' },
        { title: 'Сроки', description: 'Уважаем ваше время. Многие услуги – замена масла, тормоза, диагностика – делаем в тот же день.' },
        { title: 'Диагностика', description: 'Современное оборудование и опыт. Быстрая и точная диагностика – основа правильного и выгодного ремонта.' },
      ],
      sundayParagraph: 'Мы понимаем, что в будни машина нужна для работы – поэтому мы одни из немногих в районе Jastrowo и Шамотул работаем для вас и в воскресенье.',
      ctaTitle: 'Хотите проверить автомобиль? Запишитесь на визит!',
      ctaButton: 'Записаться',
    },
    aboutBlock: {
      title: 'О нас — Страсть и профессионализм в Ястрово',
      paragraph1:
        'Car Service Nikol был создан для водителей, которые ценят свое время и ищут надежного механика в районе Шамотулы и Ястрово. Мы знаем, что поломка случается неожиданно, поэтому мы — одни из немногих, кто доступен для вас также в субботу и воскресенье.',
      paragraph2:
        'Мы специализируемся на комплексной механике: от компьютерной диагностики и ремонта ходовой до программирования ключей. Наш приоритет — честность: мы всегда объясняем объем работ и заботимся о том, чтобы ваш автомобиль вернулся на дорогу в идеальном состоянии.',
    },
    booking: {
      title: 'Онлайн-запись в сервис',
      subtitle:
        'Оставьте данные — заявка попадёт в сервис. Мы перезвоним или ответим, чтобы согласовать время.',
      trustLine: 'Быстрый ответ · Удобное для вас время',
      ctaSubtext: 'Ответим в течение нескольких часов',
      nameLabel: 'Имя и фамилия',
      phoneLabel: 'Телефон',
      carLabel: 'Марка и модель автомобиля',
      serviceLabel: 'Тип услуги',
      dateLabel: 'Предпочтительная дата',
      dateQuickHint: 'Быстрый выбор выходных (сб–вс); другой день — в календаре:',
      calendarHelp:
        'В календаре можно выбрать любой день; дата ориентировочная, точное время согласуем по телефону после заявки.',
      timePreferenceLabel: 'Предпочтительное время визита (ориентировочно)',
      timeAny: 'Любое время (в часы работы)',
      timeMorning: 'Утро 8:00–12:00',
      timeAfternoon: 'День 12:00–16:00',
      photosLabel: 'Фото (необязательно)',
      photosHint:
        'Например, техпаспорт, место течи, повреждение — до 3 фото (JPG, PNG, WebP), около 4 МБ всего. Упрощает предварительную оценку.',
      photoRemove: 'Удалить',
      photoTooBig: 'Файл слишком большой (макс. около 1,5 МБ на фото).',
      photoWrongType: 'Допустимы только изображения (JPG, PNG, WebP).',
      messageLabel: 'Дополнительное описание (необязательно)',
      servicePlaceholder: 'Выберите услугу',
      submitLabel: 'Отправить заявку',
      successTitle: 'Спасибо! Заявка отправлена.',
      successBody: 'Мы свяжемся с вами, чтобы подтвердить дату и детали ремонта.',
      errorMessage:
        'Не удалось отправить заявку. Попробуйте позже или позвоните нам.',
      notifyNotDelivered:
        'Заявка принята, но автоматическое уведомление в сервис не ушло (нет настройки на сервере). Позвоните или напишите — чтобы ничего не потерялось.',
      validation: {
        nameRequired: 'Укажите имя и фамилию.',
        phoneRequired: 'Укажите номер телефона.',
        phoneInvalid: 'Укажите корректный номер телефона в формате +48 XXX XXX XXX.',
        carRequired: 'Укажите марку и модель автомобиля.',
        serviceRequired: 'Выберите тип услуги.',
        dateRequired: 'Выберите предпочтительную дату.',
      },
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
      bookCta: 'Записаться на эти позиции',
      selectHint: 'Выберите хотя бы одну позицию.',
      disclaimer:
        '*Ориентировочная работа без стоимости запчастей и расходников. Точную сумму сообщим после контакта или осмотра.',
    },
    location: {
      title: 'Локация и контакты',
      subtitle: 'Удобный подъезд из Ястрово, Шамотул и ближайших населённых пунктов.',
      addressLabel: 'Адрес сервиса',
      addressValue: 'ул. Wernisażowa 21, 64-500 Jastrowo, Польша',
      mapNote: 'Точный маршрут подтверждаем по телефону при записи.',
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
      invoices: 'Документы по продаже по запросу — детали при записи',
      mapLinkLabel: 'Google Maps — профиль и отзывы (Jastrowo)',
      seoKeywordsLine:
        'Автосервис Ястрово · Механик Шамотулы · Ремонт авто Jastrowo · Сервис по воскресеньям',
      rights: '© ' + new Date().getFullYear() + ' Car Service Nikol. Все права защищены.',
    },
    prompt: {
      title: 'Нужна помощь с авто?',
      text: 'Запишитесь на приём или позвоните – поможем в Jastrowo и окрестностях. Работаем и в выходные.',
      ctaCall: 'Позвонить',
      ctaBook: 'Записаться',
      close: 'Закрыть',
    },
    galleryPage: {
      intro:
        'Фото из нашего сервиса в Jastrowo — работы, подъёмники и оборудование. Регулярно добавляем новые снимки (в том числе для клиентов из Шамотул и окрестностей).',
      photoAltPrefix: 'Галерея Car Service Nikol –',
    },
    faqPage: {
      intro:
        'Ответы на типичные вопросы — многие звучат при первом звонке. Если не нашли ответ, позвоните или запишитесь онлайн.',
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


