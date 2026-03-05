'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  Disc,
  Gauge,
  Key,
  MapPin,
  Oil,
  Wrench,
  Circle,
} from 'lucide-react';

const iconMap = {
  suspension: Wrench,
  oil: Oil,
  brakes: Disc,
  diagnostics: Activity,
  timing: Gauge,
  tires: Circle,
  mobileService: MapPin,
  keys: Key,
};

// Локальные картинки из /public/images/services/ — подставь свои файлы под услуги
const imageMap = {
  suspension: '/images/services/suspension.jpg',
  oil: '/images/services/oil.jpg',
  brakes: '/images/services/brakes.jpg',
  diagnostics: '/images/services/diagnostics.jpg',
  timing: '/images/services/timing.jpg',
  tires: '/images/services/mechanic-changing-tires-car-service.jpg',
  mobileService: '/images/services/emergency-auto-mechanic-changing-flat-tire-road.jpg',
  keys: '/images/services/high-angle-hand-holding-car-key.jpg',
};

export default function Services({ t }) {
  const services = t.services;

  return (
    <section id={t.servicesId} className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-8 max-w-2xl"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-gray-50 sm:text-3xl">
            {services.title}
          </h2>
          <p className="mt-2 text-sm text-gray-300 sm:text-base">{services.subtitle}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.list.map((service) => {
            const Icon = iconMap[service.key] || Wrench;
            const imageUrl = imageMap[service.key];
            const isMobileService = service.key === 'mobileService';

            return (
              <motion.article
                key={service.key}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-xl transition hover:-translate-y-1 hover:border-orange-500/70 hover:shadow-glow"
              >
                {imageUrl && (
                  <div className="relative h-48 w-full overflow-hidden border-b border-white/10 bg-slate-900/60">
                    <img
                      src={imageUrl}
                      alt={`${service.name} (${service.nameRu})`}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"
                      aria-hidden
                    />
                    {isMobileService && (
                      <span
                        className="absolute right-3 top-3 flex h-3 w-3"
                        aria-hidden
                      >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                      </span>
                    )}
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-orange-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-50 sm:text-base">
                        <span className="font-bold">{service.name}</span>{' '}
                        <span className="font-normal text-gray-400">({service.nameRu})</span>
                      </h3>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-gray-300 sm:text-sm">
                    {service.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
