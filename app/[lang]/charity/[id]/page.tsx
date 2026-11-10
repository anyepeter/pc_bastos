import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import JsonLd from '@/components/JsonLd';
import CharityDetailClient, { PublicCharityDetail } from './CharityDetailClient';
import {
  getPublishedCharityProgramBySlug,
  getPublishedCharityPrograms,
} from '@/app/actions/charity';
import { readTranslation } from '@/lib/translations';
import { languageOf, pageMetadata, pageTrail, plainText } from '@/lib/seo';
import { breadcrumbJsonLd, graph } from '@/lib/structured-data';

type Params = { lang: string; id: string };

const loadProgram = cache((slug: string) => getPublishedCharityProgramBySlug(slug));

// `params.id` is the slug, matching the blog route convention.
export async function generateStaticParams() {
  const result = await getPublishedCharityPrograms();
  if (!result.success || !result.data) return [];

  return result.data.map((program: any) => ({ id: program.slug }));
}

const textIn = (value: unknown, language: 'en' | 'fr') =>
  readTranslation(value)[language] || readTranslation(value).en;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const result = await loadProgram(params.id);
  if (!result.success || !result.data) return {};

  const language = languageOf(params);
  const row = result.data;
  const title = textIn(row.title, language);
  return pageMetadata({
    language,
    path: `/charity/${row.slug}`,
    title,
    description: plainText(textIn(row.description, language)),
    image: row.images?.[0],
    imageAlt: title,
  });
}

export default async function CharityDetailPage({ params }: { params: Params }) {
  const result = await loadProgram(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const language = languageOf(params);
  const row = result.data;
  const charity: PublicCharityDetail = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    fullDescription: row.fullDescription,
    impact: row.impact,
    beneficiaries: row.beneficiaries,
    location: row.location,
    date: row.date ? new Date(row.date).toISOString() : null,
    images: row.images || [],
  };

  return (
    <PageLayout>
      <JsonLd
        data={graph(
          breadcrumbJsonLd(language, [
            ...pageTrail(language, 'charity'),
            { name: textIn(row.title, language), path: `/charity/${row.slug}` },
          ])
        )}
      />
      <CharityDetailClient charity={charity} />
    </PageLayout>
  );
}
