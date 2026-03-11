'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Send } from 'lucide-react';
import { translations, PHONE_DISPLAY, PHONE_RAW } from '../constants/translations';

export default function LocationSection({ lang }) {
  const t = translations[lang].location;

  // Embed: Wernisażowa 21, Jastrowo (place)
  const mapEmbedUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2419.658250238475!2d16.5413491!3d52.5714312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470438d011197777%3A0x6b82504818617777!2sWernisa%C5%BCowa%2021%2C%2064-500%20Jastrowo!5e0!3m2!1spl!2spl!4v1710000000000!5m2!1spl!2spl';

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

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-2xl gradient-border"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 bg-slate-900/80 px-4 py-3 text-xs text-gray-200 sm:text-sm">
              <div className="flex flex-col">
                <span className="font-semibold">
                  {lang === 'ru'
                    ? 'Car Service Nikol – адрес сервиса'
                    : 'Car Service Nikol – adres serwisu'}
                </span>
                <span className="text-[11px] text-gray-400">
                  Wernisażowa 21, 64-500 Jastrowo
                </span>
              </div>
              <a
                href="https://www.google.com/maps/place/Wernisa%C5%BCowa+21,+64-500+Jastrowo/@52.5908375,16.5384497,17z"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1.5 text-[11px] font-semibold text-slate-950 shadow-glow hover:bg-orange-400"
              >
                {lang === 'ru' ? 'Открыть в Картах' : 'Otwórz w Mapach'}
              </a>
            </div>
            <div className="bg-slate-900">
              <iframe
                title={lang === 'ru' ? 'Карта – адрес сервиса' : 'Mapa dojazdu – adres serwisu'}
                src={mapEmbedUrl}
                width="100%"
                height="360"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[360px] w-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/90 p-4 text-xs text-gray-300 shadow-xl sm:p-6 sm:text-sm"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                {t.addressLabel}
              </p>
              <p className="mt-1 text-gray-100">{t.addressValue}</p>
              <p className="mt-1 text-[11px] text-gray-400">{t.mapNote}</p>
            </div>

            <div className="space-y-2 rounded-2xl bg-slate-900/80 p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-gray-100">
                <Phone className="h-4 w-4 text-orange-400" />
                <span>{PHONE_DISPLAY}</span>
              </p>
              <p className="text-[11px] text-gray-400">
                {lang === 'ru'
                  ? 'Звоните или напишите нам в мессенджерах — договоримся о времени визита.'
                  : 'Zadzwoń lub napisz w komunikatorach – ustalimy wygodny termin wizyty.'}
              </p>
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
                href="https://t.me/+48794935734"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-semibold text-gray-100 shadow-md hover:border-orange-500 hover:text-orange-300"
              >
                <Send className="h-4 w-4 text-orange-400" />
                <span>{t.telegram}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

