import { LANGUAGES, normalizeLang } from '../constants/translations';

export const SERVICE_KEYS = [
  'suspension',
  'oil',
  'brakes',
  'diagnostics',
  'timing',
  'tires',
  'mobileService',
  'keys',
];

export const servicesData = {
  suspension: {
    slug: 'naprawa-zawieszenia-jastrowo',
    pl: {
      name: 'Naprawa zawieszenia',
      shortName: 'Zawieszenie',
      h1: 'Naprawa zawieszenia Jastrowo - Car Service Nikol',
      seoTitle: 'Naprawa zawieszenia w Jastrowo - Car Service Nikol',
      seoDescription:
        'Profesjonalna naprawa zawieszenia w Jastrowo. Wymiana amortyzatorów, wahaczy, sworzni, tulei i sprężyn. Szybka diagnostyka, uczciwe ceny, gwarancja na wykonaną usługę.',
      intro:
        'Zawieszenie odpowiada za komfort jazdy, prowadzenie samochodu i bezpieczeństwo na drodze. W Car Service Nikol w Jastrowo diagnozujemy i naprawiamy zawieszenie w samochodach osobowych i dostawczych – od luźnych tulei po zużyte amortyzatory.',
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
      h1: 'Ремонт ходовой Jastrowo - Car Service Nikol',
      seoTitle: 'Ремонт ходовой в Jastrowo - Car Service Nikol',
      seoDescription:
        'Профессиональный ремонт ходовой части в Jastrowo. Замена амортизаторов, рычагов, шаровых опор, сайлентблоков и пружин. Быстрая диагностика и честные цены.',
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
    slug: 'wymiana-oleju-i-filtrow-jastrowo',
    pl: {
      name: 'Wymiana oleju i filtrów',
      shortName: 'Oleje i filtry',
      h1: 'Wymiana oleju i filtrów Jastrowo - Car Service Nikol',
      seoTitle: 'Wymiana oleju i filtrów w Jastrowo - Car Service Nikol',
      seoDescription:
        'Szybka wymiana oleju i filtrów w Jastrowo. Dobór odpowiedniego oleju, kontrola stanu silnika, uczciwe ceny i ekologiczna utylizacja zużytego oleju.',
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
      h1: 'Замена масла и фильтров Jastrowo - Car Service Nikol',
      seoTitle: 'Замена масла и фильтров в Jastrowo - Car Service Nikol',
      seoDescription:
        'Быстрая замена моторного масла и фильтров в Jastrowo. Подбор масла по допускам производителя, проверка состояния двигателя и утилизация отработанного масла.',
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
    slug: 'serwis-hamulcow-jastrowo',
    pl: {
      name: 'Serwis hamulców',
      shortName: 'Hamulce',
      h1: 'Serwis i naprawa hamulców Jastrowo - Car Service Nikol',
      seoTitle: 'Wymiana klocków i tarcz hamulcowych Jastrowo - Car Service Nikol',
      seoDescription:
        'Serwis hamulców w Jastrowo: wymiana klocków, tarcz, płynu hamulcowego i przewodów. Profesjonalna diagnoza i krótkie terminy.',
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
      h1: 'Ремонт и обслуживание тормозов Jastrowo - Car Service Nikol',
      seoTitle: 'Ремонт тормозов в Jastrowo - Car Service Nikol',
      seoDescription:
        'Обслуживание тормозной системы в Jastrowo: замена колодок и дисков, тормозной жидкости и шлангов. Точная диагностика и гарантия на работы.',
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
    slug: 'diagnostyka-komputerowa-jastrowo',
    pl: {
      name: 'Diagnostyka komputerowa',
      shortName: 'Diagnostyka',
      h1: 'Diagnostyka komputerowa Jastrowo - Car Service Nikol',
      seoTitle: 'Diagnostyka komputerowa samochodu w Jastrowo - Car Service Nikol',
      seoDescription:
        'Zaawansowana diagnostyka komputerowa w Jastrowo. Odczyt błędów, analiza parametrów pracy silnika i elektroniki, jasna informacja o przyczynie usterki.',
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
      h1: 'Компьютерная диагностика Jastrowo - Car Service Nikol',
      seoTitle: 'Компьютерная диагностика автомобиля в Jastrowo - Car Service Nikol',
      seoDescription:
        'Компьютерная диагностика автомобиля в Jastrowo: считывание ошибок, проверка параметров работы двигателя и электроники, рекомендации по ремонту.',
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
  timing: {
    slug: 'wymiana-rozrzadu-jastrowo',
    pl: {
      name: 'Wymiana rozrządu',
      shortName: 'Rozrząd',
      h1: 'Wymiana rozrządu Jastrowo - Car Service Nikol',
      seoTitle: 'Wymiana paska rozrządu w Jastrowo - Car Service Nikol',
      seoDescription:
        'Profesjonalna wymiana paska lub łańcucha rozrządu w Jastrowo. Kompletny serwis z pompą wody i napinaczami, zgodnie z zaleceniami producenta.',
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
      h1: 'Замена ГРМ Jastrowo - Car Service Nikol',
      seoTitle: 'Замена ремня или цепи ГРМ в Jastrowo - Car Service Nikol',
      seoDescription:
        'Профессиональная замена ремня или цепи ГРМ в Jastrowo. Полный сервис с заменой роликов, натяжителей и помпы охлаждения.',
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
  tires: {
    slug: 'serwis-opon-jastrowo',
    pl: {
      name: 'Serwis opon',
      shortName: 'Opony',
      h1: 'Wymiana opon i wyważanie Jastrowo - Car Service Nikol',
      seoTitle: 'Serwis opon, wymiana i wyważanie kół w Jastrowo - Car Service Nikol',
      seoDescription:
        'Profesjonalna wymiana opon sezonowa, wyważanie kół i naprawa przebić w Jastrowo. Szybko, dokładnie, bez uszkodzenia felg.',
      intro:
        'Prawidłowo zamontowane i wyważone koła to komfort jazdy i bezpieczeństwo. W Car Service Nikol w Jastrowo wykonujemy wymianę opon letnich i zimowych, wyważanie na nowoczesnym sprzęcie oraz drobne naprawy – np. po kolizji z krawężnikiem.',
      process: [
        'Sprawdzamy stan opon (bieżnik, wiek, pęknięcia), felg aluminiowych i stalowych oraz rekomendujemy dalsze kroki.',
        'Demontujemy koła, przenosimy czujniki TPMS ostrożnie (gdy występują), montujemy opony zgodnie z kierunkiem bieżnika lub stronami „inside/outside”.',
        'Wykonujemy wyważanie statyczne i dynamiczne, dokręcamy koła dynamometrycznie według momentu podanego przez producenta pojazdu.',
      ],
      pricesIntro: 'Przykładowe ceny usług oponiarskich:',
      prices: [
        { label: 'Wymiana kompletu opon (4 koła, osobowe)', value: 'od 120 zł' },
        { label: 'Wyważanie koła', value: 'od 25 zł / szt.' },
        { label: 'Naprawa przebicia (łata, standard)', value: 'od 60 zł' },
      ],
    },
    ru: {
      name: 'Шиномонтаж',
      shortName: 'Шины',
      h1: 'Шиномонтаж и балансировка Jastrowo - Car Service Nikol',
      seoTitle: 'Шиномонтаж и балансировка колёс в Jastrowo - Car Service Nikol',
      seoDescription:
        'Сезонная замена шин, балансировка и ремонт проколов в Jastrowo. Аккуратная работа с дисками и датчиками давления.',
      intro:
        'Качественный шиномонтаж продлевает срок службы шин и улучшает управляемость. Мы меняем летнюю и зимнюю резину, балансируем колёса и при необходимости устраняем проколы.',
      process: [
        'Осматриваем протоктор, возраст шин и диски, при необходимости рекомендуем замену или ремонт.',
        'Снимаем колёса, аккуратно работаем с датчиками TPMS, монтируем шины с учётом направления рисунка и маркировки сторон.',
        'Выполняем балансировку, затягиваем колёса динамометрическим ключом с нужным моментом.',
      ],
      pricesIntro: 'Примеры цен на шиномонтаж:',
      prices: [
        { label: 'Замена комплекта шин (4 колеса, легковые)', value: 'от 120 zł' },
        { label: 'Балансировка колеса', value: 'от 25 zł / шт.' },
        { label: 'Ремонт прокола (заплатка)', value: 'от 60 zł' },
      ],
    },
  },
  mobileService: {
    slug: 'serwis-mobilny-jastrowo',
    pl: {
      name: 'Serwis mobilny',
      shortName: 'Mobilny',
      h1: 'Serwis mobilny i pomoc drogowa Jastrowo - Car Service Nikol',
      seoTitle: 'Serwis mobilny, dojazd do klienta w Jastrowo i okolicy - Car Service Nikol',
      seoDescription:
        'Awaryjne odpalanie, wymiana koła zapasowego, drobne naprawy z dojazdem do klienta w rejonie Jastrowo. Zadzwoń i ustal zakres.',
      intro:
        'Gdy nie możesz podjechać do warsztatu lub potrzebujesz szybkiej pomocy w terenie – oferujemy usługi mobilne w uzgodnionym zasięgu od Jastrowo. Zakres ustalamy telefonicznie: od boostera akumulatora po wymianę koła po stłuczce.',
      process: [
        'Dzwonisz i opisujesz sytuację (miejsce, marka auta, objawy). Podajemy orientacyjny koszt i czas dojazdu.',
        'Na miejscu wykonujemy bezpieczną diagnostykę „pierwszego kontaktu” i proponujemy najprostsze skuteczne rozwiązanie.',
        'Jeśli naprawa wymaga podnośnika lub części – organizujemy odholowanie lub termin w warsztacie.',
      ],
      pricesIntro: 'Przykładowe stawki (zależnie od odległości i godziny):',
      prices: [
        { label: 'Dojazd w okolicy Jastrowo (w ciągu dnia)', value: 'od 80 zł' },
        { label: 'Uruchomienie auta boosterem / kablami', value: 'od 80 zł' },
        { label: 'Wymiana koła na zapas (w razie przygotowanego koła)', value: 'od 60 zł' },
      ],
    },
    ru: {
      name: 'Выездной сервис',
      shortName: 'Выезд',
      h1: 'Мобильный сервис и помощь на дороге Jastrowo - Car Service Nikol',
      seoTitle: 'Выезд мастера к клиенту в Jastrowo и окрестностях - Car Service Nikol',
      seoDescription:
        'Аварийный запуск, замена колеса на запаску, мелкий ремонт с выездом в районе Jastrowo. Уточните детали по телефону.',
      intro:
        'Если вы не можете доехать до сервиса или нужна срочная помощь — по предварительной договорённости выезжаем к вам в согласованном радиусе от Jastrowo. Точные условия и цена зависят от задачи и расстояния.',
      process: [
        'Вы звоните и описываете ситуацию. Мы называем ориентировочную стоимость и время прибытия.',
        'На месте выполняем безопасную первичную диагностику и выбираем оптимальный вариант решения.',
        'При необходимости полноценного ремонта согласуем эвакуацию или визит в мастерскую.',
      ],
      pricesIntro: 'Примерные цены (зависят от расстояния и времени):',
      prices: [
        { label: 'Выезд в районе Jastrowo (днём)', value: 'от 80 zł' },
        { label: 'Запуск автомобиля от внешнего источника', value: 'от 80 zł' },
        { label: 'Замена колеса на запаску', value: 'от 60 zł' },
      ],
    },
  },
  keys: {
    slug: 'programowanie-kluczy-jastrowo',
    pl: {
      name: 'Kluczyki samochodowe',
      shortName: 'Klucze',
      h1: 'Programowanie i dorabianie kluczy Jastrowo - Car Service Nikol',
      seoTitle: 'Programowanie kluczyków samochodowych w Jastrowo - Car Service Nikol',
      seoDescription:
        'Dorabianie kluczy, programowanie pilotów i transponderów, adaptacja w sterowniku. Zapytaj o swoją markę i model w Car Service Nikol.',
      intro:
        'Zgubiony lub uszkodzony kluczyk to częsty problem. Wielu pojazdom możemy dorobić nowy klucz z immobilizerem i pilotem albo zsynchronizować istniejący zestaw. Zakres zależy od producenta, roku i dostępności kodów – zawsze uczciwie mówimy, co da się zrobić lokalnie.',
      process: [
        'Potrzebujemy danych pojazdu (VIN, rocznik, typ klucza) oraz dowodu rejestracyjnego – usługa wyłącznie dla właściciela auta.',
        'Sprawdzamy, czy mamy odpowiednie oprogramowanie i blanki pod Twoją markę; w razie potrzeby zamawiamy części.',
        'Programujemy transponder / pilot, uczymy klucz w sterowniku i testujemy start silnika oraz zdalne funkcje.',
      ],
      pricesIntro: 'Ceny są mocno zależne od marki – przykłady orientacyjne:',
      prices: [
        { label: 'Programowanie dodatkowego klucza (popularne modele)', value: 'od 350 zł' },
        { label: 'Dorobienie klucza z immobilizerem (wycena po VIN)', value: 'indywidualnie' },
        { label: 'Adaptacja / synchronizacja istniejącego klucza', value: 'od 200 zł' },
      ],
    },
    ru: {
      name: 'Автомобильные ключи',
      shortName: 'Ключи',
      h1: 'Программирование ключей Jastrowo - Car Service Nikol',
      seoTitle: 'Программирование и изготовление ключей авто в Jastrowo - Car Service Nikol',
      seoDescription:
        'Дубликат ключа, прописывание чипа и брелока, привязка к блоку управления. Уточните марку и год в Car Service Nikol.',
      intro:
        'Потеря или поломка ключа не должна останавливать вас надолго. Для многих марок мы можем изготовить и прописать новый ключ или восстановить связь с иммобилайзером. Возможности зависят от автомобиля — заранее проконсультируем по телефону.',
      process: [
        'Нужны данные авто (VIN, год) и документы, подтверждающие право собственности.',
        'Проверяем наличие софта и заготовок; при необходимости заказываем комплектующие.',
        'Программируем чип и пульт, привязываем к блоку, проверяем запуск и работу дистанционных функций.',
      ],
      pricesIntro: 'Стоимость сильно зависит от марки — ориентиры:',
      prices: [
        { label: 'Программирование дополнительного ключа (распространённые модели)', value: 'от 350 zł' },
        { label: 'Изготовление ключа с чипом (расчёт по VIN)', value: 'индивидуально' },
        { label: 'Синхронизация существующего ключа', value: 'от 200 zł' },
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

