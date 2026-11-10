import type { MetadataRoute } from 'next';
import { LANGUAGES } from '@/lib/translations';
import { languageAlternates, pageUrl } from '@/lib/seo';
import { getSiteIndex } from '@/lib/site-index';

/** Rebuilt hourly, like the pages it lists (and on every deploy). */
export const revalidate = 3600;

/**
 * Every public page in both languages. Each entry names its twin in the other
 * language (hreflang), so search engines pair /events with /fr/events.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const index = await getSiteIndex();

  const entries: { path: string; lastModified?: Date; priority: number }[] = [
    ...index.pages.map(({ key, path }) => ({
      path,
      priority: key === 'home' ? 1 : ['members', 'events', 'news', 'about', 'departments'].includes(key) ? 0.8 : 0.6,
    })),
    ...[...index.events, ...index.news, ...index.blogs].map((item) => ({
      path: item.path,
      lastModified: item.lastModified,
      priority: 0.7,
    })),
    ...[...index.churches, ...index.departments, ...index.workshops, ...index.charity].map((item) => ({
      path: item.path,
      lastModified: item.lastModified,
      priority: 0.7,
    })),
    ...index.activities.map((item) => ({ path: item.path, priority: 0.5 })),
  ];

  return entries.flatMap(({ path, lastModified, priority }) =>
    LANGUAGES.map((language) => ({
      url: pageUrl(path, language),
      ...(lastModified ? { lastModified } : {}),
      priority,
      alternates: { languages: languageAlternates(path) },
    }))
  );
}
