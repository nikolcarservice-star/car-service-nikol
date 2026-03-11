export const LANGUAGES = {
  PL: 'pl',
  RU: 'ru',
};

export const SUPPORTED_LANGS = [LANGUAGES.PL, LANGUAGES.RU];

export const PHONE_DISPLAY = '+48 794 935 734';
export const PHONE_RAW = '48794935734';

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
      phoneCta: 'Zadzwoń',
      bookCta: 'Umów wizytę',
      languageToggleLabel: 'Wybierz język',
    },
    hero: {
      title: 'Naprawimy Twój samochód, gdy inni odpoczywają',
      subtitle:
        'Serwis samochodowy Jastrowo i Szamotuły. Weekendowy serwis, szybka diagnostyka, naprawa hamulców i wymiana oleju – Twój zaufany mechanik.',
      ctaPrimary: 'Umów wizytę online',
      ctaSecondary: 'Zadzwoń teraz',
      sundayBadge: 'Otwarte w niedziele!',
      scheduleTitle: 'Weekendowe godziny otwarcia',
      saturday: 'SOBOTA: 08:00 – 18:00',
      sunday: 'NIEDZIELA: 10:00 – 16:00',
      trustSignals: [
        'Gwarancja na części',
        'Szybka diagnostyka',
        'Konkurencyjne ceny',
      ],
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
      subtitle: 'Zostaw nam swoje dane – oddzwonimy i potwierdzimy termin wizyty w serwisie.',
      trustLine: 'Szybka odpowiedź · Termin dopasowany do Ciebie',
      ctaSubtext: 'Odpowiemy w ciągu kilku godzin',
      nameLabel: 'Imię i nazwisko',
      phoneLabel: 'Telefon',
      carLabel: 'Marka i model samochodu',
      serviceLabel: 'Rodzaj usługi',
      dateLabel: 'Preferowana data',
      messageLabel: 'Dodatkowy opis (opcjonalnie)',
      servicePlaceholder: 'Wybierz usługę',
      submitLabel: 'Wyślij zgłoszenie',
      successTitle: 'Dziękujemy! Zgłoszenie zostało wysłane.',
      successBody: 'Skontaktujemy się z Tobą, aby potwierdzić termin i szczegóły naprawy.',
      errorMessage: 'Coś poszło nie tak. Spróbuj ponownie za chwilę.',
      validation: {
        nameRequired: 'Podaj imię i nazwisko.',
        phoneRequired: 'Podaj numer telefonu.',
        phoneInvalid: 'Podaj poprawny numer telefonu w formacie +48 XXX XXX XXX.',
        carRequired: 'Podaj markę i model samochodu.',
        serviceRequired: 'Wybierz rodzaj usługi.',
        dateRequired: 'Wybierz preferowaną datę.',
      },
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
      invoices: 'Wystawiamy faktury VAT',
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
      phoneCta: 'Позвонить',
      bookCta: 'Записаться',
      languageToggleLabel: 'Выбор языка',
    },
    hero: {
      title: 'Починим ваш авто, пока другие отдыхают',
      subtitle:
        'Ваш надёжный автосервис в Ястрове. Специализируемся на быстрой диагностике и ремонтах в выходные дни.',
      ctaPrimary: 'Записаться онлайн',
      ctaSecondary: 'Позвонить сейчас',
      sundayBadge: 'Работаем по воскресеньям!',
      scheduleTitle: 'График работы по выходным',
      saturday: 'СУББОТА: 08:00 – 18:00',
      sunday: 'ВОСКРЕСЕНЬЕ: 10:00 – 16:00',
      trustSignals: [
        'Гарантия на запчасти',
        'Быстрая диагностика',
        'Конкурентные цены',
      ],
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
          title: 'Бырое обслуживание',
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
        'Оставьте свои данные — мы перезвоним и согласуем удобное время посещения сервиса.',
      trustLine: 'Быстрый ответ · Удобное для вас время',
      ctaSubtext: 'Ответим в течение нескольких часов',
      nameLabel: 'Имя и фамилия',
      phoneLabel: 'Телефон',
      carLabel: 'Марка и модель автомобиля',
      serviceLabel: 'Тип услуги',
      dateLabel: 'Предпочтительная дата',
      messageLabel: 'Дополнительное описание (необязательно)',
      servicePlaceholder: 'Выберите услугу',
      submitLabel: 'Отправить заявку',
      successTitle: 'Спасибо! Ваша заявка отправлена.',
      successBody: 'Мы свяжемся с вами, чтобы подтвердить дату и детали ремонта.',
      errorMessage: 'Что-то пошло не так. Попробуйте ещё раз позже.',
      validation: {
        nameRequired: 'Укажите имя и фамилию.',
        phoneRequired: 'Укажите номер телефона.',
        phoneInvalid: 'Укажите корректный номер телефона в формате +48 XXX XXX XXX.',
        carRequired: 'Укажите марку и модель автомобиля.',
        serviceRequired: 'Выберите тип услуги.',
        dateRequired: 'Выберите предпочтительную дату.',
      },
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
      invoices: 'Выставляем счета-фактуры VAT',
      seoKeywordsLine:
        'Mechanik Jastrowo · Serwis samochodowy Szamotuły · Naprawa aut Jastrowo · Warsztat samochodowy czynny w niedzielę',
      rights: '© ' + new Date().getFullYear() + ' Car Service Nikol. Все права защищены.',
    },
    prompt: {
      title: 'Нужна помощь с авто?',
      text: 'Запишитесь на приём или позвоните – поможем в Jastrowo и окрестностях. Работаем и в выходные.',
      ctaCall: 'Позвонить',
      ctaBook: 'Записаться',
      close: 'Закрыть',
    },
  },
};

export function normalizeLang(lang) {
  if (!lang) return LANGUAGES.PL;
  const lower = String(lang).toLowerCase();
  return SUPPORTED_LANGS.includes(lower) ? lower : LANGUAGES.PL;
}

export function getTranslations(lang) {
  const code = normalizeLang(lang);
  return translations[code];
}


