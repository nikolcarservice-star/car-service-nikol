'use client';

import { LayoutDashboard, FilePlus, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/crm/Card';
import { Button } from '@/components/crm/Button';
import { CRM_BASE_PATH } from '@/lib/crm-base-path';

export default function CrmDashboardPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-crm-text">Рабочий стол</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card hover className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-crm-textMuted">
            <FilePlus className="w-5 h-5" />
            <span className="text-sm">Новый заказ</span>
          </div>
          <p className="text-xs text-crm-textMuted">
            Создать заказ-наряд для клиента
          </p>
          <Link href={`${CRM_BASE_PATH}/order/new`}>
            <Button variant="primary" size="sm">Создать</Button>
          </Link>
        </Card>
        <Card hover className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-crm-textMuted">
            <ClipboardList className="w-5 h-5" />
            <span className="text-sm">Заказы</span>
          </div>
          <p className="text-xs text-crm-textMuted">
            Список всех заказов
          </p>
          <Link href={`${CRM_BASE_PATH}/orders`}>
            <Button variant="secondary" size="sm">Открыть</Button>
          </Link>
        </Card>
        <Card hover className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-crm-textMuted">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm">Аналитика</span>
          </div>
          <p className="text-xs text-crm-textMuted">
            Выручка и отчёты
          </p>
          <Link href={`${CRM_BASE_PATH}/analytics`}>
            <Button variant="secondary" size="sm">Открыть</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
