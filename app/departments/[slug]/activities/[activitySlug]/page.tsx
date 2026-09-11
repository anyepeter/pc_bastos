import { cache } from 'react';
import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import ActivityDetailClient from './ActivityDetailClient';
import DepartmentNotFound from '../../DepartmentNotFound';
import {
  getPublishedActivity,
  getPublishedActivitySlugs,
} from '@/app/actions/department-activities';
import { splitActivities, toPublicActivity } from '@/lib/departments';
import { readTranslation } from '@/lib/translations';

/** "Upcoming" follows the calendar, so the page is refreshed hourly too. */
export const revalidate = 3600;

type Params = { slug: string; activitySlug: string };

const loadActivity = cache((slug: string, activitySlug: string) =>
  getPublishedActivity(slug, activitySlug)
);

export async function generateStaticParams() {
  const result = await getPublishedActivitySlugs();
  return result.success ? result.data || [] : [];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const result = await loadActivity(params.slug, params.activitySlug);
  if (!result.success || !result.data) return {};

  return {
    title: readTranslation(result.data.title).en,
    description: readTranslation(result.data.summary).en,
  };
}

export default async function DepartmentActivityPage({ params }: { params: Params }) {
  const result = await loadActivity(params.slug, params.activitySlug);

  if (!result.success || !result.data) {
    return (
      <PageLayout>
        <DepartmentNotFound messageKey="departments.activity.notFound" />
      </PageLayout>
    );
  }

  const row = result.data;
  const activity = toPublicActivity(row);
  const more = (row.more || []).map(toPublicActivity);

  // Same rule as the department page: upcoming until its last day has passed.
  const upcomingIds = splitActivities([activity, ...more]).upcoming.map((item) => item.id);

  return (
    <PageLayout>
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
