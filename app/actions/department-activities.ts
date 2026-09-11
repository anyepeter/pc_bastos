'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { ACTIVITY_KINDS, departmentActivityConfig } from '@/lib/admin/configs';
import { FormValues, asString } from '@/lib/admin/resource-config';
import {
  rowIsTranslated,
  toFormValues,
  toPayload,
  validateValues,
} from '@/lib/admin/resource-service';
import {
  collectImages,
  findOrphanedImages,
  removeImages,
} from '@/lib/admin/resource-actions';
import { generateSlug } from '@/lib/blog-utils';
import { readTranslation } from '@/lib/translations';
import {
  ActionOutcome,
  AccessError,
  guarded,
  requireAdminSession,
  resolveEditableDepartmentId,
} from '@/lib/auth/roles';

/**
 * Events, activity reports and projects a department posts to its own page.
 *
 * Both the council and the department's own login use these. The department
 * an activity belongs to is always decided on the server: for a new activity
 * by `resolveEditableDepartmentId` (a department account's own id, whatever
 * the browser sent), and for an existing one by the row itself — every read
 * for editing, update, delete and publish toggle first checks that the row
 * belongs to the caller's department.
 */

const config = departmentActivityConfig;
const KIND_VALUES: string[] = ACTIVITY_KINDS.map((kind) => kind.value);

/** Same answer for "no such row" and "not yours", so ids cannot be probed. */
const NOT_FOUND = 'Activity not found';

/**
 * Load an activity the caller may edit, or throw. A super admin may reach any
 * activity; a department account only those of its own department.
 */
async function loadEditableActivity(id: string) {
  const session = await requireAdminSession();

  const activity = await prisma.departmentActivity.findUnique({
    where: { id },
    include: { department: { select: { id: true, slug: true } } },
  });
  if (!activity) throw new AccessError(NOT_FOUND);

  if (session.role === 'super_admin') return activity;

  if (
    session.role === 'department' &&
    session.departmentId &&
    activity.departmentId === session.departmentId
  ) {
    return activity;
  }

  throw new AccessError(NOT_FOUND);
}

