import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceTable } from '@/components/admin/ResourceTable';
import { newsConfig } from '@/lib/admin/configs';
import { getAllNews, deleteNews, toggleNewsPublish } from '@/app/actions/news';
import { requireSuperAdminPage } from '@/lib/auth/roles';

export default async function NewsAdminPage() {
  await requireSuperAdminPage();

  const result = await getAllNews();
  const rows = result.success ? result.data || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{newsConfig.plural}</h1>
          <p className="mt-2 text-gray-600">Council news — reported items, milestones and appointments</p>
        </div>
        <Button asChild>
          <Link href={`${newsConfig.adminPath}/create`}>
            <Plus className="mr-2 h-4 w-4" />
            Create {newsConfig.singular.toLowerCase()}
          </Link>
        </Button>
      </div>

      <ResourceTable
        config={newsConfig}
        rows={rows}
        onDelete={deleteNews}
        onTogglePublish={toggleNewsPublish}
      />
    </div>
  );
}
