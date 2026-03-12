import { BRAND_GROUPS, BRANDS, YEARS, DEFAULT_SERVICES, DEFAULT_PARTS, DEFAULT_SETTINGS, normalizeBrandName, CUSTOM_BRAND_ID, isCustomBrand, PROFESSIONAL_TERMS } from './data.js';

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
  passwords: 'nikol_passwords',
  parts: 'nikol_parts',
  stockMovements: 'nikol_stock_movements',
  lastSeenOrders: 'nikol_last_seen_orders',
  lastSeenBookings: 'nikol_last_seen_bookings'
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
let parts = loadJson(STORAGE_KEYS.parts, DEFAULT_PARTS);
let stockMovements = loadJson(STORAGE_KEYS.stockMovements, []);
let plannerView = { year: new Date().getFullYear(), month: new Date().getMonth() };

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
  saveJson(STORAGE_KEYS.parts, parts);
  saveJson(STORAGE_KEYS.stockMovements, stockMovements);
}

function nextId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getLastSeen(key) {
  try {
    const v = localStorage.getItem(key);
    return v || null;
  } catch {
    return null;
  }
}
function setLastSeen(key, isoDate) {
  try {
    localStorage.setItem(key, isoDate);
  } catch {}
}
function getNewOrdersCount() {
  const last = getLastSeen(STORAGE_KEYS.lastSeenOrders);
  if (!last) return orders.length;
  return orders.filter((o) => (o.createdAt || '') > last).length;
}
function getNewBookingsCount() {
  const last = getLastSeen(STORAGE_KEYS.lastSeenBookings);
  if (!last) return bookingRequests.length;
  return bookingRequests.filter((b) => (b.createdAt || '') > last).length;
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
let selectedBookingId = null;
let sidebarCollapsed = false;

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
    conduct_btn: 'Провести',
    preview_btn: 'Предпросмотр',
    cancel_btn: 'Отмена',
    back_btn: 'Назад',
    add_to_order: 'Добавить в заказ',
    doc_title_order: 'Заказ-наряд',
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
    norm_hours: 'Нормо‑часы',
    labor_rate: 'Ставка часа',
    market_price: 'Рыночная цена (Познань)',
    year_multiplier: 'Коэфф. за год',
    year_threshold: 'Год порог (старше = сложнее)',
    price_settings: 'Настройки цен',
    orders: 'Заказы',
    settings: 'Настройки',
    order_status: 'Статус',
    status_pending: 'Принят',
    status_in_progress: 'В работе',
    status_completed: 'Выполнен',
    status_issued: 'Выдан',
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
    tab_clients_vehicles: 'Клиенты и авто',
    tab_booking: 'Заявки',
    new_badge: 'новых',
    tab_reminders: 'Напоминания',
    tab_planner: 'Планировщик',
    tab_analytics: 'Аналитика',
    tab_stock: 'Склад',
    tab_parts_catalog: 'Каталог запчастей',
    parts_catalog_title: 'Поиск запчастей по VIN',
    parts_catalog_vin_placeholder: 'Введите VIN (17 символов)',
    parts_catalog_search: 'Найти',
    parts_catalog_vehicle: 'Данные авто',
    parts_catalog_open_catalog: 'Открыть в каталоге',
    parts_catalog_links_hint: 'Оригинальные каталоги по марке / VIN',
    parts_catalog_where_order: 'Где заказываю запчасти',
    parts_catalog_oil_selector: 'Подбор масла',
    parts_catalog_oil_motul: 'Motul — подбор масла',
    add_client_vehicle_vin: 'Клиент+авто по VIN',
    stock_title: 'Склад запчастей',
    stock_search: 'Поиск по названию, коду, полке…',
    stock_add_part: 'Добавить запчасть',
    stock_name: 'Название',
    stock_sku: 'Код / артикул',
    stock_brand: 'Марка/бренд',
    stock_location: 'Полка / место',
    stock_qty: 'Остаток',
    stock_min_qty: 'Мин. остаток',
    stock_purchase_price: 'Закупочная цена',
    stock_sale_price: 'Розничная цена',
    stock_in: 'Приход',
    stock_out: 'Расход',
    stock_history: 'История движений',
    stock_import_from_order: 'Выгрузить из заказа',
    stock_import_placeholder: 'Вставьте список из заказа магазина — каждая строка одна позиция. Например:\nФильтр масляный 2 шт\nОлеј 5W30, 4\nŚwieca zapłonowa 8',
    stock_import_hint: 'Скопируйте список из письма или страницы заказа (Wapex, Inter Cars, 2407) и вставьте сюда. В конце строки укажите количество: 2 шт, 3 szt или , 4',
    stock_import_preview: 'Будет добавлено на склад',
    stock_import_do: 'Добавить на склад',
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
    planner_title: 'Планировщик визитов',
    planner_orders: 'Заказы',
    planner_bookings: 'Заявки',
    planner_reminders: 'Напоминания',
    planner_no_events: 'Нет событий на эту дату',
    planner_today: 'Сегодня',
    planner_prev: '←',
    planner_next: '→',
    booking_car: 'Авто',
    booking_service: 'Услуга',
    booking_date: 'Дата записи',
    confirm_booking: 'Подтвердить',
    booking_confirmed: 'Подтверждено',
    booking_detail: 'Заявка',
    create_order_from_booking: 'Создать заказ',
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
    conduct_btn: 'Przeprowadź',
    preview_btn: 'Podgląd',
    cancel_btn: 'Anuluj',
    back_btn: 'Wstecz',
    add_to_order: 'Dodaj do zlecenia',
    doc_title_order: 'Zlecenie serwisowe',
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
    norm_hours: 'Normogodziny',
    labor_rate: 'Stawka roboczogodziny',
    market_price: 'Cena rynkowa (Poznań)',
    year_multiplier: 'Współcz. za rok',
    year_threshold: 'Rok progu (starsze = trudniejsze)',
    price_settings: 'Ustawienia cen',
    orders: 'Zlecenia',
    settings: 'Ustawienia',
    order_status: 'Status',
    status_pending: 'Przyjęty',
    status_in_progress: 'W realizacji',
    status_completed: 'Wykonane',
    status_issued: 'Wydany',
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
    tab_clients_vehicles: 'Klienci i pojazdy',
    tab_booking: 'Zgłoszenia',
    new_badge: 'nowych',
    tab_reminders: 'Przypomnienia',
    tab_planner: 'Planer wizyt',
    tab_analytics: 'Analityka',
    tab_stock: 'Magazyn',
    tab_parts_catalog: 'Katalog części',
    parts_catalog_title: 'Wyszukiwanie części po VIN',
    parts_catalog_vin_placeholder: 'Wpisz VIN (17 znaków)',
    parts_catalog_search: 'Szukaj',
    parts_catalog_vehicle: 'Dane pojazdu',
    parts_catalog_open_catalog: 'Otwórz w katalogu',
    parts_catalog_links_hint: 'Katalogi oryginalne po marce / VIN',
    parts_catalog_where_order: 'Gdzie zamawiam części',
    parts_catalog_oil_selector: 'Dobierz olej',
    parts_catalog_oil_motul: 'Motul — dobierz olej',
    add_client_vehicle_vin: 'Klient + pojazd (VIN)',
    stock_title: 'Magazyn części',
    stock_search: 'Szukaj po nazwie, kodzie, półce…',
    stock_add_part: 'Dodaj część',
    stock_name: 'Nazwa',
    stock_sku: 'Kod / numer',
    stock_brand: 'Marka',
    stock_location: 'Półka / miejsce',
    stock_qty: 'Stan',
    stock_min_qty: 'Min. stan',
    stock_purchase_price: 'Cena zakupu',
    stock_sale_price: 'Cena sprzedaży',
    stock_in: 'Przychód',
    stock_out: 'Rozchód',
    stock_history: 'Historia ruchów',
    stock_import_from_order: 'Import z zamówienia',
    stock_import_placeholder: 'Wklej listę z zamówienia — jedna pozycja w linii. Np.:\nFiltr oleju 2 szt\nOlej 5W30, 4\nŚwieca zapłonowa 8',
    stock_import_hint: 'Skopiuj listę z e-maila lub strony zamówienia (Wapex, Inter Cars, 2407) i wklej tutaj. Na końcu linii podaj ilość: 2 szt, 3 szt lub , 4',
    stock_import_preview: 'Zostanie dodane na magazyn',
    stock_import_do: 'Dodaj na magazyn',
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
    planner_title: 'Planer wizyt',
    planner_orders: 'Zlecenia',
    planner_bookings: 'Zgłoszenia',
    planner_reminders: 'Przypomnienia',
    planner_no_events: 'Brak wydarzeń w tym dniu',
    planner_today: 'Dziś',
    planner_prev: '←',
    planner_next: '→',
    booking_car: 'Pojazd',
    booking_service: 'Usługa',
    booking_date: 'Data wizyty',
    confirm_booking: 'Potwierdź',
    booking_confirmed: 'Potwierdzone',
    booking_detail: 'Zgłoszenie',
    create_order_from_booking: 'Utwórz zlecenie',
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
  const baseFromHours = (service.laborHours || 0) * (settings.laborRate || 0);
  const base = baseFromHours > 0 ? baseFromHours : (service.basePrice || 0);
  let price = base * brandMult * yearMult;
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

/** Модальная форма поверх сайта (стиль 1С, наш дизайн). fields: [{ id, label, type?, placeholder?, value? }]. onSave(values) вызывается с объектом { id: value }. onInit?(inputs) даёт доступ к input-элементам. */
function showModalForm(title, fields, onSave, onInit) {
  const overlay = createEl('div', 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm');
  const card = createEl('div', 'w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden');
  const header = createEl('div', 'px-4 py-3 border-b border-slate-700 bg-slate-800/80');
  header.appendChild(createEl('div', 'text-sm font-semibold text-slate-100', [title]));
  card.appendChild(header);
  const form = createEl('form', 'p-4 space-y-3');
  const inputs = {};
  fields.forEach((f) => {
    const wrap = createEl('div', 'space-y-1');
    wrap.appendChild(createEl('label', 'block text-xs font-medium text-slate-400', [f.label]));
    const input = createEl('input', 'w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500');
    input.name = f.id;
    input.type = f.type || 'text';
    input.placeholder = f.placeholder || '';
    if (f.value != null) input.value = f.value;
    inputs[f.id] = input;
    wrap.appendChild(input);
    form.appendChild(wrap);
  });
  card.appendChild(form);
  if (typeof onInit === 'function') {
    onInit(inputs);
  }
  const footer = createEl('div', 'flex justify-end gap-2 px-4 py-3 border-t border-slate-700 bg-slate-800/50');
  const cancelBtn = createEl('button', 'px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700', [t('cancel_btn')]);
  cancelBtn.type = 'button';
  const saveBtn = createEl('button', 'px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white', [settings.language === 'pl' ? 'Zapisz' : 'Сохранить']);
  saveBtn.type = 'submit';
  cancelBtn.addEventListener('click', () => overlay.remove());
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const values = {};
    fields.forEach((f) => { values[f.id] = (inputs[f.id].value || '').trim(); });
    onSave(values);
    overlay.remove();
  });
  footer.appendChild(cancelBtn);
  footer.appendChild(saveBtn);
  card.appendChild(footer);
  overlay.appendChild(card);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  card.addEventListener('click', (e) => e.stopPropagation());
  appRoot.appendChild(overlay);
  if (fields.length) inputs[fields[0].id].focus();
}

