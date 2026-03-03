export const LANGUAGES = {
  PL: 'pl',
  RU: 'ru',
};

export const SUPPORTED_LANGS = [LANGUAGES.PL, LANGUAGES.RU];

export const PHONE_DISPLAY = '+48 600 000 600';
export const PHONE_RAW = '48600000600';

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
      phoneCta: 'Zadzwoń',
      languageToggleLabel: 'Wybierz język',
    },
    hero: {
      title: 'Naprawimy Twój samochód, gdy inni odpoczywają',
      subtitle:
        'Twój zaufany serwis w Jastrowo. Specjalizujemy się w szybkiej diagnostyce i naprawach w weekendy.',
      ctaPrimary: 'Umów wizytę online',
      ctaSecondary: 'Zadzwoń teraz',
      sundayBadge: 'Otwarte w niedziele!',
      scheduleTitle: 'Weekendowe godziny otwarcia',
      saturday: 'SOBOTA: 08:00 – 18:00',
      sunday: 'NIEDZIELA: 10:00 – 16:00',
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
    booking: {
      title: 'Umów wizytę online',
      subtitle: 'Zostaw nam swoje dane – oddzwonimy i potwierdzimy termin wizyty w serwisie.',
      nameLabel: 'Imię i nazwisko',
      phoneLabel: 'Telefon',
      carLabel: 'Model samochodu',
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
        carRequired: 'Podaj model samochodu.',
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
        'Mechanik Jastrowo · Serwis samochodowy Szamotuły · Naprawa aut Jastrowo · Warsztat samochodowy czynny w niedzielę',
      rights: '© ' + new Date().getFullYear() + ' Car Service Nikol. Wszystkie prawa zastrzeżone.',
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
      phoneCta: 'Позвонить',
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
    booking: {
      title: 'Онлайн-запись в сервис',
      subtitle:
        'Оставьте свои данные — мы перезвоним и согласуем удобное время посещения сервиса.',
      nameLabel: 'Имя и фамилия',
      phoneLabel: 'Телефон',
      carLabel: 'Модель автомобиля',
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
        carRequired: 'Укажите модель автомобиля.',
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


