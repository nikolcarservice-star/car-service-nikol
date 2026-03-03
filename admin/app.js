import { BRAND_GROUPS, BRANDS, YEARS, DEFAULT_SERVICES, DEFAULT_SETTINGS, normalizeBrandName, CUSTOM_BRAND_ID, isCustomBrand, PROFESSIONAL_TERMS } from './data.js';

// Простое "хранилище" на localStorage
const STORAGE_KEYS = {
  services: 'nikol_services',
  brandGroups: 'nikol_brand_groups',
  settings: 'nikol_settings',
  orders: 'nikol_orders',
  clients: 'nikol_clients',
  vehicles: 'nikol_vehicles',
  reminders: 'nikol_reminders',
  bookingRequests: 'nikol_booking_requests',
  users: 'nikol_users',
  passwords: 'nikol_passwords'
};

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return structuredClone(fallback);
    return JSON.parse(raw);
  } catch {
    return structuredClone(fallback);
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Инициализация данных
let services = loadJson(STORAGE_KEYS.services, DEFAULT_SERVICES);
let brandGroups = loadJson(STORAGE_KEYS.brandGroups, BRAND_GROUPS);
let settings = loadJson(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
let orders = loadJson(STORAGE_KEYS.orders, []);
let clients = loadJson(STORAGE_KEYS.clients, []);
let vehicles = loadJson(STORAGE_KEYS.vehicles, []);
let reminders = loadJson(STORAGE_KEYS.reminders, []);
let bookingRequests = loadJson(STORAGE_KEYS.bookingRequests, []);
let dynamicUsers = loadJson(STORAGE_KEYS.users, []);

// Подмешиваем новые дефолтные услуги в существующий каталог (без перезаписи цен)
const existingIds = new Set(services.map((s) => String(s.id)));
DEFAULT_SERVICES.forEach((svc) => {
  const id = String(svc.id);
  if (!existingIds.has(id)) {
    services.push(structuredClone(svc));
    existingIds.add(id);
  }
});

function persistAll() {
  saveJson(STORAGE_KEYS.services, services);
  saveJson(STORAGE_KEYS.brandGroups, brandGroups);
  saveJson(STORAGE_KEYS.settings, settings);
  saveJson(STORAGE_KEYS.orders, orders);
  saveJson(STORAGE_KEYS.clients, clients);
  saveJson(STORAGE_KEYS.vehicles, vehicles);
  saveJson(STORAGE_KEYS.reminders, reminders);
  saveJson(STORAGE_KEYS.bookingRequests, bookingRequests);
  saveJson(STORAGE_KEYS.users, dynamicUsers);
}

function nextId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function upsertClientFromOrder(order) {
  const phone = (order.clientPhone || '').trim();
  const name = (order.clientName || '').trim();
  if (!phone && !name) return;
  const norm = (phone || name).toLowerCase();
  let c = clients.find((x) => (x.phone || '').toLowerCase() === norm || (x.name || '').toLowerCase() === norm);
  if (!c) {
    c = { id: nextId(), name: name || '—', phone: phone || '', createdAt: new Date().toISOString() };
    clients.push(c);
  } else {
    if (name) c.name = name;
    if (phone) c.phone = phone;
  }
}

function upsertVehicleFromOrder(order) {
  const vin = (order.vin || '').trim();
  const plate = (order.plate || '').trim();
  const key = vin || plate || `${order.brand}|${order.model}|${order.year}`;
  if (!key) return;
  let v = vehicles.find(
    (x) =>
      (x.vin && x.vin === vin) ||
      (x.plate && x.plate === plate) ||
      (x.brand === order.brand && x.model === order.model && String(x.year) === String(order.year) && (plate ? x.plate === plate : true))
  );
  if (!v) {
    v = {
      id: nextId(),
      brand: order.brand,
      model: order.model,
      year: order.year,
      vin: vin || '',
      plate: plate || '',
      createdAt: new Date().toISOString()
    };
    vehicles.push(v);
  } else {
    if (vin) v.vin = vin;
    if (plate) v.plate = plate;
    v.brand = order.brand;
    v.model = order.model;
    v.year = order.year;
  }
}

function getClientsList() {
  const byPhone = new Map();
  clients.forEach((c) => byPhone.set((c.phone || c.name || c.id).toLowerCase(), c));
  orders.forEach((o) => {
    const phone = (o.clientPhone || '').trim();
    const name = (o.clientName || '').trim();
    if (!phone && !name) return;
    const key = (phone || name).toLowerCase();
    if (!byPhone.has(key)) {
      byPhone.set(key, { id: 'order-' + key, name: name || '—', phone, fromOrders: true });
    }
  });
  return Array.from(byPhone.values()).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

function getVehiclesList() {
  const byKey = new Map();
  vehicles.forEach((v) => {
    const k = v.vin || v.plate || `${v.brand}|${v.model}|${v.year}`;
    byKey.set(k, v);
  });
  orders.forEach((o) => {
    const k = (o.vin || '').trim() || (o.plate || '').trim() || `${o.brand}|${o.model}|${o.year}`;
    if (!k) return;
    if (!byKey.has(k)) {
      byKey.set(k, {
        id: 'order-' + k,
        brand: o.brand,
        model: o.model,
        year: o.year,
        vin: (o.vin || '').trim(),
        plate: (o.plate || '').trim(),
        fromOrders: true
      });
    }
  });
  return Array.from(byKey.values()).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

// Примитивная авторизация (локально, без сервера)
const USERS = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'master', password: 'master123', role: 'master' }
];

let currentUser = null;
let adminSelectedOrderId = null;

// Восстанавливаем пользователя из localStorage, чтобы не выбрасывало при перезагрузке
try {
  const saved = localStorage.getItem('nikol_current_user');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed && parsed.username && parsed.role) {
      currentUser = parsed;
    }
  }
} catch {
  // игнорируем ошибки доступа
}

// Многоязычность
const I18N = {
  ru: {
    login_title: 'Car Service Nikol',
    login_subtitle: 'Внутренняя CRM',
    username: 'Логин',
    password: 'Пароль',
    login_btn: 'Войти',
    wrong_credentials: 'Неверный логин или пароль',
    role_master: 'Мастер',
    role_admin: 'Админ',
    new_order: 'Новый заказ',
    admin_panel: 'База знаний и цен',
    logout: 'Выйти',
    brand: 'Марка',
    model: 'Модель',
    year: 'Год',
    choose: 'Выберите',
    services_label: 'Услуги',
    add_custom_service: 'Добавить свою работу',
    custom_name: 'Название работы',
    custom_price: 'Цена (PLN)',
    comment: 'Комментарий',
    photo_before: 'Фото до ремонта',
    take_photo: 'Выбрать/сделать фото',
    total: 'Итого',
    create_order: 'Сохранить',
    save_order: 'Сохранить заказ',
    recommended_price: 'Рекомендуемая цена',
    above_competitors: 'Выше рынка в Познани',
    below_competitors: 'Ниже рынка в Познани',
    near_competitors: 'Близко к рынку',
    service_name: 'Услуга',
    base_price: 'Базовая цена',
    multiplier: 'Коэффициент',
    competitor_price: 'Средняя цена конкурентов (Poznań)',
    save_changes: 'Сохранить изменения',
    brand_group: 'Группа марок',
    group_A: 'Standard',
    group_B: 'Medium',
    group_C: 'Premium',
    group_D: 'Exclusive/Key Prog',
    new_service: 'Новая услуга',
    add_service: 'Добавить услугу',
    language: 'Язык интерфейса',
    order_created: 'Заказ сохранён.',
    order_saved: 'Заказ сохранён. Админ сможет сформировать PDF.',
    open_pdf: 'Открыть PDF',
    send_whatsapp: 'Отправить в WhatsApp',
    pwa_hint: 'Добавьте эту страницу на главный экран для быстрого доступа.',
    pdf_lang: 'Язык документа PDF',
    pdf_pl: 'Генерировать на польском',
    pdf_ru: 'Генерировать на русском',
    total_override: 'Итого (можно изменить)',
    confirm_and_pdf: 'Подтвердить и создать PDF',
    discount_vs_market: 'Скидка к рынку, %',
    discount_vs_market_hint: 'Например -10: цена на 10% ниже среднего по Познани',
    min_price: 'Мин. порог (PLN)',
    market_price: 'Рыночная цена (Познань)',
    year_multiplier: 'Коэфф. за год',
    year_threshold: 'Год порог (старше = сложнее)',
    price_settings: 'Настройки цен',
    orders: 'Заказы',
    settings: 'Настройки',
    order_status: 'Статус',
    status_pending: 'Ожидает',
    status_in_progress: 'В работе',
    status_completed: 'Выполнен',
    status_cancelled: 'Отменён',
    generate_pdf: 'Сформировать PDF',
    no_orders: 'Нет заказов',
    order_detail: 'Детали заказа',
    back_to_list: '← К списку',
    client_name: 'Имя клиента',
    client_phone: 'Телефон клиента',
    vin: 'VIN',
    plate: 'Гос. номер',
    dashboard: 'Дашборд',
    today_orders: 'Сегодня',
    pending_orders: 'Ожидают',
    custom_car: 'Свой вариант',
    work_description: 'Что нужно отремонтировать',
    work_description_placeholder: 'Например: замена масла, диагностика',
    add_work: 'Добавить работу',
    manual_brand: 'Марка (ввод вручную)',
    manual_model: 'Модель (ввод вручную)',
    manual_year: 'Год (ввод вручную)',
    from_catalog: 'Подставить из каталога',
    price_pln: 'Цена (PLN)',
    price_monitor: 'Мониторинг цен (Познань и окрестности)',
    price_monitor_url: 'URL мониторинга (скрипт или ваш Vercel)',
    price_monitor_hint: 'Система сама мониторит цены в интернете: разверните скрипт из папки admin/price-monitor на Vercel (бесплатно), укажите URL вида https://ваш-проект.vercel.app/api/prices — тогда кнопка ниже подтянет актуальные цены с KB.pl (Познань, Szamotuły и др.). Либо загрузите JSON вручную.',
    update_prices_btn: 'Мониторить с интернета (Познань)',
    upload_json_btn: 'Загрузить JSON',
    last_update: 'Последнее обновление',
    suggest_from_catalog: 'Похоже на каталог',
    monitor_from_internet_btn: 'Мониторить из интернета',
    monitor_from_internet_no_url: 'Укажите URL мониторинга в Настройках (Познань и окрестности).',
    suggest_from_internet_btn: 'Предложить из интернета',
    suggest_from_internet_no_url: 'Укажите URL мониторинга в Настройках.',
    admin_note: 'Заметки администратора',
    delete_order: 'Удалить заказ',
    delete_confirm: 'Удалить этот заказ навсегда?',
    remove: 'Удалить',
    tab_clients: 'Клиенты',
    tab_vehicles: 'Авто',
    tab_booking: 'Заявки',
    tab_reminders: 'Напоминания',
    tab_analytics: 'Аналитика',
    add_client: 'Добавить клиента',
    add_vehicle: 'Добавить авто',
    add_booking: 'Добавить заявку',
    add_reminder: 'Добавить напоминание',
    search_placeholder: 'Поиск по имени, тел., VIN...',
    no_clients: 'Нет клиентов',
    no_vehicles: 'Нет авто',
    no_reminders: 'Нет напоминаний',
    no_booking_requests: 'Нет заявок',
    convert_to_order: 'В заказ',
    client_orders: 'Заказы',
    client_vehicles: 'Автомобили',
    new_order_from_client: 'Новый заказ',
    payment_type: 'Оплата',
    payment_cash: 'Наличные',
    payment_card: 'Карта',
    payment_transfer: 'Перевод',
    paid: 'Оплачено',
    time_in: 'Приём',
    time_out: 'Выдача',
    master: 'Мастер',
    revenue: 'Выручка',
    orders_count: 'Заказов',
    avg_check: 'Средний чек',
    top_services: 'ТОП услуг',
    top_clients: 'ТОП клиентов',
    export_csv: 'Экспорт CSV',
    period_today: 'Сегодня',
    period_week: 'Неделя',
    period_month: 'Месяц',
    reminder_due: 'Срок',
    reminder_note: 'Заметка',
    reminder_completed: 'Выполнено',
    booking_car: 'Авто',
    booking_service: 'Услуга',
    booking_date: 'Дата записи',
    change_password: 'Сменить пароль',
    current_password: 'Текущий пароль',
    new_password: 'Новый пароль',
    password_changed: 'Пароль изменён'
  },
  pl: {
    login_title: 'Car Service Nikol',
    login_subtitle: 'Wewnętrzny CRM',
    username: 'Login',
    password: 'Hasło',
    login_btn: 'Zaloguj',
    wrong_credentials: 'Nieprawidłowy login lub hasło',
    role_master: 'Mechanik',
    role_admin: 'Admin',
    new_order: 'Nowe zlecenie',
    admin_panel: 'Baza wiedzy i cen',
    logout: 'Wyloguj',
    brand: 'Marka',
    model: 'Model',
    year: 'Rok',
    choose: 'Wybierz',
    services_label: 'Usługi',
    add_custom_service: 'Dodaj własną pracę',
    custom_name: 'Nazwa pracy',
    custom_price: 'Cena (PLN)',
    comment: 'Komentarz',
    photo_before: 'Zdjęcie przed naprawą',
    take_photo: 'Wybierz / zrób zdjęcie',
    total: 'Razem',
    create_order: 'Zapisz',
    save_order: 'Zapisz zlecenie',
    recommended_price: 'Cena rekomendowana',
    above_competitors: 'Powyżej rynku w Poznaniu',
    below_competitors: 'Poniżej rynku w Poznaniu',
    near_competitors: 'Blisko rynku',
    service_name: 'Usługa',
    base_price: 'Cena bazowa',
    multiplier: 'Współczynnik',
    competitor_price: 'Średnia cena konkurencji (Poznań)',
    save_changes: 'Zapisz zmiany',
    brand_group: 'Grupa marek',
    group_A: 'Standard',
    group_B: 'Medium',
    group_C: 'Premium',
    group_D: 'Exclusive/Key Prog',
    new_service: 'Nowa usługa',
    add_service: 'Dodaj usługę',
    language: 'Język interfejsu',
    order_created: 'Zlecenie zapisane.',
    order_saved: 'Zlecenie zapisane. Admin utworzy PDF.',
    open_pdf: 'Otwórz PDF',
    send_whatsapp: 'Wyślij na WhatsApp',
    pwa_hint: 'Dodaj tę stronę do ekranu głównego.',
    pdf_lang: 'Język dokumentu PDF',
    pdf_pl: 'Generuj po polsku',
    pdf_ru: 'Generuj po rosyjsku',
    total_override: 'Razem (można zmienić)',
    confirm_and_pdf: 'Potwierdź i utwórz PDF',
    discount_vs_market: 'Zniżka vs rynek, %',
    discount_vs_market_hint: 'Np. -10: cena 10% poniżej średniej (Poznań)',
    min_price: 'Min. próg (PLN)',
    market_price: 'Cena rynkowa (Poznań)',
    year_multiplier: 'Współcz. za rok',
    year_threshold: 'Rok progu (starsze = trudniejsze)',
    price_settings: 'Ustawienia cen',
    orders: 'Zlecenia',
    settings: 'Ustawienia',
    order_status: 'Status',
    status_pending: 'Oczekuje',
    status_in_progress: 'W realizacji',
    status_completed: 'Wykonane',
    status_cancelled: 'Anulowane',
    generate_pdf: 'Generuj PDF',
    no_orders: 'Brak zleceń',
    order_detail: 'Szczegóły zlecenia',
    back_to_list: '← Lista',
    client_name: 'Imię klienta',
    client_phone: 'Tel. klienta',
    vin: 'VIN',
    plate: 'Nr rejestr.',
    dashboard: 'Panel',
    today_orders: 'Dziś',
    pending_orders: 'Oczekujące',
    custom_car: 'Inna (wpisz ręcznie)',
    work_description: 'Co do naprawy',
    work_description_placeholder: 'Np. wymiana oleju, diagnostyka',
    add_work: 'Dodaj pracę',
    manual_brand: 'Marka (wpis ręczny)',
    manual_model: 'Model (wpis ręczny)',
    manual_year: 'Rok (wpis ręczny)',
    from_catalog: 'Z katalogu',
    price_pln: 'Cena (PLN)',
    price_monitor: 'Monitoring cen (Poznań i okolice)',
    price_monitor_url: 'URL monitora (skrypt lub Vercel)',
    price_monitor_hint: 'System sam monitoruje ceny w internecie: wdróż skrypt z folderu admin/price-monitor na Vercel (za darmo), podaj URL np. https://twoj-projekt.vercel.app/api/prices — przycisk poniżej pobierze aktualne ceny z KB.pl (Poznań, Szamotuły). Możesz też wgrać JSON ręcznie.',
    update_prices_btn: 'Monitoruj z internetu (Poznań)',
    upload_json_btn: 'Wgraj JSON',
    last_update: 'Ostatnia aktualizacja',
    suggest_from_catalog: 'Z katalogu',
    monitor_from_internet_btn: 'Monitoruj z internetu',
    monitor_from_internet_no_url: 'Ustaw URL monitora w Ustawieniach (Poznań i okolice).',
    suggest_from_internet_btn: 'Zaproponuj z internetu',
    suggest_from_internet_no_url: 'Ustaw URL monitora w Ustawieniach.',
    admin_note: 'Notatki administratora',
    delete_order: 'Usuń zlecenie',
    delete_confirm: 'Usunąć to zlecenie na stałe?',
    remove: 'Usuń',
    tab_clients: 'Klienci',
    tab_vehicles: 'Pojazdy',
    tab_booking: 'Zgłoszenia',
    tab_reminders: 'Przypomnienia',
    tab_analytics: 'Analityka',
    add_client: 'Dodaj klienta',
    add_vehicle: 'Dodaj pojazd',
    add_booking: 'Dodaj zgłoszenie',
    add_reminder: 'Dodaj przypomnienie',
    search_placeholder: 'Szukaj po imieniu, tel., VIN...',
    no_clients: 'Brak klientów',
    no_vehicles: 'Brak pojazdów',
    no_reminders: 'Brak przypomnień',
    no_booking_requests: 'Brak zgłoszeń',
    convert_to_order: 'Do zlecenia',
    client_orders: 'Zlecenia',
    client_vehicles: 'Pojazdy',
    new_order_from_client: 'Nowe zlecenie',
    payment_type: 'Płatność',
    payment_cash: 'Gotówka',
    payment_card: 'Karta',
    payment_transfer: 'Przelew',
    paid: 'Opłacone',
    time_in: 'Przyjęcie',
    time_out: 'Wydanie',
    master: 'Mechanik',
    revenue: 'Przychód',
    orders_count: 'Zleceń',
    avg_check: 'Średnia wartość',
    top_services: 'TOP usługi',
    top_clients: 'TOP klienci',
    export_csv: 'Eksport CSV',
    period_today: 'Dziś',
    period_week: 'Tydzień',
    period_month: 'Miesiąc',
    reminder_due: 'Termin',
    reminder_note: 'Notatka',
    reminder_completed: 'Wykonane',
    booking_car: 'Pojazd',
    booking_service: 'Usługa',
    booking_date: 'Data wizyty',
    change_password: 'Zmień hasło',
    current_password: 'Obecne hasło',
    new_password: 'Nowe hasło',
    password_changed: 'Hasło zmienione'
  }
};

