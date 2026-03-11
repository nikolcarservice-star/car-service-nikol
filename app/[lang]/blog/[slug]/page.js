import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import { blogPosts, getBlogPost, getAllBlogSlugs } from '../../../../data/blog';
import { normalizeLang } from '../../../../constants/translations';

export function generateStaticParams() {
  const params = [];
  ['pl', 'ru'].forEach((lang) => {
    getAllBlogSlugs().forEach((slug) => {
      params.push({ lang, slug });
    });
  });
  return params;
}

export function generateMetadata({ params }) {
  const lang = normalizeLang(params.lang);
  const post = getBlogPost(params.slug, lang);
  if (!post) return {};
  const siteName = 'Car Service Nikol';
  return {
    title: `${post.title} – ${siteName}`,
    description: post.excerpt,
    alternates: { canonical: `/${lang}/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `/${lang}/blog/${params.slug}`,
    },
  };
}

export default function BlogPostPage({ params }) {
  const lang = normalizeLang(params.lang);
  const post = getBlogPost(params.slug, lang);
  if (!post) notFound();

  const basePath = `/${lang}`;
  const isRu = lang === 'ru';

  return (
    <section className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: isRu ? 'Главная' : 'Strona główna', href: basePath },
            { label: isRu ? 'Блог' : 'Blog', href: `${basePath}/blog` },
            { label: post.title },
          ]}
        />
        <article className="mt-4 max-w-3xl">
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-gray-50 sm:text-3xl">
            <FileText className="h-7 w-7 shrink-0 text-orange-400" />
            {post.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:text-base">
            {post.excerpt}
          </p>
          {Array.isArray(post.body) && post.body.length > 0 && (
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-300 sm:text-base">
              {post.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}
          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-gray-300 sm:p-5">
            <p className="font-medium text-gray-200">
              {isRu
                ? 'Car Service Nikol — сервис в Jastrowo и Шамотулах. Диагностика, ремонт подвески и тормозов, замена масла. Работаем в выходные.'
                : 'Car Service Nikol — serwis w Jastrowo i Szamotułach. Diagnostyka, naprawa zawieszenia i hamulców, wymiana oleju. Pracujemy w weekendy.'}
            </p>
            <Link
              href={`${basePath}/#booking`}
              className="mt-3 inline-flex items-center gap-2 text-orange-400 hover:text-orange-300"
            >
              <ArrowLeft className="h-4 w-4" />
              {isRu ? 'Контакт и запись' : 'Kontakt i umów wizytę'}
            </Link>
          </div>
        </article>
        <p className="mt-8">
          <Link href={`${basePath}/blog`} className="text-sm font-medium text-orange-400 hover:text-orange-300">
            ← {isRu ? 'Все статьи' : 'Wszystkie artykuły'}
          </Link>
        </p>
      </div>
    </section>
  );
}
