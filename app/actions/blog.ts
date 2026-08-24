'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { deleteImage } from './upload';
import { Translation, normalizeTranslation, readTranslation } from '@/lib/translations';
import { AccessError, requireSuperAdmin } from '@/lib/auth/roles';

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
 * Validate the bilingual payload.
 *
 * English is always required because it is the fallback language everywhere
 * (see `getTranslatedText`). French is only required to publish, so an editor
 * can save an English draft first and add the translation afterwards.
 */
function validateBlogPostInput(data: BlogPostInput): string | null {
  if (!data.title?.en?.trim()) return 'The English title is required';
  if (!data.description?.en?.trim()) return 'The English content is required';
  if (!data.slug?.trim()) return 'The URL slug is required';

  if (data.published) {
    if (!data.title?.fr?.trim()) {
      return 'The French title is required before this post can be published';
    }
    if (!data.description?.fr?.trim()) {
      return 'The French content is required before this post can be published';
    }
  }

  return null;
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
    await requireSuperAdmin();

    const validationError = validateBlogPostInput(data);
    if (validationError) {
      return { success: false, error: validationError };
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
        title: normalizeTranslation(data.title) as any, // Prisma will store as JSON
        slug: data.slug.trim(),
        description: normalizeTranslation(data.description) as any, // Prisma will store as JSON
        imageUrl: data.imageUrl,
        published: data.published,
      },
    });

    revalidatePath('/admin/blog');
    revalidatePath('/blogs');

    return { success: true, data: post };
  } catch (error) {
    if (error instanceof AccessError) return { success: false, error: error.message };
    console.error('Error creating blog post:', error);
    return { success: false, error: 'Failed to create blog post' };
  }
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(id: string, data: BlogPostInput): Promise<ActionResult> {
  try {
    await requireSuperAdmin();

    const validationError = validateBlogPostInput(data);
    if (validationError) {
      return { success: false, error: validationError };
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
        title: normalizeTranslation(data.title) as any, // Prisma will store as JSON
        slug: data.slug.trim(),
        description: normalizeTranslation(data.description) as any, // Prisma will store as JSON
        imageUrl: data.imageUrl,
        published: data.published,
      },
    });

    revalidatePath('/admin/blog');
    revalidatePath(`/admin/blog/${id}/edit`);
    revalidatePath('/blogs');

    return { success: true, data: post };
  } catch (error) {
    if (error instanceof AccessError) return { success: false, error: error.message };
    console.error('Error updating blog post:', error);
    return { success: false, error: 'Failed to update blog post' };
  }
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: string): Promise<ActionResult> {
  try {
    await requireSuperAdmin();

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
    if (error instanceof AccessError) return { success: false, error: error.message };
    console.error('Error deleting blog post:', error);
    return { success: false, error: 'Failed to delete blog post' };
  }
}

/**
 * Toggle publish status of a blog post
 */
export async function togglePublishStatus(id: string): Promise<ActionResult> {
  try {
    await requireSuperAdmin();

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return { success: false, error: 'Blog post not found' };
    }

    // Going from draft -> published requires a complete French translation,
    // same rule the editor enforces.
    if (!post.published) {
      const title = readTranslation(post.title);
      const description = readTranslation(post.description);

      if (!title.fr.trim() || !description.fr.trim()) {
        return {
          success: false,
          error: 'Add the French translation before publishing this post',
        };
      }
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
    if (error instanceof AccessError) return { success: false, error: error.message };
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
