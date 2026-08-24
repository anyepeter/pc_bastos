import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceTable } from '@/components/admin/ResourceTable';
import { eventConfig } from '@/lib/admin/configs';
import { getAllEvents, deleteEvent, toggleEventPublish } from '@/app/actions/events';
import { requireSuperAdminPage } from '@/lib/auth/roles';

export default async function EventsAdminPage() {
  await requireSuperAdminPage();

  const result = await getAllEvents();
  const rows = result.success ? result.data || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{eventConfig.plural}</h1>
          <p className="mt-2 text-gray-600">Manage the events listed on the public site</p>
        </div>
        <Button asChild>
          <Link href={`${eventConfig.adminPath}/create`}>
            <Plus className="mr-2 h-4 w-4" />
            Create {eventConfig.singular.toLowerCase()}
          </Link>
        </Button>
      </div>

      <ResourceTable
        config={eventConfig}
        rows={rows}
        onDelete={deleteEvent}
        onTogglePublish={toggleEventPublish}
      />
    </div>
  );
}
