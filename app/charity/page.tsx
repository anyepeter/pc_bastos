import PageLayout from '@/components/PageLayout';
import CharityClient, { PublicCharityProgram } from './CharityClient';
import { getPublishedCharityPrograms } from '@/app/actions/charity';

export default async function CharityPage() {
  const result = await getPublishedCharityPrograms();
  const rows = result.success ? result.data || [] : [];

  const programs: PublicCharityProgram[] = rows.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    impact: row.impact,
    beneficiaries: row.beneficiaries,
    location: row.location,
    images: row.images || [],
  }));

  return (
    <PageLayout>
      <CharityClient programs={programs} />
    </PageLayout>
  );
}
