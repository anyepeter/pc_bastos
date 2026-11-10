import { cache } from 'react';
import PageLayout from '@/components/PageLayout';
import WorkshopsClient, { PublicWorkshop } from './WorkshopsClient';
import { getPublishedWorkshops } from '@/app/actions/workshops';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { languageOf, pageTrail, staticPageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, graph } from '@/lib/structured-data';

// One query per request, shared by the metadata and the page.
const loadWorkshops = cache(() => getPublishedWorkshops());

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const result = await loadWorkshops();
  const empty = !result.success || !result.data?.length;
  return staticPageMetadata('workshops', languageOf(params), { noIndex: empty });
}

export default async function WorkshopsPage({ params }: { params: { lang: string } }) {
  const language = languageOf(params);
  const result = await loadWorkshops();
  const rows = result.success ? result.data || [] : [];

  const workshops: PublicWorkshop[] = rows.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    location: row.location,
    date: new Date(row.date).toISOString(),
    images: row.images || [],
  }));

  return (
    <PageLayout>
      <JsonLd data={graph(breadcrumbJsonLd(language, pageTrail(language, 'workshops')))} />
      <WorkshopsClient workshops={workshops} />
    </PageLayout>
  );
}
