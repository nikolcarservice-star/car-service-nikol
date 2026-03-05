'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Calendar, X } from 'lucide-react';
import { getTranslations, PHONE_RAW } from '../constants/translations';

const STORAGE_KEY = 'car-service-nikol-prompt-seen';
const DELAY_MS = 25000; // 25 секунд

const GA_EVENT_CATEGORY = 'cta_prompt';

function trackEvent(action, label = '') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: GA_EVENT_CATEGORY,
      event_label: label,
    });
  }
}

export default function DelayedPrompt({ lang }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname() || '';

  const currentLang = pathname.startsWith('/ru') ? 'ru' : 'pl';
  const t = getTranslations(currentLang);
  const prompt = t.prompt;
  const basePath = currentLang === 'ru' ? '/ru' : '/pl';
  const bookingId = t.bookingId || 'booking';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => {
      setVisible(true);
      trackEvent('prompt_shown', pathname || '/');
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, [mounted, pathname]);

  const handleClose = () => {
    setVisible(false);
    trackEvent('prompt_closed');
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (_) {}
  };

  const handleCallClick = () => {
    trackEvent('call_click');
    handleClose();
  };

  const handleBookClick = () => {
    trackEvent('book_click', 'contact_page');
    handleClose();
  };

  const handleFormLinkClick = () => {
    trackEvent('form_link_click');
    handleClose();
    const el = document.getElementById(bookingId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = `${basePath}#${bookingId}`;
    }
  };

  if (!prompt?.title) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="prompt-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={handleClose}
            aria-hidden
          />
          <motion.div
            key="prompt-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="prompt-title"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl border border-slate-600/80 bg-gradient-to-b from-slate-900 to-slate-900/95 shadow-2xl shadow-black/50 ring-2 ring-orange-500/20"
          >
            <div className="relative p-6 sm:p-8">
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-3 top-3 rounded-lg p-2 text-gray-400 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                aria-label={prompt.close}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="pr-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">
                  Car Service Nikol
                </p>
                <h2 id="prompt-title" className="text-xl font-bold text-white sm:text-2xl leading-tight">
                  {prompt.title}
                </h2>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                  {prompt.text}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <a
                  href={`tel:+${PHONE_RAW}`}
                  onClick={handleCallClick}
                  className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-400 hover:to-orange-500 hover:shadow-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <Phone className="h-5 w-5 shrink-0" />
                  {prompt.ctaCall}
                </a>
                <Link
                  href={`${basePath}/contact`}
                  onClick={handleBookClick}
                  className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-xl border-2 border-orange-500/60 bg-slate-800/90 px-5 py-4 text-base font-bold text-white transition hover:border-orange-400 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <Calendar className="h-5 w-5 shrink-0" />
                  {prompt.ctaBook}
                </Link>
              </div>

              <p className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleFormLinkClick}
                  className="text-sm text-gray-400 underline decoration-gray-500 underline-offset-2 transition hover:text-orange-400 hover:decoration-orange-500"
                >
                  {currentLang === 'ru' ? 'Или перейти к форме записи' : 'Lub przejdź do formularza'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
