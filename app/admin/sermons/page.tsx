import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceTable } from '@/components/admin/ResourceTable';
import { sermonConfig } from '@/lib/admin/configs';
import { getAllSermons, deleteSermon, toggleSermonPublish } from '@/app/actions/sermons';
import { requireSuperAdminPage } from '@/lib/auth/roles';

export default async function SermonsAdminPage() {
  await requireSuperAdminPage();

  const result = await getAllSermons();
  const rows = result.success ? result.data || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{sermonConfig.plural}</h1>
          <p className="mt-2 text-gray-600">Manage sermons, their recordings and thumbnails</p>
        </div>
        <Button asChild>
          <Link href={`${sermonConfig.adminPath}/create`}>
            <Plus className="mr-2 h-4 w-4" />
            Create {sermonConfig.singular.toLowerCase()}
          </Link>
        </Button>
      </div>

      <ResourceTable
        config={sermonConfig}
        rows={rows}
        onDelete={deleteSermon}
        onTogglePublish={toggleSermonPublish}
      />
    </div>
  );
}
