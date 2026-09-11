import { ActivitiesListView } from '@/components/admin/DepartmentActivityViews';
import { myDepartmentContext } from '../context';

export default async function MyDepartmentActivitiesPage() {
  return <ActivitiesListView {...await myDepartmentContext()} />;
}
