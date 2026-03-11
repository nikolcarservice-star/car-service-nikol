'use client';

import Script from 'next/script';

export default function Reviews() {
  return (
    <section className="border-t border-slate-800 bg-slate-950">
      {/* Trustindex Google Reviews */}
      <Script
        src="https://cdn.trustindex.io/loader.js?e6bb50d66c409597175656ecd96"
        strategy="lazyOnload"
        defer
        async
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {/* Контейнер Trustindex: класс и data-ti-widget-id должны совпадать с кодом из панели Trustindex */}
        <div
          className="ti-widget"
          data-ti-widget-id="e6bb50d66c409597175656ecd96"
        />
      </div>
    </section>
  );
}

