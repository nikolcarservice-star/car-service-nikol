'use client';

import { motion } from 'framer-motion';
import { MapPin, Send } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_RAW, translations } from '../constants/translations';

export default function LocationSection({ lang }) {
  const t = translations[lang].location;

  return (
    <section
      id={translations[lang].locationId}
      className="border-b border-slate-800 bg-slate-950"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-6 max-w-2xl"
        >
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-gray-50 sm:text-3xl">
            <MapPin className="h-6 w-6 text-orange-400" />
            {t.title}
          </h2>
          <p className="mt-2 text-sm text-gray-300 sm:text-base">{t.subtitle}</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl"
          >
            <iframe
              title="Mapa dojazdu Car Service Nikol"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2434.668480626504!2d16.925168!3d52.406374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDI0JzIyLjkiTiAxNsKwNTUnMzAuNiJF!5e0!3m2!1spl!2spl!4v1700000000000"
              width="100%"
              height="260"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-0"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-gray-300 sm:p-6 sm:text-sm"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                {t.addressLabel}
              </p>
              <p className="mt-1 text-gray-100">{t.addressValue}</p>
              <p className="mt-1 text-[11px] text-gray-400">{t.mapNote}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${PHONE_RAW}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md hover:bg-emerald-400"
              >
                <Send className="h-4 w-4" />
                <span>{t.whatsapp}</span>
              </a>
              <a
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-semibold text-gray-100 shadow-md hover:border-orange-500 hover:text-orange-300"
              >
                <Send className="h-4 w-4 text-orange-400" />
                <span>{t.telegram}</span>
              </a>
            </div>

            <p className="text-[11px] text-gray-400">
              WhatsApp:&nbsp;
              <a
                href={`https://wa.me/${PHONE_RAW}`}
                target="_blank"
                rel="noreferrer"
                className="text-orange-300 hover:text-orange-200"
              >
                {PHONE_DISPLAY}
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

