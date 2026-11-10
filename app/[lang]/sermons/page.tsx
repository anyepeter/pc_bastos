import { cache } from 'react';
import PageLayout from '@/components/PageLayout';
import SermonsClient, { PublicSermon } from './SermonsClient';
import { getPublishedSermons } from '@/app/actions/sermons';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { languageOf, pageTrail, staticPageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, graph } from '@/lib/structured-data';

// One query per request, shared by the metadata and the page.
const loadSermons = cache(() => getPublishedSermons());

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const result = await loadSermons();
  const empty = !result.success || !result.data?.length;
  return staticPageMetadata('sermons', languageOf(params), { noIndex: empty });
}

export default async function SermonsPage({ params }: { params: { lang: string } }) {
  const language = languageOf(params);
  const result = await loadSermons();
  const rows = result.success ? result.data || [] : [];

  const sermons: PublicSermon[] = rows.map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    date: new Date(row.date).toISOString(),
    duration: row.duration,
    videoUrl: row.videoUrl,
    audioUrl: row.audioUrl,
    thumbnail: row.thumbnail,
  }));

  return (
    <PageLayout>
      <JsonLd data={graph(breadcrumbJsonLd(language, pageTrail(language, 'sermons')))} />
      <SermonsClient sermons={sermons} />
    </PageLayout>
  );
}
