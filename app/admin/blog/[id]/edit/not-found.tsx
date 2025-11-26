import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <FileQuestion className="h-16 w-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Post Not Found</h2>
      <p className="text-gray-600 mb-6">
        The blog post you're looking for doesn't exist or has been deleted.
      </p>
      <Button asChild>
        <Link href="/admin/blog">Back to Blog Posts</Link>
      </Button>
    </div>
  );
}
