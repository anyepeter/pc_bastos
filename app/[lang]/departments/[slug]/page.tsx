import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import JsonLd from '@/components/JsonLd';
import DepartmentDetailClient from './DepartmentDetailClient';
import {
  getPublishedDepartmentBySlug,
  getPublishedDepartments,
} from '@/app/actions/departments';
import { splitActivities, splitPhoneNumbers, toPublicActivity, toPublicDepartment } from '@/lib/departments';
import { readTranslation } from '@/lib/translations';
import { languageOf, pageMetadata, pageTrail, plainText } from '@/lib/seo';
import { breadcrumbJsonLd, departmentJsonLd, graph } from '@/lib/structured-data';

/**
 * Which events count as "upcoming" changes with the clock, not only with
 * edits, so the page is refreshed hourly on top of the `revalidatePath` that
 * runs on every department or activity write.
 */
export const revalidate = 3600;

type Params = { lang: string; slug: string };

// One query per request, shared by the metadata and the page.
const loadDepartment = cache((slug: string) => getPublishedDepartmentBySlug(slug));

export async function generateStaticParams() {
  const result = await getPublishedDepartments();
  if (!result.success || !result.data) return [];

  return result.data.map((department: any) => ({ slug: department.slug }));
}

const textIn = (value: unknown, language: 'en' | 'fr') =>
  readTranslation(value)[language] || readTranslation(value).en;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const result = await loadDepartment(params.slug);
  if (!result.success || !result.data) return {};

  const language = languageOf(params);
  const row = result.data;
  const name = textIn(row.name, language);
  return pageMetadata({
    language,
    path: `/departments/${row.slug}`,
    title: name,
    description: plainText(textIn(row.summary, language) || textIn(row.mission, language)),
    image: row.coverImage || row.images?.[0] || row.logo,
    imageAlt: name,
  });
}

export default async function DepartmentPage({ params }: { params: Params }) {
  const result = await loadDepartment(params.slug);

  // A real 404 (see not-found.tsx), not a 200 page that says "not found".
  if (!result.success || !result.data) {
    notFound();
  }

  const language = languageOf(params);
  const row = result.data;
  const { upcoming, recent, projects } = splitActivities(
    (row.activities || []).map(toPublicActivity)
  );

  return (
    <PageLayout>
      <JsonLd
        data={graph(
          departmentJsonLd({
            language,
            slug: row.slug,
            name: row.name,
            acronym: row.acronym,
            summary: row.summary,
            logo: row.logo,
            email: row.email,
            phone: splitPhoneNumbers(row.phone)[0],
          }),
          breadcrumbJsonLd(language, [
            ...pageTrail(language, 'departments'),
            { name: textIn(row.name, language), path: `/departments/${row.slug}` },
          ])
        )}
      />
      <DepartmentDetailClient
        department={toPublicDepartment(row)}
        upcoming={upcoming}
        recent={recent}
        projects={projects}
      />
    </PageLayout>
  );
}
