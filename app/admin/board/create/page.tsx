import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { boardMemberConfig } from '@/lib/admin/configs';
import { createBoardMember, updateBoardMember } from '@/app/actions/board';
import { requireSuperAdminPage } from '@/lib/auth/roles';

export default async function CreateBoardMemberPage() {
  await requireSuperAdminPage();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={boardMemberConfig.adminPath} aria-label="Back to the board">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New board member</h1>
          <p className="mt-2 text-gray-600">
            Fill in the English title, then add the French one before publishing
          </p>
        </div>
      </div>

      <ResourceForm
        config={boardMemberConfig}
        onCreate={createBoardMember}
        onUpdate={updateBoardMember}
      />
    </div>
  );
}
