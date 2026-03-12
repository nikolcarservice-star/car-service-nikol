'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useCrm } from '../../CrmContext';
import { Card, CardHeader } from '@/components/crm/Card';
import { Button } from '@/components/crm/Button';
import { Input } from '@/components/crm/Input';
import { Select } from '@/components/crm/Select';
import { BRANDS, YEARS, DEFAULT_SERVICES, CUSTOM_BRAND_ID } from '@/lib/crm-data';
import { CRM_BASE_PATH } from '@/lib/crm-base-path';

const STORAGE_ORDERS = 'nikol_orders';

function formatPrice(n) {
  return (Number(n) || 0).toFixed(0) + ' PLN';
}

export default function NewOrderPage() {
  const { user, language } = useCrm();
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [manualOpen, setManualOpen] = useState(false);
  const [manualBrand, setManualBrand] = useState('');
  const [manualModel, setManualModel] = useState('');
  const [manualYear, setManualYear] = useState('');
  const [orderLines, setOrderLines] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [vin, setVin] = useState('');
  const [plate, setPlate] = useState('');
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);

  const services = DEFAULT_SERVICES;
  const lang = language === 'pl' ? 'pl' : 'ru';
  const serviceNameKey = lang === 'pl' ? 'name_pl' : 'name_ru';

  const brandOptions = useMemo(
    () => [
      { value: '', label: 'Выберите марку' },
      ...BRANDS.map((b) => ({ value: b.name, label: b.name })),
      { value: CUSTOM_BRAND_ID, label: 'Свой вариант' },
    ],
    []
  );

  const selectedBrandData = BRANDS.find((b) => b.name === brand);
  const modelOptions = useMemo(() => {
    if (!selectedBrandData?.models) return [{ value: '', label: 'Модель' }];
    return [
      { value: '', label: 'Выберите модель' },
      ...selectedBrandData.models.map((m) => ({ value: m, label: m })),
    ];
  }, [selectedBrandData]);

  const yearOptions = useMemo(
    () => [
      { value: '', label: 'Год' },
      ...YEARS.map((y) => ({ value: y, label: y })),
    ],
    []
  );

  const serviceOptions = useMemo(
    () =>
      services.map((s) => ({
        value: s.id,
        label: `${s[serviceNameKey]} — ${formatPrice(s.basePrice)}`,
      })),
    [services, serviceNameKey]
  );

  const getEffectiveCar = () => {
    if (manualBrand || manualModel || manualYear) {
      return {
        brand: manualBrand || (brand === CUSTOM_BRAND_ID ? '' : brand),
        model: manualModel || model,
        year: manualYear || year,
      };
    }
    return {
      brand: brand === CUSTOM_BRAND_ID ? '' : brand,
      model,
      year,
    };
  };

  const addService = (serviceId) => {
    const svc = services.find((s) => s.id === serviceId);
    if (!svc) return;
    const car = getEffectiveCar();
    const price = svc.basePrice || 0;
    setOrderLines((prev) => [
      ...prev,
      {
        id: `line_${Date.now()}`,
        type: 'catalog',
        svcId: svc.id,
        name_pl: svc.name_pl,
        name_ru: svc.name_ru,
        price,
      },
    ]);
  };

  const addCustomService = () => {
    const name = customName.trim();
    const price = parseFloat(customPrice);
    if (!name || isNaN(price) || price < 0) return;
    setOrderLines((prev) => [
      ...prev,
      { id: `custom_${Date.now()}`, type: 'custom', name, price },
    ]);
    setCustomName('');
    setCustomPrice('');
  };

  const removeLine = (id) => {
    setOrderLines((prev) => prev.filter((l) => l.id !== id));
  };

  const total = orderLines.reduce((sum, l) => sum + (l.price || 0), 0);

  const handleSave = () => {
    const car = getEffectiveCar();
    if (!car.brand || !car.model || !car.year) {
      alert(language === 'pl' ? 'Podaj markę, model i rok.' : 'Укажите марку, модель и год.');
      return;
    }
    if (orderLines.length === 0) {
      alert(language === 'pl' ? 'Dodaj co najmniej jedną usługę.' : 'Добавьте хотя бы одну услугу.');
      return;
    }
    const order = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      createdBy: user?.username || 'master',
      brand: car.brand,
      model: car.model,
      year: car.year,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      vin: vin.trim(),
      plate: plate.trim(),
      comment: comment.trim(),
      services: orderLines.map((l) => ({
        name_pl: l.name_pl || l.name,
        name_ru: l.name_ru || l.name,
        price: l.price,
        quantity: 1,
      })),
      total,
    };
    try {
      const raw = localStorage.getItem(STORAGE_ORDERS);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(order);
      localStorage.setItem(STORAGE_ORDERS, JSON.stringify(list));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert('Ошибка сохранения');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-crm-textMuted">
        <Link href={CRM_BASE_PATH} className="hover:text-crm-text transition-colors">
          Рабочий стол
        </Link>
        <span>/</span>
        <span className="text-crm-text">Новый заказ</span>
      </div>

      <h1 className="text-xl font-semibold text-crm-text">Заказ-наряд</h1>

      {/* Блок авто: марка / модель / год — карточные dropdown */}
      <Card>
        <CardHeader title="Автомобиль" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            label="Марка"
            value={brand}
            onChange={(v) => {
              setBrand(v);
              setModel('');
            }}
            options={brandOptions}
            placeholder="Выберите марку"
          />
          {brand && brand !== CUSTOM_BRAND_ID && (
            <Select
              label="Модель"
              value={model}
              onChange={setModel}
              options={modelOptions}
              placeholder="Выберите модель"
            />
          )}
          <Select
            label="Год"
            value={year}
            onChange={setYear}
            options={yearOptions}
            placeholder="Год"
          />
        </div>

        {/* Ссылка «Ввести вручную» — схлопнуто по умолчанию */}
        <div className="mt-3 pt-3 border-t border-[var(--crm-border)]">
          <button
            type="button"
            onClick={() => setManualOpen((o) => !o)}
            className="flex items-center gap-2 text-sm text-crm-accent hover:underline"
          >
            {manualOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            Ввести вручную
          </button>
          {manualOpen && (
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Input
                placeholder="Марка (вручную)"
                value={manualBrand}
                onChange={(e) => setManualBrand(e.target.value)}
              />
              <Input
                placeholder="Модель (вручную)"
                value={manualModel}
                onChange={(e) => setManualModel(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Год"
                value={manualYear}
                onChange={(e) => setManualYear(e.target.value)}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Услуги: выбор из списка + карточки добавленных */}
      <Card>
        <CardHeader title="Услуги" />
        <div className="flex flex-wrap items-end gap-2 mb-4">
          <div className="flex-1 min-w-[200px]" data-service-select>
            <Select
              label="Добавить услугу"
              value={selectedServiceId}
              onChange={(v) => setSelectedServiceId(v || '')}
              options={[{ value: '', label: 'Выберите услугу' }, ...serviceOptions]}
              placeholder="Выберите услугу"
            />
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              if (selectedServiceId) {
                addService(selectedServiceId);
                setSelectedServiceId('');
              }
            }}
          >
            <Plus className="w-4 h-4" />
            Добавить в заказ
          </Button>
        </div>

        {/* Добавленные услуги — карточки с ценой и удалением */}
        <div className="space-y-2">
          {orderLines.map((line) => (
            <div
              key={line.id}
              className="flex items-center justify-between gap-3 p-3 rounded-crm bg-[var(--crm-surface)]/80 border border-[var(--crm-border)] hover:border-crm-textMuted/20 transition-colors"
            >
              <span className="text-sm text-crm-text flex-1 min-w-0 truncate">
                {line.type === 'catalog'
                  ? lang === 'pl'
                    ? line.name_pl
                    : line.name_ru
                  : line.name}
              </span>
              <span className="text-sm font-medium text-crm-accent shrink-0">
                {formatPrice(line.price)}
              </span>
              <button
                type="button"
                onClick={() => removeLine(line.id)}
                className="p-1.5 rounded-crm text-crm-textMuted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                aria-label="Удалить"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Своя работа */}
        <div className="mt-4 pt-4 border-t border-[var(--crm-border)]">
          <p className="text-xs text-crm-textMuted mb-2">Добавить свою работу</p>
          <div className="flex flex-wrap gap-2 items-end">
            <Input
              placeholder="Название работы"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              containerClassName="flex-1 min-w-[140px]"
            />
            <Input
              type="number"
              placeholder="Цена (PLN)"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              containerClassName="w-28"
            />
            <Button variant="secondary" size="sm" onClick={addCustomService}>
              Добавить
            </Button>
          </div>
        </div>

        {/* Итого — крупный шрифт */}
        <div className="mt-4 pt-4 border-t border-[var(--crm-border)] flex justify-between items-center">
          <span className="text-sm font-medium text-crm-textMuted">Итого</span>
          <span className="text-2xl font-bold text-crm-accent">
            {formatPrice(total)}
          </span>
        </div>
      </Card>

      {/* Клиент и комментарий */}
      <Card>
        <CardHeader title="Клиент и данные" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Имя клиента"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Имя"
          />
          <Input
            label="Телефон"
            type="tel"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            placeholder="+48 ..."
          />
          <Input
            label="VIN"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="17 символов"
          />
          <Input
            label="Гос. номер"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            placeholder="Гос. номер"
          />
        </div>
        <div className="mt-3 space-y-1">
          <label className="block text-xs font-medium text-crm-textMuted">Комментарий</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 rounded-crm bg-[var(--crm-surface)] border border-[var(--crm-border)] text-crm-text placeholder-crm-textMuted/70 text-sm focus:outline-none focus:ring-2 focus:ring-crm-accent focus:border-transparent resize-y min-h-[80px]"
            placeholder="Комментарий..."
          />
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={handleSave}>
          Сохранить заказ
        </Button>
        {saved && (
          <span className="text-sm text-green-400">Заказ сохранён.</span>
        )}
        <Link href={`${CRM_BASE_PATH}/orders`}>
          <Button variant="ghost">К списку заказов</Button>
        </Link>
      </div>
    </div>
  );
}
