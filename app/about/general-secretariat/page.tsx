import PageLayout from '@/components/PageLayout';
import GeneralSecretariatClient from './GeneralSecretariatClient';
import { getPublishedDepartments } from '@/app/actions/departments';
import { toPublicDepartmentSummary } from '@/lib/departments';
import { getPublishedBoardMembers } from '@/app/actions/board';
import { toPublicBoardMember } from '@/lib/board';

export default async function GeneralSecretariatPage() {
  // A failed read comes back as an empty list, which the client answers with
  // the council's original list from the locale files.
  const [result, boardResult] = await Promise.all([
    getPublishedDepartments(),
    getPublishedBoardMembers(),
  ]);
  const rows = result.success ? result.data || [] : [];

  // The General Secretary as published in /admin/board. Without one the page
  // simply leaves the profile out.
  const secretaryRow = (boardResult.success ? boardResult.data || [] : []).find(
    (row: any) => row.office === 'general_secretary'
  );

  return (
    <PageLayout>
      <GeneralSecretariatClient
        departments={rows.map(toPublicDepartmentSummary)}
        secretary={secretaryRow ? toPublicBoardMember(secretaryRow) : null}
      />
    </PageLayout>
  );
}
