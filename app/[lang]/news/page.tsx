import { cache } from 'react';
import PageLayout from '@/components/PageLayout';
import NewsClient, { PublicNewsArticle } from './NewsClient';
import { getPublishedNews } from '@/app/actions/news';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { languageOf, pageTrail, staticPageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, graph } from '@/lib/structured-data';

// One query per request, shared by the metadata and the page.
const loadArticles = cache(() => getPublishedNews());

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const result = await loadArticles();
  const empty = !result.success || !result.data?.length;
  return staticPageMetadata('news', languageOf(params), { noIndex: empty });
}

export default async function NewsPage({ params }: { params: { lang: string } }) {
  const language = languageOf(params);
  const result = await loadArticles();
  const rows = result.success ? result.data || [] : [];

  const articles: PublicNewsArticle[] = rows.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category ?? null,
    date: new Date(row.date).toISOString(),
    imageUrl: row.imageUrl ?? null,
  }));

  return (
    <PageLayout>
      <JsonLd data={graph(breadcrumbJsonLd(language, pageTrail(language, 'news')))} />
      <NewsClient articles={articles} />
    </PageLayout>
  );
}
