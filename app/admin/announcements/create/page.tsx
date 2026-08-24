import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { announcementConfig } from '@/lib/admin/configs';
import { createAnnouncement, updateAnnouncement } from '@/app/actions/announcements';
import { requireSuperAdminPage } from '@/lib/auth/roles';

export default async function CreateAnnouncementPage() {
  await requireSuperAdminPage();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={announcementConfig.adminPath}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            New {announcementConfig.singular.toLowerCase()}
          </h1>
          <p className="mt-2 text-gray-600">
            Write the English version, then add the French translation before publishing
          </p>
        </div>
      </div>

      <ResourceForm
        config={announcementConfig}
        onCreate={createAnnouncement}
        onUpdate={updateAnnouncement}
      />
    </div>
  );
}
