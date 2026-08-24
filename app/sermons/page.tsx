import PageLayout from '@/components/PageLayout';
import SermonsClient, { PublicSermon } from './SermonsClient';
import { getPublishedSermons } from '@/app/actions/sermons';

export default async function SermonsPage() {
  const result = await getPublishedSermons();
  const rows = result.success ? result.data || [] : [];

  const sermons: PublicSermon[] = rows.map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    date: new Date(row.date).toISOString(),
    duration: row.duration,
    videoUrl: row.videoUrl,
    audioUrl: row.audioUrl,
    thumbnail: row.thumbnail,
  }));

  return (
    <PageLayout>
      <SermonsClient sermons={sermons} />
    </PageLayout>
  );
}
