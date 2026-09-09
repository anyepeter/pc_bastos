import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { ChurchAccountsPanel } from '@/components/admin/ChurchAccountsPanel';
import { memberChurchConfig } from '@/lib/admin/configs';
import { toFormValues } from '@/lib/admin/resource-service';
import { readTranslation } from '@/lib/translations';
import { requireSuperAdminPage } from '@/lib/auth/roles';
import {
  getChurchById,
  createChurch,
  updateChurch,
  listChurchAccounts,
  createChurchAccount,
  resetChurchAccountPassword,
  removeChurchAccount,
} from '@/app/actions/churches';

export default async function EditChurchPage({
  params,
}: {
  params: { id: string };
}) {
  await requireSuperAdminPage();

  const result = await getChurchById(params.id);
  if (!result.success || !result.data) {
    notFound();
  }

  const row = result.data;
  const churchName = readTranslation(row.denomination).en || 'this church';

  const accountsResult = await listChurchAccounts(row.id);
  const accounts = accountsResult.success ? accountsResult.data || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/churches">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{churchName}</h1>
          <p className="mt-2 text-gray-600">
            Edit the church page and manage who can maintain it
          </p>
        </div>
      </div>

      {!accountsResult.success && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Church accounts could not be loaded: {accountsResult.error}
        </p>
      )}

      <ChurchAccountsPanel
        churchId={row.id}
        churchName={churchName}
        accounts={accounts}
        onCreate={createChurchAccount}
        onResetPassword={resetChurchAccountPassword}
        onRemove={removeChurchAccount}
      />

      <ResourceForm
        config={memberChurchConfig}
        recordId={row.id}
        isPublished={row.published}
        initialValues={toFormValues(memberChurchConfig, row)}
        onCreate={createChurch}
        onUpdate={updateChurch}
      />
    </div>
  );
}
