import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import JsonLd from '@/components/JsonLd';
import WorkshopClient, { PublicWorkshopDetail } from './WorkshopClient';
import {
  getPublishedWorkshopBySlug,
  getPublishedWorkshops,
} from '@/app/actions/workshops';
import { readTranslation } from '@/lib/translations';
import { languageOf, pageMetadata, pageTrail, plainText } from '@/lib/seo';
import { breadcrumbJsonLd, eventJsonLd, graph } from '@/lib/structured-data';

type Params = { lang: string; id: string };

const loadWorkshop = cache((slug: string) => getPublishedWorkshopBySlug(slug));

// `params.id` is the slug, matching the blog route convention.
export async function generateStaticParams() {
  const result = await getPublishedWorkshops();
  if (!result.success || !result.data) return [];

  return result.data.map((workshop: any) => ({ id: workshop.slug }));
}

const textIn = (value: unknown, language: 'en' | 'fr') =>
  readTranslation(value)[language] || readTranslation(value).en;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const result = await loadWorkshop(params.id);
  if (!result.success || !result.data) return {};

  const language = languageOf(params);
  const row = result.data;
  const title = textIn(row.title, language);
  return pageMetadata({
    language,
    path: `/workshops/${row.slug}`,
    title,
    description: plainText(textIn(row.description, language)),
    image: row.images?.[0],
    imageAlt: title,
  });
}

export default async function WorkshopDetailPage({ params }: { params: Params }) {
  const result = await loadWorkshop(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const language = languageOf(params);
  const row = result.data;
  const workshop: PublicWorkshopDetail = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    fullDescription: row.fullDescription,
    location: row.location,
    duration: row.duration,
    capacity: row.capacity,
    date: new Date(row.date).toISOString(),
    images: row.images || [],
  };

  const title = textIn(row.title, language);

  return (
    <PageLayout>
      <JsonLd
        data={graph(
          eventJsonLd({
            language,
            type: 'EducationEvent',
            path: `/workshops/${row.slug}`,
            name: title,
            description: textIn(row.fullDescription, language) || textIn(row.description, language),
            date: workshop.date,
            location: textIn(row.location, language),
            images: row.images || [],
          }),
          breadcrumbJsonLd(language, [...pageTrail(language, 'workshops'), { name: title, path: `/workshops/${row.slug}` }])
        )}
      />
      <WorkshopClient workshop={workshop} />
    </PageLayout>
  );
}
