import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceTable } from '@/components/admin/ResourceTable';
import { announcementConfig } from '@/lib/admin/configs';
import { getAllAnnouncements, deleteAnnouncement, toggleAnnouncementPublish } from '@/app/actions/announcements';
import { requireSuperAdminPage } from '@/lib/auth/roles';

export default async function AnnouncementsAdminPage() {
  await requireSuperAdminPage();

  const result = await getAllAnnouncements();
  const rows = result.success ? result.data || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{announcementConfig.plural}</h1>
          <p className="mt-2 text-gray-600">Manage the announcements shown to member churches</p>
        </div>
        <Button asChild>
          <Link href={`${announcementConfig.adminPath}/create`}>
            <Plus className="mr-2 h-4 w-4" />
            Create {announcementConfig.singular.toLowerCase()}
          </Link>
        </Button>
      </div>

      <ResourceTable
        config={announcementConfig}
        rows={rows}
        onDelete={deleteAnnouncement}
        onTogglePublish={toggleAnnouncementPublish}
      />
    </div>
  );
}