function t(key) {
  const dict = I18N[settings.language] || I18N.ru;
  return dict[key] ?? key;
}

// Утилиты
function getBrandGroupId(brandName) {
  if (!brandName || brandName === CUSTOM_BRAND_ID) return 'A';
  const normalized = normalizeBrandName(brandName);
  const brand = BRANDS.find(b => b.name === brandName || b.name === normalized);
  return brand?.groupId || 'A';
}

function getBrandMultiplier(brandName) {
  const groupId = getBrandGroupId(brandName);
  const group = brandGroups[groupId];
  return group ? group.multiplier : 1.0;
}

function getYearMultiplier(year) {
  const y = parseInt(year, 10);
  if (isNaN(y)) return 1;
  return y < (settings.yearThreshold || 2020) ? (settings.yearMultiplier || 1.1) : 1;
}

function formatPrice(value) {
  const n = Number(value);
  return (isNaN(n) ? 0 : n).toFixed(0) + ' PLN';
}

function getOrderTotal(o) {
  if (o.total != null && Number(o.total) >= 0) return Number(o.total);
  return (o.services || []).reduce((s, x) => s + (Number(x.price) || 0), 0);
}

// Smart Pricing: (Base * BrandMult) * YearMult, не ниже minPrice
function calculateServicePrice(service, brandName, year) {
  const brandMult = getBrandMultiplier(brandName);
  const yearMult = getYearMultiplier(year);
  let price = (service.basePrice || 0) * brandMult * yearMult;
  const minP = service.minPrice != null ? service.minPrice : 0;
  if (minP > 0 && price < minP) price = minP;
  return { price, brandMult, yearMult };
}

// Целевая разница с рынком: например -10 → цена на 10% ниже (competitorAvg * (1 + (-10)/100) = 0.9)
function getSuggestedMarketPrice(service) {
  if (!service.competitorAvgPrice || settings.discountVsMarketPercent == null) return null;
  const pct = settings.discountVsMarketPercent;
  return service.competitorAvgPrice * (1 + pct / 100);
}

function classifyPriceVsCompetitors(service, finalPrice) {
  if (!service.competitorAvgPrice) return null;
  const avg = service.competitorAvgPrice;
  const diffPercent = ((finalPrice - avg) / avg) * 100;
  const limit = settings.priceDeviationWarningPercent || 20;
  if (Math.abs(diffPercent) <= limit) return 'near';
  return diffPercent > 0 ? 'above' : 'below';
}

// DOM helpers
const appRoot = document.getElementById('app');

function createEl(tag, className = '', children = []) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  for (const child of children) {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child) el.appendChild(child);
  }
  return el;
}

// Рендеры
function renderLogin() {
  appRoot.innerHTML = '';

  const container = createEl(
    'div',
    'flex-1 flex flex-col items-center justify-center px-4 py-8'
  );

  const card = createEl(
    'div',
    'w-full max-w-sm bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl p-6'
  );

  const title = createEl(
    'h1',
    'text-2xl font-semibold mb-1 text-center text-white',
    [t('login_title')]
  );
  const subtitle = createEl(
    'p',
    'text-sm text-slate-400 mb-6 text-center',
    [t('login_subtitle')]
  );

  const form = createEl('form', 'space-y-4');

  const userGroup = createEl('div', 'space-y-1');
  userGroup.appendChild(createEl('label', 'block text-sm text-slate-300', [t('username')]));
  const userInput = createEl('input', 'w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500');
  userInput.type = 'text';
  userInput.autocomplete = 'username';
  userGroup.appendChild(userInput);

  const passGroup = createEl('div', 'space-y-1');
  passGroup.appendChild(createEl('label', 'block text-sm text-slate-300', [t('password')]));
  const passInput = createEl('input', 'w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500');
  passInput.type = 'password';
  passInput.autocomplete = 'current-password';
  passGroup.appendChild(passInput);

  const errorBox = createEl('div', 'text-xs text-red-400 h-4');

  const loginBtn = createEl(
    'button',
    'w-full py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-sm font-medium text-white transition flex items-center justify-center gap-2',
    [t('login_btn')]
  );
  loginBtn.type = 'submit';

  const credsHint = createEl(
    'p',
    'mt-4 text-[11px] text-slate-500 text-center',
    [
      `admin / admin123 (${t('role_admin')}), master / master123 (${t('role_master')})`
    ]
  );

  form.appendChild(userGroup);
  form.appendChild(passGroup);
  form.appendChild(errorBox);
  form.appendChild(loginBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = userInput.value.trim();
    const p = passInput.value.trim();

    let found = null;

    // 1) Пользователи, созданные в настройках (dynamicUsers)
    const dyn = dynamicUsers.find((usr) => usr.username === u && usr.password === p);
    if (dyn) {
      found = { username: dyn.username, role: dyn.role };
    } else {
      // 2) Базовые пользователи с возможной сменой пароля
      const customPasswords = loadJson(STORAGE_KEYS.passwords, {});
      const base = USERS.find((usr) => usr.username === u);
      if (base) {
        const expected = customPasswords[u] !== undefined ? customPasswords[u] : base.password;
        if (p === expected) {
          found = { username: base.username, role: base.role };
        }
      }
    }

    if (!found) {
      errorBox.textContent = t('wrong_credentials');
      return;
    }
    currentUser = { username: found.username, role: found.role };
    try {
      localStorage.setItem('nikol_current_user', JSON.stringify(currentUser));
    } catch {
      // если localStorage недоступен — просто продолжаем без сохранения сессии
    }
    renderAppShell();
  });

  card.appendChild(title);
  card.appendChild(subtitle);
  card.appendChild(form);
  card.appendChild(credsHint);

  const hint = createEl(
    'p',
    'mt-6 text-xs text-slate-500 text-center max-w-xs',
    [t('pwa_hint')]
  );

  container.appendChild(card);
  container.appendChild(hint);
  appRoot.appendChild(container);
}

function renderAppShell(activeTab = 'order') {
  if (!currentUser) {
    renderLogin();
    return;
  }

  appRoot.innerHTML = '';

  const wrapper = createEl(
    'div',
    'flex-1 flex flex-col w-full max-w-6xl mx-auto'
  );

  const header = createEl(
    'header',
    'px-4 pt-4 pb-3 flex items-center justify-between bg-slate-950/80 backdrop-blur border-b border-slate-800'
  );
  const left = createEl('div', 'flex items-center gap-3');
  const logoIcon = createEl('div', 'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-primary-500 to-primary-400 text-slate-950 shadow-md');
  logoIcon.appendChild(createEl('span', 'text-lg font-extrabold tracking-tight', ['N']));
  const logoText = createEl('div', 'flex flex-col');
  logoText.appendChild(createEl('span', 'text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-400', ['Car Service']));
  logoText.appendChild(createEl('span', 'text-sm font-semibold text-white', ['Nikol CRM']));
  const logo = createEl('div', 'flex items-center gap-2');
  logo.appendChild(logoIcon);
  logo.appendChild(logoText);
  const roleBadge = createEl(
    'span',
    'ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-300',
    [currentUser.role === 'admin' ? t('role_admin') : t('role_master')]
  );
  left.appendChild(logo);
  left.appendChild(roleBadge);

  const right = createEl('div', 'flex items-center gap-2');

  // language switch
  const langSelect = createEl(
    'select',
    'text-xs bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500'
  );
  [['ru', 'RU'], ['pl', 'PL']].forEach(([code, label]) => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = label;
    if (settings.language === code) opt.selected = true;
    langSelect.appendChild(opt);
  });
  langSelect.addEventListener('change', () => {
    settings.language = langSelect.value;
    persistAll();
    renderAppShell(activeTab);
  });

  const logoutBtn = createEl(
    'button',
    'text-xs px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200',
    [t('logout')]
  );
  logoutBtn.addEventListener('click', () => {
    currentUser = null;
    try {
      localStorage.removeItem('nikol_current_user');
    } catch {
      // ignore
    }
    renderLogin();
  });

  right.appendChild(langSelect);
  right.appendChild(logoutBtn);

  header.appendChild(left);
  header.appendChild(right);

  const tabs = createEl(
    'div',
    'px-3 pt-2 pb-1 flex items-center gap-1.5 overflow-x-auto bg-slate-950/80 border-b border-slate-900 flex-wrap'
  );

  const tabClass = (tab) =>
    `text-xs font-medium rounded-full px-3 py-2 whitespace-nowrap ${
      activeTab === tab ? 'bg-primary-600 text-white' : 'bg-slate-900 text-slate-300'
    }`;

  const orderTab = createEl('button', tabClass('order'), [t('new_order')]);
  orderTab.addEventListener('click', () => renderAppShell('order'));
  tabs.appendChild(orderTab);

  const isAdmin = currentUser.role === 'admin';
  const isOwner = isAdmin && currentUser.username === 'admin';

  if (isAdmin) {
    const adminOrdersTab = createEl('button', tabClass('admin_orders'), [t('orders')]);
    const clientsTab = createEl('button', tabClass('clients'), [t('tab_clients')]);
    const vehiclesTab = createEl('button', tabClass('vehicles'), [t('tab_vehicles')]);
    const bookingTab = createEl('button', tabClass('booking'), [t('tab_booking')]);
    const remindersTab = createEl('button', tabClass('reminders'), [t('tab_reminders')]);
    const analyticsTab = createEl('button', tabClass('analytics'), [t('tab_analytics')]);

    adminOrdersTab.addEventListener('click', () => renderAppShell('admin_orders'));
    clientsTab.addEventListener('click', () => renderAppShell('clients'));
    vehiclesTab.addEventListener('click', () => renderAppShell('vehicles'));
    bookingTab.addEventListener('click', () => renderAppShell('booking'));
    remindersTab.addEventListener('click', () => renderAppShell('reminders'));
    analyticsTab.addEventListener('click', () => renderAppShell('analytics'));

    tabs.appendChild(adminOrdersTab);
    tabs.appendChild(clientsTab);
    tabs.appendChild(vehiclesTab);
    tabs.appendChild(bookingTab);
    tabs.appendChild(remindersTab);
    tabs.appendChild(analyticsTab);

    if (isOwner) {
      const adminSettingsTab = createEl('button', tabClass('admin'), [t('settings')]);
      adminSettingsTab.addEventListener('click', () => renderAppShell('admin'));
      tabs.appendChild(adminSettingsTab);
    }
  }

  const content = createEl(
    'main',
    'flex-1 overflow-y-auto px-3 pb-6 pt-3'
  );

  if (activeTab === 'order') {
    content.appendChild(renderOrderScreen());
  } else if (activeTab === 'admin_orders') {
    content.appendChild(renderAdminOrdersScreen());
  } else if (activeTab === 'clients') {
    content.appendChild(renderClientsScreen());
  } else if (activeTab === 'vehicles') {
    content.appendChild(renderVehiclesScreen());
  } else if (activeTab === 'booking') {
    content.appendChild(renderBookingScreen());
  } else if (activeTab === 'reminders') {
    content.appendChild(renderRemindersScreen());
  } else if (activeTab === 'analytics') {
    content.appendChild(renderAnalyticsScreen());
  } else {
    content.appendChild(renderAdminScreen());
  }

  wrapper.appendChild(header);
  wrapper.appendChild(tabs);
  wrapper.appendChild(content);
  appRoot.appendChild(wrapper);
}

