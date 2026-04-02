'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calculator } from 'lucide-react';
import {
  CALCULATOR_ITEMS,
  computeCalculatorLaborTotal,
} from '../data/serviceCalculator';
import { getTranslations, LANGUAGES } from '../constants/translations';

/**
 * @param {{ lang: string }} props
 */
export default function ServiceCalculator({ lang }) {
  const t = getTranslations(lang);
  const tc = t.serviceCalculator || {};
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [partsMode, setPartsMode] = useState('workshop');

  const items = useMemo(
    () =>
      CALCULATOR_ITEMS.map((item) => ({
        id: item.id,
        name: lang === LANGUAGES.RU ? item.nameRu : item.namePl,
        price: item.price,
      })),
    [lang]
  );

  const workshopParts = partsMode === 'workshop';
  const { base, discounted, savings } = computeCalculatorLaborTotal(selected, workshopParts);

  const toggleService = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const bookingId = t.bookingId || 'booking';
  const basePath = `/${lang}`;

  const goToBooking = () => {
    if (selected.length === 0) return;
    const params = new URLSearchParams();
    params.set('services', selected.join(','));
    params.set('calc_parts', partsMode === 'workshop' ? 'workshop' : 'own');
    router.push(`${basePath}?${params.toString()}#${bookingId}`);
  };

  return (
    <div className="rounded-2xl border border-orange-500/35 bg-slate-900/80 p-5 shadow-xl ring-1 ring-white/[0.06] sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/25">
          <Calculator className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-gray-50 sm:text-xl">
            {tc.title || 'Kalkulator orientacyjny'}
          </h2>
          {tc.subtitle && (
            <p className="mt-1 text-sm text-gray-400">{tc.subtitle}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
          {tc.partsLegend || 'Części'}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setPartsMode('own')}
            className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
              partsMode === 'own'
                ? 'border-orange-500/70 bg-orange-500/15 text-orange-100'
                : 'border-slate-700 bg-slate-950/40 text-gray-300 hover:border-slate-600'
            }`}
          >
            <span className="block font-medium">{tc.partsOwn || 'Własne części'}</span>
          </button>
          <button
            type="button"
            onClick={() => setPartsMode('workshop')}
            className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
              partsMode === 'workshop'
                ? 'border-orange-500/70 bg-orange-500/15 text-orange-100'
                : 'border-slate-700 bg-slate-950/40 text-gray-300 hover:border-slate-600'
            }`}
          >
            <span className="block font-medium">
              {tc.partsWorkshop || 'Części z serwisu (−10% robocizny)'}
            </span>
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
          {tc.servicesLegend || 'Usługi'}
        </p>
        <div className="max-h-[min(52vh,28rem)] space-y-2 overflow-y-auto pr-1">
          {items.map((service) => {
            const active = selected.includes(service.id);
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                  active
                    ? 'border-orange-500/70 bg-orange-500/10 text-gray-100'
                    : 'border-slate-700/90 bg-slate-950/30 text-gray-300 hover:border-slate-600'
                }`}
              >
                <span className="leading-snug">{service.name}</span>
                <span className="shrink-0 font-semibold tabular-nums text-orange-400">
                  {service.price} PLN
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950/50 p-4">
        {workshopParts && selected.length > 0 ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-gray-400">
              <span>{tc.sumLabel || 'Suma robocizny (orientacyjnie)'}</span>
              <span className="font-medium text-gray-300 line-through">{base} PLN</span>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm text-gray-200">
                {tc.sumDiscounted || 'Po rabacie −10% (części z serwisu)'}
              </span>
              <span className="text-xl font-bold text-orange-400">{discounted} PLN*</span>
            </div>
            {savings > 0 && (
              <p className="text-xs text-emerald-400/90">
                {(tc.savingsLine || 'Oszczędzasz ok. {amount} PLN na robociznie w wycenie.').replace(
                  '{amount}',
                  String(savings)
                )}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-sm text-gray-300">{tc.sumLabel || 'Suma robocizny'}</span>
            <span className="text-xl font-bold text-orange-400">{base} PLN*</span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={goToBooking}
        disabled={selected.length === 0}
        className="mt-4 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-400 hover:to-amber-400 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {tc.bookCta || 'Umów wizytę na te usługi'}
      </button>
      {selected.length === 0 && tc.selectHint && (
        <p className="mt-2 text-center text-xs text-amber-200/80">{tc.selectHint}</p>
      )}
      <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
        {tc.disclaimer ||
          '*Orientacyjna robocizna bez części. Dokładną wycenę po kontakcie lub oględzinach.'}
      </p>
    </div>
  );
}
