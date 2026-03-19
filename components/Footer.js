import Link from 'next/link';
import { getTranslations } from '../constants/translations';

export default function Footer({ lang }) {
  const t = getTranslations(lang).footer;

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-gray-300 sm:text-sm">
        <div className="grid gap-6 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-100">Car Service Nikol</p>
            <Link
              href={`/${lang}/privacy`}
              className="mt-1 inline-flex text-[11px] text-orange-300 hover:text-orange-200"
            >
              {t.privacy}
            </Link>
            {t.seoKeywordsLine && (
              <p className="mt-3 max-w-xl text-[10px] text-gray-500 sm:text-[11px]">
                {t.seoKeywordsLine}
              </p>
            )}
          </div>

          <div className="space-y-1 text-[11px] text-gray-400 sm:text-xs">
            <p className="font-semibold text-gray-200">{t.scheduleTitle}</p>
            {t.monFri && <p>{t.monFri}</p>}
            <p className="text-orange-300">{t.saturday}</p>
            <p className="text-emerald-300">{t.sunday}</p>
          </div>
        </div>

        <p className="mt-6 text-[10px] text-gray-500">{t.rights}</p>
      </div>
    </footer>
  );
}

