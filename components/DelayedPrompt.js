'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Calendar, X } from 'lucide-react';
import { getTranslations, PHONE_RAW } from '../constants/translations';

const STORAGE_KEY = 'car-service-nikol-prompt-seen';
const DELAY_MS = 25000; // 25 секунд

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
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, [mounted]);

  const handleClose = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (_) {}
  };

  const handleBookClick = () => {
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
        <>
          <motion.div
            key="prompt-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden
          />
          <motion.div
            key="prompt-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="prompt-title"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
          >
            <div className="relative p-5 sm:p-6">
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-3 top-3 rounded-lg p-1.5 text-gray-400 transition hover:bg-slate-800 hover:text-gray-200"
                aria-label={prompt.close}
              >
                <X className="h-5 w-5" />
              </button>

              <h2 id="prompt-title" className="pr-8 text-lg font-semibold text-gray-50 sm:text-xl">
                {prompt.title}
              </h2>
              <p className="mt-2 text-sm text-gray-300">{prompt.text}</p>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-3">
                <a
                  href={`tel:+${PHONE_RAW}`}
                  onClick={handleClose}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-orange-400"
                >
                  <Phone className="h-4 w-4" />
                  {prompt.ctaCall}
                </a>
                <Link
                  href={`${basePath}/contact`}
                  onClick={handleClose}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-gray-100 transition hover:border-orange-500/50 hover:bg-slate-800"
                >
                  <Calendar className="h-4 w-4" />
                  {prompt.ctaBook}
                </Link>
              </div>

              <p className="mt-3 text-center">
                <button
                  type="button"
                  onClick={handleBookClick}
                  className="text-xs text-gray-500 underline decoration-gray-600 underline-offset-2 hover:text-orange-400 hover:decoration-orange-500"
                >
                  {currentLang === 'ru' ? 'Или перейти к форме записи' : 'Lub przejdź do formularza'}
                </button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
