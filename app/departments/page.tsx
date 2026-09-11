import PageLayout from '@/components/PageLayout';
import DepartmentsClient from './DepartmentsClient';
import { getPublishedDepartments } from '@/app/actions/departments';
import { toPublicDepartmentSummary } from '@/lib/departments';

export default async function DepartmentsPage() {
  // A failed read comes back as an empty list, which the client answers with
  // the council's original list from the locale files.
  const result = await getPublishedDepartments();
  const rows = result.success ? result.data || [] : [];

  return (
    <PageLayout>
      <DepartmentsClient departments={rows.map(toPublicDepartmentSummary)} />
    </PageLayout>
  );
}
