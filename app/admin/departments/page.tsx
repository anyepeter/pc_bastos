import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceTable, type StatusCell } from '@/components/admin/ResourceTable';
import { departmentConfig } from '@/lib/admin/configs';
import { DEPARTMENT_SEEDS } from '@/lib/departments-seed';
import { requireSuperAdminPage } from '@/lib/auth/roles';
import {
  getAllDepartments,
  deleteDepartment,
  toggleDepartmentPublish,
  listAccountsByDepartment,
  importCouncilDepartments,
  type DepartmentAccount,
} from '@/app/actions/departments';
import { ImportDepartmentsButton } from './ImportDepartmentsButton';

/** "Active" / "Issued password" / "No login", with the email underneath. */
function loginCell(accounts: DepartmentAccount[] = []): StatusCell {
  if (accounts.length === 0) {
    return { label: 'No login', tone: 'gray' };
  }

  const pending = accounts.some((account) => account.status === 'pending');
  const [first, ...rest] = accounts;

  return {
    label: pending ? 'Issued password' : 'Active',
    tone: pending ? 'amber' : 'green',
    detail: rest.length > 0 ? `${first.email} +${rest.length} more` : first.email,
  };
}

export default async function DepartmentsAdminPage() {
  await requireSuperAdminPage();

  const [result, accountsResult] = await Promise.all([
    getAllDepartments(),
    listAccountsByDepartment(),
  ]);
  const rows = result.success ? result.data || [] : [];
  const accountsByDepartment = accountsResult.success ? accountsResult.data || {} : {};

  const cells: Record<string, StatusCell> = {};
  for (const row of rows) cells[row.id] = loginCell(accountsByDepartment[row.id]);

  const withLogin = rows.filter((row) => accountsByDepartment[row.id]?.length).length;
  const published = rows.filter((row) => row.published).length;
  const slugs = new Set(rows.map((row) => row.slug));
  const missing = DEPARTMENT_SEEDS.filter((seed) => !slugs.has(seed.slug)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{departmentConfig.plural}</h1>
          <p className="mt-2 text-gray-600">
            Manage the departments&apos; pages and the accounts that can edit them. Each
            department&apos;s events and activities are reached from its edit page.
          </p>
          {rows.length > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {rows.length} {rows.length === 1 ? 'department' : 'departments'} · {published}{' '}
              published · {withLogin} with a login
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {missing > 0 && (
            <ImportDepartmentsButton onImport={importCouncilDepartments} missing={missing} />
          )}
          <Button asChild>
            <Link href="/admin/departments/create">
              <Plus className="mr-2 h-4 w-4" />
              Add department
            </Link>
          </Button>
        </div>
      </div>

      {!result.success && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Departments could not be loaded: {result.error}
        </p>
      )}

      {!accountsResult.success && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Department logins could not be loaded: {accountsResult.error}
        </p>
      )}

      <ResourceTable
        config={departmentConfig}
        rows={rows}
        onDelete={deleteDepartment}
        onTogglePublish={toggleDepartmentPublish}
        statusColumn={
          accountsResult.success ? { header: 'Login', cells } : undefined
        }
        deleteDescription="This permanently removes the department's page, all of its events and activities, the images uploaded for them, and every login attached to it — those accounts will no longer be able to sign in. This action cannot be undone."
      />
    </div>
  );
}
