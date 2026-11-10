import PageLayout from '@/components/PageLayout';
import MembersClient, { PublicChurch } from './MembersClient';
import { getPublishedChurches } from '@/app/actions/churches';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { languageOf, pageTrail, staticPageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, graph, memberChurchJsonLd } from '@/lib/structured-data';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return staticPageMetadata('members', languageOf(params));
}

export default async function MembersPage({ params }: { params: { lang: string } }) {
  const language = languageOf(params);
  const result = await getPublishedChurches();
  const rows = result.success ? result.data || [] : [];

  const churches: PublicChurch[] = rows.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    denomination: row.denomination,
    leader: row.leader,
    location: row.location,
    founded: row.founded,
    logo: row.logo,
  }));

  return (
    <PageLayout>
      {/* The council and each of its member churches. */}
      <JsonLd
        data={graph(
          breadcrumbJsonLd(language, pageTrail(language, 'members')),
          ...rows.map((row: any) =>
            memberChurchJsonLd({
              language,
              slug: row.slug,
              denomination: row.denomination,
              location: row.location,
              history: row.history,
              founded: row.founded,
              logo: row.logo,
              website: row.website,
            })
          )
        )}
      />
      <MembersClient churches={churches} />
    </PageLayout>
  );
}
