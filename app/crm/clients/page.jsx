'use client';

import { Card } from '@/components/crm/Card';

export default function ClientsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold text-crm-text">Клиенты и авто</h1>
      <Card>
        <p className="text-sm text-crm-textMuted">
          Раздел в разработке. Здесь будет список клиентов и автомобилей.
        </p>
      </Card>
    </div>
  );
}
