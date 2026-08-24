import PageLayout from '@/components/PageLayout';
import WorkshopsClient, { PublicWorkshop } from './WorkshopsClient';
import { getPublishedWorkshops } from '@/app/actions/workshops';

export default async function WorkshopsPage() {
  const result = await getPublishedWorkshops();
  const rows = result.success ? result.data || [] : [];

  const workshops: PublicWorkshop[] = rows.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    location: row.location,
    date: new Date(row.date).toISOString(),
    images: row.images || [],
  }));

  return (
    <PageLayout>
      <WorkshopsClient workshops={workshops} />
    </PageLayout>
  );
}
