import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * Every crawler — search engines and AI assistants alike — may read the whole
 * public site in both languages. Only the dashboard and its login are off
 * limits (they are also marked noindex and sit behind a session).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/sign-in'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
