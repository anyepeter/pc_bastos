import { cache } from 'react';
import PageLayout from '@/components/PageLayout';
import AnnouncementsClient, { PublicAnnouncement } from './AnnouncementsClient';
import { getPublishedAnnouncements } from '@/app/actions/announcements';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { languageOf, pageTrail, staticPageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, graph } from '@/lib/structured-data';

// One query per request, shared by the metadata and the page.
const loadAnnouncements = cache(() => getPublishedAnnouncements());

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const result = await loadAnnouncements();
  const empty = !result.success || !result.data?.length;
  return staticPageMetadata('announcements', languageOf(params), { noIndex: empty });
}

export default async function AnnouncementsPage({ params }: { params: { lang: string } }) {
  const language = languageOf(params);
  const result = await loadAnnouncements();
  const rows = result.success ? result.data || [] : [];

  const announcements: PublicAnnouncement[] = rows.map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    fullContent: row.fullContent,
    date: new Date(row.date).toISOString(),
    priority: row.priority,
    imageUrl: row.imageUrl,
  }));

  return (
    <PageLayout>
      <JsonLd data={graph(breadcrumbJsonLd(language, pageTrail(language, 'announcements')))} />
      <AnnouncementsClient announcements={announcements} />
    </PageLayout>
  );
}
