import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import GiveClient from './GiveClient';
import { getPublishedCharityPrograms } from '@/app/actions/charity';
import type { PublicCharityProgram } from '@/app/charity/CharityClient';

export const metadata: Metadata = {
  title: 'Give | CEPCA',
  description:
    'Support the work of CEPCA member churches across Cameroon — education, healthcare, clean water and pastoral care.',
};

export default async function GivePage() {
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
      <GiveClient programs={programs} />
    </PageLayout>
  );
}
