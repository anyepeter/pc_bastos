import { cache } from 'react';
import PageLayout from '@/components/PageLayout';
import EventsClient, { PublicEvent } from './EventsClient';
import { getPublishedEvents } from '@/app/actions/events';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { languageOf, pageTrail, staticPageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, graph } from '@/lib/structured-data';

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

// One query per request, shared by the metadata and the page.
const loadEvents = cache(() => getPublishedEvents());

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const result = await loadEvents();
  const empty = !result.success || !result.data?.length;
  return staticPageMetadata('events', languageOf(params), { noIndex: empty });
}

export default async function EventsPage({ params }: { params: { lang: string } }) {
  const language = languageOf(params);
  const result = await loadEvents();
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
      <JsonLd data={graph(breadcrumbJsonLd(language, pageTrail(language, 'events')))} />
      <EventsClient events={diaryOrder(events)} />
    </PageLayout>
  );
}
