'use client';

/**
 * CRM 1.1 — Атомарная кнопка.
 * Визуальная логика: акцентная (оранжевая) для primary, нейтральная для secondary/ghost.
 * Hover: лёгкое усиление тени и яркости. Микро-анимация через transition.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-crm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-crm-accent focus:ring-offset-2 focus:ring-offset-[var(--crm-bg)] disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    primary:
      'bg-crm-accent hover:bg-[#ea580c] text-white shadow-crm-btn hover:shadow-[0_4px_12px_-2px_rgba(249,115,22,0.45)]',
    secondary:
      'bg-crm-surface hover:bg-crm-surfaceHover text-crm-text border border-crm-border',
    ghost:
      'bg-transparent hover:bg-white/5 text-crm-textMuted hover:text-crm-text',
    danger:
      'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-[10px]',
    md: 'px-4 py-2.5 text-sm rounded-crm',
    lg: 'px-5 py-3 text-base rounded-crm-lg',
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      data-crm-interactive
      {...props}
    >
      {children}
    </button>
  );
}
