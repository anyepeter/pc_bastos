import PageLayout from '@/components/PageLayout';
import BlogListClient from '@/components/BlogListClient';
import { getPublishedBlogPosts } from '@/app/actions/blog-public';

export default async function BlogsPage() {
  // Fetch published blog posts from database for initial state
  const result = await getPublishedBlogPosts();
  const posts = result.success ? result.data : [];

  return (
    <PageLayout>
      {/* No StoreProvider here — the root layout already provides one. A second
          one would put the nav's LanguageSelector and this page on different
          stores, so switching language would never reach the posts. */}
      <BlogListClient initialPosts={posts} />
    </PageLayout>
  );
}
