import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import JsonLd from '@/components/JsonLd';
import EventDetailClient from './EventDetailClient';
import type { PublicEvent } from '../EventsClient';
import { getPublishedEventBySlug, getPublishedEvents } from '@/app/actions/events';
import { readTranslation } from '@/lib/translations';
import { languageOf, pageMetadata, pageTrail, plainText } from '@/lib/seo';
import { breadcrumbJsonLd, eventJsonLd, graph } from '@/lib/structured-data';

type Params = { lang: string; id: string };

// One query per request, shared by the metadata and the page.
const loadEvent = cache((slug: string) => getPublishedEventBySlug(slug));

// `params.id` is the slug, matching the blog route convention.
export async function generateStaticParams() {
  const result = await getPublishedEvents();
  if (!result.success || !result.data) return [];

  return result.data.map((event: any) => ({ id: event.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const result = await loadEvent(params.id);
  if (!result.success || !result.data) return {};

  const language = languageOf(params);
  const row = result.data;
  const title = readTranslation(row.title)[language] || readTranslation(row.title).en;
  return pageMetadata({
    language,
    path: `/events/${row.slug}`,
    title,
    description: plainText(readTranslation(row.description)[language] || readTranslation(row.description).en),
    image: row.imageUrl,
    imageAlt: title,
  });
}

export default async function EventDetailPage({ params }: { params: Params }) {
  const result = await loadEvent(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const language = languageOf(params);
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
    images: row.images || [],
  };

  const text = (value: unknown) => readTranslation(value)[language] || readTranslation(value).en;
  const title = text(row.title);

  return (
    <PageLayout>
      <JsonLd
        data={graph(
          eventJsonLd({
            language,
            path: `/events/${row.slug}`,
            name: title,
            description: text(row.description),
            date: event.date,
            time: row.time,
            location: text(row.location),
            images: [row.imageUrl, ...(row.images || [])],
          }),
          breadcrumbJsonLd(language, [...pageTrail(language, 'events'), { name: title, path: `/events/${row.slug}` }])
        )}
      />
      <EventDetailClient event={event} />
    </PageLayout>
  );
}
