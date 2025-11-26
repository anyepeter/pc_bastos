'use server';

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload an image to Cloudinary
 * @param formData - FormData containing the image file
 * @returns Upload result with URL or error
 */
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File;

    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Please upload an image (JPEG, PNG, WebP, or GIF)' };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'File too large. Maximum size is 5MB' };
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'church/blog',
          resource_type: 'auto',
          transformation: [
            { width: 1200, height: 630, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return {
      success: true,
      url: result.secure_url,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    };
  }
}

/**
 * Delete an image from Cloudinary
 * @param imageUrl - The Cloudinary image URL
 * @returns Success status
 */
export async function deleteImage(imageUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract public_id from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const publicIdWithExtension = urlParts.slice(urlParts.indexOf('church')).join('/');
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '');

    await cloudinary.uploader.destroy(publicId);

    return { success: true };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete image',
    };
  }
}
