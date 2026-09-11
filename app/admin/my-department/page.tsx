import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CalendarDays, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { departmentProfileConfig } from '@/lib/admin/configs';
import { toFormValues } from '@/lib/admin/resource-service';
import { readTranslation } from '@/lib/translations';
import { councilToday } from '@/lib/departments';
import { requireAdminSession } from '@/lib/auth/roles';
import { ROLE_HOME } from '@/lib/auth/role-meta';
import {
  getMyDepartment,
  createDepartment,
  updateDepartment,
} from '@/app/actions/departments';
import { listDepartmentActivities } from '@/app/actions/department-activities';

/**
 * A department's own workspace. Super admins land here too, but they are
 * pointed at the full list instead — this page only ever edits the department
 * attached to the signed-in account, and never its address, acronym, position
 * or publish state (those stay with the council).
 */
export default async function MyDepartmentPage() {
  const session = await requireAdminSession();

  // A church account has its own workspace.
  if (session.role === 'church') redirect(ROLE_HOME.church);

  if (session.role === 'super_admin') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My department</h1>
          <p className="mt-2 text-gray-600">This page belongs to department accounts.</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-gray-700">
            You are signed in as the council secretariat, so you can edit every department —
            and its events and activities — from the{' '}
            <Link href="/admin/departments" className="font-medium text-blue-600 underline">
              Departments
            </Link>{' '}
            list.
          </p>
        </div>
      </div>
    );
  }

  const result = await getMyDepartment();

  if (!result.success || !result.data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">My department</h1>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-medium text-amber-900">
                This account is not linked to a department yet
              </p>
              <p className="mt-1 text-sm text-amber-800">
                {result.error} Please contact the council secretariat.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const row = result.data;
  const departmentName = readTranslation(row.name).en || 'Your department';

  const activitiesResult = await listDepartmentActivities(row.id);
  const activities = activitiesResult.success ? activitiesResult.data || [] : [];
  const drafts = activities.filter((activity) => !activity.published).length;
  const today = councilToday();
  const upcoming = activities.filter(
    (activity) =>
      activity.published &&
      activity.kind !== 'project' &&
      new Date(activity.endDate ?? activity.date).toISOString().slice(0, 10) >= today
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{departmentName}</h1>
          <p className="mt-2 text-gray-600">
            Keep your department&apos;s page up to date in both English and French
          </p>
        </div>
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

      {!row.published && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Your page is not visible on the public site yet. Your edits are saved, and the
          council secretariat can make it live.
        </p>
      )}

      {/* The second half of the workspace, one click away. */}
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
          <div>
            <p className="font-medium text-gray-900">Events &amp; activities</p>
            <p className="mt-0.5 text-sm text-gray-600">
              {activities.length === 0
                ? 'Nothing posted yet. Announce what is coming up, and report on what you have done.'
                : `${activities.length} in total · ${upcoming} upcoming on your page${
                    drafts > 0 ? ` · ${drafts} draft${drafts === 1 ? '' : 's'} to review` : ''
                  }`}
            </p>
          </div>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link href="/admin/my-department/activities">Manage events &amp; activities</Link>
        </Button>
      </div>

      <ResourceForm
        config={departmentProfileConfig}
        recordId={row.id}
        isPublished={row.published}
        mode="save"
        initialValues={toFormValues(departmentProfileConfig, row)}
        onCreate={createDepartment}
        onUpdate={updateDepartment}
      />
    </div>
  );
}
