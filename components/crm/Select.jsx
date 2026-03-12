'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CRM 1.1 — Современный dropdown в виде карточки.
 * Плавная анимация при раскрытии списка, без жёстких рамок.
 */
export function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Выберите',
  className = '',
  containerClassName = '',
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <div ref={ref} className={`relative ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-medium text-crm-textMuted mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`
          w-full flex items-center justify-between gap-2
          px-3 py-2.5 rounded-crm
          bg-[var(--crm-surface)] border border-[var(--crm-border)]
          text-sm text-left text-crm-text
          hover:border-crm-textMuted/30 hover:bg-[var(--crm-surface-hover)]
          focus:outline-none focus:ring-2 focus:ring-crm-accent focus:border-transparent
          transition-all duration-150
          ${className}
        `}
        data-crm-interactive
      >
        <span className={value ? '' : 'text-crm-textMuted'}>{selectedLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-crm-textMuted shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-1 w-full rounded-crm-lg bg-[var(--crm-surface)] border border-[var(--crm-border)] shadow-crm-card max-h-56 overflow-y-auto py-1"
          >
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`
                    w-full px-3 py-2.5 text-left text-sm
                    hover:bg-crm-accent/15 hover:text-crm-accent
                    transition-colors
                    ${value === opt.value ? 'bg-crm-accent/10 text-crm-accent' : 'text-crm-text'}
                  `}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
