import { getPublishedBlogPosts } from '@/app/actions/blog-public';
import { getPublishedCharityPrograms } from '@/app/actions/charity';
import { getPublishedAnnouncements } from '@/app/actions/announcements';
import { getPublishedActivitySlugs } from '@/app/actions/department-activities';
import { getPublishedChurches } from '@/app/actions/churches';
import { getPublishedEvents } from '@/app/actions/events';
import { getPublishedSermons } from '@/app/actions/sermons';
import { getPublishedDepartments } from '@/app/actions/departments';
import { getPublishedNews } from '@/app/actions/news';
import { getPublishedBoardMembers } from '@/app/actions/board';
import { getPublishedWorkshops } from '@/app/actions/workshops';
import { readTranslation, type Translation } from '@/lib/translations';
import { PAGE_PATHS, type PageKey } from '@/lib/seo';

/**
 * Everything published on the site, read once for the sitemap and llms.txt.
 * A failed read counts as empty — these files must never take the site down.
 */

type Row = Record<string, any>;

const rows = async (result: Promise<{ success: boolean; data?: unknown }>): Promise<Row[]> => {
  try {
    const outcome = await result;
    return outcome.success && Array.isArray(outcome.data) ? (outcome.data as Row[]) : [];
  } catch {
    return [];
  }
};

export interface IndexedItem {
  path: string;
  title: Translation;
  summary: Translation;
  date?: Date;
  lastModified?: Date;
  extra?: Record<string, string | null | undefined>;
}

export interface SiteIndex {
  /** Fixed pages worth indexing — list pages with nothing published are left out. */
  pages: { key: PageKey; path: string }[];
  events: IndexedItem[];
  news: IndexedItem[];
  blogs: IndexedItem[];
  workshops: IndexedItem[];
  charity: IndexedItem[];
  churches: IndexedItem[];
  departments: IndexedItem[];
  activities: { path: string }[];
  board: { name: string; office: string; title: Translation }[];
}

const date = (value: unknown) => (value ? new Date(value as string) : undefined);

export async function getSiteIndex(): Promise<SiteIndex> {
  const [events, news, blogs, workshops, charity, churches, departments, activities, announcements, sermons, board] =
    await Promise.all([
      rows(getPublishedEvents()),
      rows(getPublishedNews()),
      rows(getPublishedBlogPosts()),
      rows(getPublishedWorkshops()),
      rows(getPublishedCharityPrograms()),
      rows(getPublishedChurches()),
      rows(getPublishedDepartments()),
      rows(getPublishedActivitySlugs()),
      rows(getPublishedAnnouncements()),
      rows(getPublishedSermons()),
      rows(getPublishedBoardMembers()),
    ]);

  // An empty list page is thin content: keep it out until it has something.
  const emptyLists = new Set<PageKey>([
    ...(blogs.length ? [] : (['blogs'] as const)),
    ...(workshops.length ? [] : (['workshops'] as const)),
    ...(charity.length ? [] : (['charity'] as const)),
    ...(sermons.length ? [] : (['sermons'] as const)),
    ...(announcements.length ? [] : (['announcements'] as const)),
    ...(events.length ? [] : (['events'] as const)),
    ...(news.length ? [] : (['news'] as const)),
  ]);

  const pages = (Object.keys(PAGE_PATHS) as PageKey[])
    .filter((key) => !emptyLists.has(key))
    .map((key) => ({ key, path: PAGE_PATHS[key] }));

  return {
    pages,
    events: events
      .map((row) => ({
        path: `/events/${row.slug}`,
        title: readTranslation(row.title),
        summary: readTranslation(row.description),
        date: date(row.date),
        lastModified: date(row.updatedAt),
        extra: { location: readTranslation(row.location).en, time: row.time },
      }))
      .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0)),
    news: news
      .map((row) => ({
        path: `/news/${row.slug}`,
        title: readTranslation(row.title),
        summary: readTranslation(row.excerpt),
        date: date(row.date),
        lastModified: date(row.updatedAt),
      }))
      .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0)),
    blogs: blogs.map((row) => ({
      path: `/blogs/${row.slug}`,
      title: readTranslation(row.title),
      summary: readTranslation(row.description),
      date: date(row.createdAt),
      lastModified: date(row.updatedAt),
    })),
    workshops: workshops.map((row) => ({
      path: `/workshops/${row.slug}`,
      title: readTranslation(row.title),
      summary: readTranslation(row.description),
      date: date(row.date),
      lastModified: date(row.updatedAt),
    })),
    charity: charity.map((row) => ({
      path: `/charity/${row.slug}`,
      title: readTranslation(row.title),
      summary: readTranslation(row.description),
      lastModified: date(row.updatedAt),
    })),
    churches: churches.map((row) => ({
      path: `/members/${row.slug}`,
      title: readTranslation(row.denomination),
      summary: readTranslation(row.history),
      lastModified: date(row.updatedAt),
      extra: {
        location: readTranslation(row.location).en,
        founded: row.founded,
        website: row.website,
        leader: readTranslation(row.leader).en,
      },
    })),
    departments: departments.map((row) => ({
      path: `/departments/${row.slug}`,
      title: readTranslation(row.name),
      summary: readTranslation(row.summary),
      lastModified: date(row.updatedAt),
      extra: { acronym: row.acronym },
    })),
    activities: activities
      .filter((row) => row.slug && row.activitySlug)
      .map((row) => ({ path: `/departments/${row.slug}/activities/${row.activitySlug}` })),
    board: board.map((row) => ({
      name: typeof row.name === 'string' ? row.name.trim() : '',
      office: row.office,
      title: readTranslation(row.title),
    })),
  };
}
