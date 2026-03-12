'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CrmProvider, useCrm } from './CrmContext';
import { Sidebar } from '@/components/crm/Sidebar';
import { Header } from '@/components/crm/Header';
import { LoginForm } from './LoginForm';

function CrmLayoutInner({ children }) {
  const { user, language, setLanguage, logout } = useCrm();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  const handleSearch = (query) => {
    if (!query) return;
    router.push(`/crm/orders?q=${encodeURIComponent(query)}`);
  };

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="crm-root flex h-screen w-full bg-[var(--crm-bg)] text-crm-text">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        language={language}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          language={language}
          onLanguageChange={setLanguage}
          onLogout={logout}
          onSearch={handleSearch}
        />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}

export default function CrmLayout({ children }) {
  return (
    <CrmProvider>
      <CrmLayoutInner>{children}</CrmLayoutInner>
    </CrmProvider>
  );
}
