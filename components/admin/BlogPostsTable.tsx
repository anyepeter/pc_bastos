'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { DeleteDialog } from './DeleteDialog';
import { deleteBlogPost, togglePublishStatus } from '@/app/actions/blog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface BlogPost {
  id: string;
  title: any;
  slug: string;
  description: any;
  imageUrl: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Helper to get text from title/description (could be string or Translation object)
const getText = (field: any): string => {
  if (typeof field === 'string') return field;
  if (field && typeof field === 'object' && field.en) return field.en;
  return '';
};

interface BlogPostsTableProps {
  posts: BlogPost[];
}

export function BlogPostsTable({ posts }: BlogPostsTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingPublish, setTogglingPublish] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    const result = await deleteBlogPost(postToDelete);

    if (result.success) {
      toast.success('Blog post deleted successfully');
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to delete blog post');
    }
    setIsDeleting(false);
  };

  const handleTogglePublish = async (id: string) => {
    setTogglingPublish(id);
    const result = await togglePublishStatus(id);

    if (result.success) {
      toast.success(
        `Post ${result.data.published ? 'published' : 'unpublished'} successfully`
      );
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to update publish status');
    }
    setTogglingPublish(null);
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop table view */}
      <div className="hidden md:block">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    {post.imageUrl ? (
                      <div className="relative w-16 h-16 rounded overflow-hidden">
                        <Image
                          src={post.imageUrl}
                          alt={getText(post.title)}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{getText(post.title)}</p>
                      <p className="text-sm text-gray-500">/{post.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={post.published ? 'default' : 'secondary'}
                      className={
                        post.published
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : ''
                      }
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTogglePublish(post.id)}
                        disabled={togglingPublish === post.id}
                        title={post.published ? 'Unpublish' : 'Publish'}
                      >
                        {post.published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/blog/${post.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(post.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-4">
            <div className="flex space-x-4">
              {post.imageUrl ? (
                <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 truncate">/{post.slug}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <Badge
                    variant={post.published ? 'default' : 'secondary'}
                    className={
                      post.published
                        ? 'bg-green-100 text-green-700'
                        : ''
                    }
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTogglePublish(post.id)}
                disabled={togglingPublish === post.id}
                className="flex-1"
              >
                {post.published ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Publish
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link href={`/admin/blog/${post.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteClick(post.id)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete blog post?"
        description="This will permanently delete this blog post and its associated image. This action cannot be undone."
        isDeleting={isDeleting}
      />
    </>
  );
}
