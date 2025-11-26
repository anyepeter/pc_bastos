import { useState, useEffect } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UseBlogPostsReturn {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch all published blog posts
 * Reusable across the application
 */
export function useBlogPosts(): UseBlogPostsReturn {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/blog/posts');

      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }

      const data = await response.json();

      if (data.success) {
        setPosts(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to load blog posts');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
  };
}

/**
 * Custom hook to fetch a single blog post by slug
 */
export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/blog/posts/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Blog post not found');
        }
        throw new Error('Failed to fetch blog post');
      }

      const data = await response.json();

      if (data.success) {
        setPost(data.data);
      } else {
        throw new Error(data.error || 'Failed to load blog post');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  return {
    post,
    loading,
    error,
    refetch: fetchPost,
  };
}
