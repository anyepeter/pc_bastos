import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import JsonLd from '@/components/JsonLd';
import NewsDetailClient, { PublicNewsDetail } from './NewsDetailClient';
import { getPublishedNews, getPublishedNewsBySlug } from '@/app/actions/news';
import { getSiteSettings } from '@/app/actions/settings';
import { readTranslation } from '@/lib/translations';
import { languageOf, pageMetadata, pageTrail, plainText } from '@/lib/seo';
import { articleJsonLd, breadcrumbJsonLd, graph } from '@/lib/structured-data';

type Params = { lang: string; id: string };

const loadArticle = cache((slug: string) => getPublishedNewsBySlug(slug));

// `params.id` is the slug, matching the blog and workshop route convention.
export async function generateStaticParams() {
  const result = await getPublishedNews();
  if (!result.success || !result.data) return [];

  return result.data.map((article: any) => ({ id: article.slug }));
}

const textIn = (value: unknown, language: 'en' | 'fr') =>
  readTranslation(value)[language] || readTranslation(value).en;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const result = await loadArticle(params.id);
  if (!result.success || !result.data) return {};

  const language = languageOf(params);
  const row = result.data;
  const title = textIn(row.title, language);
  return pageMetadata({
    language,
    path: `/news/${row.slug}`,
    title,
    description: plainText(textIn(row.excerpt, language) || textIn(row.body, language)),
    image: row.imageUrl,
    imageAlt: title,
    type: 'article',
    publishedTime: new Date(row.date).toISOString(),
    modifiedTime: new Date(row.updatedAt).toISOString(),
    section: row.category ? textIn(row.category, language) : undefined,
  });
}

export default async function NewsDetailPage({ params }: { params: Params }) {
  const result = await loadArticle(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const language = languageOf(params);
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

  const title = textIn(row.title, language);
  const settings = await getSiteSettings();

  return (
    <PageLayout>
      <JsonLd
        data={graph(
          articleJsonLd({
            language,
            path: `/news/${row.slug}`,
            type: 'NewsArticle',
            headline: title,
            description: plainText(textIn(row.excerpt, language), 300),
            image: row.imageUrl,
            datePublished: article.date,
            dateModified: new Date(row.updatedAt).toISOString(),
            section: row.category ? textIn(row.category, language) : undefined,
            settings,
          }),
          breadcrumbJsonLd(language, [...pageTrail(language, 'news'), { name: title, path: `/news/${row.slug}` }])
        )}
      />
      <NewsDetailClient article={article} />
    </PageLayout>
  );
}
