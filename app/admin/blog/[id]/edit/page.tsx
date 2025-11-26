import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogPostForm } from '@/components/admin/BlogPostForm';
import { getBlogPostById } from '@/app/actions/blog';

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getBlogPostById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const post = result.data;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
          <p className="mt-2 text-gray-600">
            Update your blog post content and settings
          </p>
        </div>
      </div>

      {/* Form */}
      <BlogPostForm post={post} isEditing />
    </div>
  );
}
