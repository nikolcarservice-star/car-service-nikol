'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/crm/Card';
import { Button } from '@/components/crm/Button';
import { Skeleton, SkeletonRow } from '@/components/crm/Skeleton';

const STORAGE_ORDERS = 'nikol_orders';

function formatPrice(n) {
  return (Number(n) || 0).toFixed(0) + ' PLN';
}

const statusLabels = {
  ru: { pending: 'Ожидает', in_progress: 'В работе', completed: 'Выполнен', cancelled: 'Отменён' },
  pl: { pending: 'Oczekuje', in_progress: 'W realizacji', completed: 'Wykonane', cancelled: 'Anulowane' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ORDERS);
      setOrders(raw ? JSON.parse(raw) : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-xl font-semibold text-crm-text">Заказы</h1>
        <Card>
          <SkeletonRow cols={4} />
          <SkeletonRow cols={4} />
          <SkeletonRow cols={4} />
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-crm-text">Заказы</h1>
        <Link href="/crm/order/new">
          <Button variant="primary">Новый заказ</Button>
        </Link>
      </div>

      {/* Таблица без жёстких границ, чередование при наведении */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--crm-border)]">
                <th className="text-left py-3 px-4 text-xs font-medium text-crm-textMuted">Дата</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-crm-textMuted">Авто</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-crm-textMuted">Клиент</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-crm-textMuted">Итого</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-crm-textMuted">
                    Нет заказов
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[var(--crm-border)]/50 hover:bg-[var(--crm-surface)]/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-crm-text">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-crm-text">
                      {order.brand} {order.model}, {order.year}
                    </td>
                    <td className="py-3 px-4 text-sm text-crm-text">
                      {order.clientName || '—'} {order.clientPhone ? `· ${order.clientPhone}` : ''}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-crm-accent">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/crm/orders/${order.id}`}
                        className="inline-flex text-crm-textMuted hover:text-crm-accent transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
