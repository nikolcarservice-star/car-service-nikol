'use client';

import { Card } from '@/components/crm/Card';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold text-crm-text">Настройки</h1>
      <Card>
        <p className="text-sm text-crm-textMuted">
          Раздел в разработке. Здесь будут настройки цен, языка и учётных записей.
        </p>
      </Card>
    </div>
  );
}
