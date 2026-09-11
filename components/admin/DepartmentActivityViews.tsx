import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, ExternalLink, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceTable, type StatusCell } from '@/components/admin/ResourceTable';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { ACTIVITY_KINDS, activityConfigFor } from '@/lib/admin/configs';
import { councilToday } from '@/lib/departments';
import {
  createDepartmentActivity,
  deleteDepartmentActivity,
  getActivityForEdit,
  listDepartmentActivities,
  toggleDepartmentActivityPublish,
  updateDepartmentActivity,
} from '@/app/actions/department-activities';

/**
 * The events-and-activities screens, shared by the council's routes
 * (/admin/departments/[id]/activities) and a department's own workspace
 * (/admin/my-department/activities). Only the base path and the way back
 * differ; which department the rows belong to is always settled on the server
 * (app/actions/department-activities.ts).
 */

interface ViewContext {
  departmentId: string;
  departmentName: string;
  departmentSlug: string;
  departmentPublished: boolean;
  /** Where these screens live, e.g. /admin/my-department/activities. */
  basePath: string;
  /** The page the list's back arrow returns to. */
  backHref: string;
}

/** "Event · Upcoming", "Activity report", "Project" — the list's Type column. */
function kindCell(row: { kind: string; date: Date | string; endDate?: Date | string | null }): StatusCell {
  const label = ACTIVITY_KINDS.find((kind) => kind.value === row.kind)?.label ?? 'Activity report';
  if (row.kind === 'project') return { label, tone: 'gray' };

  const lastDay = new Date(row.endDate ?? row.date).toISOString().slice(0, 10);
  return lastDay >= councilToday()
    ? { label, tone: 'green', detail: 'Upcoming' }
    : { label, tone: 'gray', detail: 'Past' };
}

export async function ActivitiesListView(context: ViewContext) {
  const result = await listDepartmentActivities(context.departmentId);
  const rows = result.success ? result.data || [] : [];
  const config = activityConfigFor(context.basePath);

  const cells: Record<string, StatusCell> = {};
  for (const row of rows) cells[row.id] = kindCell(row);

  const published = rows.filter((row) => row.published).length;
  const drafts = rows.length - published;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={context.backHref} aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events &amp; Activities</h1>
            <p className="mt-2 text-gray-600">
              What {context.departmentName} has coming up, reports of what it has done, and
              its projects
            </p>
            {rows.length > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                {published} published · {drafts} {drafts === 1 ? 'draft' : 'drafts'}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {context.departmentPublished && (
            <Link
              href={`/departments/${context.departmentSlug}`}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View public page
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
          <Button asChild>
            <Link href={`${context.basePath}/create`}>
              <Plus className="mr-2 h-4 w-4" />
              Add event or activity
            </Link>
          </Button>
        </div>
      </div>

      {!result.success && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Activities could not be loaded: {result.error}
        </p>
      )}

      {drafts > 0 && (
        <p className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          Drafts are not shown on the public page. Check the dates and the account of each
          one, add the French translation, then publish it.
        </p>
      )}

      <ResourceTable
        config={config}
        rows={rows}
        onDelete={deleteDepartmentActivity}
        onTogglePublish={toggleDepartmentActivityPublish}
        statusColumn={{ header: 'Type', cells }}
        deleteDescription="This permanently removes the item from the department's page, together with the photos uploaded for it. This action cannot be undone."
      />
    </div>
  );
}

export function ActivityCreateView(context: ViewContext) {
  const config = activityConfigFor(context.basePath);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={context.basePath} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New event or activity</h1>
          <p className="mt-2 text-gray-600">
            For {context.departmentName}. Write the English version, then add the French
            translation before publishing
          </p>
        </div>
      </div>

      <ResourceForm
        config={config}
        // The id is only a hint: a department account always posts to its own.
        onCreate={createDepartmentActivity.bind(null, context.departmentId)}
        onUpdate={updateDepartmentActivity}
      />
    </div>
  );
}

/**
 * Editor for one activity. `getActivityForEdit` refuses an activity from any
 * other department; for the council's nested route a mismatched URL is sent
 * to the activity's real department rather than edited under the wrong one.
 */
export async function ActivityEditView({
  activityId,
  context,
  councilRoute = false,
}: {
  activityId: string;
  context: ViewContext;
  councilRoute?: boolean;
}) {
  const result = await getActivityForEdit(activityId);
  if (!result.success || !result.data) notFound();

  const row = result.data;
  if (row.departmentId !== context.departmentId) {
    if (councilRoute) {
      redirect(`/admin/departments/${row.departmentId}/activities/${activityId}/edit`);
    }
    notFound();
  }

  const config = activityConfigFor(context.basePath);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={context.basePath} aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit event or activity</h1>
            <p className="mt-2 text-gray-600">
              For {context.departmentName}. Update the content and translations
            </p>
          </div>
        </div>
        {row.published && context.departmentPublished && (
          <Link
            href={`/departments/${row.departmentSlug}/activities/${row.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View public page
            <ExternalLink className="h-4 w-4" />
          </Link>
        )}
      </div>

      <ResourceForm
        config={config}
        recordId={activityId}
        isPublished={row.published}
        initialValues={row.values}
        onCreate={createDepartmentActivity.bind(null, context.departmentId)}
        onUpdate={updateDepartmentActivity}
      />
    </div>
  );
}
