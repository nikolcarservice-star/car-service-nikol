'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import brandLogos from '../data/brandLogos';

const ITEM_WIDTH_PERCENT = 10; // 10 items, track 100% → each 10%; scroll by 1 item = -10%
const SCROLL_SPEED = 0.05; // % per frame, ~3% per sec → один круг ~30 сек
const FPS = 60;

function BrandCard({ brand }) {
  const imgSrc = `/images/brands/${brand.id}.png`;
  return (
    <div className="group flex h-[120px] flex-col items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800/90 px-2 py-4 shadow-lg transition-all duration-200 hover:border-orange-500/60 hover:shadow-[0_0_20px_rgba(249,115,22,0.25)] sm:h-[130px] sm:py-5">
      <div className="relative h-14 w-14 flex-shrink-0 transition-opacity group-hover:opacity-95 sm:h-16 sm:w-16">
        <Image
          src={imgSrc}
          alt={brand.name}
          fill
          sizes="64px"
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
  const [order, setOrder] = useState(() => brandLogos.map((_, i) => i));
  const [offset, setOffset] = useState(0);
  const rafRef = useRef(null);
  const lastRef = useRef(0);

  useEffect(() => {
    const animate = (now) => {
      lastRef.current = lastRef.current || now;
      const elapsed = (now - lastRef.current) / 1000;
      lastRef.current = now;
      setOffset((prev) => {
        let next = prev - SCROLL_SPEED * 60 * elapsed;
        if (next <= -ITEM_WIDTH_PERCENT) {
          setOrder((o) => [...o.slice(1), o[0]]);
          return 0;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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
          <div
            className="brands-track flex gap-3 sm:gap-4"
            style={{
              width: '200%',
              transform: `translateX(${offset}%)`,
            }}
          >
            {order.map((index) => {
              const brand = brandLogos[index];
              return (
                <div key={brand.id} className="brands-marquee-card">
                  <BrandCard brand={brand} />
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .brands-track {
          will-change: transform;
        }
        .brands-marquee-card {
          flex: 0 0 10%;
          min-width: 0;
        }
      `}</style>
    </section>
  );
}
