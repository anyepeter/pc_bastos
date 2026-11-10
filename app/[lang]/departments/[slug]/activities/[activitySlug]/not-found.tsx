import PageLayout from '@/components/PageLayout';
import DepartmentNotFound from '../../DepartmentNotFound';

export default function NotFound() {
  return (
    <PageLayout>
      <DepartmentNotFound messageKey="departments.activity.notFound" />
    </PageLayout>
  );
}
