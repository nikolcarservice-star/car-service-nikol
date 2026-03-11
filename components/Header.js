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

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={buildPath(currentLang)} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-glow">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950 text-orange-200">
                <Wrench className="h-5 w-5" />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Car Service
              </span>
              <span className="text-lg font-semibold text-gray-100">Nikol</span>
              <span className="text-[10px] text-gray-500">Jastrowo · Szamotuły</span>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-gray-300 md:flex">
          <Link href={buildPath(currentLang)} className="hover:text-orange-400">
            {nav.home}
          </Link>
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-gray-300 hover:text-orange-400"
            >
              <span>{nav.services}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="invisible absolute left-0 top-full min-w-[220px] rounded-xl border border-slate-800 bg-slate-950/95 p-2 text-xs opacity-0 shadow-xl backdrop-blur transition group-hover:visible group-hover:opacity-100">
              <Link
                href={buildPath(currentLang, 'services')}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-200 hover:bg-slate-900 hover:text-orange-300"
              >
                <Wrench className="h-4 w-4 text-orange-400" />
                <span>{nav.servicesAll ?? 'Wszystkie usługi'}</span>
              </Link>
              <div className="my-1 h-px bg-slate-800" />
              {servicesNav.map((item) => (
                <Link
                  key={item.slug}
                  href={buildPath(currentLang, `services/${item.slug}`)}
                  className="block rounded-lg px-3 py-1.5 text-gray-200 hover:bg-slate-900 hover:text-orange-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link href={buildPath(currentLang, 'about')} className="hover:text-orange-400">
            {nav.about ?? 'O nas'}
          </Link>
          <Link href={buildPath(currentLang, 'contact')} className="hover:text-orange-400">
            {nav.contact ?? 'Kontakt'}
          </Link>
          <Link href={buildPath(currentLang, 'cennik')} className="hover:text-orange-400">
            {nav.cennik ?? 'Cennik'}
          </Link>
          <Link href={buildPath(currentLang, 'blog')} className="hover:text-orange-400">
            {nav.blog ?? 'Blog'}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={buildPath(currentLang) + '#' + (t.bookingId || 'booking')}
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-2 text-xs font-bold text-slate-950 shadow-glow hover:bg-orange-400 sm:px-4 sm:text-sm"
            title={nav.bookCta ?? 'Umów wizytę'}
          >
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{nav.bookCta ?? 'Umów wizytę'}</span>
          </Link>
          <div
            aria-label={nav.languageToggleLabel}
            className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-medium text-gray-200 shadow-sm"
          >
            <Languages className="h-4 w-4 text-orange-400" />
            <Link
              href={buildPath(LANGUAGES.PL, restPath)}
              className={`rounded-full px-2 py-0.5 transition ${
                currentLang === LANGUAGES.PL
                  ? 'bg-orange-500 text-slate-950'
                  : 'text-gray-300 hover:text-orange-400'
              }`}
            >
              PL
            </Link>
            <Link
              href={buildPath(LANGUAGES.RU, restPath)}
              className={`rounded-full px-2 py-0.5 transition ${
                currentLang === LANGUAGES.RU
                  ? 'bg-orange-500 text-slate-950'
                  : 'text-gray-300 hover:text-orange-400'
              }`}
            >
              RU
            </Link>
          </div>

          <a
            href={`tel:${PHONE_RAW}`}
            className="hidden items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-glow hover:bg-orange-400 md:inline-flex"
            title={nav.phoneCta}
          >
            <Phone className="h-4 w-4" />
            <span>{PHONE_DISPLAY}</span>
          </a>
        </div>
      </div>
    </header>
  );
}

