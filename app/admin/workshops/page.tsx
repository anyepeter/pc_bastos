import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceTable } from '@/components/admin/ResourceTable';
import { workshopConfig } from '@/lib/admin/configs';
import { getAllWorkshops, deleteWorkshop, toggleWorkshopPublish } from '@/app/actions/workshops';
import { requireSuperAdminPage } from '@/lib/auth/roles';

export default async function WorkshopsAdminPage() {
  await requireSuperAdminPage();

  const result = await getAllWorkshops();
  const rows = result.success ? result.data || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{workshopConfig.plural}</h1>
          <p className="mt-2 text-gray-600">Manage workshops and training sessions</p>
        </div>
        <Button asChild>
          <Link href={`${workshopConfig.adminPath}/create`}>
            <Plus className="mr-2 h-4 w-4" />
            Create {workshopConfig.singular.toLowerCase()}
          </Link>
        </Button>
      </div>

      <ResourceTable
        config={workshopConfig}
        rows={rows}
        onDelete={deleteWorkshop}
        onTogglePublish={toggleWorkshopPublish}
      />
    </div>
  );
}
