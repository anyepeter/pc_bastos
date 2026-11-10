import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import JsonLd from '@/components/JsonLd';
import BlogDetailClient from './BlogDetailClient';
import { getPublishedBlogPostBySlug, getPublishedBlogPosts } from '@/app/actions/blog-public';
import { getSiteSettings } from '@/app/actions/settings';
import { readTranslation } from '@/lib/translations';
import { languageOf, pageMetadata, pageTrail, plainText } from '@/lib/seo';
import { articleJsonLd, breadcrumbJsonLd, graph } from '@/lib/structured-data';

type Params = { lang: string; id: string };

const loadPost = cache((slug: string) => getPublishedBlogPostBySlug(slug));

// Generate static params for all published blog posts
export async function generateStaticParams() {
  const result = await getPublishedBlogPosts();

  if (!result.success || !result.data) {
    return [];
  }

  return result.data.map((post) => ({
    id: post.slug,
  }));
}

const textIn = (value: unknown, language: 'en' | 'fr') =>
  readTranslation(value)[language] || readTranslation(value).en;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const result = await loadPost(params.id);
  if (!result.success || !result.data) return {};

  const language = languageOf(params);
  const post = result.data;
  const title = textIn(post.title, language);
  return pageMetadata({
    language,
    path: `/blogs/${post.slug}`,
    title,
    description: plainText(textIn(post.description, language)),
    image: post.imageUrl,
    imageAlt: title,
    type: 'article',
    publishedTime: new Date(post.createdAt).toISOString(),
    modifiedTime: new Date(post.updatedAt).toISOString(),
  });
}

export default async function BlogDetailPage({ params }: { params: Params }) {
  // params.id is actually the slug
  const result = await loadPost(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const language = languageOf(params);
  const post = result.data;
  const title = textIn(post.title, language);
  const settings = await getSiteSettings();

  return (
    <PageLayout>
      <JsonLd
        data={graph(
          articleJsonLd({
            language,
            path: `/blogs/${post.slug}`,
            type: 'BlogPosting',
            headline: title,
            description: plainText(textIn(post.description, language), 300),
            image: post.imageUrl,
            datePublished: new Date(post.createdAt).toISOString(),
            dateModified: new Date(post.updatedAt).toISOString(),
            settings,
          }),
          breadcrumbJsonLd(language, [...pageTrail(language, 'blogs'), { name: title, path: `/blogs/${post.slug}` }])
        )}
      />
      {/* No StoreProvider here — RootShell already provides one. A second one
          would put the nav and this page on different stores. */}
      <BlogDetailClient post={post} />
    </PageLayout>
  );
}
