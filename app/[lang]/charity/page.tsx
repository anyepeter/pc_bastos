import { cache } from 'react';
import PageLayout from '@/components/PageLayout';
import CharityClient, { PublicCharityProgram } from './CharityClient';
import { getPublishedCharityPrograms } from '@/app/actions/charity';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { languageOf, pageTrail, staticPageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, graph } from '@/lib/structured-data';

// One query per request, shared by the metadata and the page.
const loadPrograms = cache(() => getPublishedCharityPrograms());

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const result = await loadPrograms();
  const empty = !result.success || !result.data?.length;
  return staticPageMetadata('charity', languageOf(params), { noIndex: empty });
}

export default async function CharityPage({ params }: { params: { lang: string } }) {
  const language = languageOf(params);
  const result = await loadPrograms();
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
      <JsonLd data={graph(breadcrumbJsonLd(language, pageTrail(language, 'charity')))} />
      <CharityClient programs={programs} />
    </PageLayout>
  );
}