function renderOrderScreen() {
  const isMaster = currentUser && currentUser.role === 'master';
  const container = createEl(
    'div',
    'space-y-4'
  );

  // Авто
  const carCard = createEl(
    'div',
    'bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3'
  );
  carCard.appendChild(createEl('h2', 'text-sm font-semibold text-slate-100 mb-1', [t('brand') + ' / ' + t('model')]));

  const brandSelect = createEl(
    'select',
    'w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500'
  );
  const brandPlaceholder = document.createElement('option');
  brandPlaceholder.value = '';
  brandPlaceholder.textContent = t('choose');
  brandPlaceholder.disabled = true;
  brandPlaceholder.selected = true;
  brandSelect.appendChild(brandPlaceholder);
  BRANDS.forEach((b) => {
    const opt = document.createElement('option');
    opt.value = b.name;
    opt.textContent = b.name;
    brandSelect.appendChild(opt);
  });
  const customOpt = document.createElement('option');
  customOpt.value = CUSTOM_BRAND_ID;
  customOpt.textContent = t('custom_car');
  brandSelect.appendChild(customOpt);

  const modelYearWrap = createEl('div', 'space-y-2');
  const modelSelect = createEl(
    'select',
    'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500'
  );
  const modelPlaceholder = document.createElement('option');
  modelPlaceholder.value = '';
  modelPlaceholder.textContent = t('model');
  modelPlaceholder.disabled = true;
  modelPlaceholder.selected = true;
  modelSelect.appendChild(modelPlaceholder);

  const yearSelect = createEl(
    'select',
    'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500'
  );
  const yearPlaceholder = document.createElement('option');
  yearPlaceholder.value = '';
  yearPlaceholder.textContent = t('year');
  yearPlaceholder.disabled = true;
  yearPlaceholder.selected = true;
  yearSelect.appendChild(yearPlaceholder);
  YEARS.forEach((y) => {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  });
  modelYearWrap.appendChild(modelSelect);
  modelYearWrap.appendChild(yearSelect);

  const customCarWrap = createEl('div', 'mt-2 space-y-2 hidden');
  const customBrandInput = createEl('input', 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500');
  customBrandInput.placeholder = t('brand');
  const customModelInput = createEl('input', 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500');
  customModelInput.placeholder = t('model');
  const customYearInput = createEl('input', 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500');
  customYearInput.placeholder = t('year');
  customYearInput.type = 'number';
  customYearInput.min = '1990';
  customYearInput.max = '2030';
  customCarWrap.appendChild(customBrandInput);
  customCarWrap.appendChild(customModelInput);
  customCarWrap.appendChild(customYearInput);

  // Всегда видимые поля для ручного ввода марки, модели, года (приоритет, если заполнены)
  const manualCarWrap = createEl('div', 'mt-3 pt-3 border-t border-slate-800 space-y-2');
  manualCarWrap.appendChild(createEl('div', 'text-[11px] text-slate-500', [t('brand') + ' / ' + t('model') + ' / ' + t('year') + ' — ' + (settings.language === 'pl' ? 'wpisz ręcznie' : 'ввод вручную')]));
  const manualBrandInput = createEl('input', 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500');
  manualBrandInput.placeholder = t('manual_brand');
  const manualModelInput = createEl('input', 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500');
  manualModelInput.placeholder = t('manual_model');
  const manualYearInput = createEl('input', 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500');
  manualYearInput.placeholder = t('manual_year');
  manualYearInput.type = 'number';
  manualYearInput.min = '1990';
  manualYearInput.max = '2030';
  manualCarWrap.appendChild(manualBrandInput);
  manualCarWrap.appendChild(manualModelInput);
  manualCarWrap.appendChild(manualYearInput);

  function toggleCustomCar(show) {
    customCarWrap.classList.toggle('hidden', !show);
    modelYearWrap.classList.toggle('hidden', show);
  }

  brandSelect.addEventListener('change', () => {
    const isCustom = brandSelect.value === CUSTOM_BRAND_ID;
    toggleCustomCar(isCustom);
    if (!isCustom) {
      const brand = BRANDS.find((b) => b.name === brandSelect.value);
      modelSelect.innerHTML = '';
      const ph = document.createElement('option');
      ph.value = '';
      ph.textContent = t('model');
      ph.disabled = true;
      ph.selected = true;
      modelSelect.appendChild(ph);
      if (brand && brand.models) {
        brand.models.forEach((m) => {
          const opt = document.createElement('option');
          opt.value = m;
          opt.textContent = m;
          modelSelect.appendChild(opt);
        });
      }
    }
    updateSummary();
  });

  function getEffectiveCar() {
    const mBrand = (manualBrandInput.value || '').trim();
    const mModel = (manualModelInput.value || '').trim();
    const mYear = (manualYearInput.value || '').trim();
    if (mBrand || mModel || mYear) {
      return {
        brand: mBrand || (brandSelect.value === CUSTOM_BRAND_ID ? (customBrandInput.value || '').trim() : (brandSelect.value || '')),
        model: mModel || (brandSelect.value === CUSTOM_BRAND_ID ? (customModelInput.value || '').trim() : (modelSelect.value || '')),
        year: mYear || (brandSelect.value === CUSTOM_BRAND_ID ? (customYearInput.value || '').trim() : (yearSelect.value || ''))
      };
    }
    const isCustom = brandSelect.value === CUSTOM_BRAND_ID;
    return {
      brand: isCustom ? (customBrandInput.value.trim() || '') : (brandSelect.value || ''),
      model: isCustom ? (customModelInput.value.trim() || '') : (modelSelect.value || ''),
      year: isCustom ? (customYearInput.value.trim() || '') : (yearSelect.value || '')
    };
  }

  [customBrandInput, customModelInput, customYearInput, manualBrandInput, manualModelInput, manualYearInput].forEach((el) => el.addEventListener('input', () => { if (!isMaster) updateSummary(); }));
  modelSelect.addEventListener('change', () => { if (!isMaster) updateSummary(); });
  yearSelect.addEventListener('change', () => { if (!isMaster) updateSummary(); });

  carCard.appendChild(brandSelect);
  carCard.appendChild(modelYearWrap);
  carCard.appendChild(customCarWrap);
  carCard.appendChild(manualCarWrap);

  // Услуги: для мастера — только ввод текстом; для админа — каталог + своя работа с ценой
  const servicesCard = createEl(
    'div',
    'bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3'
  );
  servicesCard.appendChild(createEl('h2', 'text-sm font-semibold text-slate-100', [t('services_label')]));

  const selectedServiceIds = new Set();
  const selectedCustomServices = [];
  const masterWorks = [];

  const servicesList = createEl('div', 'space-y-2');
  const customCard = createEl('div', 'bg-slate-900/80 border border-dashed border-slate-700 rounded-2xl p-4 space-y-2');

  if (isMaster) {
    customCard.appendChild(createEl('h3', 'text-xs font-medium text-slate-200', [t('work_description')]));
    const workInput = createEl('input', 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500');
    workInput.placeholder = t('work_description_placeholder');
    const addWorkBtn = createEl('button', 'mt-2 w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-sm text-slate-100', ['+ ', t('add_work')]);
    addWorkBtn.type = 'button';
    const masterWorksList = createEl('div', 'mt-2 space-y-1');
    addWorkBtn.addEventListener('click', () => {
      const text = workInput.value.trim();
      if (!text) return;
      masterWorks.push(text);
      const row = createEl('div', 'flex items-center justify-between gap-2 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2');
      row.appendChild(createEl('span', 'text-sm text-slate-100', [text]));
      const delBtn = createEl('button', 'text-red-400 hover:text-red-300 text-xs', ['×']);
      delBtn.type = 'button';
      delBtn.addEventListener('click', () => {
        const idx = Array.from(masterWorksList.children).indexOf(row);
        if (idx !== -1) masterWorks.splice(idx, 1);
        row.remove();
      });
      row.appendChild(delBtn);
      masterWorksList.appendChild(row);
      workInput.value = '';
    });
    customCard.appendChild(workInput);
    customCard.appendChild(addWorkBtn);
    customCard.appendChild(masterWorksList);
  } else {
    services.forEach((svc) => {
      const row = createEl(
        'label',
        'flex items-center justify-between gap-2 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5'
      );
      const left = createEl('div', 'flex items-center gap-2');
      const checkbox = createEl('input', 'h-4 w-4 rounded border-slate-700');
      checkbox.type = 'checkbox';
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) selectedServiceIds.add(svc.id);
        else selectedServiceIds.delete(svc.id);
        updateSummary();
      });
      const name = createEl('div', 'text-xs text-slate-100', [settings.language === 'pl' ? svc.name_pl : svc.name_ru]);
      const right = createEl('div', 'text-right');
      const basePriceEl = createEl('div', 'text-[11px] text-slate-400', [formatPrice(svc.basePrice)]);
      left.appendChild(checkbox);
      left.appendChild(name);
      right.appendChild(basePriceEl);
      row.appendChild(left);
      row.appendChild(right);
      servicesList.appendChild(row);
    });
    servicesCard.appendChild(servicesList);
    customCard.appendChild(createEl('h3', 'text-xs font-medium text-slate-200', [t('add_custom_service')]));
    const customName = createEl('input', 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500');
    customName.placeholder = t('custom_name');
    const customPrice = createEl('input', 'w-full mt-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500');
    customPrice.placeholder = t('custom_price');
    customPrice.type = 'number';
    customPrice.min = '0';
    const addCustomBtn = createEl('button', 'mt-2 inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-100', ['+ ', t('add_custom_service')]);
    addCustomBtn.type = 'button';
    const customList = createEl('div', 'mt-2 space-y-1');
    addCustomBtn.addEventListener('click', () => {
      const name = customName.value.trim();
      const price = parseFloat(customPrice.value);
      if (!name || isNaN(price) || price <= 0) return;
      const id = `custom_${Date.now()}`;
      selectedCustomServices.push({ id, name, price });
      const row = createEl('div', 'flex items-center justify-between gap-2 text-[11px] bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5');
      const left = createEl('div', 'flex-1 min-w-0');
      left.appendChild(createEl('span', 'text-slate-100 truncate block', [name]));
      left.appendChild(createEl('span', 'text-slate-300', [formatPrice(price)]));
      row.appendChild(left);
      const delBtn = createEl('button', 'shrink-0 text-red-400 hover:text-red-300 text-xs px-1.5 py-0.5 rounded');
      delBtn.type = 'button';
      delBtn.textContent = t('remove');
      delBtn.addEventListener('click', () => {
        const idx = selectedCustomServices.findIndex((s) => s.id === id);
        if (idx !== -1) selectedCustomServices.splice(idx, 1);
        row.remove();
        updateSummary();
      });
      row.appendChild(delBtn);
      customList.appendChild(row);
      customName.value = '';
      customPrice.value = '';
      updateSummary();
    });
    customCard.appendChild(customName);
    customCard.appendChild(customPrice);
    customCard.appendChild(addCustomBtn);
    customCard.appendChild(customList);
  }

  servicesCard.appendChild(customCard);

  // Комментарий и фото
  const commentCard = createEl(
    'div',
    'bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3'
  );
  const commentLabel = createEl('label', 'block text-xs text-slate-300', [t('comment')]);
  const commentInput = createEl(
    'textarea',
    'w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500'
  );
  commentInput.rows = 2;

  const clientNameInput = createEl('input', 'w-full mt-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500');
  clientNameInput.placeholder = t('client_name');
  const clientPhoneInput = createEl('input', 'w-full mt-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500');
  clientPhoneInput.placeholder = t('client_phone');
  clientPhoneInput.type = 'tel';
  const vinInput = createEl('input', 'w-full mt-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500');
  vinInput.placeholder = t('vin');
  const plateInput = createEl('input', 'w-full mt-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500');
  plateInput.placeholder = t('plate');

  const photoLabel = createEl('div', 'text-xs text-slate-300 mt-2', [t('photo_before')]);
  const photoInput = createEl(
    'input',
    'mt-1 block w-full text-xs text-slate-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-slate-800 file:text-slate-100 hover:file:bg-slate-700'
  );
  photoInput.type = 'file';
  photoInput.accept = 'image/*';
  photoInput.capture = 'environment';

  commentCard.appendChild(commentLabel);
  commentCard.appendChild(commentInput);
  commentCard.appendChild(clientNameInput);
  commentCard.appendChild(clientPhoneInput);
  commentCard.appendChild(vinInput);
  commentCard.appendChild(plateInput);
  commentCard.appendChild(photoLabel);
  commentCard.appendChild(photoInput);

  // Предзаполнение из Клиенты / Авто / Заявки
  (function applyPrefill() {
    const c = window.__adminSelectedClient;
    const v = window.__adminSelectedVehicle;
    const b = window.__bookingPrefill;
    if (c) {
      clientNameInput.value = c.name || '';
      clientPhoneInput.value = c.phone || '';
      window.__adminSelectedClient = null;
    }
    if (v) {
      manualBrandInput.value = v.brand || '';
      manualModelInput.value = v.model || '';
      manualYearInput.value = v.year || '';
      vinInput.value = v.vin || '';
      plateInput.value = v.plate || '';
      window.__adminSelectedVehicle = null;
    }
    if (b) {
      clientNameInput.value = clientNameInput.value || b.name || '';
      clientPhoneInput.value = clientPhoneInput.value || b.phone || '';
      commentInput.value = (b.message || '') + (b.service ? '\nУслуга: ' + b.service : '');
      if (b.car && b.car.trim()) {
        const parts = b.car.trim().split(/\s+/);
        if (parts.length >= 3) {
          manualBrandInput.value = parts[0];
          manualModelInput.value = parts.slice(1, -1).join(' ');
          manualYearInput.value = parts[parts.length - 1];
        } else {
          manualBrandInput.value = b.car;
        }
      }
      window.__bookingPrefill = null;
    }
  })();

  // Итог
  const summaryCard = createEl(
    'div',
    'bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 sticky bottom-0'
  );

  const summaryList = createEl('div', 'space-y-1 max-h-40 overflow-y-auto text-[11px]');
  const totalRow = createEl('div', 'flex items-center justify-between mt-1');
  const totalLabel = createEl('span', 'text-xs text-slate-300', [t('total')]);
  const totalValue = createEl('span', 'text-base font-semibold text-primary-400', ['0 PLN']);
  totalRow.appendChild(totalLabel);
  totalRow.appendChild(totalValue);

  const saveInfo = createEl('div', 'text-[11px] text-primary-300 min-h-[1rem]');

  const actionsRow = createEl('div', 'mt-3');
  const createBtn = createEl(
    'button',
    'w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-sm font-medium text-white',
    [t('save_order')]
  );

  actionsRow.appendChild(createBtn);

  if (!isMaster) {
    summaryCard.appendChild(summaryList);
    summaryCard.appendChild(totalRow);
  }
  summaryCard.appendChild(saveInfo);
  summaryCard.appendChild(actionsRow);

  function updateSummary() {
    if (isMaster) return;
    summaryList.innerHTML = '';
    const car = getEffectiveCar();
    const brandName = car.brand || null;
    const year = car.year || '';
    let total = 0;

    services
      .filter((svc) => selectedServiceIds.has(svc.id))
      .forEach((svc) => {
        const { price, brandMult, yearMult } = calculateServicePrice(svc, brandName, year);
        total += price;
        const cmp = classifyPriceVsCompetitors(svc, price);
        const suggestedMarket = getSuggestedMarketPrice(svc);
        const row = createEl(
          'div',
          'flex items-center justify-between gap-2'
        );
        const left = createEl('div', 'flex-1');
        left.appendChild(
          createEl(
            'div',
            'text-slate-100',
            [settings.language === 'pl' ? svc.name_pl : svc.name_ru]
          )
        );
        const multText = yearMult > 1
          ? `×${brandMult.toFixed(2)} ×${yearMult}`
          : `×${brandMult.toFixed(2)}`;
        left.appendChild(
          createEl(
            'div',
            'text-[10px] text-slate-400',
            [`${t('recommended_price')}: ${formatPrice(price)} (${multText})`]
          )
        );
        const right = createEl('div', 'text-right');
        right.appendChild(createEl('div', 'text-xs text-slate-100', [formatPrice(price)]));
        if (cmp) {
          let text, color;
          if (cmp === 'above') { text = t('above_competitors'); color = 'text-amber-400'; }
          else if (cmp === 'below') { text = t('below_competitors'); color = 'text-sky-400'; }
          else { text = t('near_competitors'); color = 'text-emerald-400'; }
          right.appendChild(createEl('div', `text-[10px] ${color}`, [text]));
        }
        if (suggestedMarket != null && Math.abs(suggestedMarket - price) > 1) {
          right.appendChild(
            createEl('div', 'text-[10px] text-slate-500', [`≈ ${formatPrice(suggestedMarket)} vs rynek`])
          );
        }
        row.appendChild(left);
        row.appendChild(right);
        summaryList.appendChild(row);
      });

    // кастомные услуги
    selectedCustomServices.forEach((svc) => {
      total += svc.price;
      const row = createEl('div', 'flex items-center justify-between gap-2');
      row.appendChild(
        createEl('div', 'text-slate-100 text-xs', [svc.name])
      );
      row.appendChild(
        createEl('div', 'text-slate-100 text-xs', [formatPrice(svc.price)])
      );
      summaryList.appendChild(row);
    });

    totalValue.textContent = formatPrice(total);
  }

  createBtn.addEventListener('click', async () => {
    const car = getEffectiveCar();
    const { brand: brandName, model: modelName, year } = car;
    if (!brandName || !modelName || !year) {
      alert(settings.language === 'pl' ? 'Podaj markę, model i rok.' : 'Укажите марку, модель и год авто.');
      return;
    }

    let serviceItems = [];
    let total = 0;
    if (isMaster) {
      if (masterWorks.length === 0) {
        alert(settings.language === 'pl' ? 'Dodaj co najmniej jedną pracę.' : 'Добавьте хотя бы одну работу.');
        return;
      }
      serviceItems = masterWorks.map((text) => {
        const catalog = suggestCatalogService(text);
        const pro = getProfessionalName(text);
        const name_pl = catalog ? catalog.name_pl : (pro ? pro.name_pl : text);
        const name_ru = catalog ? catalog.name_ru : (pro ? pro.name_ru : text);
        return { name_pl, name_ru, quantity: 1, price: 0 };
      });
    } else {
      if (selectedServiceIds.size === 0 && selectedCustomServices.length === 0) {
        alert(settings.language === 'pl' ? 'Wybierz co najmniej jedną usługę.' : 'Выберите хотя бы одну услугу.');
        return;
      }
      const selectedStandardServices = services.filter((s) => selectedServiceIds.has(s.id));
      selectedStandardServices.forEach((svc) => {
        const { price } = calculateServicePrice(svc, brandName, year);
        total += price;
        serviceItems.push({ name_pl: svc.name_pl, name_ru: svc.name_ru, quantity: 1, price });
      });
      selectedCustomServices.forEach((svc) => {
        total += svc.price;
        serviceItems.push({ name_pl: svc.name, name_ru: svc.name, quantity: 1, price: svc.price });
      });
    }

    let photoDataUrl = null;
    if (photoInput.files && photoInput.files[0]) {
      photoDataUrl = await fileToDataUrl(photoInput.files[0]);
    }

    const now = new Date().toISOString();
    const order = {
      id: Date.now().toString(),
      createdAt: now,
      status: 'pending',
      createdBy: currentUser?.username || 'master',
      brand: brandName,
      model: modelName,
      year,
      comment: commentInput.value.trim(),
      photoDataUrl,
      clientName: (clientNameInput.value || '').trim(),
      clientPhone: (clientPhoneInput.value || '').trim(),
      vin: (vinInput.value || '').trim(),
      plate: (plateInput.value || '').trim(),
      services: serviceItems,
      total: isMaster ? 0 : total,
      paymentType: 'cash',
      paid: false,
      timeIn: now,
      timeOut: null,
      master: currentUser?.username || null
    };

    // Сохраняем локально (для оффлайна) и отправляем в общую базу (Supabase через /api/crm-orders)
    orders.push(order);
    upsertClientFromOrder(order);
    upsertVehicleFromOrder(order);
    persistAll();

    try {
      await fetch('/api/crm-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
    } catch {
      // если сервер недоступен — оставляем только локально
    }

    saveInfo.textContent = t('order_saved');
    setTimeout(() => { saveInfo.textContent = ''; }, 3000);
  });

  if (!isMaster) updateSummary();

  container.appendChild(carCard);
  container.appendChild(servicesCard);
  container.appendChild(commentCard);
  container.appendChild(summaryCard);

  return container;
}

function renderAdminOrdersScreen() {
  const container = createEl('div', 'space-y-4');

  if (adminSelectedOrderId) {
    const order = orders.find((o) => o.id === adminSelectedOrderId);
    if (!order) {
      adminSelectedOrderId = null;
      return renderAdminOrdersScreen();
    }
    const detail = createEl('div', 'space-y-4');
    const headerRow = createEl('div', 'flex items-center justify-between');
    const backBtn = createEl('button', 'text-sm text-slate-400 hover:text-white flex items-center gap-1', [t('back_to_list')]);
    backBtn.addEventListener('click', () => {
      adminSelectedOrderId = null;
      renderAppShell('admin_orders');
    });
    const deleteBtn = createEl('button', 'text-xs text-red-400 hover:text-red-300', [t('delete_order')]);
    deleteBtn.addEventListener('click', () => {
      const msg = t('delete_confirm');
      if (!window.confirm(msg)) return;
      orders = orders.filter((o) => o.id !== order.id);
      adminSelectedOrderId = null;
      persistAll();
      renderAppShell('admin_orders');
    });
    headerRow.appendChild(backBtn);
    headerRow.appendChild(deleteBtn);
    detail.appendChild(headerRow);

    detail.appendChild(createEl('div', 'text-xs text-slate-400', [`#${order.id} · ${new Date(order.createdAt).toLocaleString(settings.language === 'pl' ? 'pl-PL' : 'ru-RU')}`]));
    detail.appendChild(createEl('h2', 'text-lg font-semibold text-white', [`${order.brand} ${order.model}, ${order.year}`]));

    const clientBlock = createEl('div', 'grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mt-1');
    const nameInput = createEl('input', 'w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100');
    nameInput.placeholder = t('client_name');
    nameInput.value = order.clientName || '';
    nameInput.addEventListener('change', () => {
      order.clientName = nameInput.value.trim();
      persistAll();
    });
    const phoneInput = createEl('input', 'w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100');
    phoneInput.placeholder = t('client_phone');
    phoneInput.type = 'tel';
    phoneInput.value = order.clientPhone || '';
    phoneInput.addEventListener('change', () => {
      order.clientPhone = phoneInput.value.trim();
      persistAll();
    });
    const vinInputAdmin = createEl('input', 'w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100');
    vinInputAdmin.placeholder = t('vin');
    vinInputAdmin.value = order.vin || '';
    vinInputAdmin.addEventListener('change', () => {
      order.vin = vinInputAdmin.value.trim();
      persistAll();
    });
    const plateInputAdmin = createEl('input', 'w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100');
    plateInputAdmin.placeholder = t('plate');
    plateInputAdmin.value = order.plate || '';
    plateInputAdmin.addEventListener('change', () => {
      order.plate = plateInputAdmin.value.trim();
      persistAll();
    });
    clientBlock.appendChild(nameInput);
    clientBlock.appendChild(phoneInput);
    clientBlock.appendChild(vinInputAdmin);
    clientBlock.appendChild(plateInputAdmin);
    detail.appendChild(clientBlock);

    const adminNoteLabel = createEl('div', 'text-[11px] text-slate-400 mt-1', [t('admin_note')]);
    const adminNoteInput = createEl('textarea', 'w-full mt-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100');
    adminNoteInput.rows = 2;
    adminNoteInput.value = order.adminNote || '';
    adminNoteInput.addEventListener('change', () => {
      order.adminNote = adminNoteInput.value.trim();
      persistAll();
    });
    detail.appendChild(adminNoteLabel);
    detail.appendChild(adminNoteInput);
    detail.appendChild(createEl('div', 'text-sm text-slate-300', [`${t('total')}: ${formatPrice(order.total)}`]));

    const statusRow = createEl('div', 'flex items-center gap-2');
    statusRow.appendChild(createEl('span', 'text-xs text-slate-400', [t('order_status') + ': ']));
    const statusSelect = createEl('select', 'px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-100');
    const currentStatus = order.status || 'pending';
    ['pending', 'in_progress', 'completed', 'cancelled'].forEach((st) => {
      const opt = document.createElement('option');
      opt.value = st;
      opt.textContent = t('status_' + st);
      if (currentStatus === st) opt.selected = true;
      statusSelect.appendChild(opt);
    });
    statusSelect.addEventListener('change', () => {
      order.status = statusSelect.value;
      persistAll();
    });
    statusRow.appendChild(statusSelect);
    detail.appendChild(statusRow);

    const payRow = createEl('div', 'grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2');
    const paymentSelect = createEl('select', 'px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-100');
    ['cash', 'card', 'transfer'].forEach((val) => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = t('payment_' + val);
      if ((order.paymentType || 'cash') === val) opt.selected = true;
      paymentSelect.appendChild(opt);
    });
    paymentSelect.addEventListener('change', () => { order.paymentType = paymentSelect.value; persistAll(); });
    const paidLabel = createEl('label', 'flex items-center gap-2 text-xs text-slate-300');
    const paidCheck = document.createElement('input');
    paidCheck.type = 'checkbox';
    paidCheck.checked = !!order.paid;
    paidCheck.addEventListener('change', () => { order.paid = paidCheck.checked; persistAll(); });
    paidLabel.appendChild(paidCheck);
    paidLabel.appendChild(document.createTextNode(t('paid')));
    const timeInLabel = createEl('label', 'text-[11px] text-slate-400');
    timeInLabel.textContent = t('time_in');
    const timeInInput = createEl('input', 'w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100');
    timeInInput.type = 'datetime-local';
    timeInInput.value = order.timeIn ? new Date(order.timeIn).toISOString().slice(0, 16) : '';
    timeInInput.addEventListener('change', () => { order.timeIn = timeInInput.value ? new Date(timeInInput.value).toISOString() : null; persistAll(); });
    const timeOutLabel = createEl('label', 'text-[11px] text-slate-400');
    timeOutLabel.textContent = t('time_out');
    const timeOutInput = createEl('input', 'w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100');
    timeOutInput.type = 'datetime-local';
    timeOutInput.value = order.timeOut ? new Date(order.timeOut).toISOString().slice(0, 16) : '';
    timeOutInput.addEventListener('change', () => { order.timeOut = timeOutInput.value ? new Date(timeOutInput.value).toISOString() : null; persistAll(); });
    const masterLabel = createEl('label', 'text-[11px] text-slate-400');
    masterLabel.textContent = t('master');
    const masterInput = createEl('input', 'w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100');
    masterInput.placeholder = currentUser?.username || 'master';
    masterInput.value = order.master || '';
    masterInput.addEventListener('change', () => { order.master = masterInput.value.trim() || null; persistAll(); });
    payRow.appendChild(createEl('div', '', [createEl('div', 'text-[11px] text-slate-400 mb-0.5', [t('payment_type')]), paymentSelect]));
    payRow.appendChild(createEl('div', 'flex items-end', [paidLabel]));
    payRow.appendChild(createEl('div', '', [timeInLabel, timeInInput]));
    payRow.appendChild(createEl('div', '', [timeOutLabel, timeOutInput]));
    payRow.appendChild(createEl('div', 'sm:col-span-2', [masterLabel, masterInput]));
    detail.appendChild(payRow);

    function recalcOrderTotal() {
      const sum = (order.services || []).reduce((acc, s) => acc + (typeof s.price === 'number' ? s.price : parseFloat(s.price) || 0), 0);
      order.total = sum;
      if (totalInput) totalInput.value = order.total;
      persistAll();
    }

    const totalOverrideWrap = createEl('div', 'flex items-center gap-2');
    totalOverrideWrap.appendChild(createEl('label', 'text-xs text-slate-400', [t('total_override')]));
    const totalInput = createEl('input', 'w-24 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-100');
    totalInput.type = 'number';
    totalInput.value = order.total;
    totalInput.addEventListener('change', () => {
      const v = parseFloat(totalInput.value);
      if (!isNaN(v) && v >= 0) { order.total = v; persistAll(); }
    });
    totalOverrideWrap.appendChild(totalInput);
    detail.appendChild(totalOverrideWrap);

    const monitorFromInternetBtn = createEl('button', 'mt-2 px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs text-slate-200 border border-slate-600');
    monitorFromInternetBtn.type = 'button';
    monitorFromInternetBtn.textContent = t('monitor_from_internet_btn');
    monitorFromInternetBtn.addEventListener('click', async () => {
      const url = getMonitorApiUrl(settings.priceMonitorUrl || '');
      if (!url) {
        alert(t('monitor_from_internet_no_url'));
        return;
      }
      monitorFromInternetBtn.disabled = true;
      monitorFromInternetBtn.textContent = '...';
      try {
        const res = await fetch(url);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : (data.services || data.prices || []);
        if (arr.length) {
          await updatePricesFromJson(arr);
          (order.services || []).forEach((line) => {
            const rawName = line.name_pl || line.name_ru || line.name || '';
            if (!rawName) return;
            const suggested = suggestCatalogService(rawName);
            const pro = getProfessionalName(rawName);
            if (suggested) {
              line.name_pl = suggested.name_pl;
              line.name_ru = suggested.name_ru;
            } else if (pro) {
              line.name_pl = pro.name_pl;
              line.name_ru = pro.name_ru;
            }
          });
          settings.lastPriceUpdate = new Date().toISOString();
          persistAll();
          renderAppShell('admin_orders');
        } else {
          alert(settings.language === 'pl' ? 'Brak danych z monitora.' : 'Нет данных от монитора.');
        }
      } catch (e) {
        alert((settings.language === 'pl' ? 'Błąd: ' : 'Ошибка: ') + e.message);
      }
      monitorFromInternetBtn.disabled = false;
      monitorFromInternetBtn.textContent = t('monitor_from_internet_btn');
    });
    detail.appendChild(monitorFromInternetBtn);

    const servicesList = createEl('div', 'space-y-2 mt-2');
    (order.services || []).forEach((s, idx) => {
      const name = settings.language === 'pl' ? (s.name_pl || s.name) : (s.name_ru || s.name);
      const row = createEl('div', 'flex flex-wrap items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 p-2');
      row.appendChild(createEl('span', 'text-sm text-slate-100 flex-1 min-w-0', [name]));

      const priceInput = createEl('input', 'w-20 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-100');
      priceInput.type = 'number';
      priceInput.min = '0';
      priceInput.value = typeof s.price === 'number' ? s.price : (s.price || 0);
      priceInput.placeholder = t('price_pln');
      priceInput.addEventListener('change', () => {
        const v = parseFloat(priceInput.value);
        order.services[idx].price = !isNaN(v) && v >= 0 ? v : 0;
        recalcOrderTotal();
      });

      const suggested = suggestCatalogService(name);
      if (suggested && (typeof s.price !== 'number' || s.price === 0)) {
        const { price: calcPrice } = calculateServicePrice(suggested, order.brand, order.year);
        const suggestLabel = createEl('span', 'text-[10px] text-slate-500', [t('suggest_from_catalog') + ': ']);
        const suggestBtn = createEl('button', 'text-xs px-2 py-0.5 rounded bg-primary-900/50 text-primary-300 hover:bg-primary-800');
        suggestBtn.type = 'button';
        const sugName = settings.language === 'pl' ? suggested.name_pl : suggested.name_ru;
        suggestBtn.textContent = sugName + ' — ' + calcPrice + ' PLN';
        suggestBtn.addEventListener('click', () => {
          order.services[idx].price = calcPrice;
          order.services[idx].name_pl = suggested.name_pl;
          order.services[idx].name_ru = suggested.name_ru;
          priceInput.value = calcPrice;
          recalcOrderTotal();
          persistAll();
          renderAppShell('admin_orders');
        });
        row.appendChild(suggestLabel);
        row.appendChild(suggestBtn);
      } else {
        const rawName = (s.name_pl || s.name_ru || s.name || '').trim();
        if (rawName) {
          const internetBtn = createEl('button', 'text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600');
          internetBtn.type = 'button';
          internetBtn.textContent = t('suggest_from_internet_btn');
          internetBtn.addEventListener('click', async () => {
            const baseUrl = getMonitorApiUrl(settings.priceMonitorUrl || '');
            if (!baseUrl) {
              alert(t('suggest_from_internet_no_url'));
              return;
            }
            internetBtn.disabled = true;
            internetBtn.textContent = '...';
            try {
              const apiUrl = baseUrl.includes('?') ? baseUrl + '&service=' + encodeURIComponent(rawName) : baseUrl + '?service=' + encodeURIComponent(rawName);
              const res = await fetch(apiUrl);
              const data = await res.json();
              if (data && (data.name_pl || data.name_ru)) {
                order.services[idx].name_pl = data.name_pl || data.name_ru || rawName;
                order.services[idx].name_ru = data.name_ru || data.name_pl || rawName;
                const price = typeof data.competitorAvgPrice === 'number' && data.competitorAvgPrice > 0 ? data.competitorAvgPrice : (typeof data.basePrice === 'number' ? data.basePrice : 0);
                if (price > 0) {
                  order.services[idx].price = price;
                  priceInput.value = price;
                  recalcOrderTotal();
                }
                persistAll();
                renderAppShell('admin_orders');
              } else {
                internetBtn.textContent = t('suggest_from_internet_btn');
                internetBtn.disabled = false;
              }
            } catch (e) {
              alert((settings.language === 'pl' ? 'Błąd: ' : 'Ошибка: ') + e.message);
              internetBtn.textContent = t('suggest_from_internet_btn');
              internetBtn.disabled = false;
            }
          });
          row.appendChild(internetBtn);
        }
      }

      const fromCatalogSelect = createEl('select', 'text-xs px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 max-w-[140px]');
      const catalogPlaceholder = document.createElement('option');
      catalogPlaceholder.value = '';
      catalogPlaceholder.textContent = t('from_catalog');
      fromCatalogSelect.appendChild(catalogPlaceholder);
      services.forEach((svc) => {
        const opt = document.createElement('option');
        opt.value = svc.id;
        opt.textContent = (settings.language === 'pl' ? svc.name_pl : svc.name_ru) + ' (' + svc.basePrice + ')';
        fromCatalogSelect.appendChild(opt);
      });
      fromCatalogSelect.addEventListener('change', () => {
        const sid = fromCatalogSelect.value;
        if (!sid) return;
        const svc = services.find((x) => x.id === sid);
        if (svc) {
          const { price } = calculateServicePrice(svc, order.brand, order.year);
          order.services[idx].price = price;
          order.services[idx].name_pl = svc.name_pl;
          order.services[idx].name_ru = svc.name_ru;
          priceInput.value = price;
          recalcOrderTotal();
          persistAll();
          renderAppShell('admin_orders');
        }
        fromCatalogSelect.value = '';
      });

      row.appendChild(createEl('label', 'text-[11px] text-slate-400', [t('price_pln')]));
      row.appendChild(priceInput);
      row.appendChild(fromCatalogSelect);
      const removeBtn = createEl('button', 'text-xs px-2 py-0.5 rounded bg-slate-800 text-red-300 hover:bg-red-700 hover:text-white', ['×']);
      removeBtn.type = 'button';
      removeBtn.addEventListener('click', () => {
        order.services.splice(idx, 1);
        recalcOrderTotal();
        persistAll();
        renderAppShell('admin_orders');
      });
      row.appendChild(removeBtn);
      servicesList.appendChild(row);
    });
    detail.appendChild(servicesList);
    if (order.comment) detail.appendChild(createEl('p', 'text-xs text-slate-400', [t('comment') + ': ' + order.comment]));

    const reminderFromOrderBtn = createEl('button', 'px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs text-slate-200', [t('add_reminder')]);
    reminderFromOrderBtn.addEventListener('click', () => {
      const note = prompt(settings.language === 'pl' ? 'Treść przypomnienia' : 'Текст напоминания', (settings.language === 'pl' ? 'Kontrola po naprawie #' : 'Контроль после ремонта #') + order.id);
      if (note == null) return;
      const d = new Date(); d.setMonth(d.getMonth() + 3);
      const dueStr = prompt(settings.language === 'pl' ? 'Data (RRRR-MM-DD)' : 'Дата (ГГГГ-ММ-ДД)', d.toISOString().slice(0, 10));
      reminders.push({ id: nextId(), orderId: order.id, note: (note || '').trim(), dueDate: dueStr || d.toISOString().slice(0, 10), completed: false, createdAt: new Date().toISOString() });
      persistAll();
    });
    const pdfRow = createEl('div', 'flex flex-wrap gap-2 mt-4');
    const pdfPlBtn = createEl('button', 'px-3 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-xs text-white', [t('pdf_pl')]);
    const pdfRuBtn = createEl('button', 'px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs text-slate-100', [t('pdf_ru')]);
    const waPlBtn = createEl('button', 'px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-xs text-white', ['WhatsApp (PL)']);
    const waRuBtn = createEl('button', 'px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-xs text-slate-100', ['WhatsApp (RU)']);

    async function doGeneratePdf(lang) {
      pdfPlBtn.disabled = true;
      pdfRuBtn.disabled = true;
      try {
        const { pdfBlobUrl } = await generateOrderPdf(order, lang);
        window.open(pdfBlobUrl, '_blank');
      } catch (e) {
        alert(settings.language === 'pl' ? 'Nie udało się wygenerować PDF. Sprawdź połączenie.' : 'Не удалось сформировать PDF. Проверьте интернет.');
      } finally {
        pdfPlBtn.disabled = false;
        pdfRuBtn.disabled = false;
      }
    }

    function doSendWhatsApp(lang) {
      const text = buildOrderSummaryText(order, lang);
      const phone = getWhatsappNumber(order);
      const url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank');
    }

    pdfPlBtn.addEventListener('click', () => doGeneratePdf('pl'));
    pdfRuBtn.addEventListener('click', () => doGeneratePdf('ru'));
    waPlBtn.addEventListener('click', () => doSendWhatsApp('pl'));
    waRuBtn.addEventListener('click', () => doSendWhatsApp('ru'));

    pdfRow.appendChild(reminderFromOrderBtn);
    pdfRow.appendChild(pdfPlBtn);
    pdfRow.appendChild(pdfRuBtn);
    pdfRow.appendChild(waPlBtn);
    pdfRow.appendChild(waRuBtn);
    detail.appendChild(pdfRow);

    container.appendChild(detail);
    return container;
  }

  const loading = createEl('div', 'text-sm text-slate-400 py-2', [settings.language === 'pl' ? 'Ładowanie zleceń...' : 'Загружаем заказы...']);
  container.appendChild(loading);

  (async () => {
    try {
      const res = await fetch('/api/crm-orders');
      const data = await res.json();
      if (data && data.ok && Array.isArray(data.orders)) {
        orders = data.orders.map((o) => ({
          id: o.id,
          createdAt: o.created_at,
          status: o.status,
          createdBy: o.created_by,
          brand: o.brand,
          model: o.model,
          year: o.year,
          comment: o.comment,
          photoDataUrl: o.photo_url,
          clientName: o.client_name,
          clientPhone: o.client_phone,
          vin: o.vin,
          plate: o.plate,
          total: Number(o.total) || 0,
          paymentType: o.payment_type,
          paid: o.paid,
          timeIn: o.time_in,
          timeOut: o.time_out,
          master: o.master,
          adminNote: o.admin_note,
          services: []
        }));
        persistAll();
      }
    } catch {
      // fallback: остаёмся на локальных orders
    }

    container.removeChild(loading);

    const today = new Date().toDateString();
    const todayCount = orders.filter((o) => new Date(o.createdAt).toDateString() === today).length;
    const pendingCount = orders.filter((o) => (o.status || 'pending') === 'pending').length;

    const dashboard = createEl('div', 'grid grid-cols-2 gap-2 mb-4');
    dashboard.appendChild(createEl('div', 'bg-slate-900 rounded-xl p-3 text-center', [
      createEl('div', 'text-2xl font-bold text-primary-400', [String(todayCount)]),
      createEl('div', 'text-[11px] text-slate-400', [t('today_orders')])
    ]));
    dashboard.appendChild(createEl('div', 'bg-slate-900 rounded-xl p-3 text-center', [
      createEl('div', 'text-2xl font-bold text-amber-400', [String(pendingCount)]),
      createEl('div', 'text-[11px] text-slate-400', [t('pending_orders')])
    ]));
    container.appendChild(dashboard);

    const list = createEl('div', 'space-y-2');
    const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sorted.length === 0) {
      list.appendChild(createEl('div', 'text-sm text-slate-400 py-8 text-center', [t('no_orders')]));
    } else {
      sorted.forEach((o) => {
        const row = createEl(
          'div',
          'bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between items-center cursor-pointer hover:bg-slate-800'
        );
        row.addEventListener('click', () => {
          adminSelectedOrderId = o.id;
          renderAppShell('admin_orders');
        });
        const left = createEl('div', '');
        left.appendChild(createEl('div', 'text-sm font-medium text-white', [`${o.brand} ${o.model}, ${o.year}`]));
        left.appendChild(createEl('div', 'text-[11px] text-slate-400', [new Date(o.createdAt).toLocaleString()]));
        const statusBadge = createEl(
          'span',
          `text-[10px] px-2 py-0.5 rounded-full ${
            (o.status || 'pending') === 'completed' ? 'bg-emerald-900 text-emerald-300' :
            (o.status || 'pending') === 'in_progress' ? 'bg-amber-900 text-amber-300' :
            (o.status || 'pending') === 'cancelled' ? 'bg-slate-700 text-slate-400' : 'bg-slate-700 text-slate-300'
          }`,
          [t('status_' + (o.status || 'pending'))]
        );
        const right = createEl('div', 'text-right');
        right.appendChild(createEl('div', 'text-sm font-semibold text-primary-400', [formatPrice(getOrderTotal(o))]));
        right.appendChild(statusBadge);
        row.appendChild(left);
        row.appendChild(right);
        list.appendChild(row);
      });
    }
    container.appendChild(list);
  })();

  return container;
}

function renderClientsScreen() {
  const container = createEl('div', 'space-y-4');
  const topBar = createEl('div', 'flex gap-2');
  const searchInput = createEl('input', 'flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm placeholder-slate-500');
  searchInput.placeholder = t('search_placeholder');
  searchInput.type = 'text';
  const addClientBtn = createEl('button', 'px-3 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-sm text-white whitespace-nowrap', [t('add_client')]);
  addClientBtn.addEventListener('click', () => {
    const name = prompt(settings.language === 'pl' ? 'Imię i nazwisko' : 'Имя клиента', '');
    if (name == null) return;
    const phone = prompt(settings.language === 'pl' ? 'Telefon' : 'Телефон', '');
    if (!name.trim() && !(phone || '').trim()) return;
    clients.push({ id: nextId(), name: (name || '').trim() || '—', phone: (phone || '').trim(), createdAt: new Date().toISOString() });
    persistAll();
    renderList();
  });
  topBar.appendChild(searchInput);
  topBar.appendChild(addClientBtn);
  container.appendChild(topBar);

  let filtered = [];
  function renderList() {
    const list = getClientsList();
    const q = (searchInput.value || '').toLowerCase().trim();
    filtered = q ? list.filter((c) => (c.name || '').toLowerCase().includes(q) || (c.phone || '').replace(/\D/g, '').includes(q.replace(/\D/g, ''))) : list;
    listEl.innerHTML = '';
    if (filtered.length === 0) {
      listEl.appendChild(createEl('div', 'text-sm text-slate-400 py-8 text-center', [t('no_clients')]));
      return;
    }
    filtered.forEach((c) => {
      const row = createEl('div', 'bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between items-center gap-2 cursor-pointer hover:bg-slate-800');
      const left = createEl('div', '', [
        createEl('div', 'text-sm font-medium text-white', [c.name || '—']),
        createEl('div', 'text-xs text-slate-400', [c.phone || '—'])
      ]);
      row.appendChild(left);
      const ordersCount = orders.filter((o) => (o.clientPhone || '').trim() === (c.phone || '').trim() || (o.clientName || '').trim() === (c.name || '').trim()).length;
      const right = createEl('div', 'flex items-center gap-2');
      right.appendChild(createEl('div', 'text-xs text-slate-400', [ordersCount + ' ' + t('client_orders').toLowerCase()]));
      const delBtn = createEl('button', 'text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-red-700 hover:text-white', ['×']);
      delBtn.type = 'button';
      delBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (!window.confirm(settings.language === 'pl' ? 'Usunąć klienta?' : 'Удалить клиента?')) return;
        clients = clients.filter((x) => x.id !== c.id);
        persistAll();
        renderList();
      });
      right.appendChild(delBtn);
      row.appendChild(right);
      row.addEventListener('click', () => {
        adminSelectedOrderId = null;
        window.__adminSelectedClient = c;
        renderAppShell('order');
      });
      listEl.appendChild(row);
    });
  }
  searchInput.addEventListener('input', renderList);

  const listEl = createEl('div', 'space-y-2');
  container.appendChild(listEl);
  renderList();
  return container;
}

function renderVehiclesScreen() {
  const container = createEl('div', 'space-y-4');
  const topBar = createEl('div', 'flex gap-2');
  const searchInput = createEl('input', 'flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm placeholder-slate-500');
  searchInput.placeholder = t('search_placeholder');
  searchInput.type = 'text';
  const addVehicleBtn = createEl('button', 'px-3 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-sm text-white whitespace-nowrap', [t('add_vehicle')]);
  addVehicleBtn.addEventListener('click', () => {
    const brand = prompt(settings.language === 'pl' ? 'Marka' : 'Марка', '');
    if (brand == null) return;
    const model = prompt(settings.language === 'pl' ? 'Model' : 'Модель', '');
    const year = prompt(settings.language === 'pl' ? 'Rok' : 'Год', new Date().getFullYear());
    const vin = prompt('VIN', '');
    const plate = prompt(settings.language === 'pl' ? 'Numer rejestracyjny' : 'Гос. номер', '');
    vehicles.push({ id: nextId(), brand: (brand || '').trim(), model: (model || '').trim(), year: (year || '').trim(), vin: (vin || '').trim(), plate: (plate || '').trim(), createdAt: new Date().toISOString() });
    persistAll();
    renderList();
  });
  topBar.appendChild(searchInput);
  topBar.appendChild(addVehicleBtn);
  container.appendChild(topBar);

  const listEl = createEl('div', 'space-y-2');
  let filtered = [];
  function renderList() {
    const list = getVehiclesList();
    const q = (searchInput.value || '').toLowerCase().trim();
    filtered = q ? list.filter((v) => (v.brand + ' ' + v.model + ' ' + v.year).toLowerCase().includes(q) || (v.vin || '').toLowerCase().includes(q) || (v.plate || '').toLowerCase().includes(q)) : list;
    listEl.innerHTML = '';
    if (filtered.length === 0) {
      listEl.appendChild(createEl('div', 'text-sm text-slate-400 py-8 text-center', [t('no_vehicles')]));
      return;
    }
    filtered.forEach((v) => {
      const row = createEl('div', 'bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between items-center gap-2 cursor-pointer hover:bg-slate-800');
      const left = createEl('div', '', [
        createEl('div', 'text-sm font-medium text-white', [`${v.brand} ${v.model}, ${v.year}`]),
        createEl('div', 'text-xs text-slate-400', [(v.vin || v.plate || '—')])
      ]);
      row.appendChild(left);
      const ordersCount = orders.filter((o) => (o.vin && o.vin === v.vin) || (o.plate && o.plate === v.plate) || (o.brand === v.brand && o.model === v.model && String(o.year) === String(v.year))).length;
      const right = createEl('div', 'flex items-center gap-2');
      right.appendChild(createEl('div', 'text-xs text-slate-400', [ordersCount + ' ' + t('client_orders').toLowerCase()]));
      const delBtn = createEl('button', 'text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-red-700 hover:text-white', ['×']);
      delBtn.type = 'button';
      delBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (!window.confirm(settings.language === 'pl' ? 'Usunąć pojazd?' : 'Удалить авто?')) return;
        vehicles = vehicles.filter((x) => x.id !== v.id);
        persistAll();
        renderList();
      });
      right.appendChild(delBtn);
      row.appendChild(right);
      row.addEventListener('click', () => {
        adminSelectedOrderId = null;
        window.__adminSelectedVehicle = v;
        renderAppShell('order');
      });
      listEl.appendChild(row);
    });
  }
  searchInput.addEventListener('input', renderList);
  container.appendChild(listEl);
  renderList();
  return container;
}