// Рендеры
function renderLogin() {
  appRoot.innerHTML = '';
  appRoot.className = 'h-full min-h-screen flex items-center justify-center p-4 bg-crm-bg';

  const container = createEl('div', 'w-full max-w-sm');
  const card = createEl('div', 'w-full bg-crm-glass border border-white/10 rounded-crm-lg shadow-crm-card p-6');
  const title = createEl('h1', 'text-xl font-semibold mb-1 text-center text-crm-text', [t('login_title')]);
  const subtitle = createEl('p', 'text-sm text-crm-textMuted mb-6 text-center', [t('login_subtitle')]);
  const form = createEl('form', 'space-y-4');

  const userGroup = createEl('div', 'space-y-1');
  userGroup.appendChild(createEl('label', 'block text-xs font-medium text-crm-textMuted', [t('username')]));
  const userInput = createEl('input', 'w-full px-3 py-2.5 rounded-crm bg-crm-surface border border-white/10 text-sm text-crm-text placeholder-crm-textMuted/70 focus:outline-none focus:ring-2 focus:ring-crm-accent');
  userInput.type = 'text';
  userInput.autocomplete = 'username';
  userGroup.appendChild(userInput);

  const passGroup = createEl('div', 'space-y-1');
  passGroup.appendChild(createEl('label', 'block text-xs font-medium text-crm-textMuted', [t('password')]));
  const passInput = createEl('input', 'w-full px-3 py-2.5 rounded-crm bg-crm-surface border border-white/10 text-sm text-crm-text focus:outline-none focus:ring-2 focus:ring-crm-accent');
  passInput.type = 'password';
  passInput.autocomplete = 'current-password';
  passGroup.appendChild(passInput);

  const errorBox = createEl('div', 'text-xs text-red-400 h-4');
  const loginBtn = createEl('button', 'w-full py-2.5 rounded-crm bg-crm-accent hover:bg-primary-600 text-sm font-medium text-white shadow-crm-btn transition-colors', [t('login_btn')]);
  loginBtn.type = 'submit';
  const credsHint = createEl('p', 'mt-4 text-xs text-crm-textMuted text-center', [`admin / admin123 (${t('role_admin')}), master / master123 (${t('role_master')})`]);

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
  const hint = createEl('p', 'mt-6 text-xs text-crm-textMuted text-center max-w-xs', [t('pwa_hint')]);
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
  appRoot.className = 'h-full w-full flex bg-crm-bg';

  const isAdmin = currentUser.role === 'admin';
  const isOwner = isAdmin && currentUser.username === 'admin';
  const newOrdersCount = getNewOrdersCount();
  const newBookingsCount = getNewBookingsCount();

  // ——— Сайдбар (складывающийся) ———
  const sidebarWidth = sidebarCollapsed ? 'w-[72px]' : 'w-60';
  const sidebar = createEl('aside', `flex flex-col shrink-0 h-full bg-crm-surface border-r border-white/10 overflow-hidden transition-[width] duration-200 ${sidebarWidth}`);

  const sidebarHead = createEl('div', 'flex items-center justify-between p-3 border-b border-white/10 min-h-[56px]');
  if (!sidebarCollapsed) {
    const logoWrap = createEl('div', 'flex items-center gap-2 min-w-0');
    const logoIcon = createEl('div', 'flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-crm-accent text-white font-bold text-lg shadow-crm-btn');
    logoIcon.textContent = 'N';
    const logoText = createEl('span', 'text-sm font-semibold text-crm-text truncate', ['Nikol CRM']);
    logoWrap.appendChild(logoIcon);
    logoWrap.appendChild(logoText);
    sidebarHead.appendChild(logoWrap);
  }
  const toggleBtn = createEl('button', 'p-1.5 rounded-crm text-crm-textMuted hover:text-crm-text hover:bg-white/5 transition-colors shrink-0');
  toggleBtn.innerHTML = sidebarCollapsed ? '&#8250;' : '&#8249;';
  toggleBtn.setAttribute('aria-label', sidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню');
  toggleBtn.addEventListener('click', () => { sidebarCollapsed = !sidebarCollapsed; renderAppShell(activeTab); });
  sidebarHead.appendChild(toggleBtn);
  sidebar.appendChild(sidebarHead);

  const navClass = (tab) => `flex items-center gap-3 px-3 py-2.5 mx-2 rounded-crm text-sm font-medium transition-colors w-full text-left ${activeTab === tab ? 'bg-crm-accent/15 text-crm-accent' : 'text-crm-textMuted hover:bg-white/5 hover:text-crm-text'}`;

  const navItems = [
    { tab: 'order', label: t('new_order') },
    ...(isAdmin ? [
      { tab: 'admin_orders', label: t('orders'), badge: newOrdersCount },
      { tab: 'booking', label: t('tab_booking'), badge: newBookingsCount },
      { tab: 'clients_vehicles', label: t('tab_clients_vehicles') },
      { tab: 'reminders', label: t('tab_reminders') },
      { tab: 'planner', label: t('tab_planner') },
      { tab: 'analytics', label: t('tab_analytics') },
      { tab: 'stock', label: t('tab_stock') },
      { tab: 'parts_catalog', label: t('tab_parts_catalog') },
      ...(isOwner ? [{ tab: 'admin', label: t('settings') }] : [])
    ] : [])
  ];

  navItems.forEach(({ tab, label, badge }) => {
    const btn = createEl('button', navClass(tab));
    if (!sidebarCollapsed) {
      btn.appendChild(document.createTextNode(label));
      if (badge > 0) {
        const b = createEl('span', 'ml-auto inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] font-bold bg-crm-accent text-white', [String(badge)]);
        btn.appendChild(b);
      }
    }
    const go = () => {
      if (tab === 'admin_orders') setLastSeen(STORAGE_KEYS.lastSeenOrders, new Date().toISOString());
      if (tab === 'booking') setLastSeen(STORAGE_KEYS.lastSeenBookings, new Date().toISOString());
      renderAppShell(tab);
    };
    btn.addEventListener('click', go);
    sidebar.appendChild(btn);
  });

  appRoot.appendChild(sidebar);

  // ——— Основная область: хедер + контент ———
  const main = createEl('div', 'flex-1 flex flex-col min-w-0');
  const header = createEl('header', 'h-14 shrink-0 flex items-center justify-between gap-4 px-4 bg-crm-surface/80 border-b border-white/10');
  const searchWrap = createEl('form', 'flex-1 max-w-xl');
  searchWrap.setAttribute('role', 'search');
  const searchInput = createEl('input', 'w-full pl-9 pr-3 py-2 rounded-crm bg-crm-bg/80 border border-white/10 text-sm text-crm-text placeholder-crm-textMuted/70 focus:outline-none focus:ring-2 focus:ring-crm-accent focus:border-transparent');
  searchInput.placeholder = t('search_placeholder');
  searchInput.type = 'search';
  searchInput.name = 'q';
  searchWrap.appendChild(searchInput);
  searchWrap.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = (searchInput.value || '').trim();
    window.__crmGlobalSearch = q;
    renderAppShell('admin_orders');
  });
  const headerRight = createEl('div', 'flex items-center gap-2');
  const userSpan = createEl('span', 'text-sm text-crm-text', [currentUser.username || '—']);
  const langSelect = createEl('select', 'text-xs bg-crm-bg/80 border border-white/10 rounded-crm px-2.5 py-1.5 text-crm-text focus:outline-none focus:ring-2 focus:ring-crm-accent');
  [['ru', 'RU'], ['pl', 'PL']].forEach(([code, label]) => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = label;
    if (settings.language === code) opt.selected = true;
    langSelect.appendChild(opt);
  });
  langSelect.addEventListener('change', () => { settings.language = langSelect.value; persistAll(); renderAppShell(activeTab); });
  const logoutBtn = createEl('button', 'text-xs px-2.5 py-1.5 rounded-crm text-crm-textMuted hover:bg-white/5 hover:text-crm-text transition-colors', [t('logout')]);
  logoutBtn.addEventListener('click', () => { currentUser = null; try { localStorage.removeItem('nikol_current_user'); } catch {} renderLogin(); });
  headerRight.appendChild(userSpan);
  headerRight.appendChild(langSelect);
  headerRight.appendChild(logoutBtn);
  header.appendChild(searchWrap);
  header.appendChild(headerRight);
  main.appendChild(header);

  const content = createEl('main', 'flex-1 overflow-y-auto p-4');
  if (activeTab === 'order') {
    content.appendChild(renderOrderScreen());
  } else if (activeTab === 'admin_orders') {
    content.appendChild(renderAdminOrdersScreen());
  } else if (activeTab === 'clients_vehicles') {
    content.appendChild(renderClientsAndVehiclesScreen());
  } else if (activeTab === 'booking') {
    content.appendChild(renderBookingScreen());
  } else if (activeTab === 'reminders') {
    content.appendChild(renderRemindersScreen());
  } else if (activeTab === 'planner') {
    content.appendChild(renderVisitPlannerScreen());
  } else if (activeTab === 'analytics') {
    content.appendChild(renderAnalyticsScreen());
  } else if (activeTab === 'stock') {
    content.appendChild(renderStockScreen());
  } else if (activeTab === 'parts_catalog') {
    content.appendChild(renderPartsCatalogScreen());
  } else {
    content.appendChild(renderAdminScreen());
  }
  main.appendChild(content);
  appRoot.appendChild(main);
}

