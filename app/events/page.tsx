import PageLayout from '@/components/PageLayout';
import EventsClient, { PublicEvent } from './EventsClient';
import { getPublishedEvents } from '@/app/actions/events';

export default async function EventsPage() {
  const result = await getPublishedEvents();
  const rows = result.success ? result.data || [] : [];

  // Dates are serialised here so the client component gets plain JSON.
  const events: PublicEvent[] = rows.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    location: row.location,
    category: row.category,
    date: new Date(row.date).toISOString(),
    time: row.time,
    imageUrl: row.imageUrl,
  }));

  return (
    <PageLayout>
      <EventsClient events={events} />
    </PageLayout>
  );
}