function revalidateActivity(
  department: { id: string; slug: string },
  ...activitySlugs: (string | null | undefined)[]
) {
  revalidatePath(`/admin/departments/${department.id}/activities`);
  revalidatePath('/admin/my-department/activities');
  revalidatePath(`/departments/${department.slug}`);
  for (const slug of activitySlugs) {
    if (slug) revalidatePath(`/departments/${department.slug}/activities/${slug}`);
  }
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base;
  let suffix = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.departmentActivity.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

/** Checks the shared validation does not cover. Returns an error message. */
function checkValues(values: FormValues, publish: boolean): string | null {
  const missing = validateValues(config, values, publish);
  if (missing) return missing;

  if (!KIND_VALUES.includes(asString(values.kind))) {
    return 'Choose whether this is an event, an activity report or a project';
  }

  const start = asString(values.date);
  const end = asString(values.endDate);
  if (end && start && end < start) {
    return 'The end date is before the start date';
  }

  return null;
}

/* ------------------------------------------------------------------ admin */

/** A department's activities, newest first, for its admin list. */
export async function listDepartmentActivities(
  departmentId?: string
): Promise<ActionOutcome<any[]>> {
  return guarded(async () => {
    const id = await resolveEditableDepartmentId(departmentId);
    const data = await prisma.departmentActivity.findMany({
      where: { departmentId: id },
      orderBy: { date: 'desc' },
    });
    return { success: true, data };
  });
}

/** Editor values for one activity, after checking it is the caller's to edit. */
export async function getActivityForEdit(id: string): Promise<
  ActionOutcome<{
    values: FormValues;
    published: boolean;
    departmentId: string;
    departmentSlug: string;
    slug: string;
  }>
> {
  return guarded(async () => {
    const row = await loadEditableActivity(id);
    return {
      success: true,
      data: {
        values: toFormValues(config, row),
        published: row.published,
        departmentId: row.departmentId,
        departmentSlug: row.department.slug,
        slug: row.slug,
      },
    };
  });
}

/**
 * Create an activity. Bound to a department id by the page that renders the
 * editor; for a department account that id is ignored in favour of its own.
 */
export async function createDepartmentActivity(
  departmentId: string,
  values: FormValues,
  publish: boolean
): Promise<ActionOutcome> {
  return guarded(async () => {
    const id = await resolveEditableDepartmentId(departmentId);

    const department = await prisma.department.findUnique({
      where: { id },
      select: { id: true, slug: true },
    });
    if (!department) return { success: false, error: 'Department not found' };

    const error = checkValues(values, publish);
    if (error) return { success: false, error };

    const base = generateSlug(readTranslation(values.title).en);
    if (!base) {
      return { success: false, error: 'Could not build a URL from the English title' };
    }

    const payload = toPayload(config, values);
    payload.slug = await uniqueSlug(base);
    payload.departmentId = department.id;
    payload.published = publish;

    const data = await prisma.departmentActivity.create({ data: payload as any });
    revalidateActivity(department, data.slug);

    return { success: true, data };
  });
}

export async function updateDepartmentActivity(
  id: string,
  values: FormValues,
  publish: boolean
): Promise<ActionOutcome> {
  return guarded(async () => {
    const existing = await loadEditableActivity(id);

    const error = checkValues(values, publish);
    if (error) return { success: false, error };

    // Only the fields in the config are read, so the department it belongs to
    // cannot be changed from the browser.
    const payload = toPayload(config, values);
    const base = generateSlug(readTranslation(values.title).en);
    payload.slug = base ? await uniqueSlug(base, existing.id) : existing.slug;
    payload.published = publish;

    const orphaned = findOrphanedImages(config, existing, values);

    const data = await prisma.departmentActivity.update({
      where: { id: existing.id },
      data: payload as any,
    });

    await removeImages(orphaned);
    revalidateActivity(existing.department, data.slug, existing.slug);

    return { success: true, data };
  });
}

export async function deleteDepartmentActivity(id: string): Promise<ActionOutcome> {
  return guarded(async () => {
    const existing = await loadEditableActivity(id);

    await prisma.departmentActivity.delete({ where: { id: existing.id } });
    await removeImages(collectImages(config, existing));

    revalidateActivity(existing.department, existing.slug);
    return { success: true };
  });
}

export async function toggleDepartmentActivityPublish(id: string): Promise<ActionOutcome> {
  return guarded(async () => {
    const existing = await loadEditableActivity(id);

    // A draft goes live only once the French translation is complete.
    if (!existing.published && !rowIsTranslated(config, existing)) {
      return {
        success: false,
        error: 'Add the French translation before publishing this item',
      };
    }

    const data = await prisma.departmentActivity.update({
      where: { id: existing.id },
      data: { published: !existing.published },
    });

    revalidateActivity(existing.department, data.slug);
    return { success: true, data };
  });
}

/* ----------------------------------------------------------------- public */

/**
 * One published activity of a published department, looked up by both slugs
 * so an activity cannot be reached under another department's address. Comes
 * with a few of the department's other published activities.
 */
export async function getPublishedActivity(
  departmentSlug: string,
  activitySlug: string
): Promise<ActionOutcome> {
  try {
    const data = await prisma.departmentActivity.findFirst({
      where: {
        slug: activitySlug,
        published: true,
        department: { slug: departmentSlug, published: true },
      },
      include: {
        department: {
          select: { id: true, slug: true, acronym: true, name: true },
        },
      },
    });
    if (!data) return { success: false, error: NOT_FOUND };

    const more = await prisma.departmentActivity.findMany({
      where: { departmentId: data.departmentId, published: true, id: { not: data.id } },
      orderBy: { date: 'desc' },
      take: 3,
    });

    return { success: true, data: { ...data, more } };
  } catch (error) {
    console.error('Error loading department activity:', error);
    return { success: false, error: 'Failed to load this activity' };
  }
}

/** Every published activity with its department's slug, for static params. */
export async function getPublishedActivitySlugs(): Promise<
  ActionOutcome<{ slug: string; activitySlug: string }[]>
> {
  try {
    const rows = await prisma.departmentActivity.findMany({
      where: { published: true, department: { published: true } },
      select: { slug: true, department: { select: { slug: true } } },
    });
    return {
      success: true,
      data: rows.map((row) => ({ slug: row.department.slug, activitySlug: row.slug })),
    };
  } catch (error) {
    console.error('Error loading department activities:', error);
    return { success: false, error: 'Failed to load activities', data: [] };
  }
}
