import { requireSuperAdminPage } from '@/lib/auth/roles';
import { ActivityEditView } from '@/components/admin/DepartmentActivityViews';
import { councilActivityContext } from '../../context';

export default async function CouncilEditActivityPage({
  params,
}: {
  params: { id: string; activityId: string };
}) {
  await requireSuperAdminPage();

  return (
    <ActivityEditView
      activityId={params.activityId}
      context={await councilActivityContext(params.id)}
      councilRoute
    />
  );
}
