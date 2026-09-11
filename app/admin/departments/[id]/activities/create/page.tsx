import { requireSuperAdminPage } from '@/lib/auth/roles';
import { ActivityCreateView } from '@/components/admin/DepartmentActivityViews';
import { councilActivityContext } from '../context';

export default async function CouncilCreateActivityPage({
  params,
}: {
  params: { id: string };
}) {
  await requireSuperAdminPage();
  return <ActivityCreateView {...await councilActivityContext(params.id)} />;
}
