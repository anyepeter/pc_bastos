'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { deleteImage } from './upload';
import { Translation } from '@/lib/translations';

export interface BlogPostInput {
  title: Translation;
  slug: string;
  description: Translation;
  imageUrl?: string | null;
  published: boolean;
}

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Get all blog posts
 */
export async function getAllBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, data: posts };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { success: false, error: 'Failed to fetch blog posts' };
  }
}

/**
 * Get a single blog post by ID
 */
export async function getBlogPostById(id: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return { success: false, error: 'Blog post not found' };
    }

    return { success: true, data: post };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return { success: false, error: 'Failed to fetch blog post' };
  }
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      return { success: false, error: 'Blog post not found' };
    }

    return { success: true, data: post };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return { success: false, error: 'Failed to fetch blog post' };
  }
}

/**
 * Create a new blog post
 */
export async function createBlogPost(data: BlogPostInput): Promise<ActionResult> {

  try {
    // Validate required fields
    if (!data.title || !data.slug || !data.description) {
      return { success: false, error: 'Missing required fields' };
    }

    // Validate translations
    if (!data.title.en || !data.title.fr || !data.description.en || !data.description.fr) {
      return { success: false, error: 'Both English and French translations are required' };
    }

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: data.slug },
    });

    if (existingPost) {
      return { success: false, error: 'A post with this slug already exists' };
    }

    const post = await prisma.blogPost.create({
      data: {
        title: data.title as any, // Prisma will store as JSON
        slug: data.slug,
        description: data.description as any, // Prisma will store as JSON
        imageUrl: data.imageUrl,
        published: data.published,
      },
    });

    revalidatePath('/admin/blog');
    revalidatePath('/blogs');

    return { success: true, data: post };
  } catch (error) {
    console.error('Error creating blog post:', error);
    return { success: false, error: 'Failed to create blog post' };
  }
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(id: string, data: BlogPostInput): Promise<ActionResult> {
  try {
    // Validate required fields
    if (!data.title || !data.slug || !data.description) {
      return { success: false, error: 'Missing required fields' };
    }

    // Validate translations
    if (!data.title.en || !data.title.fr || !data.description.en || !data.description.fr) {
      return { success: false, error: 'Both English and French translations are required' };
    }

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return { success: false, error: 'Blog post not found' };
    }

    // Check if new slug conflicts with another post
    if (data.slug !== existingPost.slug) {
      const slugConflict = await prisma.blogPost.findUnique({
        where: { slug: data.slug },
      });

      if (slugConflict) {
        return { success: false, error: 'A post with this slug already exists' };
      }
    }

    // If image was changed, delete old image from Cloudinary
    if (existingPost.imageUrl && data.imageUrl && existingPost.imageUrl !== data.imageUrl) {
      await deleteImage(existingPost.imageUrl);
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title as any, // Prisma will store as JSON
        slug: data.slug,
        description: data.description as any, // Prisma will store as JSON
        imageUrl: data.imageUrl,
        published: data.published,
      },
    });

    revalidatePath('/admin/blog');
    revalidatePath(`/admin/blog/${id}/edit`);
    revalidatePath('/blogs');

    return { success: true, data: post };
  } catch (error) {
    console.error('Error updating blog post:', error);
    return { success: false, error: 'Failed to update blog post' };
  }
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: string): Promise<ActionResult> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return { success: false, error: 'Blog post not found' };
    }

    // Delete image from Cloudinary if it exists
    if (post.imageUrl) {
      await deleteImage(post.imageUrl);
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath('/admin/blog');
    revalidatePath('/blogs');

    return { success: true };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return { success: false, error: 'Failed to delete blog post' };
  }
}

/**
 * Toggle publish status of a blog post
 */
export async function togglePublishStatus(id: string): Promise<ActionResult> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return { success: false, error: 'Blog post not found' };
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        published: !post.published,
      },
    });

    revalidatePath('/admin/blog');
    revalidatePath('/blogs');

    return { success: true, data: updatedPost };
  } catch (error) {
    console.error('Error toggling publish status:', error);
    return { success: false, error: 'Failed to update publish status' };
  }
}

/**
 * Search blog posts by title or content
 */
export async function searchBlogPosts(query: string) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        slug: { contains: query, mode: 'insensitive' },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, data: posts };
  } catch (error) {
    console.error('Error searching blog posts:', error);
    return { success: false, error: 'Failed to search blog posts' };
  }
}