function renderBookingScreen() {
  const container = createEl('div', 'space-y-4');
  const addBtn = createEl('button', 'w-full py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-sm text-white', [t('add_booking')]);
  container.appendChild(addBtn);

  const listEl = createEl('div', 'space-y-2');
  function renderList() {
    listEl.innerHTML = '';
    const sorted = [...bookingRequests].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    if (sorted.length === 0) {
      listEl.appendChild(createEl('div', 'text-sm text-slate-400 py-8 text-center', [t('no_booking_requests')]));
      return;
    }
    sorted.forEach((r) => {
      const row = createEl('div', 'bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1');
      row.appendChild(createEl('div', 'text-sm font-medium text-white', [r.name || '—']));
      row.appendChild(createEl('div', 'text-xs text-slate-400', [(r.phone || '') + ' · ' + (r.car || '—')]));
      row.appendChild(createEl('div', 'text-xs text-slate-300', [r.service || '—']));
      if (r.message) row.appendChild(createEl('div', 'text-xs text-slate-500', [r.message]));
      const actions = createEl('div', 'flex gap-2 mt-2');
      const toOrderBtn = createEl('button', 'text-xs px-2 py-1 rounded-lg bg-primary-600 text-white', [t('convert_to_order')]);
      toOrderBtn.addEventListener('click', () => {
        window.__bookingPrefill = r;
        renderAppShell('order');
      });
      const delBtn = createEl('button', 'text-xs px-2 py-1 rounded-lg bg-slate-700 text-slate-300', [t('remove')]);
      delBtn.addEventListener('click', () => {
        bookingRequests = bookingRequests.filter((x) => x.id !== r.id);
        persistAll();
        renderList();
      });
      actions.appendChild(toOrderBtn);
      actions.appendChild(delBtn);
      row.appendChild(actions);
      listEl.appendChild(row);
    });
  }

  addBtn.addEventListener('click', () => {
    const name = prompt(settings.language === 'pl' ? 'Imię i nazwisko' : 'Имя клиента', '');
    if (name == null) return;
    const phone = prompt(settings.language === 'pl' ? 'Telefon' : 'Телефон', '');
    const car = prompt(settings.language === 'pl' ? 'Pojazd (marka, model, rok)' : 'Авто (марка, модель, год)', '');
    const service = prompt(settings.language === 'pl' ? 'Usługa' : 'Услуга', '');
    const message = prompt(settings.language === 'pl' ? 'Wiadomość' : 'Сообщение', '');
    bookingRequests.push({
      id: nextId(),
      name: (name || '').trim(),
      phone: (phone || '').trim(),
      car: (car || '').trim(),
      service: (service || '').trim(),
      message: (message || '').trim(),
      createdAt: new Date().toISOString()
    });
    persistAll();
    renderList();
  });

  container.appendChild(listEl);
  renderList();
  return container;
}

