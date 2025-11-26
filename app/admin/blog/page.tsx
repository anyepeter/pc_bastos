import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogPostsList } from '@/components/admin/BlogPostsList';
import { getAllBlogPosts } from '@/app/actions/blog';

export default async function BlogPostsPage() {
  const result = await getAllBlogPosts();
  const posts = result.success ? result.data || [] : [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="mt-2 text-gray-600">
            Manage your blog posts and content
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Link>
        </Button>
      </div>

      {/* Search and posts list */}
      <BlogPostsList posts={posts} />
    </div>
  );
}
