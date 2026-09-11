import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { departmentConfig } from '@/lib/admin/configs';
import { requireSuperAdminPage } from '@/lib/auth/roles';
import { createDepartment, updateDepartment } from '@/app/actions/departments';

export default async function CreateDepartmentPage() {
  await requireSuperAdminPage();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/departments" aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add department</h1>
          <p className="mt-2 text-gray-600">
            Create the page first — once it is saved you are taken straight to it to create
            the department&apos;s login
          </p>
        </div>
      </div>

      <ResourceForm
        config={departmentConfig}
        afterCreate="edit"
        onCreate={createDepartment}
        onUpdate={updateDepartment}
      />
    </div>
  );
}
