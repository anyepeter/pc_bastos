import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { charityConfig } from '@/lib/admin/configs';
import { getCharityProgramById, createCharityProgram, updateCharityProgram } from '@/app/actions/charity';
import { toFormValues } from '@/lib/admin/resource-service';
import { requireSuperAdminPage } from '@/lib/auth/roles';

export default async function EditCharityProgramPage({
  params,
}: {
  params: { id: string };
}) {
  await requireSuperAdminPage();

  const result = await getCharityProgramById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const row = result.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={charityConfig.adminPath}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit {charityConfig.singular.toLowerCase()}
          </h1>
          <p className="mt-2 text-gray-600">
            Update the content and translations for this item
          </p>
        </div>
      </div>

      <ResourceForm
        config={charityConfig}
        recordId={row.id}
        isPublished={row.published}
        initialValues={toFormValues(charityConfig, row)}
        onCreate={createCharityProgram}
        onUpdate={updateCharityProgram}
      />
    </div>
  );
}
