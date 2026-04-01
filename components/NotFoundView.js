'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

/**
 * @param {{ embedded?: boolean }} props
 * embedded — w obrębie layoutu [lang] (bez pełnego ekranu i z mniejszym paddingiem)
 */
export default function NotFoundView({ embedded = false }) {
  const pathname = usePathname() || '';
  const isRu = pathname.startsWith('/ru');
  const homeHref = isRu ? '/ru' : '/pl';
  const otherHref = isRu ? '/pl' : '/ru';
  const otherLabel = isRu ? 'PL' : 'RU';

  const title = isRu ? 'Страница не найдена' : 'Strona nie została znaleziona';
  const lead = isRu
    ? 'Ссылка устарела или страницы не существует. Вернитесь на главную — сервис в Jastrowo и для клиентов из Шамотул.'
    : 'Ten adres mógł się zmienić lub strona nie istnieje. Wróć na stronę główną — serwis w Jastrowo i dla kierowców z Szamotuł.';
  const primaryCta = isRu ? 'Вернуться на главную' : 'Wróć na stronę główną';
  const secondaryHint = isRu ? 'Версия на другом языке:' : 'Druga wersja językowa:';

  const wrap = embedded ? 'py-10 sm:py-14' : 'min-h-screen py-16 sm:py-24';

  return (
    <div className={`${wrap} flex flex-col items-center justify-center px-4 text-center`}>
      <p className="text-5xl font-bold text-orange-500 sm:text-7xl" aria-hidden>
        404
      </p>
      <h1 className="mt-4 text-xl font-semibold text-gray-100 sm:text-2xl">{title}</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-400 sm:text-base">{lead}</p>
      <Link
        href={homeHref}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-orange-400"
      >
        <Home className="h-4 w-4 shrink-0" aria-hidden />
        {primaryCta}
      </Link>
      <p className="mt-6 text-xs text-gray-500">
        {secondaryHint}{' '}
        <Link href={otherHref} className="font-medium text-orange-400 hover:text-orange-300">
          {otherLabel}
        </Link>
      </p>
    </div>
  );
}
