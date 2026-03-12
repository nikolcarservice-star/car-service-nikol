'use client';

import { useState } from 'react';
import { Search, LogOut, Globe, User } from 'lucide-react';
import { Button } from './Button';

const langLabels = { ru: 'RU', pl: 'PL' };

export function Header({
  user = { username: 'admin', role: 'admin' },
  language = 'ru',
  onLanguageChange,
  onLogout,
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchQuery.trim());
  };

  return (
    <header className="h-14 shrink-0 flex items-center justify-between gap-4 px-4 bg-[var(--crm-surface)]/80 backdrop-blur-crm border-b border-[var(--crm-border)]">
      {/* Глобальный поиск по VIN или гос. номерам */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-crm-textMuted pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по VIN или гос. номеру..."
            className="w-full pl-9 pr-3 py-2 rounded-crm bg-[var(--crm-bg)]/80 border border-[var(--crm-border)] text-sm text-crm-text placeholder-crm-textMuted/70 focus:outline-none focus:ring-2 focus:ring-crm-accent focus:border-transparent transition-all"
            data-crm-interactive
          />
        </div>
      </form>

      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-sm text-crm-textMuted">
          <User className="w-4 h-4" />
          <span className="text-crm-text">{user?.username || '—'}</span>
        </span>

        {/* Выбор языка */}
        <div className="flex rounded-crm overflow-hidden border border-[var(--crm-border)]">
          {['ru', 'pl'].map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => onLanguageChange?.(lang)}
              className={`
                px-2.5 py-1.5 text-xs font-medium transition-colors
                ${language === lang ? 'bg-crm-accent text-white' : 'bg-transparent text-crm-textMuted hover:bg-white/5 hover:text-crm-text'}
              `}
            >
              {langLabels[lang] || lang}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-crm-textMuted"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </Button>
      </div>
    </header>
  );
}
