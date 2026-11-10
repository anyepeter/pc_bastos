import { cache } from 'react';
import PageLayout from '@/components/PageLayout';
import BlogListClient from '@/components/BlogListClient';
import { getPublishedBlogPosts } from '@/app/actions/blog-public';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { languageOf, pageTrail, staticPageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, graph } from '@/lib/structured-data';

// One query per request, shared by the metadata and the page.
const loadPosts = cache(() => getPublishedBlogPosts());

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const result = await loadPosts();
  const empty = !result.success || !result.data?.length;
  return staticPageMetadata('blogs', languageOf(params), { noIndex: empty });
}

export default async function BlogsPage({ params }: { params: { lang: string } }) {
  const language = languageOf(params);
  // Fetch published blog posts from database for initial state
  const result = await loadPosts();
  const posts = result.success ? result.data : [];

  return (
    <PageLayout>
      <JsonLd data={graph(breadcrumbJsonLd(language, pageTrail(language, 'blogs')))} />
      {/* No StoreProvider here — the root layout already provides one. A second
          one would put the nav's LanguageSelector and this page on different
          stores, so switching language would never reach the posts. */}
      <BlogListClient initialPosts={posts} />
    </PageLayout>
  );
}
