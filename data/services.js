import { LANGUAGES, normalizeLang } from '../constants/translations';

export const SERVICE_KEYS = ['suspension', 'oil', 'brakes', 'diagnostics', 'ac', 'timing'];

export const servicesData = {
  suspension: {
    slug: 'naprawa-zawieszenia-poznan',
    pl: {
      name: 'Naprawa zawieszenia',
      shortName: 'Zawieszenie',
      h1: 'Naprawa zawieszenia Poznań - Car Service Nikol',
      seoTitle: 'Naprawa zawieszenia w Poznaniu - Car Service Nikol',
      seoDescription:
        'Profesjonalna naprawa zawieszenia w Poznaniu. Wymiana amortyzatorów, wahaczy, sworzni, tulei i sprężyn. Szybka diagnostyka, uczciwe ceny, gwarancja na wykonaną usługę.',
      intro:
        'Zawieszenie odpowiada za komfort jazdy, prowadzenie samochodu i bezpieczeństwo na drodze. W Car Service Nikol w Poznaniu diagnozujemy i naprawiamy zawieszenie w samochodach osobowych i dostawczych – od luźnych tulei po zużyte amortyzatory.',
      process: [
        'Rozpoczynamy od dokładnej diagnostyki na ścieżce prób, podnośniku oraz podczas jazdy próbnej. Sprawdzamy stan amortyzatorów, sprężyn, wahaczy, sworzni, tulei, łączników stabilizatora i układu kierowniczego.',
        'Po diagnozie omawiamy z Tobą zakres naprawy i proponujemy kilka wariantów części – zamienniki dobrej jakości lub elementy OE. Z góry znasz orientacyjny koszt i czas wykonania usługi.',
        'Podczas montażu używamy sprawdzonych narzędzi i zachowujemy procedury producentów. Po zakończeniu prac zalecamy geometrię kół, aby samochód prowadził się stabilnie i równomiernie zużywał opony.',
      ],
      pricesIntro: 'Przykładowe ceny usług związanych z zawieszeniem:',
      prices: [
        { label: 'Diagnostyka zawieszenia', value: 'od 120 zł' },
        { label: 'Wymiana amortyzatora (1 szt.)', value: 'od 180 zł robocizna' },
        { label: 'Wymiana wahacza kompletnego', value: 'od 220 zł robocizna' },
      ],
    },
    ru: {
      name: 'Ремонт ходовой',
      shortName: 'Ходовая',
      h1: 'Ремонт ходовой Познань - Car Service Nikol',
      seoTitle: 'Ремонт ходовой в Познани - Car Service Nikol',
      seoDescription:
        'Профессиональный ремонт ходовой части в Познани. Замена амортизаторов, рычагов, шаровых опор, сайлентблоков и пружин. Быстрая диагностика и честные цены.',
      intro:
        'Ходовая часть напрямую влияет на устойчивость автомобиля и вашу безопасность. В Car Service Nikol мы проводим полную диагностику и ремонт подвески легковых и легких коммерческих автомобилей.',
      process: [
        'Сначала проводим диагностику на подъемнике и тестовой дороге: проверяем амортизаторы, пружины, рычаги, сайлентблоки, стойки стабилизатора и рулевые тяги.',
        'После осмотра подробно объясняем, какие элементы требуют замены, и согласуем стоимость работ и запчастей. Вы заранее знаете, сколько будет стоить ремонт.',
        'При установке используем качественные детали и соблюдаем технические требования производителей. После ремонта рекомендуем сделать развал-схождение.',
      ],
      pricesIntro: 'Примеры цен на работы по ходовой части:',
      prices: [
        { label: 'Диагностика ходовой части', value: 'от 120 zł' },
        { label: 'Замена амортизатора (1 шт.)', value: 'от 180 zł работа' },
        { label: 'Замена рычага в сборе', value: 'от 220 zł работа' },
      ],
    },
  },
  oil: {
    slug: 'wymiana-oleju-i-filtrow-poznan',
    pl: {
      name: 'Wymiana oleju i filtrów',
      shortName: 'Oleje i filtry',
      h1: 'Wymiana oleju i filtrów Poznań - Car Service Nikol',
      seoTitle: 'Wymiana oleju i filtrów w Poznaniu - Car Service Nikol',
      seoDescription:
        'Szybka wymiana oleju i filtrów w Poznaniu. Dobór odpowiedniego oleju, kontrola stanu silnika, uczciwe ceny i ekologiczna utylizacja zużytego oleju.',
      intro:
        'Regularna wymiana oleju i filtrów to podstawa długiej i bezproblemowej pracy silnika. W naszym serwisie dobieramy olej zgodnie z zaleceniami producenta i stylu jazdy, a całą usługę wykonujemy zwykle w mniej niż godzinę.',
      process: [
        'Sprawdzamy historię serwisową pojazdu, przebieg oraz specyfikację producenta. Na tej podstawie dobieramy odpowiedni olej i filtry.',
        'Opróżniamy układ smarowania, wymieniamy filtr oleju, uszczelkę korka spustowego i nalewamy świeży olej z dokładnym pomiarem poziomu.',
        'Przy okazji kontrolujemy stan pozostałych filtrów: powietrza, kabinowego i paliwa, a także wizualnie sprawdzamy szczelność silnika.',
      ],
      pricesIntro: 'Przykładowe ceny związane z wymianą oleju i filtrów:',
      prices: [
        { label: 'Wymiana oleju + filtr oleju', value: 'od 220 zł z materiałem' },
        { label: 'Wymiana filtra powietrza', value: 'od 40 zł robocizna' },
        { label: 'Wymiana filtra kabinowego', value: 'od 50 zł robocizna' },
      ],
    },
    ru: {
      name: 'Замена масла и фильтров',
      shortName: 'Масла и фильтры',
      h1: 'Замена масла и фильтров Познань - Car Service Nikol',
      seoTitle: 'Замена масла и фильтров в Познани - Car Service Nikol',
      seoDescription:
        'Быстрая замена моторного масла и фильтров в Познани. Подбор масла по допускам производителя, проверка состояния двигателя и утилизация отработанного масла.',
      intro:
        'Своевременная замена масла и фильтров защищает двигатель от износа и перегрева. Мы подбираем масло по допускам производителя и вашему стилю езды, а работу выполняем быстро и аккуратно.',
      process: [
        'Проверяем сервисную историю, пробег и технические требования производителя. Предлагаем несколько вариантов качественных масел.',
        'Сливаем отработанное масло, меняем масляный фильтр и уплотнительное кольцо пробки, затем заливаем новое масло и проверяем уровень.',
        'По желанию клиента меняем воздушный, салонный и топливный фильтры, а также осматриваем двигатель на предмет течей.',
      ],
      pricesIntro: 'Примеры цен на замену масла и фильтров:',
      prices: [
        { label: 'Замена масла + масляный фильтр', value: 'от 220 zł с материалами' },
        { label: 'Замена воздушного фильтра', value: 'от 40 zł работа' },
        { label: 'Замена салонного фильтра', value: 'от 50 zł работа' },
      ],
    },
  },
  brakes: {
    slug: 'serwis-hamulcow-poznan',
    pl: {
      name: 'Serwis hamulców',
      shortName: 'Hamulce',
      h1: 'Serwis i naprawa hamulców Poznań - Car Service Nikol',
      seoTitle: 'Wymiana klocków i tarcz hamulcowych Poznań - Car Service Nikol',
      seoDescription:
        'Serwis hamulców w Poznaniu: wymiana klocków, tarcz, płynu hamulcowego i przewodów. Profesjonalna diagnoza i krótkie terminy.',
      intro:
        'Sprawne hamulce to podstawa bezpieczeństwa. W naszym serwisie sprawdzamy skuteczność hamowania, stan klocków, tarcz, przewodów i płynu hamulcowego, a następnie proponujemy optymalne rozwiązanie.',
      process: [
        'Na początku wykonujemy pomiar grubości tarcz i klocków, sprawdzamy stan zacisków oraz równomierność hamowania.',
        'Dobieramy części renomowanych producentów, montujemy je z zachowaniem momentów dokręcania i czyścimy powierzchnie robocze.',
        'Po montażu odpowietrzamy układ hamulcowy, sprawdzamy poziom płynu i wykonujemy jazdę próbną.',
      ],
      pricesIntro: 'Przykładowe ceny serwisu hamulców:',
      prices: [
        { label: 'Wymiana klocków hamulcowych (oś)', value: 'od 160 zł robocizna' },
        { label: 'Wymiana tarcz + klocków (oś)', value: 'od 260 zł robocizna' },
        { label: 'Wymiana płynu hamulcowego', value: 'od 150 zł z materiałem' },
      ],
    },
    ru: {
      name: 'Сервис тормозной системы',
      shortName: 'Тормоза',
      h1: 'Ремонт и обслуживание тормозов Познань - Car Service Nikol',
      seoTitle: 'Ремонт тормозов в Познани - Car Service Nikol',
      seoDescription:
        'Обслуживание тормозной системы в Познани: замена колодок и дисков, тормозной жидкости и шлангов. Точная диагностика и гарантия на работы.',
      intro:
        'От исправности тормозов зависит ваша безопасность. Мы диагностируем состояние колодок, дисков, суппортов и тормозной жидкости, а затем выполняем необходимый ремонт.',
      process: [
        'Диагностируем тормозную систему на стенде, проверяем толщину колодок и дисков, состояние суппортов и гибких шлангов.',
        'Устанавливаем новые детали, очищаем направляющие и поверхности соприкосновения, используем смазки, устойчивые к высокой температуре.',
        'Прокачиваем систему, проверяем уровень и состояние тормозной жидкости, проводим тест-драйв.',
      ],
      pricesIntro: 'Примеры цен на сервис тормозов:',
      prices: [
        { label: 'Замена тормозных колодок (ось)', value: 'от 160 zł работа' },
        { label: 'Замена дисков + колодок (ось)', value: 'от 260 zł работа' },
        { label: 'Замена тормозной жидкости', value: 'от 150 zł с материалами' },
      ],
    },
  },
  diagnostics: {
    slug: 'diagnostyka-komputerowa-poznan',
    pl: {
      name: 'Diagnostyka komputerowa',
      shortName: 'Diagnostyka',
      h1: 'Diagnostyka komputerowa Poznań - Car Service Nikol',
      seoTitle: 'Diagnostyka komputerowa samochodu w Poznaniu - Car Service Nikol',
      seoDescription:
        'Zaawansowana diagnostyka komputerowa w Poznaniu. Odczyt błędów, analiza parametrów pracy silnika i elektroniki, jasna informacja o przyczynie usterki.',
      intro:
        'Nowoczesne samochody pełne są elektroniki. Dzięki profesjonalnym testerom diagnostycznym odczytujemy błędy sterowników i parametry pracy silnika, aby szybko znaleźć przyczynę problemu.',
      process: [
        'Podłączamy tester diagnostyczny do gniazda OBD i wykonujemy pełny skan sterowników pojazdu.',
        'Analizujemy zapisane błędy oraz bieżące parametry pracy silnika, wtrysku, turbiny, DPF i innych podzespołów.',
        'Po diagnostyce omawiamy wyniki i proponujemy dalsze kroki naprawy wraz z orientacyjnymi kosztami.',
      ],
      pricesIntro: 'Przykładowe ceny diagnostyki komputerowej:',
      prices: [
        { label: 'Podstawowa diagnostyka komputerowa', value: 'od 150 zł' },
        { label: 'Rozszerzona diagnostyka kilku układów', value: 'od 220 zł' },
      ],
    },
    ru: {
      name: 'Компьютерная диагностика',
      shortName: 'Диагностика',
      h1: 'Компьютерная диагностика Познань - Car Service Nikol',
      seoTitle: 'Компьютерная диагностика автомобиля в Познани - Car Service Nikol',
      seoDescription:
        'Компьютерная диагностика автомобиля в Познани: считывание ошибок, проверка параметров работы двигателя и электроники, рекомендации по ремонту.',
      intro:
        'Электроника современного автомобиля требует точной диагностики. Мы используем профессиональные сканеры, чтобы быстро определить источник неисправности.',
      process: [
        'Подключаем диагностический сканер к разъёму OBD и выполняем полное сканирование блоков управления.',
        'Изучаем сохранённые ошибки и текущие параметры работы двигателя, топливной системы и других узлов.',
        'Объясняем результаты простым языком и предлагаем план дальнейшего ремонта.',
      ],
      pricesIntro: 'Примеры цен на компьютерную диагностику:',
      prices: [
        { label: 'Базовая компьютерная диагностика', value: 'от 150 zł' },
        { label: 'Расширенная диагностика нескольких систем', value: 'от 220 zł' },
      ],
    },
  },
  ac: {
    slug: 'serwis-klimatyzacji-poznan',
    pl: {
      name: 'Serwis klimatyzacji',
      shortName: 'Klimatyzacja',
      h1: 'Serwis klimatyzacji Poznań - Car Service Nikol',
      seoTitle: 'Serwis i nabicie klimatyzacji w Poznaniu - Car Service Nikol',
      seoDescription:
        'Serwis klimatyzacji samochodowej w Poznaniu: odgrzybianie, nabicie czynnika, test szczelności i naprawa układu.',
      intro:
        'Sprawna klimatyzacja zapewnia komfort jazdy latem i suchość szyb zimą. Wykonujemy kompleksowy serwis klimatyzacji, od odgrzybiania wnętrza po uzupełnienie czynnika i oleju w układzie.',
      process: [
        'Sprawdzamy szczelność układu, stan przewodów, sprężarki i skraplacza, a także działanie wentylatorów.',
        'Opróżniamy układ z czynnika, wykonujemy próżnię, uzupełniamy odpowiednią ilość czynnika i oleju.',
        'Na końcu odgrzybiamy układ i wnętrze pojazdu, aby pozbyć się nieprzyjemnych zapachów i drobnoustrojów.',
      ],
      pricesIntro: 'Przykładowe ceny serwisu klimatyzacji:',
      prices: [
        { label: 'Serwis klimatyzacji z uzupełnieniem czynnika', value: 'od 260 zł' },
        { label: 'Odgrzybianie klimatyzacji', value: 'od 120 zł' },
      ],
    },
    ru: {
      name: 'Сервис кондиционера',
      shortName: 'Кондиционер',
      h1: 'Сервис кондиционера Познань - Car Service Nikol',
      seoTitle: 'Сервис и заправка кондиционера в Познани - Car Service Nikol',
      seoDescription:
        'Обслуживание автомобильного кондиционера в Познани: проверка герметичности, заправка фреоном, удаление запахов и бактерий.',
      intro:
        'Исправный кондиционер обеспечивает комфорт в жару и предотвращает запотевание стёкол. Мы выполняем полный сервис системы кондиционирования.',
      process: [
        'Проверяем систему на герметичность, оцениваем состояние шлангов, радиатора и компрессора.',
        'Откачиваем старый фреон, создаём вакуум, затем заправляем систему нужным количеством хладагента и масла.',
        'Проводим дезинфекцию испарителя и салона, чтобы удалить запахи и микроорганизмы.',
      ],
      pricesIntro: 'Примеры цен на сервис кондиционера:',
      prices: [
        { label: 'Полный сервис кондиционера с заправкой', value: 'от 260 zł' },
        { label: 'Дезинфекция и удаление запахов', value: 'от 120 zł' },
      ],
    },
  },
  timing: {
    slug: 'wymiana-rozrzadu-poznan',
    pl: {
      name: 'Wymiana rozrządu',
      shortName: 'Rozrząd',
      h1: 'Wymiana rozrządu Poznań - Car Service Nikol',
      seoTitle: 'Wymiana paska rozrządu w Poznaniu - Car Service Nikol',
      seoDescription:
        'Profesjonalna wymiana paska lub łańcucha rozrządu w Poznaniu. Kompletny serwis z pompą wody i napinaczami, zgodnie z zaleceniami producenta.',
      intro:
        'Uszkodzony rozrząd może doprowadzić do poważnej awarii silnika. W naszym serwisie wymieniamy kompletne zestawy rozrządu, dbając o prawidłowe ustawienie faz rozrządu i momenty dokręcania.',
      process: [
        'Na podstawie numeru VIN i przebiegu sprawdzamy interwały wymiany rozrządu i dobieramy odpowiedni zestaw.',
        'Demontujemy osprzęt, zabezpieczamy silnik specjalnymi blokadami i wymieniamy pasek lub łańcuch, rolki, napinacze oraz pompę wody (jeśli występuje w zestawie).',
        'Po montażu sprawdzamy szczelność układu chłodzenia, poziom płynów i wykonujemy jazdę próbną.',
      ],
      pricesIntro: 'Przykładowe ceny wymiany rozrządu:',
      prices: [
        { label: 'Wymiana paska rozrządu (silnik 4-cyl.)', value: 'od 900 zł robocizna' },
        { label: 'Wymiana łańcucha rozrządu', value: 'wycena indywidualna' },
      ],
    },
    ru: {
      name: 'Замена ГРМ',
      shortName: 'ГРМ',
      h1: 'Замена ГРМ Познань - Car Service Nikol',
      seoTitle: 'Замена ремня или цепи ГРМ в Познани - Car Service Nikol',
      seoDescription:
        'Профессиональная замена ремня или цепи ГРМ в Познани. Полный сервис с заменой роликов, натяжителей и помпы охлаждения.',
      intro:
        'Своевременная замена ГРМ защищает двигатель от серьёзных поломок. Мы работаем по заводским регламентам и используем комплектующие проверенных брендов.',
      process: [
        'По VIN и пробегу уточняем рекомендуемый интервал замены и подбираем подходящий комплект ГРМ.',
        'Разбираем необходимый навесной агрегат, фиксируем валы специнструментом и меняем ремень или цепь вместе с роликами и помпой.',
        'После сборки проверяем уровни жидкостей, запускаем двигатель и контролируем его работу.',
      ],
      pricesIntro: 'Примеры цен на замену ГРМ:',
      prices: [
        { label: 'Замена ремня ГРМ (4-цилиндровый двигатель)', value: 'от 900 zł работа' },
        { label: 'Замена цепи ГРМ', value: 'индивидуальный расчёт' },
      ],
    },
  },
};

export function getAllServices(lang) {
  const code = normalizeLang(lang);
  return SERVICE_KEYS.map((key) => {
    const service = servicesData[key];
    return {
      key,
      slug: service.slug,
      ...service[code],
    };
  });
}

export function getServiceBySlug(slug, lang) {
  const code = normalizeLang(lang);
  const entry = Object.values(servicesData).find((service) => service.slug === slug);
  if (!entry) return null;
  return {
    slug: entry.slug,
    ...entry[code],
  };
}

export function getServiceNavItems(lang) {
  return getAllServices(lang).map((service) => ({
    slug: service.slug,
    label: service.shortName,
  }));
}

