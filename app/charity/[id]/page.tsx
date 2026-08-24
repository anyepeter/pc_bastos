import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import CharityDetailClient, { PublicCharityDetail } from './CharityDetailClient';
import {
  getPublishedCharityProgramBySlug,
  getPublishedCharityPrograms,
} from '@/app/actions/charity';

// `params.id` is the slug, matching the blog route convention.
export async function generateStaticParams() {
  const result = await getPublishedCharityPrograms();
  if (!result.success || !result.data) return [];

  return result.data.map((program: any) => ({ id: program.slug }));
}

export default async function CharityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getPublishedCharityProgramBySlug(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

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
      <CharityDetailClient charity={charity} />
    </PageLayout>
  );
}
