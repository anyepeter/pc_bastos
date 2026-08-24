import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import EventDetailClient from './EventDetailClient';
import type { PublicEvent } from '../EventsClient';
import { getPublishedEventBySlug, getPublishedEvents } from '@/app/actions/events';

// `params.id` is the slug, matching the blog route convention.
export async function generateStaticParams() {
  const result = await getPublishedEvents();
  if (!result.success || !result.data) return [];

  return result.data.map((event: any) => ({ id: event.slug }));
}

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getPublishedEventBySlug(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const row = result.data;
  const event: PublicEvent = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    location: row.location,
    category: row.category,
    date: new Date(row.date).toISOString(),
    time: row.time,
    imageUrl: row.imageUrl,
  };

  return (
    <PageLayout>
      <EventDetailClient event={event} />
    </PageLayout>
  );
}
