'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/crm/Card';
import { Button } from '@/components/crm/Button';
import { CRM_BASE_PATH } from '@/lib/crm-base-path';

const STORAGE_ORDERS = 'nikol_orders';

function formatPrice(n) {
  return (Number(n) || 0).toFixed(0) + ' PLN';
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ORDERS);
      const list = raw ? JSON.parse(raw) : [];
      const found = list.find((o) => o.id === params.id);
      setOrder(found || null);
    } catch {
      setOrder(null);
    }
  }, [params.id]);

  if (order === null) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Link href={`${CRM_BASE_PATH}/orders`} className="inline-flex items-center gap-1 text-sm text-crm-textMuted hover:text-crm-text">
          <ArrowLeft className="w-4 h-4" /> К списку заказов
        </Link>
        <p className="text-crm-textMuted">Заказ не найден.</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="h-8 w-48 rounded-crm bg-crm-surface/80 crm-skeleton" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Link href={`${CRM_BASE_PATH}/orders`} className="inline-flex items-center gap-1 text-sm text-crm-textMuted hover:text-crm-text">
          <ArrowLeft className="w-4 h-4" /> К списку заказов
        </Link>
      </div>

      <Card>
        <h1 className="text-lg font-semibold text-crm-text">
          {order.brand} {order.model}, {order.year}
        </h1>
        <p className="text-xs text-crm-textMuted mt-1">
          #{order.id} · {new Date(order.createdAt).toLocaleString()}
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
          <p><span className="text-crm-textMuted">Клиент:</span> {order.clientName || '—'}</p>
          <p><span className="text-crm-textMuted">Телефон:</span> {order.clientPhone || '—'}</p>
          <p><span className="text-crm-textMuted">VIN:</span> {order.vin || '—'}</p>
          <p><span className="text-crm-textMuted">Гос. номер:</span> {order.plate || '—'}</p>
        </div>
        {order.comment && (
          <p className="mt-2 text-sm text-crm-textMuted">{order.comment}</p>
        )}
        <div className="mt-4 pt-4 border-t border-[var(--crm-border)]">
          <p className="text-xs font-medium text-crm-textMuted mb-2">Услуги</p>
          <ul className="space-y-1">
            {(order.services || []).map((s, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="text-crm-text">{s.name_ru || s.name_pl || s.name}</span>
                <span className="text-crm-accent">{formatPrice(s.price)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-right text-lg font-bold text-crm-accent">
            Итого: {formatPrice(order.total)}
          </p>
        </div>
      </Card>
    </div>
  );
}
