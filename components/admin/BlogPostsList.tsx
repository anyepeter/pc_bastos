'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BlogPostsTable } from './BlogPostsTable';

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

interface BlogPostsListProps {
  posts: BlogPost[];
}

export function BlogPostsList({ posts }: BlogPostsListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to get text from title/description (could be string or Translation object)
  const getText = (field: any): string => {
    if (typeof field === 'string') return field;
    if (field && typeof field === 'object' && field.en) return field.en;
    return '';
  };

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }

    const query = searchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        getText(post.title).toLowerCase().includes(query) ||
        post.slug.toLowerCase().includes(query) ||
        getText(post.description).toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  return (
    <>
      {/* Search bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by title, slug, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
        </div>
        {searchQuery && (
          <Button
            variant="ghost"
            onClick={() => setSearchQuery('')}
            className="whitespace-nowrap"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Results count */}
      {searchQuery && (
        <div className="text-sm text-gray-600">
          Found {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
          {filteredPosts.length !== posts.length && ` out of ${posts.length} total`}
        </div>
      )}

      {/* Posts list */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          {searchQuery ? (
            <>
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No posts found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No blog posts match your search "{searchQuery}"
              </p>
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
              </div>
            </>
          ) : (
            <>
              <Plus className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No blog posts
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new blog post.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/admin/blog/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <BlogPostsTable posts={filteredPosts} />
      )}
    </>
  );
}
