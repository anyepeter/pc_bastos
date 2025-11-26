import PageLayout from '@/components/PageLayout';
import BlogListClient from '@/components/BlogListClient';
import { getPublishedBlogPosts } from '@/app/actions/blog-public';
import StoreProvider from '@/components/StoreProvider';

export default async function BlogsPage() {
  // Fetch published blog posts from database for initial state
  const result = await getPublishedBlogPosts();
  const posts = result.success ? result.data : [];

  return (
    <PageLayout>
      <StoreProvider initialBlogPosts={posts}>
        <BlogListClient />
      </StoreProvider>
    </PageLayout>
  );
}
