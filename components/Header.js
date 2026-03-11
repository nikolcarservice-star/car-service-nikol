'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, ChevronDown, Languages, Phone, Wrench } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_RAW, LANGUAGES } from '../constants/translations';
import { getServiceNavItems } from '../data/services';

export default function Header({ lang, t }) {
  const nav = t.navigation;
  const pathname = usePathname() || '/';

  const segments = pathname.split('/').filter(Boolean);
  const currentLangSegment =
    segments[0] === LANGUAGES.PL || segments[0] === LANGUAGES.RU ? segments[0] : LANGUAGES.PL;
  const restPath = segments.slice(1).join('/');

  const buildPath = (targetLang, subPath = '') =>
    `/${targetLang}${subPath ? `/${subPath}` : ''}`;

  const servicesNav = getServiceNavItems(lang);

  const currentLang = lang || currentLangSegment;

  const bookHref = buildPath(currentLang) + '#' + (t.bookingId || 'booking');

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/95 shadow-lg shadow-black/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:py-3.5">
        <div className="flex items-center gap-3">
          <Link
            href={buildPath(currentLang)}
            className="group flex items-center gap-3 rounded-xl transition-opacity hover:opacity-90"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 shadow-lg shadow-orange-500/25 ring-1 ring-white/10 transition group-hover:shadow-orange-500/30">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950/80 text-orange-200">
                <Wrench className="h-5 w-5" />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500">
                Car Service
              </span>
              <span className="text-lg font-bold tracking-tight text-white">Nikol</span>
              <span className="text-[10px] text-gray-500">Jastrowo · Szamotuły</span>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 text-sm md:flex">
          <Link
            href={buildPath(currentLang)}
            className="rounded-lg px-3 py-2 text-gray-300 transition-colors hover:bg-white/5 hover:text-orange-400"
          >
            {nav.home}
          </Link>
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-gray-300 transition-colors hover:bg-white/5 hover:text-orange-400"
            >
              <span>{nav.services}</span>
              <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-0 top-full mt-0.5 min-w-[220px] rounded-xl border border-slate-700/80 bg-slate-900/98 p-2 opacity-0 shadow-xl shadow-black/30 backdrop-blur transition duration-200 group-hover:visible group-hover:opacity-100">
              <Link
                href={buildPath(currentLang, 'services')}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-gray-200 transition-colors hover:bg-orange-500/15 hover:text-orange-300"
              >
                <Wrench className="h-4 w-4 text-orange-400" />
                <span>{nav.servicesAll ?? 'Wszystkie usługi'}</span>
              </Link>
              <div className="my-1 h-px bg-slate-700" />
              {servicesNav.map((item) => (
                <Link
                  key={item.slug}
                  href={buildPath(currentLang, `services/${item.slug}`)}
                  className="block rounded-lg px-3 py-2 text-gray-200 transition-colors hover:bg-orange-500/15 hover:text-orange-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <Link
            href={buildPath(currentLang, 'about')}
            className="rounded-lg px-3 py-2 text-gray-300 transition-colors hover:bg-white/5 hover:text-orange-400"
          >
            {nav.about ?? 'O nas'}
          </Link>
          <Link
            href={buildPath(currentLang, 'contact')}
            className="rounded-lg px-3 py-2 text-gray-300 transition-colors hover:bg-white/5 hover:text-orange-400"
          >
            {nav.contact ?? 'Kontakt'}
          </Link>
          <Link
            href={buildPath(currentLang, 'cennik')}
            className="rounded-lg px-3 py-2 text-gray-300 transition-colors hover:bg-white/5 hover:text-orange-400"
          >
            {nav.cennik ?? 'Cennik'}
          </Link>
          <Link
            href={buildPath(currentLang, 'blog')}
            className="rounded-lg px-3 py-2 text-gray-300 transition-colors hover:bg-white/5 hover:text-orange-400"
          >
            {nav.blog ?? 'Blog'}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            aria-label={nav.languageToggleLabel}
            className="flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-1.5 text-xs font-medium text-gray-200 shadow-inner"
          >
            <Languages className="h-3.5 w-3.5 shrink-0 text-orange-400/90" />
            <Link
              href={buildPath(LANGUAGES.PL, restPath)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                currentLang === LANGUAGES.PL
                  ? 'bg-orange-500 text-slate-950 shadow-sm'
                  : 'text-gray-400 hover:text-orange-400'
              }`}
            >
              PL
            </Link>
            <Link
              href={buildPath(LANGUAGES.RU, restPath)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                currentLang === LANGUAGES.RU
                  ? 'bg-orange-500 text-slate-950 shadow-sm'
                  : 'text-gray-400 hover:text-orange-400'
              }`}
            >
              RU
            </Link>
          </div>

          <a
            href={`tel:${PHONE_RAW}`}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/30 ring-2 ring-orange-400/30 transition hover:from-orange-400 hover:to-amber-400 hover:shadow-orange-500/40 hover:ring-orange-400/50 sm:px-4 sm:text-sm"
            title={nav.phoneCta}
          >
            <Phone className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
          </a>

          <Link
            href={bookHref}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/30 ring-2 ring-orange-400/30 transition hover:from-orange-400 hover:to-amber-400 hover:shadow-orange-500/40 hover:ring-orange-400/50 sm:px-4 sm:text-sm"
            title={nav.bookCta ?? 'Umów wizytę'}
          >
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{nav.bookCta ?? 'Umów wizytę'}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

