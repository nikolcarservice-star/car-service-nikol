'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  Users,
  Package,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CRM_BASE_PATH } from '@/lib/crm-base-path';

const navItems = [
  { path: '', labelKey: 'dashboard', icon: LayoutDashboard },
  { path: '/order/new', labelKey: 'new_order', icon: FilePlus },
  { path: '/orders', labelKey: 'orders', icon: ClipboardList },
  { path: '/clients', labelKey: 'clients', icon: Users },
  { path: '/stock', labelKey: 'stock', icon: Package },
  { path: '/analytics', labelKey: 'analytics', icon: BarChart3 },
  { path: '/settings', labelKey: 'settings', icon: Settings },
];

const labels = {
  ru: {
    dashboard: 'Рабочий стол',
    new_order: 'Новый заказ',
    orders: 'Заказы',
    clients: 'Клиенты и авто',
    stock: 'Склад',
    analytics: 'Аналитика',
    settings: 'Настройки',
  },
  pl: {
    dashboard: 'Pulpit',
    new_order: 'Nowe zlecenie',
    orders: 'Zlecenia',
    clients: 'Klienci i pojazdy',
    stock: 'Magazyn',
    analytics: 'Analityka',
    settings: 'Ustawienia',
  },
};

export function Sidebar({ collapsed, onToggle, language = 'ru' }) {
  const pathname = usePathname();
  const t = labels[language] || labels.ru;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="flex flex-col shrink-0 h-full bg-[var(--crm-surface)] border-r border-[var(--crm-border)] overflow-hidden"
    >
      {/* Кнопка сворачивания — визуально в боковой панели */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--crm-border)] min-h-[56px]">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 min-w-0"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-crm bg-crm-accent text-white font-bold text-lg shadow-crm-btn">
                N
              </div>
              <span className="text-sm font-semibold text-crm-text truncate">
                Nikol CRM
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={onToggle}
          className="p-1.5 rounded-crm text-crm-textMuted hover:text-crm-text hover:bg-white/5 transition-colors"
          aria-label={collapsed ? 'Развернуть меню' : 'Свернуть меню'}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => {
          const href = CRM_BASE_PATH + item.path;
          const crmPath = '/crm' + item.path;
          const isActive =
            pathname === crmPath ||
            (item.path !== '' && pathname.startsWith(crmPath));
          const Icon = item.icon;
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 mx-2 rounded-crm
                transition-colors duration-150
                ${isActive ? 'bg-crm-accent/15 text-crm-accent' : 'text-crm-textMuted hover:bg-white/5 hover:text-crm-text'}
              `}
              data-crm-interactive
            >
              <Icon className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {t[item.labelKey]}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
