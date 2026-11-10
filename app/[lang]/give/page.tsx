import PageLayout from '@/components/PageLayout';
import GiveClient from './GiveClient';
import { getPublishedCharityPrograms } from '@/app/actions/charity';
import type { PublicCharityProgram } from '@/app/[lang]/charity/CharityClient';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { languageOf, pageTrail, staticPageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, graph } from '@/lib/structured-data';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return staticPageMetadata('give', languageOf(params));
}

export default async function GivePage({ params }: { params: { lang: string } }) {
  const language = languageOf(params);
  const result = await getPublishedCharityPrograms();
  const rows = result.success ? result.data || [] : [];

  const programs: PublicCharityProgram[] = rows.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    impact: row.impact,
    beneficiaries: row.beneficiaries,
    location: row.location,
    images: row.images || [],
  }));

  return (
    <PageLayout>
      <JsonLd data={graph(breadcrumbJsonLd(language, pageTrail(language, 'give')))} />
      <GiveClient programs={programs} />
    </PageLayout>
  );
}
