import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import JsonLd from '@/components/JsonLd';
import MemberDetailClient, { PublicChurchDetail } from './MemberDetailClient';
import {
  getPublishedChurchBySlug,
  getPublishedChurches,
} from '@/app/actions/churches';
import { readTranslation } from '@/lib/translations';
import { languageOf, pageMetadata, pageTrail, plainText } from '@/lib/seo';
import { breadcrumbJsonLd, graph, memberChurchJsonLd } from '@/lib/structured-data';

type Params = { lang: string; slug: string };

const loadChurch = cache((slug: string) => getPublishedChurchBySlug(slug));

export async function generateStaticParams() {
  const result = await getPublishedChurches();
  if (!result.success || !result.data) return [];

  return result.data.map((church: any) => ({ slug: church.slug }));
}

const textIn = (value: unknown, language: 'en' | 'fr') =>
  readTranslation(value)[language] || readTranslation(value).en;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const result = await loadChurch(params.slug);
  if (!result.success || !result.data) return {};

  const language = languageOf(params);
  const row = result.data;
  const name = textIn(row.denomination, language);
  const town = textIn(row.location, language);
  const lead =
    language === 'fr'
      ? `${name}, Église membre du Conseil des Églises Protestantes du Cameroun${town ? ` (${town})` : ''}.`
      : `${name}, a member church of the Council of Protestant Churches of Cameroon${town ? ` (${town})` : ''}.`;

  return pageMetadata({
    language,
    path: `/members/${row.slug}`,
    title: name,
    description: plainText(`${lead} ${textIn(row.history, language)}`),
    image: row.images?.[0] || row.logo,
    imageAlt: name,
  });
}

export default async function MemberDetailPage({ params }: { params: Params }) {
  const result = await loadChurch(params.slug);

  // A real 404 (see not-found.tsx), not a 200 page that says "not found".
  if (!result.success || !result.data) {
    notFound();
  }

  const language = languageOf(params);
  const row = result.data;
  const member: PublicChurchDetail = {
    id: row.id,
    slug: row.slug,
    denomination: row.denomination,
    leader: row.leader,
    location: row.location,
    history: row.history,
    images: row.images || [],
    founded: row.founded,
    logo: row.logo,
    leaderPhoto: row.leaderPhoto ?? null,
    phone: row.phone,
    email: row.email,
    address: row.address,
    website: row.website,
  };

  return (
    <PageLayout>
      <JsonLd
        data={graph(
          memberChurchJsonLd({
            language,
            slug: row.slug,
            denomination: row.denomination,
            location: row.location,
            history: row.history,
            founded: row.founded,
            logo: row.logo,
            website: row.website,
          }),
          breadcrumbJsonLd(language, [
            ...pageTrail(language, 'members'),
            { name: textIn(row.denomination, language), path: `/members/${row.slug}` },
          ])
        )}
      />
      <MemberDetailClient member={member} />
    </PageLayout>
  );
}
