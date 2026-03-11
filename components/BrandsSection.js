'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import brandLogos from '../data/brandLogos';

const DUPLICATED = [...brandLogos, ...brandLogos];

function BrandCard({ brand }) {
  const imgSrc = `/images/brands/${brand.id}.png`;
  return (
    <div className="group flex h-[120px] flex-col items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800/90 px-2 py-4 shadow-lg transition-all duration-200 hover:border-orange-500/60 hover:shadow-[0_0_20px_rgba(249,115,22,0.25)] sm:h-[130px] sm:py-5">
      <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center transition-opacity group-hover:opacity-95 sm:h-14 sm:w-14">
        <Image
          src={imgSrc}
          alt={brand.name}
          width={56}
          height={56}
          className="object-contain"
        />
      </div>
      <span className="mt-2 line-clamp-1 text-center text-xs font-medium text-white sm:text-sm">
        {brand.name}
      </span>
    </div>
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
          className="mt-8 w-full overflow-hidden"
          aria-label="Марки авто"
        >
          <div className="brands-marquee flex gap-3 sm:gap-4">
            {DUPLICATED.map((brand, i) => (
              <div key={`${brand.id}-${i}`} className="brands-marquee-card">
                <BrandCard brand={brand} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .brands-marquee {
          width: 200%;
          animation: brands-scroll 30s linear infinite;
        }
        .brands-marquee-card {
          flex: 0 0 calc(10% - 0.6rem);
          min-width: 0;
        }
        @keyframes brands-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