function renderRemindersScreen() {
  const container = createEl('div', 'space-y-4');
  const addBtn = createEl('button', 'w-full py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-sm text-white', [t('add_reminder')]);
  container.appendChild(addBtn);

  const listEl = createEl('div', 'space-y-2');
  function renderList() {
    listEl.innerHTML = '';
    const sorted = [...reminders].sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
    if (sorted.length === 0) {
      listEl.appendChild(createEl('div', 'text-sm text-slate-400 py-8 text-center', [t('no_reminders')]));
      return;
    }
    sorted.forEach((r) => {
      const row = createEl('div', `rounded-xl p-3 border ${r.completed ? 'bg-slate-800/50 border-slate-800 text-slate-500' : 'bg-slate-900 border-slate-800'}`);
      row.appendChild(createEl('div', 'text-sm font-medium text-white', [r.note || t('reminder_note')]));
      row.appendChild(createEl('div', 'text-xs text-slate-400', [t('reminder_due') + ': ' + (r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '—')]));
      const actions = createEl('div', 'flex gap-2 mt-2');
      const toggleBtn = createEl('button', 'text-xs px-2 py-1 rounded-lg ' + (r.completed ? 'bg-slate-700' : 'bg-emerald-700') + ' text-white', [r.completed ? '↩' : t('reminder_completed')]);
      toggleBtn.addEventListener('click', () => {
        r.completed = !r.completed;
        persistAll();
        renderList();
      });
      const delBtn = createEl('button', 'text-xs px-2 py-1 rounded-lg bg-slate-700 text-slate-300', [t('remove')]);
      delBtn.addEventListener('click', () => {
        reminders = reminders.filter((x) => x.id !== r.id);
        persistAll();
        renderList();
      });
      actions.appendChild(toggleBtn);
      actions.appendChild(delBtn);
      row.appendChild(actions);
      listEl.appendChild(row);
    });
  }

  addBtn.addEventListener('click', () => {
    const note = prompt(settings.language === 'pl' ? 'Treść przypomnienia' : 'Текст напоминания', '');
    if (note == null) return;
    const dueStr = prompt(settings.language === 'pl' ? 'Data (RRRR-MM-DD)' : 'Дата (ГГГГ-ММ-ДД)', new Date().toISOString().slice(0, 10));
    reminders.push({
      id: nextId(),
      note: (note || '').trim(),
      dueDate: dueStr || new Date().toISOString().slice(0, 10),
      completed: false,
      createdAt: new Date().toISOString()
    });
    persistAll();
    renderList();
  });

  container.appendChild(listEl);
  renderList();
  return container;
}

