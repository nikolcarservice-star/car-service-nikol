import NotFoundView from '../../components/NotFoundView';

export const metadata = {
  title: '404 – Car Service Nikol | Jastrowo, w Szamotułach',
  description:
    'Strona nie znaleziona. Car Service Nikol — serwis Jastrowo, w Szamotułach. Wróć na stronę główną.',
};

export default function LangNotFound() {
  return <NotFoundView embedded />;
}
