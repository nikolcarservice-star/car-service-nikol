// Seed data: двуязычная CRM "Nikol Service" (RU/PL)
// Коэффициенты: Standard x1.0, Medium x1.2, Premium x1.5

export const CUSTOM_BRAND_ID = '__custom__';

export const BRAND_GROUPS = {
  A: {
    id: 'A',
    name: 'Standard',
    multiplier: 1.0,
    brands: ['Fiat', 'Opel', 'Dacia', 'Renault', 'Peugeot', 'Citroën', 'Seat', 'Skoda', 'Mazda', 'Suzuki', 'Nissan', 'Mitsubishi']
  },
  B: {
    id: 'B',
    name: 'Medium',
    multiplier: 1.2,
    brands: ['Volkswagen', 'Toyota', 'Ford', 'Hyundai', 'Kia', 'Honda', 'Chevrolet', 'Opel', 'Škoda']
  },
  C: {
    id: 'C',
    name: 'Premium',
    multiplier: 1.5,
    brands: ['BMW', 'Mercedes', 'Audi', 'Lexus', 'Volvo', 'Porsche', 'Land Rover', 'Jaguar', 'Mini', 'Alfa Romeo', 'Jeep', 'Infiniti']
  }
};

// Расширенный список марок и моделей (годы — общий список для выбора или свой ввод)
const YEARS_LIST = ['1995', '1998', '2000', '2002', '2004', '2006', '2008', '2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024'];

