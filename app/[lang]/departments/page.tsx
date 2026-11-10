import PageLayout from '@/components/PageLayout';
import DepartmentsClient from './DepartmentsClient';
import { getPublishedDepartments } from '@/app/actions/departments';
import { toPublicDepartmentSummary } from '@/lib/departments';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { languageOf, pageTrail, staticPageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, graph } from '@/lib/structured-data';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return staticPageMetadata('departments', languageOf(params));
}

export default async function DepartmentsPage({ params }: { params: { lang: string } }) {
  const language = languageOf(params);
  // A failed read comes back as an empty list, which the client answers with
  // the council's original list from the locale files.
  const result = await getPublishedDepartments();
  const rows = result.success ? result.data || [] : [];

  return (
    <PageLayout>
      <JsonLd data={graph(breadcrumbJsonLd(language, pageTrail(language, 'departments')))} />
      <DepartmentsClient departments={rows.map(toPublicDepartmentSummary)} />
    </PageLayout>
  );
}