function renderAnalyticsScreen() {
  const container = createEl('div', 'space-y-4');
  const periodSelect = createEl('select', 'px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm');
  [['today', t('period_today')], ['week', t('period_week')], ['month', t('period_month')]].forEach(([val, label]) => {
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = label;
    periodSelect.appendChild(opt);
  });
  let period = 'week';
  periodSelect.value = period;
  periodSelect.addEventListener('change', () => { period = periodSelect.value; renderDashboard(); });

  const now = new Date();
  function getPeriodDates() {
    if (period === 'today') {
      const d = new Date(now); d.setHours(0, 0, 0, 0);
      return { start: d, end: now };
    }
    if (period === 'week') {
      const end = new Date(now); end.setHours(23, 59, 59, 999);
      const start = new Date(now); start.setDate(start.getDate() - 7); start.setHours(0, 0, 0, 0);
      return { start, end };
    }
    const end = new Date(now); end.setHours(23, 59, 59, 999);
    const start = new Date(now); start.setMonth(start.getMonth() - 1); start.setHours(0, 0, 0, 0);
    return { start, end };
  }

  const cardsEl = createEl('div', 'grid grid-cols-1 sm:grid-cols-3 gap-3');
  const topServicesEl = createEl('div', 'bg-slate-900 border border-slate-800 rounded-xl p-4');
  const topClientsEl = createEl('div', 'bg-slate-900 border border-slate-800 rounded-xl p-4');
  const topsWrap = createEl('div', 'grid grid-cols-1 md:grid-cols-2 gap-3');
  topsWrap.appendChild(topServicesEl);
  topsWrap.appendChild(topClientsEl);
  const exportBtn = createEl('button', 'w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 mt-2', [t('export_csv')]);

  function renderDashboard() {
    const { start, end } = getPeriodDates();
    const inPeriod = (o) => {
      const d = new Date(o.createdAt);
      return d >= start && d <= end;
    };
    const completedOrders = orders.filter((o) => (o.status || '') === 'completed' && inPeriod(o));
    const revenue = completedOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const count = completedOrders.length;
    const avgCheck = count ? Math.round(revenue / count) : 0;

    cardsEl.innerHTML = '';
    cardsEl.appendChild(createEl('div', 'bg-slate-900 rounded-xl p-4 text-center border border-slate-800', [
      createEl('div', 'text-2xl font-bold text-primary-400', [String(revenue)]),
      createEl('div', 'text-xs text-slate-400', [t('revenue') + ' (PLN)'])
    ]));
    cardsEl.appendChild(createEl('div', 'bg-slate-900 rounded-xl p-4 text-center border border-slate-800', [
      createEl('div', 'text-2xl font-bold text-slate-100', [String(count)]),
      createEl('div', 'text-xs text-slate-400', [t('orders_count')])
    ]));
    cardsEl.appendChild(createEl('div', 'bg-slate-900 rounded-xl p-4 text-center border border-slate-800', [
      createEl('div', 'text-2xl font-bold text-slate-100', [String(avgCheck)]),
      createEl('div', 'text-xs text-slate-400', [t('avg_check') + ' (PLN)'])
    ]));

    const serviceCount = {};
    completedOrders.forEach((o) => {
      (o.services || []).forEach((s) => {
        const name = settings.language === 'pl' ? (s.name_pl || s.name_ru) : (s.name_ru || s.name_pl);
        serviceCount[name] = (serviceCount[name] || 0) + 1;
      });
    });
    const topServices = Object.entries(serviceCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
    topServicesEl.innerHTML = '';
    topServicesEl.appendChild(createEl('h3', 'text-sm font-semibold text-slate-100 mb-2', [t('top_services')]));
    topServices.length ? topServices.forEach(([name, n]) => { topServicesEl.appendChild(createEl('div', 'text-xs text-slate-300 flex justify-between', [name, n])); }) : topServicesEl.appendChild(createEl('div', 'text-xs text-slate-500', ['—']));

    const clientRevenue = {};
    completedOrders.forEach((o) => {
      const key = (o.clientPhone || o.clientName || '—').trim() || '—';
      clientRevenue[key] = (clientRevenue[key] || 0) + (Number(o.total) || 0);
    });
    const topClients = Object.entries(clientRevenue).sort((a, b) => b[1] - a[1]).slice(0, 5);
    topClientsEl.innerHTML = '';
    topClientsEl.appendChild(createEl('h3', 'text-sm font-semibold text-slate-100 mb-2', [t('top_clients')]));
    topClients.length ? topClients.forEach(([name, sum]) => { topClientsEl.appendChild(createEl('div', 'text-xs text-slate-300 flex justify-between', [name, formatPrice(sum)])); }) : topClientsEl.appendChild(createEl('div', 'text-xs text-slate-500', ['—']));
  }

  exportBtn.addEventListener('click', () => {
    const { start, end } = getPeriodDates();
    const inPeriod = (o) => { const d = new Date(o.createdAt); return d >= start && d <= end; };
    const list = orders.filter(inPeriod);
    const headers = ['id', 'createdAt', 'status', 'brand', 'model', 'year', 'clientName', 'clientPhone', 'total'];
    const rows = list.map((o) => headers.map((h) => (o[h] != null ? String(o[h]) : '')));
    const csv = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'orders_' + period + '_' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  container.appendChild(periodSelect);
  container.appendChild(cardsEl);
  container.appendChild(topsWrap);
  container.appendChild(exportBtn);
  renderDashboard();
  return container;
}

function renderAdminScreen() {
  const container = createEl('div', 'space-y-4');

  // Настройка коэффициентов брендов
  const brandCard = createEl(
    'div',
    'bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3'
  );
  brandCard.appendChild(
    createEl('h2', 'text-sm font-semibold text-slate-100', [t('brand_group')])
  );

  const groupTable = createEl('div', 'space-y-2 text-xs');
  Object.keys(brandGroups).forEach((gid) => {
    const group = brandGroups[gid];
    if (!group) return;
    const row = createEl(
      'div',
      'flex items-center justify-between gap-2 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5'
    );
    const left = createEl('div', '');
    left.appendChild(
      createEl('div', 'text-slate-100', [
        `${group.id}: ${group.name}`
      ])
    );
    left.appendChild(
      createEl('div', 'text-[10px] text-slate-400', [
        (group.brands && group.brands.length) ? group.brands.join(', ') : ''
      ])
    );
    const right = createEl('div', 'flex items-center gap-1');
    right.appendChild(
      createEl('span', 'text-[11px] text-slate-400', [t('multiplier')])
    );
    const inp = createEl(
      'input',
      'w-16 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary-500'
    );
    inp.type = 'number';
    inp.step = '0.05';
    inp.min = '0.5';
    inp.max = '3.0';
    inp.value = group.multiplier;
    inp.addEventListener('change', () => {
      const v = parseFloat(inp.value);
      if (!isNaN(v) && v > 0) {
        brandGroups[gid].multiplier = v;
        persistAll();
      }
    });
    right.appendChild(inp);
    row.appendChild(left);
    row.appendChild(right);
    groupTable.appendChild(row);
  });

  brandCard.appendChild(groupTable);

  // Настройка услуг
  const servicesCard = createEl(
    'div',
    'bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3'
  );
  servicesCard.appendChild(
    createEl('h2', 'text-sm font-semibold text-slate-100', [t('service_name')])
  );

  const serviceList = createEl('div', 'space-y-2 text-xs max-h-72 overflow-y-auto');

  function renderServiceRows() {
    serviceList.innerHTML = '';
    services.forEach((svc) => {
      const row = createEl(
        'div',
        'rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 space-y-1'
      );
      row.appendChild(
        createEl('div', 'text-slate-100 text-xs font-medium', [
          settings.language === 'pl' ? svc.name_pl : svc.name_ru
        ])
      );
      const grid = createEl('div', 'grid grid-cols-3 gap-2 mt-1');

      const baseWrap = createEl('div', 'space-y-0.5');
      baseWrap.appendChild(createEl('div', 'text-[10px] text-slate-400', [t('base_price')]));
      const baseInput = createEl('input', 'w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary-500');
      baseInput.type = 'number';
      baseInput.min = '0';
      baseInput.value = svc.basePrice;
      baseInput.addEventListener('change', () => {
        const v = parseFloat(baseInput.value);
        if (!isNaN(v) && v >= 0) { svc.basePrice = v; persistAll(); }
      });
      baseWrap.appendChild(baseInput);

      const minWrap = createEl('div', 'space-y-0.5');
      minWrap.appendChild(createEl('div', 'text-[10px] text-slate-400', [t('min_price')]));
      const minInput = createEl('input', 'w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary-500');
      minInput.type = 'number';
      minInput.min = '0';
      minInput.value = svc.minPrice ?? '';
      minInput.addEventListener('change', () => {
        const v = parseFloat(minInput.value);
        svc.minPrice = !isNaN(v) && v >= 0 ? v : null;
        persistAll();
      });
      minWrap.appendChild(minInput);

      const cmpWrap = createEl('div', 'space-y-0.5');
      cmpWrap.appendChild(createEl('div', 'text-[10px] text-slate-400', [t('market_price')]));
      const cmpInput = createEl('input', 'w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary-500');
      cmpInput.type = 'number';
      cmpInput.min = '0';
      cmpInput.value = svc.competitorAvgPrice ?? '';
      cmpInput.addEventListener('change', () => {
        const v = parseFloat(cmpInput.value);
        svc.competitorAvgPrice = !isNaN(v) && v > 0 ? v : null;
        persistAll();
      });
      cmpWrap.appendChild(cmpInput);

      grid.appendChild(baseWrap);
      grid.appendChild(minWrap);
      grid.appendChild(cmpWrap);
      row.appendChild(grid);
      serviceList.appendChild(row);
    });
  }

  renderServiceRows();

  // Добавление новой услуги
  const newServiceCard = createEl(
    'div',
    'mt-3 border-t border-slate-800 pt-3 space-y-2'
  );
  newServiceCard.appendChild(
    createEl('div', 'text-xs font-medium text-slate-200', [t('new_service')])
  );
  const namePl = createEl(
    'input',
    'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500'
  );
  namePl.placeholder = 'PL';
  const nameRu = createEl(
    'input',
    'w-full mt-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500'
  );
  nameRu.placeholder = 'RU';
  const basePrice = createEl(
    'input',
    'w-full mt-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500'
  );
  basePrice.placeholder = t('base_price');
  basePrice.type = 'number';
  basePrice.min = '0';
  const minPriceNew = createEl(
    'input',
    'w-full mt-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500'
  );
  minPriceNew.placeholder = t('min_price');
  minPriceNew.type = 'number';
  minPriceNew.min = '0';
  const addBtn = createEl(
    'button',
    'mt-3 inline-flex items-center px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-xs text-white',
    [t('add_service')]
  );

  addBtn.addEventListener('click', () => {
    const pl = namePl.value.trim();
    const ru = nameRu.value.trim();
    const bp = parseFloat(basePrice.value);
    const minP = parseFloat(minPriceNew.value);
    if (!pl || !ru || isNaN(bp) || bp <= 0) return;
    const svc = {
      id: `${Date.now()}`,
      name_pl: pl,
      name_ru: ru,
      basePrice: bp,
      minPrice: !isNaN(minP) && minP >= 0 ? minP : null,
      competitorAvgPrice: null
    };
    services.push(svc);
    persistAll();
    namePl.value = '';
    nameRu.value = '';
    basePrice.value = '';
    minPriceNew.value = '';
    renderServiceRows();
  });

  newServiceCard.appendChild(namePl);
  newServiceCard.appendChild(nameRu);
  newServiceCard.appendChild(basePrice);
  newServiceCard.appendChild(minPriceNew);
  newServiceCard.appendChild(addBtn);

  servicesCard.appendChild(serviceList);
  servicesCard.appendChild(newServiceCard);

  // Price Settings (Smart Pricing)
  const settingsCard = createEl(
    'div',
    'bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3'
  );
  settingsCard.appendChild(
    createEl('h2', 'text-sm font-semibold text-slate-100', [t('price_settings')])
  );
  const discountWrap = createEl('div', 'space-y-1');
  discountWrap.appendChild(createEl('label', 'block text-[11px] text-slate-400', [t('discount_vs_market')]));
  const discountInput = createEl(
    'input',
    'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500'
  );
  discountInput.type = 'number';
  discountInput.placeholder = '-10';
  discountInput.value = settings.discountVsMarketPercent ?? '';
  discountInput.addEventListener('change', () => {
    const v = parseFloat(discountInput.value);
    settings.discountVsMarketPercent = !isNaN(v) ? v : 0;
    persistAll();
  });
  discountWrap.appendChild(discountInput);
  discountWrap.appendChild(createEl('div', 'text-[10px] text-slate-500', [t('discount_vs_market_hint')]));
  settingsCard.appendChild(discountWrap);

  const yearRow = createEl('div', 'grid grid-cols-2 gap-2');
  const threshWrap = createEl('div', 'space-y-1');
  threshWrap.appendChild(createEl('label', 'block text-[11px] text-slate-400', [t('year_threshold')]));
  const threshInput = createEl('input', 'w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-100');
  threshInput.type = 'number';
  threshInput.value = settings.yearThreshold ?? 2020;
  threshInput.addEventListener('change', () => {
    const v = parseInt(threshInput.value, 10);
    if (!isNaN(v)) { settings.yearThreshold = v; persistAll(); }
  });
  threshWrap.appendChild(threshInput);
  const multWrap = createEl('div', 'space-y-1');
  multWrap.appendChild(createEl('label', 'block text-[11px] text-slate-400', [t('year_multiplier')]));
  const multInput = createEl('input', 'w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-100');
  multInput.type = 'number';
  multInput.step = '0.1';
  multInput.value = settings.yearMultiplier ?? 1.1;
  multInput.addEventListener('change', () => {
    const v = parseFloat(multInput.value);
    if (!isNaN(v) && v > 0) { settings.yearMultiplier = v; persistAll(); }
  });
  multWrap.appendChild(multInput);
  yearRow.appendChild(threshWrap);
  yearRow.appendChild(multWrap);
  settingsCard.appendChild(yearRow);

  // Мониторинг цен: раз в неделю обновлять из URL или загрузить JSON
  const monitorCard = createEl('div', 'bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3');
  monitorCard.appendChild(createEl('h2', 'text-sm font-semibold text-slate-100', [t('price_monitor')]));
  monitorCard.appendChild(createEl('p', 'text-[11px] text-slate-500', [t('price_monitor_hint')]));

  const urlWrap = createEl('div', 'space-y-1');
  urlWrap.appendChild(createEl('label', 'block text-[11px] text-slate-400', [t('price_monitor_url')]));
  const urlInput = createEl('input', 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500');
  urlInput.type = 'url';
  urlInput.placeholder = 'https://ваш-проект.vercel.app или .../api/prices';
  urlInput.value = settings.priceMonitorUrl || '';
  urlInput.addEventListener('change', () => {
    settings.priceMonitorUrl = urlInput.value.trim();
    persistAll();
  });
  urlWrap.appendChild(urlInput);
  urlWrap.appendChild(createEl('div', 'text-[10px] text-slate-500 mt-0.5', [settings.language === 'pl' ? 'Jeśli podasz tylko domenę (np. car-ser.vercel.app), dodam /api/prices' : 'Если указать только домен (например car-ser.vercel.app), подставится /api/prices']));
  monitorCard.appendChild(urlWrap);

  const updateBtn = createEl('button', 'w-full py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-xs text-white');
  updateBtn.textContent = t('update_prices_btn');
  updateBtn.type = 'button';
  updateBtn.addEventListener('click', async () => {
    const url = getMonitorApiUrl(settings.priceMonitorUrl || urlInput.value || '');
    if (!url) {
      alert(settings.language === 'pl' ? 'Podaj URL.' : 'Укажите URL.');
      return;
    }
    updateBtn.disabled = true;
    updateBtn.textContent = '...';
    try {
      const res = await fetch(url);
      const data = await res.json();
      const { updated } = await updatePricesFromJson(data);
      updateBtn.textContent = t('update_prices_btn') + ' ✓';
      lastUpdateEl.textContent = (t('last_update') + ': ') + (settings.lastPriceUpdate ? new Date(settings.lastPriceUpdate).toLocaleString() : '—');
      if (updated > 0) renderAppShell('admin');
    } catch (e) {
      alert((settings.language === 'pl' ? 'Błąd: ' : 'Ошибка: ') + e.message);
      updateBtn.textContent = t('update_prices_btn');
    }
    updateBtn.disabled = false;
  });
  monitorCard.appendChild(updateBtn);

  const fileInput = createEl('input', 'hidden');
  fileInput.type = 'file';
  fileInput.accept = '.json,application/json';
  const uploadBtn = createEl('button', 'w-full mt-2 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs text-slate-200');
  uploadBtn.textContent = t('upload_json_btn');
  uploadBtn.type = 'button';
  uploadBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const { updated } = await updatePricesFromJson(Array.isArray(data) ? data : (data.services || data.prices || []));
      lastUpdateEl.textContent = (t('last_update') + ': ') + (settings.lastPriceUpdate ? new Date(settings.lastPriceUpdate).toLocaleString() : '—');
      if (updated > 0) renderAppShell('admin');
    } catch (e) {
      alert((settings.language === 'pl' ? 'Błąd pliku: ' : 'Ошибка файла: ') + e.message);
    }
    fileInput.value = '';
  });
  monitorCard.appendChild(uploadBtn);
  monitorCard.appendChild(fileInput);

  const lastUpdateEl = createEl('div', 'text-[11px] text-slate-500 mt-2');
  lastUpdateEl.textContent = (t('last_update') + ': ') + (settings.lastPriceUpdate ? new Date(settings.lastPriceUpdate).toLocaleString() : '—');
  monitorCard.appendChild(lastUpdateEl);

  const passwordCard = createEl('div', 'bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3');
  passwordCard.appendChild(createEl('h2', 'text-sm font-semibold text-slate-100', [t('change_password')]));
  const passForm = createEl('div', 'space-y-2');
  const currPass = createEl('input', 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm');
  currPass.type = 'password';
  currPass.placeholder = t('current_password');
  const newPass = createEl('input', 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm');
  newPass.type = 'password';
  newPass.placeholder = t('new_password');
  const changePassBtn = createEl('button', 'px-3 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-sm text-white', [t('change_password')]);
  changePassBtn.addEventListener('click', () => {
    const curr = currPass.value.trim();
    const neu = newPass.value.trim();
    const customPasswords = loadJson(STORAGE_KEYS.passwords, {});
    const expected = customPasswords[currentUser.username] !== undefined ? customPasswords[currentUser.username] : USERS.find((u) => u.username === currentUser.username)?.password;
    if (curr !== expected || !neu) {
      alert(settings.language === 'pl' ? 'Błędne obecne hasło lub puste nowe.' : 'Неверный текущий пароль или пустой новый.');
      return;
    }
    customPasswords[currentUser.username] = neu;
    saveJson(STORAGE_KEYS.passwords, customPasswords);
    currPass.value = '';
    newPass.value = '';
    alert(t('password_changed'));
  });
  passForm.appendChild(currPass);
  passForm.appendChild(newPass);
  passForm.appendChild(changePassBtn);
  passwordCard.appendChild(passForm);

  container.appendChild(brandCard);
  container.appendChild(servicesCard);
  container.appendChild(settingsCard);
  container.appendChild(monitorCard);
  container.appendChild(passwordCard);

  // Управление пользователями — только для главного администратора (логин admin)
  if (currentUser.username === 'admin' && currentUser.role === 'admin') {
    const usersCard = createEl('div', 'bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3');
    usersCard.appendChild(createEl('h2', 'text-sm font-semibold text-slate-100', [settings.language === 'pl' ? 'Użytkownicy CRM' : 'Пользователи CRM']));

    const listEl = createEl('div', 'space-y-1 text-xs');

    function renderUsers() {
      listEl.innerHTML = '';
      // Базовые пользователи (только просмотр)
      USERS.forEach((u) => {
        const row = createEl('div', 'flex items-center justify-between gap-2 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 opacity-80');
        row.appendChild(createEl('div', '', [
          createEl('div', 'text-slate-100', [u.username]),
          createEl('div', 'text-[10px] text-slate-400', [u.role === 'admin' ? (settings.language === 'pl' ? 'Wbudowany administrator' : 'Встроенный админ') : (settings.language === 'pl' ? 'Wbudowany mistrz' : 'Встроенный мастер')])
        ]));
        row.appendChild(createEl('div', 'text-[10px] text-slate-500', ['system']));
        listEl.appendChild(row);
      });

      if (dynamicUsers.length === 0) {
        listEl.appendChild(createEl('div', 'text-[11px] text-slate-400', [settings.language === 'pl' ? 'Brak dodatkowych użytkowników.' : 'Дополнительных пользователей нет.']));
        return;
      }

      dynamicUsers.forEach((u, idx) => {
        const row = createEl('div', 'flex items-center justify-between gap-2 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2');
        row.appendChild(createEl('div', '', [
          createEl('div', 'text-slate-100', [u.username]),
          createEl('div', 'text-[10px] text-slate-400', [u.role === 'admin' ? (settings.language === 'pl' ? 'Admin' : 'Админ') : (settings.language === 'pl' ? 'Mistrz' : 'Мастер')])
        ]));
        const delBtn = createEl('button', 'text-[11px] px-2 py-0.5 rounded bg-slate-800 text-red-300 hover:bg-red-700 hover:text-white', [t('remove')]);
        delBtn.type = 'button';
        delBtn.addEventListener('click', () => {
          if (!window.confirm(settings.language === 'pl' ? 'Usunąć użytkownika?' : 'Удалить пользователя?')) return;
          dynamicUsers.splice(idx, 1);
          persistAll();
          renderUsers();
        });
        row.appendChild(delBtn);
        listEl.appendChild(row);
      });
    }

    const addForm = createEl('div', 'mt-3 border-t border-slate-800 pt-3 grid grid-cols-1 sm:grid-cols-[1.2fr_1fr_1fr_auto] gap-2 text-xs');
    const loginInput = createEl('input', 'px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100', []);
    loginInput.placeholder = settings.language === 'pl' ? 'Login użytkownika' : 'Логин пользователя';
    const passInputNew = createEl('input', 'px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100', []);
    passInputNew.type = 'password';
    passInputNew.placeholder = settings.language === 'pl' ? 'Hasło' : 'Пароль';
    const roleSelect = createEl('select', 'px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100', []);
    ['master', 'admin'].forEach((role) => {
      const opt = document.createElement('option');
      opt.value = role;
      opt.textContent = role === 'admin' ? (settings.language === 'pl' ? 'Admin' : 'Админ') : (settings.language === 'pl' ? 'Mistrz' : 'Мастер');
      roleSelect.appendChild(opt);
    });
    const addUserBtn = createEl('button', 'px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-xs text-white', [settings.language === 'pl' ? 'Dodaj' : 'Добавить']);

    addUserBtn.addEventListener('click', () => {
      const login = (loginInput.value || '').trim();
      const pwd = (passInputNew.value || '').trim();
      const role = roleSelect.value === 'admin' ? 'admin' : 'master';
      if (!login || !pwd) {
        alert(settings.language === 'pl' ? 'Podaj login i hasło.' : 'Укажите логин и пароль.');
        return;
      }
      if (USERS.some((u) => u.username === login) || dynamicUsers.some((u) => u.username === login)) {
        alert(settings.language === 'pl' ? 'Taki login już istnieje.' : 'Такой логин уже существует.');
        return;
      }
      dynamicUsers.push({ id: nextId(), username: login, password: pwd, role });
      persistAll();
      loginInput.value = '';
      passInputNew.value = '';
      renderUsers();
    });

    addForm.appendChild(loginInput);
    addForm.appendChild(passInputNew);
    addForm.appendChild(roleSelect);
    addForm.appendChild(addUserBtn);

    usersCard.appendChild(listEl);
    usersCard.appendChild(addForm);
    renderUsers();

    container.appendChild(usersCard);
  }

  return container;
}

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getMonitorApiUrl(baseUrl) {
  const raw = (baseUrl || '').trim();
  if (!raw) return '/api/prices';
  const normalized = raw.replace(/\/+$/, '');
  if (/\/api\/prices(\?|$)/i.test(normalized)) return normalized;
  return normalized + '/api/prices';
}

function getWhatsappNumber(order) {
  const raw = (order.clientPhone || '').replace(/[^\d]/g, '');
  if (raw && raw.length >= 9) return raw;
  // запасной номер сервиса
  return '48794935734';
}

function getProfessionalName(text) {
  if (!text || typeof text !== 'string') return null;
  const normalized = text.toLowerCase().trim().replace(/\s+/g, ' ');
  for (const term of PROFESSIONAL_TERMS) {
    if (term.keys.some((k) => normalized.includes(k) || k.includes(normalized))) {
      return { name_pl: term.name_pl, name_ru: term.name_ru };
    }
  }
  return null;
}

function suggestCatalogService(lineName) {
  if (!lineName || typeof lineName !== 'string') return null;
  const normalized = lineName.toLowerCase().trim().replace(/\s+/g, ' ');
  let best = null;
  let bestScore = 0;
  services.forEach((svc) => {
    const pl = (svc.name_pl || '').toLowerCase();
    const ru = (svc.name_ru || '').toLowerCase();
    const plMatch = pl.includes(normalized) || normalized.includes(pl);
    const ruMatch = ru.includes(normalized) || normalized.includes(ru);
    if (plMatch || ruMatch) {
      const score = Math.max(
        normalized.length / Math.max(pl.length, 1),
        normalized.length / Math.max(ru.length, 1)
      );
      if (score > bestScore) {
        bestScore = score;
        best = svc;
      }
    }
  });
  if (best) return best;
  const words = normalized.split(/\s+/).filter((w) => w.length > 2);
  for (const svc of services) {
    const pl = (svc.name_pl || '').toLowerCase();
    const ru = (svc.name_ru || '').toLowerCase();
    const matchCount = words.filter((w) => pl.includes(w) || ru.includes(w)).length;
    if (matchCount >= Math.min(2, words.length) && matchCount > bestScore) {
      bestScore = matchCount;
      best = svc;
    }
  }
  return best;
}

async function updatePricesFromJson(data) {
  if (!Array.isArray(data)) return { updated: 0 };
  let updated = 0;
  data.forEach((item) => {
    const id = item.id != null ? String(item.id) : null;
    if (!id) return;
    const svc = services.find((s) => String(s.id) === id);
    if (!svc) return;
    if (typeof item.basePrice === 'number' && item.basePrice >= 0) {
      svc.basePrice = item.basePrice;
      updated++;
    }
    if (typeof item.competitorAvgPrice === 'number' && item.competitorAvgPrice >= 0) {
      svc.competitorAvgPrice = item.competitorAvgPrice;
      updated++;
    }
  });
  settings.lastPriceUpdate = new Date().toISOString();
  persistAll();
  return { updated };
}

function loadJspdf() {
  if (typeof window.jspdf !== 'undefined') return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      if (typeof window.jspdf !== 'undefined') resolve();
      else reject(new Error('jsPDF failed to load'));
    };
    script.onerror = () => reject(new Error('jsPDF load failed'));
    document.head.appendChild(script);
  });
}

