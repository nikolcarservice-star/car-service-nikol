import Link from 'next/link';
import { FileText } from 'lucide-react';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { blogPosts, getBlogPost } from '../../../data/blog';
import { getTranslations, normalizeLang } from '../../../constants/translations';

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  const t = getTranslations(lang);
  const isRu = lang === 'ru';
  return {
    title: isRu ? 'Блог – Car Service Nikol Jastrowo, Шамотулы' : 'Blog – Car Service Nikol Jastrowo, Szamotuły',
    description: isRu
      ? 'Полезные статьи об автосервисе в Jastrowo и Шамотулах: диагностика, подвеска, тормоза, замена масла, выходной сервис. Car Service Nikol.'
      : 'Poradniki dla kierowców z Jastrowo i Szamotuł: diagnostyka, zawieszenie, hamulce, wymiana oleju, serwis w niedziele. Car Service Nikol.',
    alternates: { canonical: `/${lang}/blog` },
  };
}

export default function BlogPage({ params }) {
  const lang = normalizeLang(params.lang);
  const t = getTranslations(lang);
  const basePath = `/${lang}`;
  const isRu = lang === 'ru';

  return (
    <section className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: isRu ? 'Главная' : 'Strona główna', href: basePath },
            { label: isRu ? 'Блог' : 'Blog' },
          ]}
        />
        <h1 className="mt-4 flex items-center gap-2 text-2xl font-semibold tracking-tight text-gray-50 sm:text-3xl">
          <FileText className="h-7 w-7 text-orange-400" />
          {isRu ? 'Блог' : 'Blog'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-300 sm:text-base">
          {isRu
            ? 'Полезные статьи о сервисе автомобилей в Jastrowo и Шамотулах: диагностика, ремонт, советы.'
            : 'Poradniki dla kierowców z Jastrowo i Szamotuł – diagnostyka, naprawy, praktyczne wskazówki.'}
        </p>

        <ul className="mt-8 space-y-4">
          {blogPosts.map((post) => {
            const item = getBlogPost(post.slug, lang);
            return (
              <li key={post.slug}>
                <Link
                  href={`${basePath}/blog/${post.slug}`}
                  className="block rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-orange-500/30 hover:bg-slate-900/80 sm:p-5"
                >
                  <h2 className="text-base font-semibold text-gray-100 sm:text-lg">{item.title}</h2>
                  <p className="mt-1 text-xs text-gray-400 sm:text-sm">{item.excerpt}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
