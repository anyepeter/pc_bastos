import { requireSuperAdminPage } from '@/lib/auth/roles';
import { ActivitiesListView } from '@/components/admin/DepartmentActivityViews';
import { councilActivityContext } from './context';

export default async function CouncilDepartmentActivitiesPage({
  params,
}: {
  params: { id: string };
}) {
  await requireSuperAdminPage();
  return <ActivitiesListView {...await councilActivityContext(params.id)} />;
}
