import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { DepartmentAccountsPanel } from '@/components/admin/DepartmentAccountsPanel';
import { departmentConfig } from '@/lib/admin/configs';
import { toFormValues } from '@/lib/admin/resource-service';
import { readTranslation } from '@/lib/translations';
import { MIN_PASSWORD_LENGTH } from '@/lib/auth/password';
import { requireSuperAdminPage } from '@/lib/auth/roles';
import {
  getDepartmentById,
  createDepartment,
  updateDepartment,
  listDepartmentAccounts,
  createDepartmentAccount,
  resetDepartmentAccountPassword,
  removeDepartmentAccount,
} from '@/app/actions/departments';
import { listDepartmentActivities } from '@/app/actions/department-activities';

export default async function EditDepartmentPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { created?: string };
}) {
  await requireSuperAdminPage();

  const result = await getDepartmentById(params.id);
  if (!result.success || !result.data) {
    notFound();
  }

  const row = result.data;
  const departmentName = readTranslation(row.name).en || 'this department';

  const [accountsResult, activitiesResult] = await Promise.all([
    listDepartmentAccounts(row.id),
    listDepartmentActivities(row.id),
  ]);
  const accounts = accountsResult.success ? accountsResult.data || [] : [];
  const activities = activitiesResult.success ? activitiesResult.data || [] : [];
  const drafts = activities.filter((activity) => !activity.published).length;

  // Set by the create page's redirect, so the next step is obvious.
  const justCreated = searchParams.created === '1';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/departments" aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{departmentName}</h1>
            <p className="mt-2 text-gray-600">
              Edit the department page and manage who can maintain it
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" asChild>
            <Link href={`/admin/departments/${row.id}/activities`}>
              <CalendarDays className="mr-2 h-4 w-4" />
              Events &amp; activities ({activities.length}
              {drafts > 0 ? `, ${drafts} draft${drafts === 1 ? '' : 's'}` : ''})
            </Link>
          </Button>
          {row.published && (
            <Link
              href={`/departments/${row.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View public page
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {justCreated && accounts.length === 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          <div className="text-sm text-green-900">
            <p className="font-medium">{departmentName} has been added.</p>
            <p className="mt-0.5 text-green-800">
              Next, create its login below so the department can sign in, keep its page up
              to date and post its events and activities.
            </p>
          </div>
        </div>
      )}

      {!accountsResult.success && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Department accounts could not be loaded: {accountsResult.error}
        </p>
      )}

      <DepartmentAccountsPanel
        departmentId={row.id}
        departmentName={departmentName}
        accounts={accounts}
        suggestedEmail={row.email || ''}
        minPasswordLength={MIN_PASSWORD_LENGTH}
        onCreate={createDepartmentAccount}
        onResetPassword={resetDepartmentAccountPassword}
        onRemove={removeDepartmentAccount}
      />

      <ResourceForm
        config={departmentConfig}
        recordId={row.id}
        isPublished={row.published}
        initialValues={toFormValues(departmentConfig, row)}
        onCreate={createDepartment}
        onUpdate={updateDepartment}
      />
    </div>
  );
}
