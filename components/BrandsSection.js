'use client';

import { motion } from 'framer-motion';
import brandLogos from '../data/brandLogos';

function BrandIcon({ path }) {
  return (
    <svg
      className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d={path} />
    </svg>
  );
}

export default function BrandsSection({ t }) {
  const brands = t.brands;
  if (!brands?.title) return null;

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
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-5 lg:grid-cols-10"
        >
          {brandLogos.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="group flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-orange-500/40 hover:bg-white/10 hover:shadow-lg hover:shadow-orange-500/10"
            >
              <div className="flex h-12 w-12 items-center justify-center text-gray-400 transition-colors duration-200 group-hover:text-orange-400 sm:h-14 sm:w-14">
                <BrandIcon path={brand.path} />
              </div>
              <span className="mt-2 text-center text-xs font-medium text-gray-300 transition-colors duration-200 group-hover:text-orange-300 sm:text-sm">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
