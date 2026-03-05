'use client';

import { motion } from 'framer-motion';

export default function AboutBlock({ t }) {
  const about = t.aboutBlock;
  if (!about) return null;

  return (
    <section
      id="about-block"
      className="border-b border-slate-800 bg-slate-950"
      aria-labelledby="about-block-title"
    >
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl sm:p-8"
        >
          <h2
            id="about-block-title"
            className="text-xl font-bold tracking-tight text-white sm:text-2xl"
          >
            {about.title}
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-gray-300 sm:text-base">
            <p>{about.paragraph1}</p>
            <p>{about.paragraph2}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
