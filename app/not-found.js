import Link from 'next/link';

export const metadata = {
  title: 'Strona nie znaleziona – Car Service Nikol',
  description: 'Strona nie istnieje. Wróć na stronę główną Car Service Nikol.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-orange-500 sm:text-8xl">404</p>
      <h1 className="mt-4 text-xl font-semibold text-gray-100 sm:text-2xl">
        Strona nie została znaleziona
      </h1>
      <p className="mt-2 max-w-md text-sm text-gray-400">
        Adres mógł się zmienić lub strona nie istnieje. Wróć na stronę główną.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/pl"
          className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow hover:bg-orange-400"
        >
          Strona główna (PL)
        </Link>
        <Link
          href="/ru"
          className="rounded-xl border border-slate-600 bg-slate-800/80 px-6 py-3 text-sm font-semibold text-gray-100 hover:border-orange-500 hover:text-orange-300"
        >
          Главная (RU)
        </Link>
      </div>
    </div>
  );
}
