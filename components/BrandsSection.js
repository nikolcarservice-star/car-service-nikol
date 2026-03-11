'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import brandLogos from '../data/brandLogos';

const cardClass =
  'group flex shrink-0 flex-col items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800/90 px-3 py-5 shadow-lg transition-all duration-200 hover:border-orange-500/60 hover:shadow-[0_0_20px_rgba(249,115,22,0.25)] sm:py-6';

function BrandCard({ brand, index }) {
  const imgSrc = `/images/brands/${brand.id}.png`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className={`w-[100px] sm:w-[110px] ${cardClass}`}
    >
      <div className="relative flex h-14 w-14 items-center justify-center transition-opacity group-hover:opacity-95 sm:h-16 sm:w-16">
        <Image
          src={imgSrc}
          alt={brand.name}
          width={56}
          height={56}
          className="object-contain"
        />
      </div>
      <span className="mt-3 text-center text-xs font-medium text-white sm:text-sm">
        {brand.name}
      </span>
    </motion.div>
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
          className="mt-8 flex flex-nowrap justify-center gap-3 overflow-x-auto pb-2 sm:gap-4"
        >
          {brandLogos.map((brand, i) => (
            <BrandCard key={brand.id} brand={brand} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
