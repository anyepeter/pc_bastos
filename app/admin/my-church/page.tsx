import Link from 'next/link';
import { ExternalLink, Info } from 'lucide-react';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { memberChurchConfig } from '@/lib/admin/configs';
import { toFormValues } from '@/lib/admin/resource-service';
import { readTranslation } from '@/lib/translations';
import { requireAdminSession } from '@/lib/auth/roles';
import { getMyChurch, createChurch, updateChurch } from '@/app/actions/churches';

/**
 * A member church's own workspace. Super admins land here too, but they are
 * pointed at the full list instead — this page only ever edits the church
 * attached to the signed-in account.
 */
export default async function MyChurchPage() {
  const session = await requireAdminSession();

  if (session.role === 'super_admin') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My church</h1>
          <p className="mt-2 text-gray-600">
            This page belongs to member church accounts.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-gray-700">
            You are signed in as the council secretariat, so you can edit every
            church from the{' '}
            <Link href="/admin/churches" className="font-medium text-blue-600 underline">
              Member Churches
            </Link>{' '}
            list.
          </p>
        </div>
      </div>
    );
  }

  const result = await getMyChurch();

  if (!result.success || !result.data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">My church</h1>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-medium text-amber-900">
                This account is not linked to a church yet
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
  const churchName = readTranslation(row.denomination).en || 'Your church';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{churchName}</h1>
          <p className="mt-2 text-gray-600">
            Keep your church&apos;s page up to date in both English and French
          </p>
        </div>
        {row.published && (
          <Link
            href={`/members/${row.slug}`}
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
          Your page is not visible on the public site yet. Your edits are saved, and
          the council secretariat can make it live.
        </p>
      )}

      <ResourceForm
        config={memberChurchConfig}
        recordId={row.id}
        isPublished={row.published}
        mode="save"
        initialValues={toFormValues(memberChurchConfig, row)}
        onCreate={createChurch}
        onUpdate={updateChurch}
      />
    </div>
  );
}
