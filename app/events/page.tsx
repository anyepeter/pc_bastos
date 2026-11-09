import PageLayout from '@/components/PageLayout';
import EventsClient, { PublicEvent } from './EventsClient';
import { getPublishedEvents } from '@/app/actions/events';

/**
 * The page lists past events as well as coming ones, and which is which
 * changes with the clock, so it is refreshed hourly on top of the
 * `revalidatePath('/events')` that runs whenever an event is saved.
 */
export const revalidate = 3600;

/**
 * Coming events first, soonest at the top; then past events, most recent
 * first, so an old report never pushes next month's assembly down the page.
 */
function diaryOrder(events: PublicEvent[]): PublicEvent[] {
  const now = Date.now();
  const time = (event: PublicEvent) => new Date(event.date).getTime();
  const upcoming = events.filter((e) => time(e) > now).sort((a, b) => time(a) - time(b));
  const past = events.filter((e) => time(e) <= now).sort((a, b) => time(b) - time(a));
  return [...upcoming, ...past];
}

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
      <EventsClient events={diaryOrder(events)} />
    </PageLayout>
  );
}
