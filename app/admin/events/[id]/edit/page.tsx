import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { eventConfig } from '@/lib/admin/configs';
import { getEventById, createEvent, updateEvent } from '@/app/actions/events';
import { toFormValues } from '@/lib/admin/resource-service';
import { requireSuperAdminPage } from '@/lib/auth/roles';

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  await requireSuperAdminPage();

  const result = await getEventById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const row = result.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={eventConfig.adminPath}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit {eventConfig.singular.toLowerCase()}
          </h1>
          <p className="mt-2 text-gray-600">
            Update the content and translations for this item
          </p>
        </div>
      </div>

      <ResourceForm
        config={eventConfig}
        recordId={row.id}
        isPublished={row.published}
        initialValues={toFormValues(eventConfig, row)}
        onCreate={createEvent}
        onUpdate={updateEvent}
      />
    </div>
  );
}
