import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { boardMemberConfig } from '@/lib/admin/configs';
import { getBoardMemberById, createBoardMember, updateBoardMember } from '@/app/actions/board';
import { toFormValues } from '@/lib/admin/resource-service';
import { requireSuperAdminPage } from '@/lib/auth/roles';

export default async function EditBoardMemberPage({ params }: { params: { id: string } }) {
  await requireSuperAdminPage();

  const result = await getBoardMemberById(params.id);
  if (!result.success || !result.data) notFound();

  const row = result.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={boardMemberConfig.adminPath} aria-label="Back to the board">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit board member</h1>
          <p className="mt-2 text-gray-600">{row.name}</p>
        </div>
      </div>

      <ResourceForm
        config={boardMemberConfig}
        recordId={row.id}
        isPublished={row.published}
        initialValues={toFormValues(boardMemberConfig, row)}
        onCreate={createBoardMember}
        onUpdate={updateBoardMember}
      />
    </div>
  );
}
