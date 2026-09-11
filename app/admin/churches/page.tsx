import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceTable, type StatusCell } from '@/components/admin/ResourceTable';
import { memberChurchConfig } from '@/lib/admin/configs';
import { requireSuperAdminPage } from '@/lib/auth/roles';
import {
  getAllChurches,
  deleteChurch,
  toggleChurchPublish,
  listAccountsByChurch,
  type ChurchAccount,
} from '@/app/actions/churches';

/** "Active" / "Temporary password" / "No login", with the email underneath. */
function loginCell(accounts: ChurchAccount[] = []): StatusCell {
  if (accounts.length === 0) {
    return { label: 'No login', tone: 'gray' };
  }

  const pending = accounts.some((account) => account.status === 'pending');
  const [first, ...rest] = accounts;

  return {
    label: pending ? 'Temporary password' : 'Active',
    tone: pending ? 'amber' : 'green',
    detail: rest.length > 0 ? `${first.email} +${rest.length} more` : first.email,
  };
}

export default async function ChurchesAdminPage() {
  await requireSuperAdminPage();

  const [result, accountsResult] = await Promise.all([
    getAllChurches(),
    listAccountsByChurch(),
  ]);
  const rows = result.success ? result.data || [] : [];
  const accountsByChurch = accountsResult.success ? accountsResult.data || {} : {};

  const cells: Record<string, StatusCell> = {};
  for (const row of rows) cells[row.id] = loginCell(accountsByChurch[row.id]);

  const withLogin = rows.filter((row) => accountsByChurch[row.id]?.length).length;
  const published = rows.filter((row) => row.published).length;

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
          {rows.length > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {rows.length} {rows.length === 1 ? 'church' : 'churches'} · {published}{' '}
              published · {withLogin} with a login
            </p>
          )}
        </div>
        <Button asChild>
          <Link href="/admin/churches/create">
            <Plus className="mr-2 h-4 w-4" />
            Add church
          </Link>
        </Button>
      </div>

      {!accountsResult.success && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Church logins could not be loaded: {accountsResult.error}
        </p>
      )}

      <ResourceTable
        config={memberChurchConfig}
        rows={rows}
        onDelete={deleteChurch}
        onTogglePublish={toggleChurchPublish}
        statusColumn={
          accountsResult.success ? { header: 'Login', cells } : undefined
        }
        deleteDescription="This permanently removes the church page, the images uploaded for it, and every login attached to it — those accounts will no longer be able to sign in. This action cannot be undone."
      />
    </div>
  );
}
