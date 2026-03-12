'use client';

/**
 * CRM 1.1 — Скелетон при загрузке блоков.
 * Визуальная логика: пульсирующая прозрачность, скругление как у контента.
 */
export function Skeleton({ className = '', width, height }) {
  const style = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`rounded-crm bg-crm-surface/80 crm-skeleton ${className}`}
      style={style}
      aria-hidden
    />
  );
}

/** Скелетон для строки таблицы */
export function SkeletonRow({ cols = 4 }) {
  return (
    <div className="flex gap-3 py-3 border-b border-[var(--crm-border)]">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="flex-1 h-5" />
      ))}
    </div>
  );
}
