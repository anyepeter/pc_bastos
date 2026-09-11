import { redirect } from 'next/navigation';
import { requireAdminSession } from '@/lib/auth/roles';
import { ROLE_HOME } from '@/lib/auth/role-meta';
import { getMyDepartment } from '@/app/actions/departments';
import { readTranslation } from '@/lib/translations';

/**
 * The signed-in department account's own department, for the
 * /admin/my-department/activities screens. The id comes from the session,
 * never the URL. Other roles are sent where they belong: the council to the
 * full list, a church to its own page.
 */
export async function myDepartmentContext() {
  const session = await requireAdminSession();

  if (session.role === 'church') redirect(ROLE_HOME.church);
  if (session.role === 'super_admin') redirect('/admin/departments');

  const result = await getMyDepartment();
  if (!result.success || !result.data) {
    // The profile page explains an unlinked account; send them there.
    redirect(ROLE_HOME.department);
  }

  const row = result.data;
  return {
    departmentId: row.id as string,
    departmentName: readTranslation(row.name).en || 'your department',
    departmentSlug: row.slug as string,
    departmentPublished: Boolean(row.published),
    basePath: '/admin/my-department/activities',
    backHref: ROLE_HOME.department,
  };
}
