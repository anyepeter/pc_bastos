import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceTable, type StatusCell } from '@/components/admin/ResourceTable';
import { boardMemberConfig } from '@/lib/admin/configs';
import { officeLabel } from '@/lib/board';
import {
  getAllBoardMembers,
  deleteBoardMember,
  toggleBoardMemberPublish,
} from '@/app/actions/board';
import { requireSuperAdminPage } from '@/lib/auth/roles';

export default async function BoardAdminPage() {
  await requireSuperAdminPage();

  const result = await getAllBoardMembers();
  const rows = result.success ? result.data || [] : [];

  // Where each member sits in the chart, with their order in the row.
  const cells: Record<string, StatusCell> = {};
  for (const row of rows) {
    cells[row.id] = {
      label: officeLabel(row.office),
      tone: row.office === 'president' ? 'green' : 'gray',
      detail: `Order ${row.sortOrder ?? 0}`,
    };
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{boardMemberConfig.plural}</h1>
          <p className="mt-2 text-gray-600">
            The people in the organogram on the Board page. The General Secretary also heads the
            General Secretariat page.
          </p>
        </div>
        <Button asChild>
          <Link href={`${boardMemberConfig.adminPath}/create`}>
            <Plus className="mr-2 h-4 w-4" />
            Add board member
          </Link>
        </Button>
      </div>

      {!result.success && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          The board could not be loaded. Refresh the page; if it keeps happening, the database may
          be unreachable.
        </p>
      )}

      <ResourceTable
        config={boardMemberConfig}
        rows={rows}
        onDelete={deleteBoardMember}
        onTogglePublish={toggleBoardMemberPublish}
        statusColumn={{ header: 'Place in chart', cells }}
      />
    </div>
  );
}
