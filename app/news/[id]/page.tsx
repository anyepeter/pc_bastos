import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import NewsDetailClient, { PublicNewsDetail } from './NewsDetailClient';
import { getPublishedNews, getPublishedNewsBySlug } from '@/app/actions/news';

// `params.id` is the slug, matching the blog and workshop route convention.
export async function generateStaticParams() {
  const result = await getPublishedNews();
  if (!result.success || !result.data) return [];

  return result.data.map((article: any) => ({ id: article.slug }));
}

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const result = await getPublishedNewsBySlug(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const row = result.data;
  const article: PublicNewsDetail = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    category: row.category ?? null,
    date: new Date(row.date).toISOString(),
    imageUrl: row.imageUrl ?? null,
  };

  return (
    <PageLayout>
      <NewsDetailClient article={article} />
    </PageLayout>
  );
}