export const BRANDS = [
  { name: 'Fiat', groupId: 'A', models: ['Punto', 'Tipo', '500', '500L', 'Ducato', 'Panda', 'Bravo', 'Stilo', 'Grande Punto', 'Doblo', 'Scudo'] },
  { name: 'Opel', groupId: 'A', models: ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland', 'Grandland', 'Combo', 'Vivaro', 'Zafira', 'Meriva', 'Adam'] },
  { name: 'Dacia', groupId: 'A', models: ['Logan', 'Duster', 'Sandero', 'Spring', 'Jogger', 'Lodgy'] },
  { name: 'Renault', groupId: 'A', models: ['Clio', 'Megane', 'Scenic', 'Captur', 'Kadjar', 'Talisman', 'Espace', 'Koleos', 'Twingo', 'Zoe', 'Duster', 'Master', 'Trafic'] },
  { name: 'Peugeot', groupId: 'A', models: ['208', '308', '408', '508', '2008', '3008', '5008', 'Partner', 'Expert', 'Boxer', '206', '207', '307'] },
  { name: 'Citroën', groupId: 'A', models: ['C3', 'C4', 'C5', 'Berlingo', 'C-Elysée', 'C4 Cactus', 'C4 Picasso', 'DS3', 'Jumpy', 'Spacetourer'] },
  { name: 'Seat', groupId: 'A', models: ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco', 'Cordoba', 'Alhambra', 'Exeo'] },
  { name: 'Skoda', groupId: 'A', models: ['Fabia', 'Octavia', 'Superb', 'Kodiaq', 'Karoq', 'Kamiq', 'Scala', 'Enyaq', 'Rapid'] },
  { name: 'Mazda', groupId: 'A', models: ['2', '3', '6', 'CX-3', 'CX-5', 'CX-30', 'CX-60', 'MX-5', 'Demio', 'Premacy'] },
  { name: 'Suzuki', groupId: 'A', models: ['Swift', 'Vitara', 'S-Cross', 'Ignis', 'Jimny', 'Baleno', 'Across', 'Alto', 'SX4'] },
  { name: 'Nissan', groupId: 'A', models: ['Micra', 'Juke', 'Qashqai', 'X-Trail', 'Leaf', 'Navara', 'Note', 'Pulsar', 'Primastar', 'NV200'] },
  { name: 'Mitsubishi', groupId: 'A', models: ['ASX', 'Outlander', 'Eclipse Cross', 'Space Star', 'L200', 'Pajero', 'Colt', 'Lancer'] },
  { name: 'Volkswagen', groupId: 'B', models: ['Golf', 'Passat', 'Polo', 'Tiguan', 'T-Roc', 'T-Cross', 'Touran', 'Sharan', 'Caddy', 'Transporter', 'Arteon', 'ID.3', 'ID.4', 'Up!', 'Scirocco'] },
  { name: 'Toyota', groupId: 'B', models: ['Yaris', 'Corolla', 'RAV4', 'Camry', 'C-HR', 'Land Cruiser', 'Hilux', 'Aygo', 'Prius', 'Supra', 'bZ4X', 'Proace'] },
  { name: 'Ford', groupId: 'B', models: ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Puma', 'Mustang', 'Ranger', 'Transit', 'EcoSport', 'S-Max', 'Galaxy'] },
  { name: 'Hyundai', groupId: 'B', models: ['i20', 'i30', 'Tucson', 'Kona', 'Santa Fe', 'Bayon', 'IONIQ', 'IONIQ 5', 'Staria', 'Porter'] },
  { name: 'Kia', groupId: 'B', models: ['Rio', 'Ceed', 'Sportage', 'Niro', 'Stonic', 'Sorento', 'Picanto', 'EV6', 'Soul', 'Carnival', 'Xceed'] },
  { name: 'Honda', groupId: 'B', models: ['Civic', 'CR-V', 'Accord', 'Jazz', 'HR-V', 'e', 'NSX', 'FR-V', 'Stream'] },
  { name: 'BMW', groupId: 'C', models: ['1', '2', '3', '4', '5', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'i3', 'i4', 'iX', 'Z4', 'M3', 'M5'] },
  { name: 'Mercedes', groupId: 'C', models: ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'EQA', 'EQB', 'EQC', 'Vito', 'Sprinter', 'V-Class'] },
  { name: 'Audi', groupId: 'C', models: ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron', 'TT', 'RS'] },
  { name: 'Lexus', groupId: 'C', models: ['IS', 'ES', 'NX', 'RX', 'UX', 'LC', 'LS', 'RZ'] },
  { name: 'Volvo', groupId: 'C', models: ['V40', 'V60', 'V90', 'S60', 'S90', 'XC40', 'XC60', 'XC90', 'C40', 'EX90'] },
  { name: 'Porsche', groupId: 'C', models: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Cayman', 'Boxster'] },
  { name: 'Land Rover', groupId: 'C', models: ['Defender', 'Discovery', 'Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque', 'Freelander'] },
  { name: 'Jaguar', groupId: 'C', models: ['XE', 'XF', 'F-Pace', 'E-Pace', 'I-Pace', 'F-Type', 'XJ'] },
  { name: 'Mini', groupId: 'C', models: ['Cooper', 'Countryman', 'Clubman', 'Paceman', 'Electric'] },
  { name: 'Alfa Romeo', groupId: 'C', models: ['Giulia', 'Stelvio', 'Tonale', 'MiTo', 'Giulietta', '147', '156', '159'] },
  { name: 'Jeep', groupId: 'C', models: ['Renegade', 'Compass', 'Cherokee', 'Grand Cherokee', 'Wrangler', 'Avenger'] },
  { name: 'Infiniti', groupId: 'C', models: ['Q30', 'Q50', 'QX50', 'QX55', 'QX80'] }
];

export const YEARS = YEARS_LIST;

// Нормализация: VW → Volkswagen и т.д.
export function normalizeBrandName(name) {
  if (!name || name === CUSTOM_BRAND_ID) return '';
  const m = { 'VW': 'Volkswagen', 'MB': 'Mercedes', 'VAG': 'Volkswagen' };
  return m[name] || name;
}

// Проверка: введённая марка/модель — из списка или свой вариант (для последующей проверки админом)
export function isCustomBrand(brandName) {
  return !brandName || brandName === CUSTOM_BRAND_ID || !BRANDS.some(b => b.name === brandName);
}

// Seed услуг по ТЗ + расширенный каталог типовых работ
export const DEFAULT_SERVICES = [
  { id: '1', name_pl: 'Diagnostyka komputerowa', name_ru: 'Компьютерная диагностика', basePrice: 100, minPrice: 80, competitorAvgPrice: 120 },
  { id: '2', name_pl: 'Kodowanie klucza', name_ru: 'Программирование ключа', basePrice: 250, minPrice: 200, competitorAvgPrice: 300 },
  { id: '3', name_pl: 'Wymiana klocków (oś)', name_ru: 'Замена колодок (ось)', basePrice: 120, minPrice: 90, competitorAvgPrice: 150 },
  { id: '4', name_pl: 'Wulkanizacja (komplet)', name_ru: 'Шиномонтаж (комплект)', basePrice: 120, minPrice: 90, competitorAvgPrice: 140 },
  { id: '5', name_pl: 'Serwis mobilny (dojazd)', name_ru: 'Выезд мастера', basePrice: 50, minPrice: 40, competitorAvgPrice: 60 },
  { id: '6', name_pl: 'Wymiana oleju i filtrów', name_ru: 'Замена масла и фильтров', basePrice: 80, minPrice: 60, competitorAvgPrice: 100 },
  { id: '7', name_pl: 'Wymiana tarcz i klocków (przód)', name_ru: 'Замена дисков и колодок (перед)', basePrice: 250, minPrice: 200, competitorAvgPrice: 280 },
  { id: '8', name_pl: 'Wymiana tarcz i klocków (tył)', name_ru: 'Замена дисков и колодок (зад)', basePrice: 260, minPrice: 210, competitorAvgPrice: 290 },
  { id: '9', name_pl: 'Wymiana płynu hamulcowego', name_ru: 'Замена тормозной жидкости', basePrice: 180, minPrice: 150, competitorAvgPrice: 210 },
  { id: '10', name_pl: 'Wymiana świec zapłonowych', name_ru: 'Замена свечей зажигания', basePrice: 90, minPrice: 70, competitorAvgPrice: 110 },
  { id: '11', name_pl: 'Wymiana amortyzatorów (oś)', name_ru: 'Замена амортизаторов (ось)', basePrice: 320, minPrice: 260, competitorAvgPrice: 360 },
  { id: '12', name_pl: 'Wymiana sprzęgła', name_ru: 'Замена сцепления', basePrice: 800, minPrice: 650, competitorAvgPrice: 900 },
  { id: '13', name_pl: 'Wymiana rozrządu (pasek)', name_ru: 'Замена ремня ГРМ', basePrice: 650, minPrice: 550, competitorAvgPrice: 750 },
  { id: '14', name_pl: 'Wymiana akumulatora', name_ru: 'Замена аккумулятора', basePrice: 80, minPrice: 60, competitorAvgPrice: 100 },
  { id: '15', name_pl: 'Serwis klimatyzacji', name_ru: 'Сервис кондиционера', basePrice: 180, minPrice: 150, competitorAvgPrice: 220 },
  { id: '16', name_pl: 'Ustawienie geometrii / zbieżność', name_ru: 'Регулировка развал-схождения', basePrice: 230, minPrice: 190, competitorAvgPrice: 280 },
  { id: '17', name_pl: 'Wymiana tłumika końcowego', name_ru: 'Замена заднего глушителя', basePrice: 190, minPrice: 150, competitorAvgPrice: 210 },
  { id: '18', name_pl: 'Wymiana łożyska koła', name_ru: 'Замена подшипника ступицы', basePrice: 200, minPrice: 160, competitorAvgPrice: 230 },
  { id: '19', name_pl: 'Wymiana pompy wody', name_ru: 'Замена помпы охлаждения', basePrice: 260, minPrice: 220, competitorAvgPrice: 310 },
  { id: '20', name_pl: 'Regeneracja rozrusznika / alternatora', name_ru: 'Ремонт стартера / генератора', basePrice: 260, minPrice: 220, competitorAvgPrice: 310 }
];

// Словарь профессиональных названий: ручной ввод → корректные термины PL/RU (для вывода в PDF/WhatsApp и после мониторинга)
export const PROFESSIONAL_TERMS = [
  { keys: ['замена двс', 'замена двигателя', 'wymiana silnika', 'silnik'], name_pl: 'Wymiana silnika', name_ru: 'Замена двигателя' },
  { keys: ['замена масла', 'wymiana oleju', 'olej', 'масло'], name_pl: 'Wymiana oleju i filtrów', name_ru: 'Замена масла и фильтров' },
  { keys: ['диагностика', 'diagnostyka', 'компьютерная диагностика'], name_pl: 'Diagnostyka komputerowa', name_ru: 'Компьютерная диагностика' },
  { keys: ['замена колодок', 'klocki', 'klocków', 'колодки'], name_pl: 'Wymiana klocków', name_ru: 'Замена колодок' },
  { keys: ['шиномонтаж', 'wulkanizacja', 'opony', 'шины'], name_pl: 'Wulkanizacja (komplet)', name_ru: 'Шиномонтаж (комплект)' },
  { keys: ['выезд', 'dojazd', 'mobilny', 'мобильный'], name_pl: 'Serwis mobilny (dojazd)', name_ru: 'Выезд мастера' },
  { keys: ['ключ', 'klucz', 'кодирование ключа', 'программирование'], name_pl: 'Kodowanie klucza', name_ru: 'Программирование ключа' },
  { keys: ['тормоз', 'hamulce', 'tarcze', 'диски тормоз'], name_pl: 'Wymiana tarcz i klocków', name_ru: 'Замена дисков и колодок' },
  { keys: ['амортизаторы', 'amortyzator', 'стойки'], name_pl: 'Wymiana amortyzatorów', name_ru: 'Замена амортизаторов' },
  { keys: ['сцепление', 'sprzęgło'], name_pl: 'Wymiana sprzęgła', name_ru: 'Замена сцепления' },
  { keys: ['свечи', 'świece', 'свечи зажигания'], name_pl: 'Wymiana świec zapłonowych', name_ru: 'Замена свечей зажигания' },
  { keys: ['жидкость тормоз', 'płyn hamulcowy', 'тормозная жидкость'], name_pl: 'Wymiana płynu hamulcowego', name_ru: 'Замена тормозной жидкости' }
];

export const DEFAULT_SETTINGS = {
  language: 'ru',
  yearThreshold: 2020,
  yearMultiplier: 1.1,
  discountVsMarketPercent: 0,
  priceDeviationWarningPercent: 20,
  priceMonitorUrl: '',
  lastPriceUpdate: null
};
