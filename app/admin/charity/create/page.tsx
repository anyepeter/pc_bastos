import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { charityConfig } from '@/lib/admin/configs';
import { createCharityProgram, updateCharityProgram } from '@/app/actions/charity';
import { requireSuperAdminPage } from '@/lib/auth/roles';

export default async function CreateCharityProgramPage() {
  await requireSuperAdminPage();

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
            New {charityConfig.singular.toLowerCase()}
          </h1>
          <p className="mt-2 text-gray-600">
            Write the English version, then add the French translation before publishing
          </p>
        </div>
      </div>

      <ResourceForm
        config={charityConfig}
        onCreate={createCharityProgram}
        onUpdate={updateCharityProgram}
      />
    </div>
  );
}
