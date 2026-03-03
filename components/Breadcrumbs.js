'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  const lastIndex = items.length - 1;

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-xs text-gray-400 sm:mb-5 sm:text-sm">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === lastIndex;
          return (
            <li key={item.href ?? index} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-3 w-3 text-slate-600" />}
              {isLast || !item.href ? (
                <span className="font-medium text-gray-300">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-400 transition hover:text-orange-300"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

