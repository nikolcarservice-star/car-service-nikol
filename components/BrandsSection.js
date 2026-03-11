'use client';

import { motion } from 'framer-motion';

export default function BrandsSection({ t }) {
  const brands = t.brands;
  if (!brands?.names?.length) return null;

  return (
    <section className="border-b border-slate-800 bg-slate-950" aria-labelledby="brands-title">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h2 id="brands-title" className="text-lg font-semibold text-gray-100 sm:text-xl">
            {brands.title}
          </h2>
          <p className="mt-1 text-sm text-gray-400">{brands.subtitle}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3"
        >
          {brands.names.map((name, i) => (
            <span
              key={name}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 backdrop-blur-sm transition hover:border-orange-500/40 hover:text-orange-300"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
