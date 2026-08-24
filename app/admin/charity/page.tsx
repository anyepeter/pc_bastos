import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceTable } from '@/components/admin/ResourceTable';
import { charityConfig } from '@/lib/admin/configs';
import { getAllCharityPrograms, deleteCharityProgram, toggleCharityProgramPublish } from '@/app/actions/charity';
import { requireSuperAdminPage } from '@/lib/auth/roles';

export default async function CharityProgramsAdminPage() {
  await requireSuperAdminPage();

  const result = await getAllCharityPrograms();
  const rows = result.success ? result.data || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{charityConfig.plural}</h1>
          <p className="mt-2 text-gray-600">Manage charity programs and their progress</p>
        </div>
        <Button asChild>
          <Link href={`${charityConfig.adminPath}/create`}>
            <Plus className="mr-2 h-4 w-4" />
            Create {charityConfig.singular.toLowerCase()}
          </Link>
        </Button>
      </div>

      <ResourceTable
        config={charityConfig}
        rows={rows}
        onDelete={deleteCharityProgram}
        onTogglePublish={toggleCharityProgramPublish}
      />
    </div>
  );
}
