import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import JsonLd from '@/components/JsonLd';
import ActivityDetailClient from './ActivityDetailClient';
import {
  getPublishedActivity,
  getPublishedActivitySlugs,
} from '@/app/actions/department-activities';
import { getSiteSettings } from '@/app/actions/settings';
import { splitActivities, toPublicActivity } from '@/lib/departments';
import { readTranslation } from '@/lib/translations';
import { languageOf, pageMetadata, pageTrail, plainText } from '@/lib/seo';
import { articleJsonLd, breadcrumbJsonLd, eventJsonLd, graph } from '@/lib/structured-data';

/** "Upcoming" follows the calendar, so the page is refreshed hourly too. */
export const revalidate = 3600;

type Params = { lang: string; slug: string; activitySlug: string };

const loadActivity = cache((slug: string, activitySlug: string) =>
  getPublishedActivity(slug, activitySlug)
);

export async function generateStaticParams() {
  const result = await getPublishedActivitySlugs();
  return result.success ? result.data || [] : [];
}

const textIn = (value: unknown, language: 'en' | 'fr') =>
  readTranslation(value)[language] || readTranslation(value).en;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const result = await loadActivity(params.slug, params.activitySlug);
  if (!result.success || !result.data) return {};

  const language = languageOf(params);
  const row = result.data;
  const title = textIn(row.title, language);
  return pageMetadata({
    language,
    path: `/departments/${row.department.slug}/activities/${row.slug}`,
    title,
    description: plainText(textIn(row.summary, language) || textIn(row.body, language)),
    image: row.imageUrl || row.images?.[0],
    imageAlt: title,
  });
}

export default async function DepartmentActivityPage({ params }: { params: Params }) {
  const result = await loadActivity(params.slug, params.activitySlug);

  // A real 404 (see not-found.tsx), not a 200 page that says "not found".
  if (!result.success || !result.data) {
    notFound();
  }

  const language = languageOf(params);
  const row = result.data;
  const activity = toPublicActivity(row);
  const more = (row.more || []).map(toPublicActivity);

  // Same rule as the department page: upcoming until its last day has passed.
  const upcomingIds = splitActivities([activity, ...more]).upcoming.map((item) => item.id);

  const path = `/departments/${row.department.slug}/activities/${row.slug}`;
  const title = textIn(row.title, language);
  const summary = textIn(row.summary, language);
  // An event is marked up as one; a report or a project as an article.
  const structured =
    activity.kind === 'event'
      ? eventJsonLd({
          language,
          path,
          name: title,
          description: textIn(row.body, language) || summary,
          date: activity.date,
          endDate: activity.endDate,
          time: activity.time,
          location: textIn(row.location, language),
          images: [activity.imageUrl, ...activity.images],
        })
      : articleJsonLd({
          language,
          path,
          type: 'NewsArticle',
          headline: title,
          description: plainText(summary, 300),
          image: activity.imageUrl || activity.images[0],
          datePublished: activity.date,
          dateModified: new Date(row.updatedAt).toISOString(),
          settings: await getSiteSettings(),
        });

  return (
    <PageLayout>
      <JsonLd
        data={graph(
          structured,
          breadcrumbJsonLd(language, [
            ...pageTrail(language, 'departments'),
            { name: textIn(row.department.name, language), path: `/departments/${row.department.slug}` },
            { name: title, path },
          ])
        )}
      />
      <ActivityDetailClient
        activity={activity}
        department={{
          slug: row.department.slug,
          acronym: row.department.acronym,
          name: row.department.name,
        }}
        more={more}
        upcoming={upcomingIds.includes(activity.id)}
        upcomingIds={upcomingIds}
      />
    </PageLayout>
  );
}
