import { notFound } from 'next/navigation';
import { getDepartmentById } from '@/app/actions/departments';
import { readTranslation } from '@/lib/translations';

/**
 * The department behind the council's /admin/departments/[id]/activities
 * screens. Page guards run first; this only turns the id into the names the
 * screens show, and a 404 when there is no such department.
 */
export async function councilActivityContext(departmentId: string) {
  const result = await getDepartmentById(departmentId);
  if (!result.success || !result.data) notFound();

  const row = result.data;
  return {
    departmentId: row.id as string,
    departmentName: readTranslation(row.name).en || 'this department',
    departmentSlug: row.slug as string,
    departmentPublished: Boolean(row.published),
    basePath: `/admin/departments/${row.id}/activities`,
    backHref: `/admin/departments/${row.id}/edit`,
  };
}