function renderOrderScreen() {
  const isMaster = currentUser && currentUser.role === 'master';
  const container = createEl('div', 'max-w-3xl mx-auto space-y-6');

  const docTitle = createEl('h1', 'text-xl font-semibold text-crm-text', [t('doc_title_order')]);
  container.appendChild(docTitle);

  // Блок авто (карточный вид)
  const carCard = createEl('div', 'p-4 rounded-crm-lg bg-crm-glass border border-white/10 shadow-crm-card space-y-3');
  const carCardHeader = createEl('div', 'border-b border-white/10 pb-3 mb-3');
  carCardHeader.appendChild(createEl('h3', 'text-sm font-semibold text-crm-text', ['Автомобиль']));
  carCard.appendChild(carCardHeader);
  carCard.appendChild(createEl('div', 'text-xs font-medium text-crm-textMuted', [t('brand') + ' / ' + t('model')]));

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

  // Ручной ввод: схлопнут по умолчанию, раскрывается по клику «Ввести вручную»
  let manualOpen = false;
  const manualCarWrap = createEl('div', 'mt-3 pt-3 border-t border-white/10');
  const manualToggle = createEl('button', 'flex items-center gap-2 text-sm text-crm-accent hover:underline mb-2');
  manualToggle.type = 'button';
  manualToggle.innerHTML = '&#9654; ' + (settings.language === 'pl' ? 'Wpisz ręcznie' : 'Ввести вручную');
  const manualFields = createEl('div', 'space-y-2 hidden');
  const manualBrandInput = createEl('input', 'w-full px-3 py-2 rounded-crm bg-crm-surface border border-white/10 text-sm text-crm-text placeholder-crm-textMuted focus:outline-none focus:ring-2 focus:ring-crm-accent');
  manualBrandInput.placeholder = t('manual_brand');
  const manualModelInput = createEl('input', 'w-full px-3 py-2 rounded-crm bg-crm-surface border border-white/10 text-sm text-crm-text placeholder-crm-textMuted focus:outline-none focus:ring-2 focus:ring-crm-accent');
  manualModelInput.placeholder = t('manual_model');
  const manualYearInput = createEl('input', 'w-full px-3 py-2 rounded-crm bg-crm-surface border border-white/10 text-sm text-crm-text placeholder-crm-textMuted focus:outline-none focus:ring-2 focus:ring-crm-accent');
  manualYearInput.placeholder = t('manual_year');
  manualYearInput.type = 'number';
  manualYearInput.min = '1990';
  manualYearInput.max = '2030';
  manualFields.appendChild(manualBrandInput);
  manualFields.appendChild(manualModelInput);
  manualFields.appendChild(manualYearInput);
  manualToggle.addEventListener('click', () => {
    manualOpen = !manualOpen;
    manualFields.classList.toggle('hidden', !manualOpen);
    manualToggle.innerHTML = (manualOpen ? '&#9660; ' : '&#9654; ') + (settings.language === 'pl' ? 'Wpisz ręcznie' : 'Ввести вручную');
  });
  manualCarWrap.appendChild(manualToggle);
  manualCarWrap.appendChild(manualFields);

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

  // Услуги: для мастера — только ввод текстом; для админа — выпадающий список + таблица строк
  const servicesCard = createEl('div', 'p-4 rounded-crm-lg bg-crm-glass border border-white/10 shadow-crm-card space-y-3');
  const servicesHeader = createEl('div', 'border-b border-white/10 pb-3 mb-3');
  servicesHeader.appendChild(createEl('h3', 'text-sm font-semibold text-crm-text', [t('services_label')]));
  servicesCard.appendChild(servicesHeader);

  const orderLines = [];
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
    const serviceSelectWrap = createEl('div', 'flex flex-wrap items-center gap-2 mb-2');
    const serviceSelect = createEl('select', 'flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary-500');
    const servicePlaceholder = document.createElement('option');
    servicePlaceholder.value = '';
    servicePlaceholder.textContent = t('choose') + ' ' + t('services_label').toLowerCase();
    serviceSelect.appendChild(servicePlaceholder);
    services.forEach((svc) => {
      const opt = document.createElement('option');
      opt.value = svc.id;
      opt.textContent = (settings.language === 'pl' ? svc.name_pl : svc.name_ru) + ' — ' + formatPrice(svc.basePrice);
      serviceSelect.appendChild(opt);
    });
    const addServiceBtn = createEl('button', 'px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-xs text-white', [t('add_to_order')]);
    addServiceBtn.type = 'button';
    addServiceBtn.addEventListener('click', () => {
      const id = serviceSelect.value;
      if (!id) return;
      const svc = services.find((s) => s.id === id);
      if (!svc) return;
      const car = getEffectiveCar();
      const { price } = calculateServicePrice(svc, car.brand, car.year);
      const lineId = 'line_' + Date.now();
      orderLines.push({ id: lineId, type: 'catalog', svcId: svc.id, name_pl: svc.name_pl, name_ru: svc.name_ru, price });
      renderOrderLinesTable();
      updateSummary();
      serviceSelect.value = '';
    });
    serviceSelectWrap.appendChild(serviceSelect);
    serviceSelectWrap.appendChild(addServiceBtn);
    servicesCard.appendChild(serviceSelectWrap);

    const orderLinesTableWrap = createEl('div', 'border border-slate-700 rounded-lg overflow-hidden');
    const orderLinesTable = createEl('div', 'divide-y divide-slate-700');
    function renderOrderLinesTable() {
      orderLinesTable.innerHTML = '';
      orderLines.forEach((line) => {
        const row = createEl('div', 'flex items-center justify-between gap-2 px-3 py-2 bg-slate-950/80 hover:bg-slate-900/80');
        const name = line.type === 'catalog' ? (settings.language === 'pl' ? line.name_pl : line.name_ru) : (line.name || '');
        row.appendChild(createEl('div', 'text-xs text-slate-100 flex-1 min-w-0 truncate', [name]));
        row.appendChild(createEl('div', 'text-xs text-slate-300 shrink-0', [formatPrice(line.price)]));
        const delBtn = createEl('button', 'shrink-0 text-red-400 hover:text-red-300 text-sm px-1', ['×']);
        delBtn.type = 'button';
        delBtn.addEventListener('click', () => {
          const idx = orderLines.findIndex((l) => l.id === line.id);
          if (idx !== -1) { orderLines.splice(idx, 1); renderOrderLinesTable(); updateSummary(); }
        });
        row.appendChild(delBtn);
        orderLinesTable.appendChild(row);
      });
    }
    orderLinesTableWrap.appendChild(orderLinesTable);
    servicesCard.appendChild(orderLinesTableWrap);
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

  // Комментарий и фото (карточный блок)
  const commentCard = createEl('div', 'p-4 rounded-crm-lg bg-crm-glass border border-white/10 shadow-crm-card space-y-3');
  const commentCardHeader = createEl('div', 'border-b border-white/10 pb-3 mb-3');
  commentCardHeader.appendChild(createEl('h3', 'text-sm font-semibold text-crm-text', ['Клиент и данные']));
  commentCard.appendChild(commentCardHeader);
  const commentLabel = createEl('label', 'block text-xs font-medium text-crm-textMuted', [t('comment')]);
  const commentInput = createEl('textarea', 'w-full mt-1 px-3 py-2 rounded-crm bg-crm-surface border border-white/10 text-sm text-crm-text focus:outline-none focus:ring-2 focus:ring-crm-accent');
  commentInput.rows = 2;

  const clientNameInput = createEl('input', 'w-full mt-2 px-3 py-2 rounded-crm bg-crm-surface border border-white/10 text-sm text-crm-text focus:outline-none focus:ring-2 focus:ring-crm-accent');
  clientNameInput.placeholder = t('client_name');
  const clientPhoneInput = createEl('input', 'w-full mt-2 px-3 py-2 rounded-crm bg-crm-surface border border-white/10 text-sm text-crm-text focus:outline-none focus:ring-2 focus:ring-crm-accent');
  clientPhoneInput.placeholder = t('client_phone');
  clientPhoneInput.type = 'tel';
  const vinInput = createEl('input', 'w-full mt-2 px-3 py-2 rounded-crm bg-crm-surface border border-white/10 text-sm text-crm-text focus:outline-none focus:ring-2 focus:ring-crm-accent');
  vinInput.placeholder = t('vin');
  const plateInput = createEl('input', 'w-full mt-2 px-3 py-2 rounded-crm bg-crm-surface border border-white/10 text-sm text-crm-text focus:outline-none focus:ring-2 focus:ring-crm-accent');
  plateInput.placeholder = t('plate');

  const photoLabel = createEl('div', 'text-xs text-crm-textMuted mt-2', [t('photo_before')]);
  const photoInput = createEl('input', 'mt-1 block w-full text-xs text-crm-textMuted file:mr-2 file:py-1.5 file:px-3 file:rounded-crm file:border-0 file:bg-crm-surface file:text-crm-text');
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

  // Итог и кнопки (CRM 1.1: крупный итог, тени кнопок)
  const summaryCard = createEl('div', 'p-4 rounded-crm-lg bg-crm-glass border border-white/10 shadow-crm-card space-y-3');

  const summaryList = createEl('div', 'space-y-1 max-h-40 overflow-y-auto text-xs text-crm-text');
  const totalRow = createEl('div', 'flex items-center justify-between mt-4 pt-4 border-t border-white/10');
  const totalLabel = createEl('span', 'text-sm font-medium text-crm-textMuted', [t('total')]);
  const totalValue = createEl('span', 'text-2xl font-bold text-crm-accent', ['0 PLN']);
  totalRow.appendChild(totalLabel);
  totalRow.appendChild(totalValue);

  const saveInfo = createEl('div', 'text-xs text-crm-accent min-h-[1rem]');

  const actionsRow = createEl('div', 'mt-3 flex flex-wrap gap-2');
  const conductBtn = createEl('button', 'px-4 py-2.5 rounded-crm bg-crm-accent hover:bg-primary-600 text-sm font-medium text-white shadow-crm-btn transition-colors', [t('conduct_btn')]);
  const previewBtn = createEl('button', 'px-4 py-2.5 rounded-crm bg-crm-surface hover:bg-crm-surfaceHover border border-white/10 text-sm font-medium text-crm-text', [t('preview_btn')]);
  const cancelBtn = createEl('button', 'px-4 py-2.5 rounded-crm border border-white/10 hover:bg-white/5 text-sm font-medium text-crm-textMuted', [t('cancel_btn')]);
  const saveOnlyBtn = createEl('button', 'px-4 py-2.5 rounded-crm bg-crm-accent hover:bg-primary-600 text-sm font-medium text-white shadow-crm-btn', [t('save_order')]);
  if (isMaster) {
    actionsRow.appendChild(saveOnlyBtn);
  } else {
    actionsRow.appendChild(conductBtn);
    actionsRow.appendChild(previewBtn);
    actionsRow.appendChild(cancelBtn);
  }

  if (!isMaster) {
    summaryCard.appendChild(summaryList);
    summaryCard.appendChild(totalRow);
  }
  summaryCard.appendChild(saveInfo);
  summaryCard.appendChild(actionsRow);

  function updateSummary() {
    if (isMaster) return;
    summaryList.innerHTML = '';
    let total = 0;
    orderLines.forEach((line) => {
      total += line.price;
      const name = line.type === 'catalog' ? (settings.language === 'pl' ? line.name_pl : line.name_ru) : (line.name || '');
      const row = createEl('div', 'flex items-center justify-between gap-2');
      row.appendChild(createEl('div', 'text-slate-100 text-xs', [name]));
      row.appendChild(createEl('div', 'text-slate-100 text-xs', [formatPrice(line.price)]));
      summaryList.appendChild(row);
    });
    selectedCustomServices.forEach((svc) => {
      total += svc.price;
      const row = createEl('div', 'flex items-center justify-between gap-2');
      row.appendChild(createEl('div', 'text-slate-100 text-xs', [svc.name]));
      row.appendChild(createEl('div', 'text-slate-100 text-xs', [formatPrice(svc.price)]));
      summaryList.appendChild(row);
    });
    totalValue.textContent = formatPrice(total);
  }

  async function buildOrderFromForm() {
    const car = getEffectiveCar();
    const { brand: brandName, model: modelName, year } = car;
    if (!brandName || !modelName || !year) {
      alert(settings.language === 'pl' ? 'Podaj markę, model i rok.' : 'Укажите марку, модель и год авто.');
      return null;
    }
    let serviceItems = [];
    let total = 0;
    if (isMaster) {
      if (masterWorks.length === 0) {
        alert(settings.language === 'pl' ? 'Dodaj co najmniej jedną pracę.' : 'Добавьте хотя бы одну работу.');
        return null;
      }
      serviceItems = masterWorks.map((text) => {
        const catalog = suggestCatalogService(text);
        const pro = getProfessionalName(text);
        const name_pl = catalog ? catalog.name_pl : (pro ? pro.name_pl : text);
        const name_ru = catalog ? catalog.name_ru : (pro ? pro.name_ru : text);
        return { name_pl, name_ru, quantity: 1, price: 0 };
      });
    } else {
      if (orderLines.length === 0 && selectedCustomServices.length === 0) {
        alert(settings.language === 'pl' ? 'Wybierz co najmniej jedną usługę.' : 'Выберите хотя бы одну услугу.');
        return null;
      }
      orderLines.forEach((line) => {
        total += line.price;
        const name_pl = line.type === 'catalog' ? line.name_pl : (line.name || '');
        const name_ru = line.type === 'catalog' ? line.name_ru : (line.name || '');
        serviceItems.push({ name_pl, name_ru, quantity: 1, price: line.price });
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
    const username = currentUser?.username || 'master';
    return {
      id: Date.now().toString(),
      createdAt: now,
      status: 'pending',
      statusHistory: [{ status: 'pending', changedAt: now, changedBy: username }],
      createdBy: username,
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
  }

  function saveOrder(order) {
    orders.push(order);
    upsertClientFromOrder(order);
    upsertVehicleFromOrder(order);
    persistAll();
    try {
      fetch('https://car-service-nikol.vercel.app/api/crm-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      }).catch(() => {});
    } catch {}
  }

  conductBtn.addEventListener('click', async () => {
    const order = await buildOrderFromForm();
    if (!order) return;
    saveOrder(order);
    saveInfo.textContent = t('order_saved');
    setTimeout(() => { saveInfo.textContent = ''; }, 3000);
    try {
      const lang = settings.language === 'pl' ? 'pl' : 'ru';
      const { pdfBlobUrl } = await generateOrderPdf(order, lang);
      if (pdfBlobUrl) window.open(pdfBlobUrl, '_blank');
    } catch (e) {
      saveInfo.textContent = (e && e.message) || 'PDF error';
    }
  });

  saveOnlyBtn.addEventListener('click', async () => {
    const order = await buildOrderFromForm();
    if (!order) return;
    saveOrder(order);
    saveInfo.textContent = t('order_saved');
    setTimeout(() => { saveInfo.textContent = ''; }, 3000);
  });

  let previewOverlay = null;
  previewBtn.addEventListener('click', async () => {
    const order = await buildOrderFromForm();
    if (!order) return;
    if (previewOverlay && previewOverlay.parentNode) previewOverlay.remove();
    previewOverlay = createEl('div', 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70');
    const panel = createEl('div', 'bg-slate-900 border border-slate-700 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 space-y-4');
    panel.appendChild(createEl('div', 'text-sm font-semibold text-slate-100', [t('doc_title_order')]));
    panel.appendChild(createEl('div', 'text-xs text-slate-400', [order.brand + ' ' + order.model + ', ' + order.year]));
    panel.appendChild(createEl('div', 'text-xs text-slate-400', [(order.clientName || '') + ' · ' + (order.clientPhone || '')]));
    const list = createEl('div', 'space-y-1 text-xs');
    (order.services || []).forEach((s) => {
      const name = settings.language === 'pl' ? (s.name_pl || s.name_ru) : (s.name_ru || s.name_pl);
      const row = createEl('div', 'flex justify-between');
      row.appendChild(createEl('span', 'text-slate-200', [name]));
      row.appendChild(createEl('span', 'text-slate-300', [formatPrice(s.price)]));
      list.appendChild(row);
    });
    panel.appendChild(list);
    panel.appendChild(createEl('div', 'text-sm font-semibold text-primary-400', [t('total') + ': ' + formatPrice(order.total)]));
    const btnRow = createEl('div', 'flex gap-2 pt-2');
    const backBtn = createEl('button', 'px-4 py-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-800', [t('back_btn')]);
    const conductFromPreviewBtn = createEl('button', 'px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white', [t('conduct_btn')]);
    backBtn.addEventListener('click', () => { if (previewOverlay.parentNode) previewOverlay.remove(); });
    conductFromPreviewBtn.addEventListener('click', async () => {
      saveOrder(order);
      try {
        const lang = settings.language === 'pl' ? 'pl' : 'ru';
        const { pdfBlobUrl } = await generateOrderPdf(order, lang);
        if (pdfBlobUrl) window.open(pdfBlobUrl, '_blank');
      } catch {}
      if (previewOverlay.parentNode) previewOverlay.remove();
    });
    btnRow.appendChild(backBtn);
    btnRow.appendChild(conductFromPreviewBtn);
    panel.appendChild(btnRow);
    previewOverlay.appendChild(panel);
    previewOverlay.addEventListener('click', (e) => { if (e.target === previewOverlay) previewOverlay.remove(); });
    appRoot.appendChild(previewOverlay);
  });

  cancelBtn.addEventListener('click', () => {
    renderAppShell('order');
  });

  if (!isMaster) updateSummary();

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
    ['pending', 'in_progress', 'completed', 'issued', 'cancelled'].forEach((st) => {
      const opt = document.createElement('option');
      opt.value = st;
      opt.textContent = t('status_' + st);
      if (currentStatus === st) opt.selected = true;
      statusSelect.appendChild(opt);
    });
    statusSelect.addEventListener('change', () => {
      const newStatus = statusSelect.value;
      if (newStatus === order.status) return;
      order.status = newStatus;
      if (!Array.isArray(order.statusHistory)) order.statusHistory = [];
      order.statusHistory.push({
        status: newStatus,
        changedAt: new Date().toISOString(),
        changedBy: currentUser?.username || 'master'
      });
      persistAll();
    });
    statusRow.appendChild(statusSelect);
    detail.appendChild(statusRow);

    const isPl = settings.language === 'pl';
    const historyEntries = Array.isArray(order.statusHistory) && order.statusHistory.length > 0
      ? order.statusHistory.slice()
      : (order.status && order.createdAt ? [{ status: order.status, changedAt: order.createdAt, changedBy: order.createdBy || '—' }] : []);
    if (historyEntries.length > 0) {
      const historyBlock = createEl('div', 'mt-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800');
      historyBlock.appendChild(createEl('div', 'text-[11px] font-medium text-slate-400 mb-1', [isPl ? 'Historia statusów' : 'История статусов']));
      historyEntries.reverse().forEach((h) => {
        const line = createEl('div', 'text-xs text-slate-300 flex flex-wrap gap-x-2');
        line.appendChild(createEl('span', 'font-medium', [t('status_' + (h.status || 'pending'))]));
        line.appendChild(document.createTextNode((h.changedAt ? new Date(h.changedAt).toLocaleString(isPl ? 'pl-PL' : 'ru-RU') : '') + (h.changedBy ? ' · ' + h.changedBy : '')));
        historyBlock.appendChild(line);
      });
      detail.appendChild(historyBlock);
    }

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
      const res = await fetch('https://car-service-nikol.vercel.app/api/crm-orders');
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

    const orderSearchInput = createEl('input', 'w-full mb-3 px-3 py-2 rounded-crm bg-crm-surface border border-white/10 text-sm text-crm-text placeholder-crm-textMuted focus:outline-none focus:ring-2 focus:ring-crm-accent');
    orderSearchInput.placeholder = t('search_placeholder') + ' (VIN, гос. номер, клиент…)';
    if (window.__crmGlobalSearch) {
      orderSearchInput.value = window.__crmGlobalSearch;
      window.__crmGlobalSearch = null;
    }
    container.appendChild(orderSearchInput);

    const list = createEl('div', 'space-y-2');
    const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    function applyOrderList() {
      const q = (orderSearchInput.value || '').trim().toLowerCase();
      const filtered = q ? sorted.filter((o) => {
        const hay = [o.vin, o.plate, o.clientName, o.clientPhone, o.brand, o.model, (o.clientPhone || '').replace(/\D/g, '')].map((s) => (s || '').toLowerCase());
        return hay.some((h) => h.includes(q)) || (o.clientPhone || '').replace(/\D/g, '').includes(q.replace(/\D/g, ''));
      }) : sorted;
      list.innerHTML = '';
      if (filtered.length === 0) {
        list.appendChild(createEl('div', 'text-sm text-slate-400 py-8 text-center', [t('no_orders')]));
        return;
      }
      filtered.forEach((o) => {
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
        left.appendChild(createEl('div', 'text-[11px] text-slate-400', [(o.clientName || o.clientPhone || '—') + ' · ' + new Date(o.createdAt).toLocaleString()]));
        const st = o.status || 'pending';
        const badgeClass = st === 'completed' ? 'bg-emerald-900 text-emerald-300' : st === 'issued' ? 'bg-sky-900 text-sky-300' : st === 'in_progress' ? 'bg-amber-900 text-amber-300' : st === 'cancelled' ? 'bg-slate-700 text-slate-400' : 'bg-slate-700 text-slate-300';
        const statusBadge = createEl('span', 'text-[10px] px-2 py-0.5 rounded-full ' + badgeClass, [t('status_' + st)]);
        const right = createEl('div', 'text-right');
        right.appendChild(createEl('div', 'text-sm font-semibold text-primary-400', [formatPrice(getOrderTotal(o))]));
        right.appendChild(statusBadge);
        row.appendChild(left);
        row.appendChild(right);
        list.appendChild(row);
      });
    }
    applyOrderList();
    orderSearchInput.addEventListener('input', applyOrderList);
    container.appendChild(list);
  })();

  return container;
}

function renderClientsAndVehiclesScreen() {
  const container = createEl('div', 'space-y-6');
  const searchAll = createEl('input', 'w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm placeholder-slate-500');
  searchAll.placeholder = t('search_placeholder');
  container.appendChild(searchAll);

  const clientsSection = createEl('div', 'space-y-2');
  clientsSection.appendChild(createEl('div', 'text-sm font-semibold text-slate-200', [t('tab_clients')]));
  const clientTop = createEl('div', 'flex justify-end gap-2 flex-wrap');
  const addClientBtn = createEl('button', 'px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-sm text-white', [t('add_client')]);
  addClientBtn.addEventListener('click', () => {
    showModalForm(t('add_client'), [
      { id: 'name', label: t('client_name'), placeholder: settings.language === 'pl' ? 'Imię i nazwisko' : 'Имя клиента' },
      { id: 'phone', label: t('client_phone'), placeholder: settings.language === 'pl' ? 'Telefon' : 'Телефон' }
    ], (values) => {
      if (!values.name && !values.phone) return;
      clients.push({ id: nextId(), name: values.name || '—', phone: values.phone || '', createdAt: new Date().toISOString() });
      persistAll();
      renderClientsList();
    });
  });
  clientTop.appendChild(addClientBtn);

  const addClientVehicleBtn = createEl('button', 'px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-100', [t('add_client_vehicle_vin')]);
  addClientVehicleBtn.addEventListener('click', () => {
    showModalForm(
      t('add_client_vehicle_vin'),
      [
        { id: 'vin', label: t('vin'), placeholder: 'VIN' },
        { id: 'name', label: t('client_name'), placeholder: settings.language === 'pl' ? 'Imię i nazwisko' : 'Имя клиента' },
        { id: 'phone', label: t('client_phone'), placeholder: settings.language === 'pl' ? 'Telefon' : 'Телефон' },
        { id: 'brand', label: t('brand'), placeholder: settings.language === 'pl' ? 'Marka' : 'Марка' },
        { id: 'model', label: t('model'), placeholder: settings.language === 'pl' ? 'Model' : 'Модель' },
        { id: 'year', label: t('year'), placeholder: String(new Date().getFullYear()) },
        { id: 'plate', label: t('plate'), placeholder: settings.language === 'pl' ? 'Nr rejestr.' : 'Гос. номер' }
      ],
      (values) => {
        if (!values.name && !values.phone && !values.vin) return;
        const nowIso = new Date().toISOString();
        const client = { id: nextId(), name: values.name || '—', phone: values.phone || '', createdAt: nowIso };
        clients.push(client);
        vehicles.push({
          id: nextId(),
          brand: values.brand || '',
          model: values.model || '',
          year: values.year || '',
          vin: values.vin || '',
          plate: values.plate || '',
          createdAt: nowIso
        });
        persistAll();
        renderClientsList();
        renderVehiclesList();
      },
      (inputs) => {
        const vinInput = inputs.vin;
        if (!vinInput) return;
        vinInput.addEventListener('blur', async () => {
          const raw = (vinInput.value || '').trim().toUpperCase().replace(/\s/g, '');
          if (raw.length !== 17) return;
          try {
            const res = await fetch('https://car-service-nikol.vercel.app/api/vin-decode?vin=' + encodeURIComponent(raw));
            const data = await res.json();
            if (!data || !data.ok || data.notFound) return;
            if (!inputs.brand.value && data.brand) inputs.brand.value = data.brand;
            if (!inputs.model.value && data.model) inputs.model.value = data.model;
            if (!inputs.year.value && data.year) inputs.year.value = String(data.year);
          } catch {
            // ignore network errors
          }
        });
      }
    );
  });
  clientTop.appendChild(addClientVehicleBtn);
  clientsSection.appendChild(clientTop);
  const clientsListEl = createEl('div', 'space-y-2');
  clientsSection.appendChild(clientsListEl);
  container.appendChild(clientsSection);

  const vehiclesSection = createEl('div', 'space-y-2');
  vehiclesSection.appendChild(createEl('div', 'text-sm font-semibold text-slate-200', [t('tab_vehicles')]));
  const vehicleTop = createEl('div', 'flex justify-end');
  const addVehicleBtn = createEl('button', 'px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-sm text-white', [t('add_vehicle')]);
  addVehicleBtn.addEventListener('click', () => {
    showModalForm(t('add_vehicle'), [
      { id: 'brand', label: t('brand'), placeholder: settings.language === 'pl' ? 'Marka' : 'Марка' },
      { id: 'model', label: t('model'), placeholder: settings.language === 'pl' ? 'Model' : 'Модель' },
      { id: 'year', label: t('year'), placeholder: String(new Date().getFullYear()) },
      { id: 'vin', label: t('vin'), placeholder: 'VIN' },
      { id: 'plate', label: t('plate'), placeholder: settings.language === 'pl' ? 'Nr rejestr.' : 'Гос. номер' }
    ], (values) => {
      vehicles.push({
        id: nextId(),
        brand: values.brand || '',
        model: values.model || '',
        year: values.year || '',
        vin: values.vin || '',
        plate: values.plate || '',
        createdAt: new Date().toISOString()
      });
      persistAll();
      renderVehiclesList();
    });
  });
  vehicleTop.appendChild(addVehicleBtn);
  vehiclesSection.appendChild(vehicleTop);
  const vehiclesListEl = createEl('div', 'space-y-2');
  vehiclesSection.appendChild(vehiclesListEl);
  container.appendChild(vehiclesSection);

  const q = () => (searchAll.value || '').toLowerCase().trim();
  function renderClientsList() {
    const list = getClientsList();
    const query = q();
    const filtered = query ? list.filter((c) => (c.name || '').toLowerCase().includes(query) || (c.phone || '').replace(/\D/g, '').includes(query.replace(/\D/g, ''))) : list;
    clientsListEl.innerHTML = '';
    if (filtered.length === 0) {
      clientsListEl.appendChild(createEl('div', 'text-sm text-slate-400 py-4 text-center', [t('no_clients')]));
      return;
    }
    filtered.forEach((c) => {
      const row = createEl('div', 'bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between items-center gap-2 cursor-pointer hover:bg-slate-800');
      row.appendChild(createEl('div', '', [
        createEl('div', 'text-sm font-medium text-white', [c.name || '—']),
        createEl('div', 'text-xs text-slate-400', [c.phone || '—'])
      ]));
      const right = createEl('div', 'flex items-center gap-2');
      const ordersCount = orders.filter((o) => (o.clientPhone || '').trim() === (c.phone || '').trim() || (o.clientName || '').trim() === (c.name || '').trim()).length;
      right.appendChild(createEl('div', 'text-xs text-slate-400', [ordersCount + ' ' + t('client_orders').toLowerCase()]));
      const delBtn = createEl('button', 'text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-red-700 hover:text-white', ['×']);
      delBtn.type = 'button';
      delBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (!window.confirm(settings.language === 'pl' ? 'Usunąć klienta?' : 'Удалить клиента?')) return;
        clients = clients.filter((x) => x.id !== c.id);
        persistAll();
        renderClientsList();
      });
      right.appendChild(delBtn);
      row.appendChild(right);
      row.addEventListener('click', () => { adminSelectedOrderId = null; window.__adminSelectedClient = c; renderAppShell('order'); });
      clientsListEl.appendChild(row);
    });
  }
  function renderVehiclesList() {
    const list = getVehiclesList();
    const query = q();
    const filtered = query ? list.filter((v) => (v.brand + ' ' + v.model + ' ' + v.year).toLowerCase().includes(query) || (v.vin || '').toLowerCase().includes(query) || (v.plate || '').toLowerCase().includes(query)) : list;
    vehiclesListEl.innerHTML = '';
    if (filtered.length === 0) {
      vehiclesListEl.appendChild(createEl('div', 'text-sm text-slate-400 py-4 text-center', [t('no_vehicles')]));
      return;
    }
    filtered.forEach((v) => {
      const row = createEl('div', 'bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between items-center gap-2 cursor-pointer hover:bg-slate-800');
      row.appendChild(createEl('div', '', [
        createEl('div', 'text-sm font-medium text-white', [`${v.brand} ${v.model}, ${v.year}`]),
        createEl('div', 'text-xs text-slate-400', [(v.vin || v.plate || '—')])
      ]));
      const right = createEl('div', 'flex items-center gap-2');
      const ordersCount = orders.filter((o) => (o.vin && o.vin === v.vin) || (o.plate && o.plate === v.plate) || (o.brand === v.brand && o.model === v.model && String(o.year) === String(v.year))).length;
      right.appendChild(createEl('div', 'text-xs text-slate-400', [ordersCount + ' ' + t('client_orders').toLowerCase()]));
      const delBtn = createEl('button', 'text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-red-700 hover:text-white', ['×']);
      delBtn.type = 'button';
      delBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (!window.confirm(settings.language === 'pl' ? 'Usunąć pojazd?' : 'Удалить авто?')) return;
        vehicles = vehicles.filter((x) => x.id !== v.id);
        persistAll();
        renderVehiclesList();
      });
      right.appendChild(delBtn);
      row.appendChild(right);
      row.addEventListener('click', () => { adminSelectedOrderId = null; window.__adminSelectedVehicle = v; renderAppShell('order'); });
      vehiclesListEl.appendChild(row);
    });
  }
  searchAll.addEventListener('input', () => { renderClientsList(); renderVehiclesList(); });
  renderClientsList();
  renderVehiclesList();
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

  async function loadFromApi() {
    try {
      // Берём заявки из основного сайта, где крутится API и Supabase
      const res = await fetch('https://car-service-nikol.vercel.app/api/booking');
      const data = await res.json();
      if (data && data.ok && Array.isArray(data.bookings)) {
        bookingRequests = data.bookings.map((r) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          car: r.car,
          service: r.service,
          message: r.message,
          date: r.date || r.preferred_date || '',
          preferredDate: (r.date || r.preferred_date || '').slice(0, 10),
          confirmed: !!r.confirmed,
          createdAt: r.created_at
        }));
        persistAll();
      }
    } catch {
      // если API недоступно – остаёмся на локальных данных
    }
  }

  async function confirmBooking(r) {
    if (!r.id) return;
    try {
      const res = await fetch('https://car-service-nikol.vercel.app/api/booking', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: r.id, confirmed: true })
      });
      const data = await res.json();
      if (data && data.ok) {
        const b = bookingRequests.find((x) => x.id === r.id);
        if (b) b.confirmed = true;
        persistAll();
      }
    } catch {}
  }

  if (selectedBookingId) {
    const r = bookingRequests.find((b) => String(b.id) === String(selectedBookingId));
    if (!r) {
      selectedBookingId = null;
      return renderBookingScreen();
    }
    const backBtn = createEl('button', 'text-sm text-slate-400 hover:text-slate-200 flex items-center gap-1', [t('back_btn') + ' ←']);
    backBtn.addEventListener('click', () => { selectedBookingId = null; renderAppShell('booking'); });
    container.appendChild(backBtn);
    const card = createEl('div', 'bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3');
    card.appendChild(createEl('div', 'text-xs font-medium text-slate-400 uppercase', [t('booking_detail')]));
    card.appendChild(createEl('div', 'text-base font-medium text-white', [r.name || '—']));
    card.appendChild(createEl('div', 'text-sm text-slate-300', [t('client_phone') + ': ' + (r.phone || '—')]));
    card.appendChild(createEl('div', 'text-sm text-slate-300', [t('booking_car') + ': ' + (r.car || '—')]));
    card.appendChild(createEl('div', 'text-sm text-slate-300', [t('booking_service') + ': ' + (r.service || '—')]));
    if (r.date) card.appendChild(createEl('div', 'text-sm text-slate-300', [t('booking_date') + ': ' + r.date]));
    if (r.message) card.appendChild(createEl('div', 'text-sm text-slate-500 border-t border-slate-700 pt-2', [r.message]));
    const createdStr = r.createdAt ? new Date(r.createdAt).toLocaleString(settings.language === 'pl' ? 'pl-PL' : 'ru-RU') : '';
    if (createdStr) card.appendChild(createEl('div', 'text-xs text-slate-500', [createdStr]));
    if (r.confirmed) card.appendChild(createEl('div', 'inline-flex items-center px-2 py-1 rounded-lg bg-emerald-800/60 text-emerald-200 text-xs', [t('booking_confirmed')]));
    const actions = createEl('div', 'flex flex-wrap gap-2 pt-2');
    if (!r.confirmed) {
      const confirmBtn = createEl('button', 'px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm', [t('confirm_booking')]);
      confirmBtn.addEventListener('click', async () => { await confirmBooking(r); renderAppShell('booking'); });
      actions.appendChild(confirmBtn);
    }
    const toOrderBtn = createEl('button', 'px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm', [t('create_order_from_booking')]);
    toOrderBtn.addEventListener('click', () => { window.__bookingPrefill = r; selectedBookingId = null; renderAppShell('order'); });
    const delBtn = createEl('button', 'px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 text-slate-300 text-sm', [t('remove')]);
    delBtn.addEventListener('click', () => {
      bookingRequests = bookingRequests.filter((x) => x.id !== r.id);
      persistAll();
      selectedBookingId = null;
      if (r.id) fetch('https://car-service-nikol.vercel.app/api/booking?id=' + encodeURIComponent(r.id), { method: 'DELETE' }).catch(() => {});
      renderAppShell('booking');
    });
    actions.appendChild(toOrderBtn);
    actions.appendChild(delBtn);
    card.appendChild(actions);
    container.appendChild(card);
    return container;
  }

  const topBar = createEl('div', 'flex flex-wrap gap-2 mb-3');
  const refreshBtn = createEl('button', 'px-4 py-2 rounded-crm bg-crm-surface hover:bg-crm-surfaceHover border border-white/10 text-sm text-crm-text', [settings.language === 'pl' ? 'Odśwież listę' : 'Обновить список']);
  refreshBtn.type = 'button';
  refreshBtn.addEventListener('click', async () => {
    refreshBtn.disabled = true;
    refreshBtn.textContent = '…';
    await loadFromApi();
    refreshBtn.disabled = false;
    refreshBtn.textContent = settings.language === 'pl' ? 'Odśwież listę' : 'Обновить список';
    renderList();
  });
  topBar.appendChild(refreshBtn);
  const addBtn = createEl('button', 'px-4 py-2 rounded-crm bg-crm-accent hover:bg-primary-600 text-sm text-white', [t('add_booking')]);
  topBar.appendChild(addBtn);
  container.appendChild(topBar);
  const listEl = createEl('div', 'space-y-2');

  function renderList() {
    listEl.innerHTML = '';
    const sorted = [...bookingRequests].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    if (sorted.length === 0) {
      listEl.appendChild(createEl('div', 'text-sm text-slate-400 py-8 text-center', [t('no_booking_requests')]));
      return;
    }
    sorted.forEach((r) => {
      const row = createEl('div', 'bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1 cursor-pointer hover:border-slate-600 transition');
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        selectedBookingId = r.id;
        renderAppShell('booking');
      });
      const titleRow = createEl('div', 'flex items-center justify-between gap-2');
      titleRow.appendChild(createEl('span', 'text-sm font-medium text-white', [r.name || '—']));
      if (r.confirmed) titleRow.appendChild(createEl('span', 'text-[10px] px-1.5 py-0.5 rounded bg-emerald-800/60 text-emerald-200', [t('booking_confirmed')]));
      row.appendChild(titleRow);
      row.appendChild(createEl('div', 'text-xs text-slate-400', [(r.phone || '') + ' · ' + (r.car || '—')]));
      row.appendChild(createEl('div', 'text-xs text-slate-300', [r.service || '—']));
      if (r.message) row.appendChild(createEl('div', 'text-xs text-slate-500 line-clamp-1', [r.message]));
      const actions = createEl('div', 'flex gap-2 mt-2');
      if (!r.confirmed) {
        const confirmBtn = createEl('button', 'text-xs px-2 py-1 rounded-lg bg-emerald-600 text-white', [t('confirm_booking')]);
        confirmBtn.addEventListener('click', (e) => { e.stopPropagation(); confirmBooking(r).then(() => loadFromApi().then(renderList)); });
        actions.appendChild(confirmBtn);
      }
      const toOrderBtn = createEl('button', 'text-xs px-2 py-1 rounded-lg bg-primary-600 text-white', [t('convert_to_order')]);
      toOrderBtn.addEventListener('click', (e) => { e.stopPropagation(); window.__bookingPrefill = r; renderAppShell('order'); });
      const delBtn = createEl('button', 'text-xs px-2 py-1 rounded-lg bg-slate-700 text-slate-300', [t('remove')]);
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        bookingRequests = bookingRequests.filter((x) => x.id !== r.id);
        persistAll();
        renderList();
        if (r.id) fetch('https://car-service-nikol.vercel.app/api/booking?id=' + encodeURIComponent(r.id), { method: 'DELETE' }).catch(() => {});
      });
      actions.appendChild(toOrderBtn);
      actions.appendChild(delBtn);
      row.appendChild(actions);
      listEl.appendChild(row);
    });
  }

  addBtn.addEventListener('click', () => {
    showModalForm(t('add_booking'), [
      { id: 'name', label: t('client_name'), placeholder: settings.language === 'pl' ? 'Imię i nazwisko' : 'Имя клиента' },
      { id: 'phone', label: t('client_phone'), placeholder: settings.language === 'pl' ? 'Telefon' : 'Телефон' },
      { id: 'car', label: t('booking_car'), placeholder: settings.language === 'pl' ? 'Marka, model, rok' : 'Марка, модель, год' },
      { id: 'service', label: t('booking_service'), placeholder: settings.language === 'pl' ? 'Usługa' : 'Услуга' },
      { id: 'message', label: t('comment'), placeholder: settings.language === 'pl' ? 'Wiadomość' : 'Сообщение' }
    ], (values) => {
      const entry = {
        id: nextId(),
        name: values.name || '',
        phone: values.phone || '',
        car: values.car || '',
        service: values.service || '',
        message: values.message || '',
        confirmed: false,
        createdAt: new Date().toISOString()
      };
      bookingRequests.push(entry);
      persistAll();
      renderList();
      fetch('https://car-service-nikol.vercel.app/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: entry.name, phone: entry.phone, car: entry.car, service: entry.service, message: entry.message, date: '', lang: settings.language })
      }).catch(() => {});
    });
  });

  container.appendChild(listEl);
  loadFromApi().then(renderList).catch(() => renderList());
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
    showModalForm(t('add_reminder'), [
      { id: 'note', label: settings.language === 'pl' ? 'Treść przypomnienia' : 'Текст напоминания', placeholder: '' },
      { id: 'dueDate', label: t('reminder_due'), placeholder: 'YYYY-MM-DD', value: new Date().toISOString().slice(0, 10) }
    ], (values) => {
      reminders.push({
        id: nextId(),
        note: values.note || '',
        dueDate: values.dueDate || new Date().toISOString().slice(0, 10),
        completed: false,
        createdAt: new Date().toISOString()
      });
      persistAll();
      renderList();
    });
  });

  container.appendChild(listEl);
  renderList();
  return container;
}

