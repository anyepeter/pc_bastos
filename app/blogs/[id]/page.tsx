import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import BlogDetailClient from './BlogDetailClient';
import { getPublishedBlogPostBySlug, getPublishedBlogPosts } from '@/app/actions/blog-public';

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

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  // Fetch blog post by slug for initial state (params.id is actually the slug)
  const result = await getPublishedBlogPostBySlug(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <PageLayout>
      {/* No StoreProvider here — the root layout already provides one. A second
          one would put the nav's LanguageSelector and this page on different
          stores, so switching language would never reach the post. */}
      <BlogDetailClient post={result.data} />
    </PageLayout>
  );
}