function buildOrderSummaryText(order, lang) {
  const isPl = lang === 'pl';
  const lines = [];
  lines.push(isPl ? 'Dzień dobry! Car Service Nikol.' : 'Здравствуйте! Car Service Nikol.');
  lines.push(isPl ? 'Zlecenie serwisowe gotowe.' : 'Заказ-наряд готов.');
  lines.push('');
  lines.push((isPl ? 'Pojazd: ' : 'Авто: ') + `${order.brand} ${order.model}, ${order.year}`);
  lines.push('');
  lines.push(isPl ? 'Usługi:' : 'Работы:');
  (order.services || []).forEach((s) => {
    let name = isPl ? (s.name_pl || s.name) : (s.name_ru || s.name);
    if ((!s.name_pl || !s.name_ru) && s.name) {
      const pro = getProfessionalName(s.name);
      if (pro) name = isPl ? pro.name_pl : pro.name_ru;
    }
    const rawPrice = typeof s.price === 'number' ? s.price : parseFloat(s.price) || 0;
    const price = Math.round(rawPrice);
    lines.push('• ' + name + ' — ' + price + ' PLN');
  });
  const rawTotal = typeof order.total === 'number' ? order.total : parseFloat(order.total) || 0;
  const total = Math.round(rawTotal);
  lines.push('');
  lines.push((isPl ? 'Razem: ' : 'Итого: ') + total + ' PLN');
  lines.push('');
  lines.push('ul. Wernisażowa 21, 64-500 Jastrowie (Szamotuły). Tel. +48 794 935 734');
  return lines.join('\n');
}

