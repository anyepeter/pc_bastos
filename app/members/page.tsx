import PageLayout from '@/components/PageLayout';
import MembersClient, { PublicChurch } from './MembersClient';
import { getPublishedChurches } from '@/app/actions/churches';

export default async function MembersPage() {
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
      <MembersClient churches={churches} />
    </PageLayout>
  );
}
