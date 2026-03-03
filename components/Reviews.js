'use client';

import Script from 'next/script';

export default function Reviews() {
  return (
    <section className="border-t border-slate-800 bg-slate-950">
      {/* Elfsight Google Reviews */}
      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="lazyOnload"
        data-elfsight-app-lazy={true}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="elfsight-app-01bab1b0-1b40-4f37-afbd-bf43e70f0b46" data-elfsight-app-lazy />
      </div>
    </section>
  );
}

