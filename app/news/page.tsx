import PageLayout from '@/components/PageLayout';
import NewsClient, { PublicNewsArticle } from './NewsClient';
import { getPublishedNews } from '@/app/actions/news';

export default async function NewsPage() {
  const result = await getPublishedNews();
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
      <NewsClient articles={articles} />
    </PageLayout>
  );
}
