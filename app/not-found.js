import NotFoundView from '../components/NotFoundView';

export const metadata = {
  title: '404 – Car Service Nikol | Jastrowo, Szamotuły',
  description:
    'Strona nie znaleziona. Car Service Nikol — serwis samochodowy Jastrowo i Szamotuły. Wróć na stronę główną lub wybierz wersję językową.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      <NotFoundView />
    </div>
  );
}
