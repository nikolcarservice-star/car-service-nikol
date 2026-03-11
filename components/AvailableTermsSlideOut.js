'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AvailableTermsSlideOut({
  sundayBadge,
  bookCtaLabel,
  bookingHref,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Tab przy krawędzi ekranu — klik otwiera panel (ukryty gdy panel otwarty) */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed right-0 top-32 z-30 flex h-12 w-10 items-center justify-center rounded-l-xl border-2 border-l-0 border-emerald-500/70 bg-emerald-600/90 text-emerald-100 shadow-lg transition hover:bg-emerald-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 sm:top-36"
          aria-label={sundayBadge}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Panel wysuwany z prawej */}
      <div
        className="fixed right-0 top-24 z-30 flex h-[calc(100vh-6rem)] w-full max-w-[280px] flex-col rounded-l-xl border-2 border-l-0 border-emerald-500/70 shadow-2xl transition-transform duration-300 ease-out sm:top-28"
        style={{
          backgroundColor: '#0f172a',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: open ? '0 25px 50px -12px rgb(0 0 0 / 0.5)' : 'none',
        }}
        role="dialog"
        aria-label={sundayBadge}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-bold text-emerald-100">
            <CalendarDays className="h-4 w-4 text-emerald-400" />
            Terminy
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Zamknij"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="text-sm font-bold text-emerald-100 sm:text-base">
            {sundayBadge}
          </p>
          <Link
            href={bookingHref}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500/30 px-4 py-2.5 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/40"
          >
            <CalendarDays className="h-4 w-4" />
            {bookCtaLabel}
          </Link>
        </div>
      </div>

      {/* Overlay — klik zamyka panel (tylko gdy otwarty) */}
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
          aria-label="Zamknij"
        />
      )}
    </>
  );
}
