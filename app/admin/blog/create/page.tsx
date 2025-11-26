import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogPostForm } from '@/components/admin/BlogPostForm';

export default function CreateBlogPostPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Create Blog Post</h1>
          <p className="mt-2 text-gray-600">
            Write and publish a new blog post
          </p>
        </div>
      </div>

      {/* Form */}
      <BlogPostForm />
    </div>
  );
}