function buildOrderPdfHtml(order, lang) {
  const isPl = lang === 'pl';
  const dateStr = new Date(order.createdAt).toLocaleString(isPl ? 'pl-PL' : 'ru-RU');
  const col1 = isPl ? 'Usługa' : 'Услуга';
  const col2 = isPl ? 'Ilość' : 'Кол-во';
  const col3 = 'Cena (PLN)';
  let rows = '';
  (order.services || []).forEach((item) => {
    let name = isPl ? (item.name_pl || item.name || '') : (item.name_ru || item.name || '');
    if ((!item.name_pl || !item.name_ru) && item.name) {
      const pro = getProfessionalName(item.name);
      if (pro) name = isPl ? pro.name_pl : pro.name_ru;
    }
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    const qty = item.quantity != null ? item.quantity : 1;
    rows += `<tr><td style="border: 1px solid #333; padding: 8px 10px;">${escapeHtml(name)}</td><td style="border: 1px solid #333; padding: 8px 10px; text-align: center;">${escapeHtml(String(qty))}</td><td style="border: 1px solid #333; padding: 8px 10px; text-align: right;">${price.toFixed(0)}</td></tr>`;
  });
  const totalNum = typeof order.total === 'number' ? order.total : parseFloat(order.total) || 0;
  const legalText = isPl
    ? 'Wyrażam zgodę na wykonanie powyższych prac serwisowych w warsztacie Car Service Nikol. Oświadczam, że zostałem poinformowany o orientacyjnej cenie usługi i mogę zostać poinformowany o zmianach kosztów przed wykonaniem dodatkowych prac.'
    : 'Даю согласие на выполнение указанных работ в сервисе Car Service Nikol. Подтверждаю, что ознакомлен с ориентировочной стоимостью и могу быть уведомлён об изменении стоимости до выполнения дополнительных работ.';
  const title = isPl ? 'Zlecenie serwisowe' : 'Заказ-наряд';
  const vehicleLabel = isPl ? 'Pojazd' : 'Авто';
  const dateLabel = isPl ? 'Data' : 'Дата';
  const totalLabel = isPl ? 'Razem brutto' : 'Итого';
  const tableStyle = 'width: 100%; border-collapse: collapse; font-size: 10pt; margin-bottom: 10px; table-layout: fixed; font-family: \'Noto Sans\', Arial, sans-serif;';
  const thStyle = 'border: 1px solid #333; padding: 8px 10px; text-align: left; font-weight: bold; background: #f5f5f5;';
  const tdStyle = 'border: 1px solid #333; padding: 8px 10px;';
  return `
    <div class="pdf-page" style="font-family: 'Noto Sans', Arial, sans-serif; width: 210mm; padding: 15mm; box-sizing: border-box; background: #fff; color: #000;">
      <div style="font-size: 14pt; font-weight: bold; margin-bottom: 4px;">Car Service Nikol</div>
      <div style="font-size: 10pt; margin-bottom: 2px;">ul. Wernisażowa 21, 64-500 Jastrowie (Szamotuły)</div>
      <div style="font-size: 10pt; margin-bottom: 12px;">Tel. +48 794 935 734</div>
      <div style="font-size: 12pt; font-weight: bold; margin-bottom: 6px;">${escapeHtml(title)}</div>
      <div style="font-size: 10pt; margin-bottom: 2px;">${escapeHtml(dateLabel)}: ${escapeHtml(dateStr)}</div>
      <div style="font-size: 10pt; margin-bottom: 10px;">${escapeHtml(vehicleLabel)}: ${escapeHtml(order.brand || '')} ${escapeHtml(order.model || '')}, ${escapeHtml(String(order.year || ''))}</div>
      <table style="${tableStyle}" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th style="${thStyle} width: 55%;">${escapeHtml(col1)}</th>
            <th style="${thStyle} width: 15%; text-align: center;">${escapeHtml(col2)}</th>
            <th style="${thStyle} width: 30%; text-align: right;">${escapeHtml(col3)}</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <div style="font-size: 10pt; font-weight: bold; margin-top: 8px;">${escapeHtml(totalLabel)}: ${totalNum.toFixed(0)} PLN</div>
      <div style="font-size: 8pt; margin-top: 12px; line-height: 1.4;">${escapeHtml(legalText)}</div>
    </div>`;
}

function escapeHtml(str) {
  if (str == null) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function generateOrderPdf(order, lang = 'pl') {
  await loadJspdf();
  if (typeof window.html2canvas !== 'function') {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      s.crossOrigin = 'anonymous';
      s.onload = resolve;
      s.onerror = () => reject(new Error('html2canvas failed to load'));
      document.head.appendChild(s);
    });
  }
  const { jsPDF } = window.jspdf;
  const isPl = lang === 'pl';

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position: fixed; left: -9999px; top: 0; width: 210mm;';
  wrap.innerHTML = buildOrderPdfHtml(order, lang);
  const pageEl = wrap.querySelector('.pdf-page');
  if (!pageEl) throw new Error('PDF template failed');
  document.body.appendChild(wrap);

  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  } else {
    await new Promise((r) => setTimeout(r, 500));
  }

  const canvas = await window.html2canvas(pageEl, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  });
  wrap.remove();

  const imgW = canvas.width;
  const imgH = canvas.height;
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfW = 210;
  const pdfH = 297;
  const ratio = Math.min(pdfW / (imgW / 2), pdfH / (imgH / 2), 1);
  const w = (imgW / 2) * ratio;
  const h = (imgH / 2) * ratio;
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, h);

  const blob = pdf.output('blob');
  const pdfBlobUrl = URL.createObjectURL(blob);
  return { pdfBlobUrl };
}

// PWA: регистрация service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .catch(() => {
        // ignore
      });
  });
}

// Старт: если пользователь сохранён, сразу открываем CRM, иначе форму входа
if (currentUser) {
  renderAppShell();
} else {
  renderLogin();
}

