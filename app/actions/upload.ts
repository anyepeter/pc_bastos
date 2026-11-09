'use server';

import { randomBytes } from 'node:crypto';
import { getSessionRole } from '@/lib/auth/roles';
import { mediaKeyFromUrl } from '@/lib/media';
import { deleteObject, putObject } from '@/lib/r2';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Server actions are reachable by anyone who finds their id, so both of these
 * refuse unless a dashboard account is signed in — otherwise a stranger could
 * fill the bucket or delete the council's images.
 */
async function signedIn(): Promise<boolean> {
  try {
    return (await getSessionRole()) !== null;
  } catch {
    return false;
  }
}

/**
 * Vercel refuses request bodies over 4.5 MB, and `next.config.js` sets the
 * server-action limit just under that. The editor shrinks photos in the
 * browser first (lib/prepare-upload.ts), so a real upload is far smaller.
 */
const MAX_BYTES = 4 * 1024 * 1024;

const ascii = (bytes: Uint8Array, from: number, to: number) =>
  Array.from(bytes.subarray(from, to), (b) => String.fromCharCode(b)).join('');

/** The allowed types, with the bytes each file must start with. */
const TYPES: Record<string, { ext: string; magic: (b: Uint8Array) => boolean }> = {
  'image/jpeg': { ext: 'jpg', magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  'image/png': { ext: 'png', magic: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  'image/gif': { ext: 'gif', magic: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 },
  'image/webp': {
    ext: 'webp',
    magic: (b) => ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 12) === 'WEBP',
  },
};

/**
 * Store an uploaded image in R2 under `church/<folder>/` and return its
 * public URL.
 */
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  if (!(await signedIn())) return { success: false, error: 'Please sign in again.' };

  try {
    const file = formData.get('file');
    if (!(file instanceof File)) return { success: false, error: 'No file provided' };

    // Callers pass a subfolder ('events', 'charity', …) so uploads stay sorted.
    const requestedFolder = String(formData.get('folder') || 'blog').replace(/[^a-z0-9-_]/gi, '');
    const folder = `church/${requestedFolder || 'blog'}`;

    const type = TYPES[file.type];
    if (!type) {
      return { success: false, error: 'Invalid file type. Please upload an image (JPEG, PNG, WebP, or GIF)' };
    }
    if (file.size > MAX_BYTES) {
      return { success: false, error: 'File too large. Maximum size is 4 MB' };
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!type.magic(bytes)) {
      return { success: false, error: 'This file is not a valid image.' };
    }

    // A fresh key every time: objects are cached as immutable.
    const key = `${folder}/${Date.now().toString(36)}-${randomBytes(5).toString('hex')}.${type.ext}`;
    const url = await putObject(key, bytes, file.type);

    return { success: true, url };
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    };
  }
}

/**
 * Delete one of our images from R2. URLs on any other host — including the
 * old Cloudinary account, which is shared with other projects — are left
 * alone and reported as done.
 */
export async function deleteImage(imageUrl: string): Promise<{ success: boolean; error?: string }> {
  if (!(await signedIn())) return { success: false, error: 'Please sign in again.' };

  const key = mediaKeyFromUrl(imageUrl);
  if (!key || !key.startsWith('church/')) return { success: true };

  try {
    await deleteObject(key);
    return { success: true };
  } catch (error) {
    console.error('Image delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete image',
    };
  }
}