function renderVisitPlannerScreen() {
  const container = createEl('div', 'space-y-4');
  const { year, month } = plannerView;
  const locale = settings.language === 'pl' ? 'pl-PL' : 'ru-RU';
  const monthTitle = new Date(year, month, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' });

  const navRow = createEl('div', 'flex items-center justify-between gap-2');
  const prevBtn = createEl('button', 'p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200', [t('planner_prev')]);
  const titleEl = createEl('div', 'text-base font-semibold text-slate-100 capitalize', [monthTitle]);
  const nextBtn = createEl('button', 'p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200', [t('planner_next')]);
  prevBtn.addEventListener('click', () => {
    plannerView = { year: month === 0 ? year - 1 : year, month: month === 0 ? 11 : month - 1 };
    renderAppShell('planner');
  });
  nextBtn.addEventListener('click', () => {
    plannerView = { year: month === 11 ? year + 1 : year, month: month === 11 ? 0 : month + 1 };
    renderAppShell('planner');
  });
  navRow.appendChild(prevBtn);
  navRow.appendChild(titleEl);
  navRow.appendChild(nextBtn);
  container.appendChild(navRow);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const weekdays = settings.language === 'pl'
    ? ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd']
    : ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const table = createEl('div', 'rounded-xl border border-slate-700 bg-slate-900 overflow-hidden');
  const headerRow = createEl('div', 'grid grid-cols-7 border-b border-slate-700 bg-slate-800/80');
  weekdays.forEach((wd) => headerRow.appendChild(createEl('div', 'py-2 text-center text-xs font-medium text-slate-400', [wd])));
  table.appendChild(headerRow);

  const getDayKey = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const ordersByDay = {};
  const bookingsByDay = {};
  const remindersByDay = {};
  orders.forEach((o) => {
    const d = (o.timeIn || o.createdAt || '').slice(0, 10);
    if (d) { ordersByDay[d] = (ordersByDay[d] || 0) + 1; }
  });
  bookingRequests.forEach((b) => {
    const d = (b.preferredDate || b.createdAt || '').slice(0, 10);
    if (d) { bookingsByDay[d] = (bookingsByDay[d] || 0) + 1; }
  });
  reminders.forEach((r) => {
    if (!r.completed && r.dueDate) { remindersByDay[r.dueDate.slice(0, 10)] = (remindersByDay[r.dueDate.slice(0, 10)] || 0) + 1; }
  });

  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const grid = createEl('div', 'grid grid-cols-7');
  for (let i = 0; i < totalCells; i++) {
    const cell = createEl('div', 'min-h-[4rem] p-1 border-b border-r border-slate-700/70 last:border-r-0 bg-slate-900');
    if (i < startOffset || i >= startOffset + daysInMonth) {
      cell.classList.add('bg-slate-950/50');
      cell.appendChild(createEl('div', 'text-slate-600 text-sm', ['']));
    } else {
      const day = i - startOffset + 1;
      const dayKey = getDayKey(year, month, day);
      const oCount = ordersByDay[dayKey] || 0;
      const bCount = bookingsByDay[dayKey] || 0;
      const rCount = remindersByDay[dayKey] || 0;
      cell.appendChild(createEl('div', 'text-slate-200 text-sm font-medium', [String(day)]));
      const badges = createEl('div', 'flex flex-wrap gap-0.5 mt-0.5');
      if (oCount) badges.appendChild(createEl('span', 'inline-block px-1.5 py-0.5 rounded text-[10px] bg-primary-600/80 text-white', [String(oCount)]));
      if (bCount) badges.appendChild(createEl('span', 'inline-block px-1.5 py-0.5 rounded text-[10px] bg-sky-600/80 text-white', [String(bCount)]));
      if (rCount) badges.appendChild(createEl('span', 'inline-block px-1.5 py-0.5 rounded text-[10px] bg-amber-600/80 text-white', [String(rCount)]));
      cell.appendChild(badges);
    }
    grid.appendChild(cell);
  }
  table.appendChild(grid);
  container.appendChild(table);

  const legend = createEl('div', 'flex flex-wrap gap-4 text-xs text-slate-400');
  legend.appendChild(createEl('span', 'flex items-center gap-1.5', [createEl('span', 'inline-block w-4 h-4 rounded bg-primary-600/80', []), t('planner_orders')]));
  legend.appendChild(createEl('span', 'flex items-center gap-1.5', [createEl('span', 'inline-block w-4 h-4 rounded bg-sky-600/80', []), t('planner_bookings')]));
  legend.appendChild(createEl('span', 'flex items-center gap-1.5', [createEl('span', 'inline-block w-4 h-4 rounded bg-amber-600/80', []), t('planner_reminders')]));
  container.appendChild(legend);

  const eventsList = createEl('div', 'mt-4 space-y-2');
  const eventsTitle = createEl('h3', 'text-sm font-semibold text-slate-200', [monthTitle + ' — ' + (settings.language === 'pl' ? 'Wydarzenia' : 'События')]);
  container.appendChild(eventsTitle);
  container.appendChild(eventsList);

  const events = [];
  orders.forEach((o) => {
    const d = (o.timeIn || o.createdAt || '').slice(0, 10);
    if (d && d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) {
      events.push({ date: d, type: 'order', label: (o.brand || '') + ' ' + (o.model || '') + ', ' + (o.clientName || '—'), id: o.id });
    }
  });
  bookingRequests.forEach((b) => {
    const d = (b.preferredDate || b.createdAt || '').slice(0, 10);
    if (d && d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) {
      events.push({ date: d, type: 'booking', label: (b.car || '') + ' — ' + (b.service || '—'), id: b.id });
    }
  });
  reminders.forEach((r) => {
    if (r.completed || !r.dueDate) return;
    const d = r.dueDate.slice(0, 10);
    if (d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) {
      events.push({ date: d, type: 'reminder', label: r.note || t('reminder_note'), id: r.id });
    }
  });
  events.sort((a, b) => a.date.localeCompare(b.date));

  if (events.length === 0) {
    eventsList.appendChild(createEl('div', 'text-sm text-slate-500 py-4', [t('planner_no_events')]));
  } else {
    events.forEach((ev) => {
      const row = createEl('div', 'flex items-center gap-2 rounded-lg px-3 py-2 bg-slate-800/60 border border-slate-700/50');
      const dateStr = new Date(ev.date + 'Z').toLocaleDateString(locale, { day: 'numeric', month: 'short' });
      const typeColor = ev.type === 'order' ? 'bg-primary-600' : ev.type === 'booking' ? 'bg-sky-600' : 'bg-amber-600';
      row.appendChild(createEl('span', 'text-xs text-slate-400 w-16 shrink-0', [dateStr]));
      row.appendChild(createEl('span', 'inline-block w-2 h-2 rounded-full shrink-0 ' + typeColor, []));
      row.appendChild(createEl('span', 'text-sm text-slate-200 truncate', [ev.label]));
      eventsList.appendChild(row);
    });
  }

  return container;
}

function renderPartsCatalogScreen() {
  const container = createEl('div', 'space-y-4');
  const apiBase = 'https://car-service-nikol.vercel.app';

  container.appendChild(createEl('h2', 'text-base font-semibold text-slate-100', [t('parts_catalog_title')]));

  const searchRow = createEl('div', 'flex gap-2 flex-wrap');
  const vinInput = createEl('input', 'flex-1 min-w-[200px] px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500');
  vinInput.placeholder = t('parts_catalog_vin_placeholder');
  vinInput.maxLength = 17;
  vinInput.autocomplete = 'off';
  const searchBtn = createEl('button', 'px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-sm font-medium text-white', [t('parts_catalog_search')]);
  searchRow.appendChild(vinInput);
  searchRow.appendChild(searchBtn);
  container.appendChild(searchRow);

  const vehicleCard = createEl('div', 'rounded-xl border border-slate-700 bg-slate-900 p-4 space-y-2 hidden');
  const vehicleTitle = createEl('div', 'text-xs font-medium text-slate-400 uppercase', [t('parts_catalog_vehicle')]);
  const vehicleBody = createEl('div', 'text-sm text-slate-200 space-y-1');
  vehicleCard.appendChild(vehicleTitle);
  vehicleCard.appendChild(vehicleBody);
  container.appendChild(vehicleCard);

  const linksCard = createEl('div', 'rounded-xl border border-slate-700 bg-slate-900 p-4 space-y-3');
  linksCard.appendChild(createEl('div', 'text-xs font-medium text-slate-400', [t('parts_catalog_links_hint')]));
  const catalogLinks = [
    { name: '7zap', url: 'https://www.7zap.com/' },
    { name: '2407.pl', url: 'https://2407.pl/' },
    { name: 'Autoostrov', url: 'https://autoostrov.by/auto/?srsltid=AfmBOopWaC6vACu6OovSOvfkIcetIu9J5W2cJVrgIYDP_QIHMWuJCKQF' },
    { name: 'ML-Auto (оригинальные каталоги)', url: 'https://www.ml-auto.by/original/' }
  ];
  const linksRow = createEl('div', 'flex flex-wrap gap-2');
  catalogLinks.forEach(({ name, url }) => {
    const a = createEl('a', 'inline-flex items-center px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm', [name]);
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    linksRow.appendChild(a);
  });
  linksCard.appendChild(linksRow);
  container.appendChild(linksCard);

  const oilCard = createEl('div', 'rounded-xl border border-slate-700 bg-slate-900 p-4 space-y-3');
  oilCard.appendChild(createEl('div', 'text-xs font-medium text-slate-400', [t('parts_catalog_oil_selector')]));
  const motulLink = createEl('a', 'inline-flex items-center px-3 py-2 rounded-lg bg-amber-900/30 hover:bg-amber-800/40 text-amber-200 text-sm border border-amber-600/50', [t('parts_catalog_oil_motul')]);
  motulLink.href = 'https://www.motul.com/pl-PL/lubricants';
  motulLink.target = '_blank';
  motulLink.rel = 'noopener noreferrer';
  oilCard.appendChild(motulLink);
  container.appendChild(oilCard);

  const whereOrderCard = createEl('div', 'rounded-xl border border-slate-700 bg-slate-900 p-4 space-y-3');
  whereOrderCard.appendChild(createEl('div', 'text-xs font-medium text-slate-400', [t('parts_catalog_where_order')]));
  const shopLinks = [
    { name: 'Wapex', url: 'https://wapex.pl/' },
    { name: 'Inter Cars', url: 'https://intercars.pl/produkty' },
    { name: '2407.pl', url: 'https://2407.pl/' }
  ];
  const shopLinksRow = createEl('div', 'flex flex-wrap gap-2');
  shopLinks.forEach(({ name, url }) => {
    const a = createEl('a', 'inline-flex items-center px-3 py-2 rounded-lg bg-primary-600/20 hover:bg-primary-600/40 text-primary-300 text-sm border border-primary-600/50', [name]);
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    shopLinksRow.appendChild(a);
  });
  whereOrderCard.appendChild(shopLinksRow);
  container.appendChild(whereOrderCard);

  const statusEl = createEl('div', 'text-sm text-slate-500 min-h-[1.5rem]');

  searchBtn.addEventListener('click', async () => {
    const vin = (vinInput.value || '').trim().toUpperCase().replace(/\s/g, '');
    if (vin.length !== 17) {
      statusEl.textContent = settings.language === 'pl' ? 'VIN musi mieć 17 znaków.' : 'VIN должен содержать 17 символов.';
      vehicleCard.classList.add('hidden');
      return;
    }
    statusEl.textContent = settings.language === 'pl' ? 'Szukam…' : 'Поиск…';
    vehicleCard.classList.add('hidden');
    try {
      const res = await fetch(`${apiBase}/api/vin-decode?vin=${encodeURIComponent(vin)}`);
      const data = await res.json();
      if (!data.ok) {
        statusEl.textContent = data.error || (settings.language === 'pl' ? 'Nie znaleziono.' : 'Не найдено.');
        return;
      }
      statusEl.textContent = '';
      vehicleBody.innerHTML = '';
      if (data.vin) {
        const vinRow = createEl('div', 'flex justify-between gap-2 border-b border-slate-700 pb-2 mb-2');
        vinRow.appendChild(createEl('span', 'text-slate-400', ['VIN:']));
        vinRow.appendChild(createEl('span', 'text-slate-100 font-mono text-xs', [data.vin]));
        vehicleBody.appendChild(vinRow);
      }
      if (data.notFound) {
        vehicleBody.appendChild(createEl('div', 'text-slate-500 text-sm', [settings.language === 'pl' ? 'Brak danych w katalogach dla tego VIN.' : 'По этому VIN в каталогах данных не найдено.']));
      } else {
        const parts = [
          [t('brand'), data.brand],
          [settings.language === 'pl' ? 'Model' : 'Модель', data.model],
          [settings.language === 'pl' ? 'Rok' : 'Год', data.year],
          [settings.language === 'pl' ? 'Paliwo' : 'Топливо', data.fuelType],
          [settings.language === 'pl' ? 'Nadwozie' : 'Кузов', data.bodyType],
          [settings.language === 'pl' ? 'Wersja' : 'Версия', data.version],
          [settings.language === 'pl' ? 'Kraj rejestracji' : 'Страна регистрации', data.registrationCountry]
        ];
        parts.forEach(([label, value]) => {
          if (value == null || value === '') return;
          const row = createEl('div', 'flex justify-between gap-2');
          row.appendChild(createEl('span', 'text-slate-400', [label + ':']));
          row.appendChild(createEl('span', 'text-slate-100', [String(value)]));
          vehicleBody.appendChild(row);
        });

        const brandLower = String(data.brand || '').toLowerCase();
        if (brandLower.startsWith('volkswagen') || brandLower === 'vw') {
          const ilRow = createEl('div', 'pt-2');
          const ilLink = createEl('a', 'inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-100 border border-slate-600', ['IlCats (VW)']);
          ilLink.href = 'https://www.ilcats.ru/';
          ilLink.target = '_blank';
          ilLink.rel = 'noopener noreferrer';
          ilRow.appendChild(ilLink);
          vehicleBody.appendChild(ilRow);
        }
      }
      vehicleCard.classList.remove('hidden');
    } catch (e) {
      statusEl.textContent = (e && e.message) || (settings.language === 'pl' ? 'Błąd połączenia.' : 'Ошибка соединения.');
    }
  });

  container.appendChild(statusEl);
  return container;
}

function renderStockScreen() {
  const container = createEl('div', 'space-y-4');

  const header = createEl('div', 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3');
  header.appendChild(createEl('h2', 'text-base font-semibold text-slate-100', [t('stock_title')]));

  const controls = createEl('div', 'flex flex-col sm:flex-row gap-2 sm:items-center');
  const searchInput = createEl('input', 'w-full sm:w-64 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500');
  searchInput.placeholder = t('stock_search');
  const addBtn = createEl('button', 'px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-sm text-white', ['+ ', t('stock_add_part')]);
  const importOrderBtn = createEl('button', 'px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-sm text-slate-200', [t('stock_import_from_order')]);
  controls.appendChild(searchInput);
  controls.appendChild(addBtn);
  controls.appendChild(importOrderBtn);
  header.appendChild(controls);

  const listEl = createEl('div', 'space-y-2');

  function renderList() {
    const q = (searchInput.value || '').toLowerCase();
    listEl.innerHTML = '';
    const sorted = [...parts].sort((a, b) => (a.name_pl || a.name_ru || '').localeCompare(b.name_pl || b.name_ru || ''));
    const filtered = sorted.filter((p) => {
      if (!q) return true;
      const langName = (settings.language === 'pl' ? (p.name_pl || p.name_ru) : (p.name_ru || p.name_pl)) || '';
      const hay = [langName, p.sku, p.location, p.brand].map((x) => (x || '').toLowerCase()).join(' ');
      return hay.includes(q);
    });
    if (!filtered.length) {
      listEl.appendChild(createEl('div', 'text-sm text-slate-400 py-6 text-center', ['—']));
      return;
    }
    filtered.forEach((p) => {
      const isLow = typeof p.minQty === 'number' && typeof p.qty === 'number' && p.qty <= p.minQty;
      const row = createEl('div', 'rounded-2xl bg-slate-900/80 border border-slate-800 px-3 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2');
      const left = createEl('div', 'space-y-1');
      const name = (settings.language === 'pl' ? (p.name_pl || p.name_ru) : (p.name_ru || p.name_pl)) || '';
      left.appendChild(createEl('div', 'text-sm font-medium text-slate-100', [name || t('stock_name')]));
      const meta = createEl('div', 'text-[11px] text-slate-400 flex flex-wrap gap-x-3 gap-y-1');
      if (p.sku) meta.appendChild(createEl('span', '', [t('stock_sku') + ': ' + p.sku]));
      if (p.brand) meta.appendChild(createEl('span', '', [t('stock_brand') + ': ' + p.brand]));
      if (p.location) meta.appendChild(createEl('span', '', [t('stock_location') + ': ' + p.location]));
      left.appendChild(meta);

      const right = createEl('div', 'flex flex-col sm:items-end gap-2 text-xs');
      const qtyLine = createEl('div', 'flex items-center gap-2');
      const qtyBadge = createEl('span', 'inline-flex items-center px-2 py-1 rounded-full text-[11px] ' + (isLow ? 'bg-red-900/60 text-red-200 border border-red-700' : 'bg-slate-800 text-slate-100 border border-slate-700'), [
        t('stock_qty') + ': ' + (p.qty ?? 0)
      ]);
      qtyLine.appendChild(qtyBadge);
      if (typeof p.minQty === 'number') {
        qtyLine.appendChild(createEl('span', 'text-[11px] text-slate-500', [t('stock_min_qty') + ': ' + p.minQty]));
      }
      right.appendChild(qtyLine);

      const prices = createEl('div', 'text-[11px] text-slate-400');
      if (p.purchasePrice != null) prices.appendChild(createEl('div', '', [t('stock_purchase_price') + ': ' + formatPrice(p.purchasePrice)]));
      if (p.salePrice != null) prices.appendChild(createEl('div', '', [t('stock_sale_price') + ': ' + formatPrice(p.salePrice)]));
      right.appendChild(prices);

      const actions = createEl('div', 'flex items-center gap-2');
      const inBtn = createEl('button', 'text-xs px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white', [t('stock_in')]);
      const outBtn = createEl('button', 'text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100', [t('stock_out')]);
      const delBtn = createEl('button', 'text-xs px-2 py-1.5 rounded-lg bg-red-900/70 hover:bg-red-800 text-red-200', ['× ', t('remove')]);
      actions.appendChild(inBtn);
      actions.appendChild(outBtn);
      actions.appendChild(delBtn);
      right.appendChild(actions);

      delBtn.addEventListener('click', () => {
        if (!confirm(settings.language === 'pl' ? 'Usunąć tę pozycję z magazynu?' : 'Удалить эту запчасть из склада?')) return;
        parts = parts.filter((x) => x.id !== p.id);
        persistAll();
        renderList();
      });

      inBtn.addEventListener('click', () => {
        const qtyStr = prompt('+' + t('stock_qty'), '1');
        if (qtyStr == null) return;
        const qn = parseFloat(qtyStr);
        if (isNaN(qn) || qn <= 0) return;
        p.qty = (p.qty || 0) + qn;
        stockMovements.push({
          id: nextId(),
          partId: p.id,
          type: 'in',
          qty: qn,
          createdAt: new Date().toISOString()
        });
        persistAll();
        renderList();
      });

      outBtn.addEventListener('click', () => {
        const qtyStr = prompt('-' + t('stock_qty'), '1');
        if (qtyStr == null) return;
        const qn = parseFloat(qtyStr);
        if (isNaN(qn) || qn <= 0) return;
        p.qty = (p.qty || 0) - qn;
        if (p.qty < 0) p.qty = 0;
        stockMovements.push({
          id: nextId(),
          partId: p.id,
          type: 'out',
          qty: qn,
          createdAt: new Date().toISOString()
        });
        persistAll();
        renderList();
      });

      row.appendChild(left);
      row.appendChild(right);
      listEl.appendChild(row);
    });
  }

  searchInput.addEventListener('input', () => renderList());

  addBtn.addEventListener('click', () => {
    const name = prompt(settings.language === 'pl' ? 'Nazwa części' : 'Название запчасти', '');
    if (name == null || !name.trim()) return;
    const sku = prompt('SKU / kod / артикул', '');
    const brand = prompt(settings.language === 'pl' ? 'Marka / producent' : 'Бренд / производитель', '');
    const location = prompt(settings.language === 'pl' ? 'Półka / miejsce' : 'Полка / место хранения', '');
    const qtyStr = prompt(settings.language === 'pl' ? 'Stan początkowy' : 'Начальный остаток', '0');
    const minStr = prompt(settings.language === 'pl' ? 'Min. stan (opcjonalnie)' : 'Мин. остаток (необязательно)', '');
    const purchaseStr = prompt(settings.language === 'pl' ? 'Cena zakupu (PLN)' : 'Закупочная цена (PLN)', '');
    const saleStr = prompt(settings.language === 'pl' ? 'Cena sprzedaży (PLN)' : 'Розничная цена (PLN)', '');

    const qty = parseFloat(qtyStr || '0');
    const minQty = minStr ? parseFloat(minStr) : null;
    const purchasePrice = purchaseStr ? parseFloat(purchaseStr) : null;
    const salePrice = saleStr ? parseFloat(saleStr) : null;

    const nameTrim = (name || '').trim();
    const part = {
      id: nextId(),
      sku: (sku || '').trim(),
      name_pl: nameTrim,
      name_ru: nameTrim,
      brand: (brand || '').trim(),
      location: (location || '').trim(),
      qty: isNaN(qty) ? 0 : qty,
      minQty: !isNaN(minQty) && minQty >= 0 ? minQty : null,
      purchasePrice: !isNaN(purchasePrice) && purchasePrice >= 0 ? purchasePrice : null,
      salePrice: !isNaN(salePrice) && salePrice >= 0 ? salePrice : null
    };
    parts.push(part);
    persistAll();
    renderList();
  });

  importOrderBtn.addEventListener('click', () => {
    const overlay = createEl('div', 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm');
    const card = createEl('div', 'w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden');
    const header = createEl('div', 'px-4 py-3 border-b border-slate-700 bg-slate-800/80');
    header.appendChild(createEl('div', 'text-sm font-semibold text-slate-100', [t('stock_import_from_order')]));
    card.appendChild(header);
    const body = createEl('div', 'p-4 space-y-3');
    body.appendChild(createEl('p', 'text-xs text-slate-400', [t('stock_import_hint')]));
    const textarea = createEl('textarea', 'w-full h-32 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y');
    textarea.placeholder = t('stock_import_placeholder');
    body.appendChild(textarea);
    const previewTitle = createEl('div', 'text-xs font-medium text-slate-400', [t('stock_import_preview')]);
    const previewList = createEl('div', 'max-h-40 overflow-y-auto space-y-1 text-xs');
    body.appendChild(previewTitle);
    body.appendChild(previewList);

    function parseLines() {
      const text = (textarea.value || '').trim();
      const lines = text.split(/\n/).map((s) => s.trim()).filter(Boolean);
      const rows = [];
      const qtyRegex = /[,\s](\d+(?:[.,]\d+)?)\s*(szt\.?|шт\.?|pcs\.?|odb\.?)?\s*$/i;
      for (const line of lines) {
        const m = line.match(qtyRegex);
        let name, qty;
        if (m) {
          name = line.slice(0, m.index).replace(/^[,\s]+|[,\s]+$/g, '').trim();
          qty = parseFloat(m[1].replace(',', '.')) || 1;
        } else {
          name = line;
          qty = 1;
        }
        if (name) rows.push({ name, qty });
      }
      return rows;
    }

    function renderPreview() {
      const rows = parseLines();
      previewList.innerHTML = '';
      if (rows.length === 0) {
        previewList.appendChild(createEl('div', 'text-slate-500 py-2', [settings.language === 'pl' ? 'Wpisz lub wklej listę.' : 'Введите или вставьте список.']));
        return;
      }
      rows.forEach((r) => {
        const row = createEl('div', 'flex justify-between gap-2 py-1 border-b border-slate-800');
        row.appendChild(createEl('span', 'text-slate-200 truncate', [r.name]));
        row.appendChild(createEl('span', 'text-slate-400 shrink-0', [String(r.qty)]));
        previewList.appendChild(row);
      });
    }

    textarea.addEventListener('input', renderPreview);

    const footer = createEl('div', 'flex justify-end gap-2 px-4 py-3 border-t border-slate-700 bg-slate-800/50');
    const cancelBtn = createEl('button', 'px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700', [t('cancel_btn')]);
    const addToStockBtn = createEl('button', 'px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white', [t('stock_import_do')]);
    cancelBtn.addEventListener('click', () => overlay.remove());
    addToStockBtn.addEventListener('click', () => {
      const rows = parseLines();
      if (rows.length === 0) {
        if (settings.language === 'pl') alert('Dodaj co najmniej jedną pozycję.'); else alert('Добавьте хотя бы одну позицию.');
        return;
      }
      const nameStr = (n) => (settings.language === 'pl' ? n : n);
      rows.forEach((r) => {
        const part = {
          id: nextId(),
          sku: '',
          name_pl: r.name,
          name_ru: r.name,
          brand: '',
          location: '',
          qty: r.qty,
          minQty: null,
          purchasePrice: null,
          salePrice: null
        };
        parts.push(part);
        stockMovements.push({
          id: nextId(),
          partId: part.id,
          type: 'in',
          qty: part.qty,
          createdAt: new Date().toISOString()
        });
      });
      persistAll();
      renderList();
      overlay.remove();
    });
    footer.appendChild(cancelBtn);
    footer.appendChild(addToStockBtn);
    card.appendChild(body);
    card.appendChild(footer);
    overlay.appendChild(card);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    card.addEventListener('click', (e) => e.stopPropagation());
    appRoot.appendChild(overlay);
    renderPreview();
  });

  container.appendChild(header);
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
      const grid = createEl('div', 'grid grid-cols-4 gap-2 mt-1');

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

      const hoursWrap = createEl('div', 'space-y-0.5');
      hoursWrap.appendChild(createEl('div', 'text-[10px] text-slate-400', [t('norm_hours')]));
      const hoursInput = createEl('input', 'w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary-500');
      hoursInput.type = 'number';
      hoursInput.min = '0';
      hoursInput.step = '0.1';
      hoursInput.value = svc.laborHours ?? '';
      hoursInput.addEventListener('change', () => {
        const v = parseFloat(hoursInput.value);
        svc.laborHours = !isNaN(v) && v >= 0 ? v : null;
        persistAll();
      });
      hoursWrap.appendChild(hoursInput);

      grid.appendChild(baseWrap);
      grid.appendChild(minWrap);
      grid.appendChild(cmpWrap);
      grid.appendChild(hoursWrap);
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

  const rateWrap = createEl('div', 'space-y-1 pt-3 border-t border-slate-800 mt-3');
  rateWrap.appendChild(createEl('label', 'block text-[11px] text-slate-400', [t('labor_rate') + ' (PLN/h)']));
  const rateInput = createEl('input', 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500');
  rateInput.type = 'number';
  rateInput.min = '0';
  rateInput.step = '10';
  rateInput.value = settings.laborRate ?? 120;
  rateInput.addEventListener('change', () => {
    const v = parseFloat(rateInput.value);
    settings.laborRate = !isNaN(v) && v >= 0 ? v : 0;
    persistAll();
  });
  rateWrap.appendChild(rateInput);
  settingsCard.appendChild(rateWrap);

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
  lines.push('ul. Wernisażowa 21, 64-500 Jastrowo (Szamotuły). Tel. +48 794 935 734');
  return lines.join('\n');
}

function buildOrderPdfHtml(order, lang) {
  const isPl = lang === 'pl';
  const dateStr = new Date(order.createdAt).toLocaleDateString(isPl ? 'pl-PL' : 'ru-RU');
  const colLp = 'Lp.';
  const col1 = isPl ? 'Nazwa usługi / pozycja' : 'Наименование работ / позиция';
  const col2 = isPl ? 'Ilość' : 'Кол-во';
  const col3 = isPl ? 'Cena jedn. (PLN)' : 'Цена ед. (PLN)';
  const col4 = isPl ? 'Wartość (PLN)' : 'Сумма (PLN)';
  let rows = '';
  let rowNum = 0;
  (order.services || []).forEach((item) => {
    rowNum += 1;
    let name = isPl ? (item.name_pl || item.name || '') : (item.name_ru || item.name || '');
    if ((!item.name_pl || !item.name_ru) && item.name) {
      const pro = getProfessionalName(item.name);
      if (pro) name = isPl ? pro.name_pl : pro.name_ru;
    }
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    const qty = item.quantity != null ? item.quantity : 1;
    const value = price * qty;
    rows += `<tr>
      <td style="border: 1px solid #333; padding: 6px 8px; text-align: center;">${rowNum}</td>
      <td style="border: 1px solid #333; padding: 6px 8px;">${escapeHtml(name)}</td>
      <td style="border: 1px solid #333; padding: 6px 8px; text-align: center;">${escapeHtml(String(qty))}</td>
      <td style="border: 1px solid #333; padding: 6px 8px; text-align: right;">${price.toFixed(2)}</td>
      <td style="border: 1px solid #333; padding: 6px 8px; text-align: right;">${value.toFixed(2)}</td>
    </tr>`;
  });
  const totalNum = typeof order.total === 'number' ? order.total : parseFloat(order.total) || 0;
  const legalText = isPl
    ? 'Wyrażam zgodę na wykonanie powyższych prac serwisowych w warsztacie Car Service Nikol. Oświadczam, że zostałem poinformowany o orientacyjnej cenie usługi i mogę zostać poinformowany o zmianach kosztów przed wykonaniem dodatkowych prac.'
    : 'Даю согласие на выполнение указанных работ в сервисе Car Service Nikol. Подтверждаю, что ознакомлен с ориентировочной стоимостью и могу быть уведомлён об изменении стоимости до выполнения дополнительных работ.';
  const title = isPl ? 'Zlecenie serwisowe' : 'Заказ-наряд';
  const docNrLabel = isPl ? 'Nr zlecenia' : '№ заказа';
  const vehicleLabel = isPl ? 'Pojazd' : 'Автомобиль';
  const clientLabel = isPl ? 'Klient' : 'Клиент';
  const totalLabel = isPl ? 'Razem brutto' : 'Итого к оплате';
  const signLabel = isPl ? 'Podpis klienta' : 'Подпись клиента';
  const thStyle = 'border: 1px solid #333; padding: 6px 8px; text-align: left; font-weight: bold; background: #e8e8e8; font-size: 9pt;';
  const tableStyle = 'width: 100%; border-collapse: collapse; font-size: 9pt; margin: 0; table-layout: fixed; font-family: \'Noto Sans\', Arial, sans-serif;';
  const logoHtml = '<div style="display: inline-block; width: 52px; height: 52px; border: 2px solid #1a1a1a; border-radius: 10px; text-align: center; line-height: 50px; font-weight: 700; font-size: 22px; color: #1a1a1a;">N</div>';
  return `
    <div class="pdf-page" style="font-family: \'Noto Sans\', Arial, sans-serif; width: 210mm; min-height: 297mm; padding: 14mm; box-sizing: border-box; background: #fff; color: #000;">
      <header style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 2px solid #333;">
        <div style="flex-shrink: 0;">${logoHtml}</div>
        <div style="text-align: right;">
          <div style="font-size: 16pt; font-weight: 700; margin-bottom: 2px;">Car Service Nikol</div>
          <div style="font-size: 9pt;">ul. Wernisażowa 21, 64-500 Jastrowo (Szamotuły)</div>
          <div style="font-size: 9pt;">Tel. +48 794 935 734</div>
        </div>
      </header>
      <h1 style="font-size: 14pt; font-weight: 700; margin: 0 0 12px 0; text-align: center;">${escapeHtml(title)}</h1>
      <div style="display: flex; justify-content: space-between; flex-wrap: wrap; font-size: 9pt; margin-bottom: 12px;">
        <span><strong>${escapeHtml(docNrLabel)}:</strong> ${escapeHtml(String(order.id || ''))}</span>
        <span><strong>${isPl ? 'Data' : 'Дата'}:</strong> ${escapeHtml(dateStr)}</span>
      </div>
      <div style="font-size: 9pt; margin-bottom: 14px; padding: 8px; background: #f8f8f8; border: 1px solid #ddd;">
        <div style="margin-bottom: 4px;"><strong>${escapeHtml(clientLabel)}:</strong> ${escapeHtml(order.clientName || '—')} ${order.clientPhone ? ' · ' + escapeHtml(order.clientPhone) : ''}</div>
        <div style="margin-bottom: 4px;"><strong>${escapeHtml(vehicleLabel)}:</strong> ${escapeHtml(order.brand || '')} ${escapeHtml(order.model || '')} ${order.year ? ', ' + escapeHtml(String(order.year)) : ''}</div>
        <div>${order.vin ? '<strong>VIN:</strong> ' + escapeHtml(order.vin) : ''} ${order.plate ? (order.vin ? ' · ' : '') + '<strong>' + (isPl ? 'Nr rej.' : 'Гос. номер') + ':</strong> ' + escapeHtml(order.plate) : ''}</div>
      </div>
      <table style="${tableStyle}" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th style="${thStyle} width: 6%;">${colLp}</th>
            <th style="${thStyle} width: 44%;">${escapeHtml(col1)}</th>
            <th style="${thStyle} width: 12%; text-align: center;">${escapeHtml(col2)}</th>
            <th style="${thStyle} width: 18%; text-align: right;">${escapeHtml(col3)}</th>
            <th style="${thStyle} width: 20%; text-align: right;">${escapeHtml(col4)}</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr>
            <td colspan="4" style="border: 1px solid #333; padding: 8px 10px; text-align: right; font-weight: bold;">${escapeHtml(totalLabel)}:</td>
            <td style="border: 1px solid #333; padding: 8px 10px; text-align: right; font-weight: bold;">${totalNum.toFixed(2)} PLN</td>
          </tr>
        </tbody>
      </table>
      <div style="font-size: 12pt; font-weight: 700; margin-top: 10px;">${escapeHtml(totalLabel)}: ${totalNum.toFixed(2)} PLN</div>
      <div style="font-size: 8pt; margin-top: 16px; line-height: 1.45;">${escapeHtml(legalText)}</div>
      <div style="margin-top: 20px;">
        <div style="font-size: 8pt; color: #555;">${escapeHtml(signLabel)}</div>
        <div style="border-bottom: 1px solid #333; width: 180px; margin-top: 4px;"></div>
      </div>
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

