import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { memberChurchConfig } from '@/lib/admin/configs';
import { requireSuperAdminPage } from '@/lib/auth/roles';
import { createChurch, updateChurch } from '@/app/actions/churches';

export default async function CreateChurchPage() {
  await requireSuperAdminPage();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/churches">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add member church</h1>
          <p className="mt-2 text-gray-600">
            Create the page first — you can invite the church&apos;s own account once
            it is saved
          </p>
        </div>
      </div>

      <ResourceForm
        config={memberChurchConfig}
        onCreate={createChurch}
        onUpdate={updateChurch}
      />
    </div>
  );
}
