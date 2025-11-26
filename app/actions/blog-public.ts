'use server';

import { prisma } from '@/lib/prisma';
import { Translation } from '@/lib/translations';

export interface PublicBlogPost {
  id: string;
  title: Translation;
  slug: string;
  description: Translation;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get all published blog posts for public display
 * Sorted by newest first
 */
export async function getPublishedBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Transform JSON fields to Translation objects
    const transformedPosts = posts.map(post => ({
      ...post,
      title: post.title as unknown as Translation,
      description: post.description as unknown as Translation,
    }));

    return { success: true, data: transformedPosts };
  } catch (error) {
    console.error('Error fetching published blog posts:', error);
    return { success: false, error: 'Failed to fetch blog posts', data: [] };
  }
}

/**
 * Get a single published blog post by slug
 * @param slug - The URL slug of the blog post
 */
export async function getPublishedBlogPostBySlug(slug: string) {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        published: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!post) {
      return { success: false, error: 'Blog post not found', data: null };
    }

    // Transform JSON fields to Translation objects
    const transformedPost = {
      ...post,
      title: post.title as unknown as Translation,
      description: post.description as unknown as Translation,
    };

    return { success: true, data: transformedPost };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return { success: false, error: 'Failed to fetch blog post', data: null };
  }
}

/**
 * Get a single published blog post by ID
 * @param id - The ID of the blog post
 */
export async function getPublishedBlogPostById(id: string) {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        id,
        published: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!post) {
      return { success: false, error: 'Blog post not found', data: null };
    }

    // Transform JSON fields to Translation objects
    const transformedPost = {
      ...post,
      title: post.title as unknown as Translation,
      description: post.description as unknown as Translation,
    };

    return { success: true, data: transformedPost };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return { success: false, error: 'Failed to fetch blog post', data: null };
  }
}
