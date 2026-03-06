'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { translations } from '../constants/translations';

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

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl"
        >
          <a
            href="https://www.google.com/maps/place/Wernisa%C5%BCowa+21,+64-500+Jastrowo/@52.5908375,16.5384497,17z"
            target="_blank"
            rel="noreferrer noopener"
            className="mb-2 inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-gray-200 hover:bg-slate-700"
          >
            {lang === 'ru' ? 'Открыть в Картах' : 'Otwórz w Mapach'}
          </a>
          <iframe
            title={lang === 'ru' ? 'Карта – адрес сервиса' : 'Mapa dojazdu – adres serwisu'}
            src={mapEmbedUrl}
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: '15px', filter: 'invert(90%) hue-rotate(180deg)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="border-0"
          />
        </motion.div>
      </div>
    </section>
  );
}

