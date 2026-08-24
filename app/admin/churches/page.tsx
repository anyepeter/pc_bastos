import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceTable } from '@/components/admin/ResourceTable';
import { memberChurchConfig } from '@/lib/admin/configs';
import { requireSuperAdminPage } from '@/lib/auth/roles';
import {
  getAllChurches,
  deleteChurch,
  toggleChurchPublish,
} from '@/app/actions/churches';

export default async function ChurchesAdminPage() {
  await requireSuperAdminPage();

  const result = await getAllChurches();
  const rows = result.success ? result.data || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {memberChurchConfig.plural}
          </h1>
          <p className="mt-2 text-gray-600">
            Manage member church pages and the accounts that can edit them
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/churches/create">
            <Plus className="mr-2 h-4 w-4" />
            Add church
          </Link>
        </Button>
      </div>

      <ResourceTable
        config={memberChurchConfig}
        rows={rows}
        onDelete={deleteChurch}
        onTogglePublish={toggleChurchPublish}
      />
    </div>
  );
}
