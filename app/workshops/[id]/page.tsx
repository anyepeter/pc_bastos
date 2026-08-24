import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import WorkshopClient, { PublicWorkshopDetail } from './WorkshopClient';
import {
  getPublishedWorkshopBySlug,
  getPublishedWorkshops,
} from '@/app/actions/workshops';

// `params.id` is the slug, matching the blog route convention.
export async function generateStaticParams() {
  const result = await getPublishedWorkshops();
  if (!result.success || !result.data) return [];

  return result.data.map((workshop: any) => ({ id: workshop.slug }));
}

export default async function WorkshopDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getPublishedWorkshopBySlug(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

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

  return (
    <PageLayout>
      <WorkshopClient workshop={workshop} />
    </PageLayout>
  );
}
