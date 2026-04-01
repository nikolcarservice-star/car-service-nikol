import NotFoundView from '../../components/NotFoundView';

export const metadata = {
  title: '404 – Car Service Nikol | Jastrowo, Szamotuły',
  description:
    'Strona nie znaleziona. Car Service Nikol — serwis samochodowy Jastrowo, Szamotuły. Wróć na stronę główną.',
};

export default function LangNotFound() {
  return <NotFoundView embedded />;
}
