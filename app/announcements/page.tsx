import PageLayout from '@/components/PageLayout';
import AnnouncementsClient, { PublicAnnouncement } from './AnnouncementsClient';
import { getPublishedAnnouncements } from '@/app/actions/announcements';

export default async function AnnouncementsPage() {
  const result = await getPublishedAnnouncements();
  const rows = result.success ? result.data || [] : [];

  const announcements: PublicAnnouncement[] = rows.map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    fullContent: row.fullContent,
    date: new Date(row.date).toISOString(),
    priority: row.priority,
    imageUrl: row.imageUrl,
  }));

  return (
    <PageLayout>
      <AnnouncementsClient announcements={announcements} />
    </PageLayout>
  );
}
