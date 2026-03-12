'use client';

/**
 * CRM 1.1 — Карточка (Glassmorphism).
 * Визуальная логика: полупрозрачный фон, размытие при наведении, скругление 10–14px, мягкая тень.
 */
export function Card({
  children,
  className = '',
  hover = false,
  padding = true,
  ...props
}) {
  const paddingClass = padding ? 'p-4' : '';
  return (
    <div
      className={`
        rounded-crm-lg bg-[var(--crm-glass)] backdrop-blur-crm
        border border-[var(--crm-border)]
        shadow-crm-card
        ${hover ? 'hover:shadow-crm-card-hover hover:bg-[var(--crm-surface)]/90 transition-all duration-200' : ''}
        ${paddingClass}
        ${className}
      `}
      data-crm-interactive={hover ? 'true' : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

/** Заголовок карточки — отдельный блок для единообразия */
export function CardHeader({ title, action, className = '' }) {
  return (
    <div
      className={`flex items-center justify-between gap-2 border-b border-[var(--crm-border)] pb-3 mb-3 ${className}`}
    >
      <h3 className="text-sm font-semibold text-crm-text">{title}</h3>
      {action && <div>{action}</div>}
    </div>
  );
}
