'use client';

/**
 * CRM 1.1 — Поле ввода.
 * Визуальная логика: фон поверхности, мягкая граница, фокус — оранжевое кольцо.
 * Без жёстких рамок, карточный вид (rounded-crm).
 */
export function Input({
  label,
  error,
  className = '',
  containerClassName = '',
  ...props
}) {
  const inputClass =
    'w-full px-3 py-2.5 rounded-crm bg-[var(--crm-surface)] border border-[var(--crm-border)] text-crm-text placeholder-crm-textMuted/70 text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-crm-accent focus:border-transparent';

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-medium text-crm-textMuted">
          {label}
        </label>
      )}
      <input
        className={`${inputClass} ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''} ${className}`}
        data-crm-interactive
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
