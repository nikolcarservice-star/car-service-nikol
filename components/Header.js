'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { CalendarDays, ChevronDown, Languages, Menu, Phone, Wrench, X } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_TEL_HREF, LANGUAGES, getPhoneContactPageHref } from '../constants/translations';
import { GALLERY_ENABLED, RUSSIAN_LOCALE_ENABLED } from '../constants/localeConfig';
import { getServiceNavItems } from '../data/services';

function HeaderContent({ lang, t, querySuffix = '' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const nav = t.navigation;
  const pathname = usePathname() || '/';

  const segments = pathname.split('/').filter(Boolean);
  const currentLangSegment =
    segments[0] === LANGUAGES.PL || segments[0] === LANGUAGES.RU ? segments[0] : LANGUAGES.PL;
  const restPath = segments.slice(1).join('/');

  const buildPath = (targetLang, subPath = '') =>
    `/${targetLang}${subPath ? `/${subPath}` : ''}`;

  /** Zachowuje ?query przy przełączaniu PL ↔ RU (np. ?service=). */
  const langHref = (targetLang) => `${buildPath(targetLang, restPath)}${querySuffix}`;

  const servicesNav = getServiceNavItems(lang);

  const currentLang = lang || currentLangSegment;

  const bookHref = `${buildPath(currentLang)}${querySuffix}#${t.bookingId || 'booking'}`;

  return (
    <header
      className={`sticky top-0 border-b border-slate-800/80 bg-slate-950/95 shadow-md shadow-black/20 backdrop-blur-md ${
        mobileMenuOpen ? 'z-[100]' : 'z-40'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <Link
            href={buildPath(currentLang)}
            className="group flex min-w-0 items-center gap-2 rounded-lg transition-opacity hover:opacity-90 sm:gap-2.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 shadow-md shadow-orange-500/20 ring-1 ring-white/10 transition group-hover:shadow-orange-500/30 sm:h-10 sm:w-10">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950/80 text-orange-200 sm:h-8 sm:w-8">
                <Wrench className="h-4 w-4 sm:h-[17px] sm:w-[17px]" />
              </div>
            </div>
            <div className="min-w-0 flex flex-col leading-none">
              <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-gray-500 sm:text-[9px]">
                Car Service
              </span>
              <span className="text-[15px] font-bold tracking-tight text-white sm:text-base">Nikol</span>
              <span className="truncate text-[8px] text-gray-500 sm:text-[9px]">Jastrowo · Szamotuły</span>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-0.5 text-xs md:flex lg:text-[13px]">
          <Link
            href={buildPath(currentLang)}
            className="rounded-md px-2 py-1.5 text-gray-300 transition-colors hover:bg-white/5 hover:text-orange-400 lg:px-2.5"
          >
            {nav.home}
          </Link>
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-0.5 rounded-md px-2 py-1.5 text-gray-300 transition-colors hover:bg-white/5 hover:text-orange-400 lg:px-2.5"
            >
              <span>{nav.services}</span>
              <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-0 top-full mt-0.5 min-w-[220px] rounded-xl border border-slate-700 bg-slate-900 p-2 opacity-0 shadow-xl shadow-black/50 transition duration-200 group-hover:visible group-hover:opacity-100">
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
            className="rounded-md px-2 py-1.5 text-gray-300 transition-colors hover:bg-white/5 hover:text-orange-400 lg:px-2.5"
          >
            {nav.about ?? 'O nas'}
          </Link>
          {GALLERY_ENABLED && (
            <Link
              href={buildPath(currentLang, 'gallery')}
              className="rounded-md px-2 py-1.5 text-gray-300 transition-colors hover:bg-white/5 hover:text-orange-400 lg:px-2.5"
            >
              {nav.gallery ?? 'Galeria'}
            </Link>
          )}
          <Link
            href={buildPath(currentLang, 'faq')}
            className="rounded-md px-2 py-1.5 text-gray-300 transition-colors hover:bg-white/5 hover:text-orange-400 lg:px-2.5"
          >
            {nav.faq ?? 'FAQ'}
          </Link>
          <Link
            href={buildPath(currentLang, 'contact')}
            className="rounded-md px-2 py-1.5 text-gray-300 transition-colors hover:bg-white/5 hover:text-orange-400 lg:px-2.5"
          >
            {nav.contact ?? 'Kontakt'}
          </Link>
          <Link
            href={buildPath(currentLang, 'cennik')}
            className="rounded-md px-2 py-1.5 text-gray-300 transition-colors hover:bg-white/5 hover:text-orange-400 lg:px-2.5"
          >
            {nav.cennik ?? 'Cennik'}
          </Link>
          <Link
            href={buildPath(currentLang, 'blog')}
            className="rounded-md px-2 py-1.5 text-gray-300 transition-colors hover:bg-white/5 hover:text-orange-400 lg:px-2.5"
          >
            {nav.blog ?? 'Blog'}
          </Link>
        </nav>

        {/* Desktop: language (optional) + phone + book */}
        <div className="hidden items-center gap-1.5 md:flex sm:gap-2">
          {RUSSIAN_LOCALE_ENABLED && (
            <div
              aria-label={nav.languageToggleLabel}
              className="flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/80 px-1.5 py-1 text-xs font-medium text-gray-200 shadow-inner"
            >
              <Languages className="h-3 w-3 shrink-0 text-orange-400/90" />
              <Link
                href={langHref(LANGUAGES.PL)}
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium transition ${
                  currentLang === LANGUAGES.PL
                    ? 'bg-orange-500 text-slate-950 shadow-sm'
                    : 'text-gray-400 hover:text-orange-400'
                }`}
              >
                PL
              </Link>
              <Link
                href={langHref(LANGUAGES.RU)}
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium transition ${
                  currentLang === LANGUAGES.RU
                    ? 'bg-orange-500 text-slate-950 shadow-sm'
                    : 'text-gray-400 hover:text-orange-400'
                }`}
              >
                RU
              </Link>
            </div>
          )}

          <Link
            href={getPhoneContactPageHref(currentLang)}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-md shadow-orange-500/25 ring-1 ring-orange-400/30 transition hover:from-orange-400 hover:to-amber-400 sm:gap-2 sm:px-3 sm:text-xs"
            title={nav.phoneCta}
          >
            <Phone className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span className="hidden lg:inline">{PHONE_DISPLAY}</span>
          </Link>

          <Link
            href={bookHref}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-md shadow-orange-500/25 ring-1 ring-orange-400/30 transition hover:from-orange-400 hover:to-amber-400 sm:gap-2 sm:px-3 sm:text-xs"
            title={nav.bookCta ?? 'Umów wizytę'}
          >
            <CalendarDays className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span className="hidden lg:inline">{nav.bookCta ?? 'Umów wizytę'}</span>
          </Link>
        </div>

        {/* Mobile: duży przycisk tel + menu (min. ~48×48 dla palca) */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <a
            href={PHONE_TEL_HREF}
            className="flex h-12 min-h-[48px] w-12 min-w-[48px] touch-manipulation items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 ring-1 ring-orange-400/30 transition active:scale-[0.97] hover:from-orange-400 hover:to-amber-400"
            aria-label={`${nav.phoneCta} — ${PHONE_DISPLAY}`}
            title={`${nav.phoneCta} — ${PHONE_DISPLAY}`}
          >
            <Phone className="h-6 w-6" strokeWidth={2.25} aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-12 min-h-[48px] w-12 min-w-[48px] touch-manipulation items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-gray-100 transition hover:bg-slate-700 hover:text-orange-400"
            aria-label={nav.openMenu ?? 'Otwórz menu'}
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu: fixed layers + flex scroll (avoids collapse under overflow/min-h on mobile) */}
      {mobileMenuOpen && (
        <div className="md:hidden" aria-modal="true" role="dialog" aria-label={nav.menuLabel ?? 'Menu nawigacji'}>
          <button
            type="button"
            className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-label={nav.closeMenu ?? 'Zamknij menu'}
          />
          <div
            className="fixed inset-y-0 right-0 z-[101] flex h-[100dvh] w-[min(100vw,22rem)] flex-col overflow-hidden border-l-2 border-slate-700 bg-slate-900 shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-4 py-3">
              <span className="text-sm font-semibold text-gray-300">Menu</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition hover:bg-white/5 hover:text-white"
                aria-label={nav.closeMenu ?? 'Zamknij menu'}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto overscroll-contain p-4">
              <Link
                href={buildPath(currentLang)}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-gray-300 hover:bg-white/5 hover:text-orange-400"
              >
                {nav.home}
              </Link>
              <Link
                href={buildPath(currentLang, 'services')}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-gray-300 hover:bg-white/5 hover:text-orange-400"
              >
                {nav.servicesAll ?? 'Wszystkie usługi'}
              </Link>
              {servicesNav.map((item) => (
                <Link
                  key={item.slug}
                  href={buildPath(currentLang, `services/${item.slug}`)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 pl-6 text-gray-400 hover:bg-white/5 hover:text-orange-400"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={buildPath(currentLang, 'about')}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-gray-300 hover:bg-white/5 hover:text-orange-400"
              >
                {nav.about ?? 'O nas'}
              </Link>
              {GALLERY_ENABLED && (
                <Link
                  href={buildPath(currentLang, 'gallery')}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-gray-300 hover:bg-white/5 hover:text-orange-400"
                >
                  {nav.gallery ?? 'Galeria'}
                </Link>
              )}
              <Link
                href={buildPath(currentLang, 'faq')}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-gray-300 hover:bg-white/5 hover:text-orange-400"
              >
                {nav.faq ?? 'FAQ'}
              </Link>
              <Link
                href={buildPath(currentLang, 'contact')}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-gray-300 hover:bg-white/5 hover:text-orange-400"
              >
                {nav.contact ?? 'Kontakt'}
              </Link>
              <Link
                href={buildPath(currentLang, 'cennik')}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-gray-300 hover:bg-white/5 hover:text-orange-400"
              >
                {nav.cennik ?? 'Cennik'}
              </Link>
              <Link
                href={buildPath(currentLang, 'blog')}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-gray-300 hover:bg-white/5 hover:text-orange-400"
              >
                {nav.blog ?? 'Blog'}
              </Link>
              {RUSSIAN_LOCALE_ENABLED && (
                <>
                  <div className="my-3 h-px bg-slate-700" />
                  <div
                    aria-label={nav.languageToggleLabel}
                    className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2.5"
                  >
                    <Languages className="h-4 w-4 shrink-0 text-orange-400/90" />
                    <Link
                      href={langHref(LANGUAGES.PL)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        currentLang === LANGUAGES.PL
                          ? 'bg-orange-500 text-slate-950'
                          : 'text-gray-400 hover:text-orange-400'
                      }`}
                    >
                      PL
                    </Link>
                    <Link
                      href={langHref(LANGUAGES.RU)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        currentLang === LANGUAGES.RU
                          ? 'bg-orange-500 text-slate-950'
                          : 'text-gray-400 hover:text-orange-400'
                      }`}
                    >
                      RU
                    </Link>
                  </div>
                </>
              )}
              <a
                href={PHONE_TEL_HREF}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex min-h-[56px] touch-manipulation items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-4 text-base font-bold text-white active:opacity-95"
              >
                <Phone className="h-6 w-6 shrink-0" strokeWidth={2.25} aria-hidden />
                <span className="flex flex-col items-start leading-tight sm:flex-row sm:items-center sm:gap-2">
                  <span>{nav.phoneCta}</span>
                  <span className="text-sm font-semibold opacity-95 sm:text-base">{PHONE_DISPLAY}</span>
                </span>
              </a>
              <Link
                href={bookHref}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-sm font-bold text-white"
              >
                <CalendarDays className="h-4 w-4" />
                {nav.bookCta ?? 'Umów wizytę'}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function HeaderWithQuery(props) {
  const searchParams = useSearchParams();
  const q = searchParams.toString();
  return <HeaderContent {...props} querySuffix={q ? `?${q}` : ''} />;
}

export default function Header(props) {
  return (
    <Suspense fallback={<HeaderContent {...props} querySuffix="" />}>
      <HeaderWithQuery {...props} />
    </Suspense>
  );
}
