import { ActivityEditView } from '@/components/admin/DepartmentActivityViews';
import { myDepartmentContext } from '../../../context';

export default async function MyDepartmentEditActivityPage({
  params,
}: {
  params: { activityId: string };
}) {
  return (
    <ActivityEditView activityId={params.activityId} context={await myDepartmentContext()} />
  );
}
