import { cache } from 'react';
import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import DepartmentDetailClient from './DepartmentDetailClient';
import DepartmentNotFound from './DepartmentNotFound';
import {
  getPublishedDepartmentBySlug,
  getPublishedDepartments,
} from '@/app/actions/departments';
import { splitActivities, toPublicActivity, toPublicDepartment } from '@/lib/departments';
import { readTranslation } from '@/lib/translations';

/**
 * Which events count as "upcoming" changes with the clock, not only with
 * edits, so the page is refreshed hourly on top of the `revalidatePath` that
 * runs on every department or activity write.
 */
export const revalidate = 3600;

// One query per request, shared by the metadata and the page.
const loadDepartment = cache((slug: string) => getPublishedDepartmentBySlug(slug));

export async function generateStaticParams() {
  const result = await getPublishedDepartments();
  if (!result.success || !result.data) return [];

  return result.data.map((department: any) => ({ slug: department.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = await loadDepartment(params.slug);
  if (!result.success || !result.data) return {};

  const name = readTranslation(result.data.name).en;
  const description = readTranslation(result.data.summary).en;
  return { title: name, description };
}

export default async function DepartmentPage({ params }: { params: { slug: string } }) {
  const result = await loadDepartment(params.slug);

  if (!result.success || !result.data) {
    return (
      <PageLayout>
        <DepartmentNotFound />
      </PageLayout>
    );
  }

  const row = result.data;
  const { upcoming, recent, projects } = splitActivities(
    (row.activities || []).map(toPublicActivity)
  );

  return (
    <PageLayout>
      <DepartmentDetailClient
        department={toPublicDepartment(row)}
        upcoming={upcoming}
        recent={recent}
        projects={projects}
      />
    </PageLayout>
  );
}
