/**
 * Where uploaded images live.
 *
 * Every image an editor uploads is stored in the council's Cloudflare R2
 * bucket and served from its public address below. The address is not a
 * secret, so it is a constant here rather than an environment variable: client
 * components check it too, and `next.config.js` repeats it for `next/image`.
 * Keep the two in step.
 *
 * Moving the bucket to a custom domain later means changing MEDIA_BASE_URL and
 * `next.config.js`, then rewriting the stored URLs in the database (rows hold
 * full URLs).
 */
export const MEDIA_BASE_URL = 'https://pub-f74c0db0e11440b6a7693d42e90d9444.r2.dev';

const MEDIA_HOST = new URL(MEDIA_BASE_URL).hostname;

/**
 * Hosts the site renders uploaded images from. Cloudinary held the uploads
 * until November 2026; it stays accepted so restoring the pre-migration URLs
 * remains a database-only rollback.
 */
const UPLOAD_HOSTS = new Set([MEDIA_HOST, 'res.cloudinary.com']);

const hostOf = (url: string): string | null => {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

/** An image the site can render with `next/image`: our bucket (or legacy Cloudinary). */
export const isUploadedImage = (url: string | null | undefined): url is string =>
  Boolean(url) && UPLOAD_HOSTS.has(hostOf(url as string) ?? '');

/** The bucket key for one of our R2 URLs, or null for anything else. */
export function mediaKeyFromUrl(url: string): string | null {
  const prefix = `${MEDIA_BASE_URL}/`;
  if (!url.startsWith(prefix)) return null;
  const key = decodeURIComponent(url.slice(prefix.length).split(/[?#]/)[0]);
  return key && !key.includes('..') ? key : null;
}

export const mediaUrl = (key: string) =>
  `${MEDIA_BASE_URL}/${key.split('/').map(encodeURIComponent).join('/')}`;
