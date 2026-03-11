'use client';

import { motion } from 'framer-motion';
import brandLogos from '../data/brandLogos';

function BrandIcon({ path }) {
  return (
    <svg
      className="h-9 w-9 shrink-0 sm:h-10 sm:w-10"
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
    <section
      className="border-b border-slate-800 bg-[#0e0e14]"
      aria-labelledby="brands-title"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h2
            id="brands-title"
            className="text-xl font-semibold text-white sm:text-2xl"
          >
            {brands.title}
          </h2>
          <p className="mt-2 text-sm text-gray-400">{brands.subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          {brandLogos.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="group flex min-w-[100px] max-w-[120px] flex-1 flex-col items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800/90 px-4 py-5 shadow-lg transition-all duration-200 hover:border-orange-500/60 hover:shadow-[0_0_20px_rgba(249,115,22,0.25)] sm:min-w-[110px] sm:py-6"
            >
              <div className="flex h-14 w-14 items-center justify-center text-gray-400 transition-colors duration-200 group-hover:text-white sm:h-16 sm:w-16">
                <BrandIcon path={brand.path} />
              </div>
              <span className="mt-3 text-center text-xs font-medium text-white sm:text-sm">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
