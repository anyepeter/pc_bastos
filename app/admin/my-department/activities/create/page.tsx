import { ActivityCreateView } from '@/components/admin/DepartmentActivityViews';
import { myDepartmentContext } from '../../context';

export default async function MyDepartmentCreateActivityPage() {
  return <ActivityCreateView {...await myDepartmentContext()} />;
}
