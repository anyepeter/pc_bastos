'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import {
  generateTemporaryPassword,
  hashPassword,
  validatePasswordStrength,
} from '@/lib/auth/password';
import { destroyAllSessionsForUser, normalizeEmail } from '@/lib/auth/session';
import {
  COUNCIL_ONLY_DEPARTMENT_FIELDS,
  departmentActivityConfig,
  departmentConfig,
  departmentProfileConfig,
} from '@/lib/admin/configs';
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
import { normalizeTranslation, readTranslation } from '@/lib/translations';
import {
  DEPARTMENT_ACTIVITY_SEEDS,
  DEPARTMENT_SEEDS,
  type SeedText,
} from '@/lib/departments-seed';
import {
  ActionOutcome,
  AccessError,
  guarded,
  requireAdminSession,
  requireSuperAdmin,
  resolveEditableDepartmentId,
} from '@/lib/auth/roles';

/**
 * Council departments: the profile, its publish state, and the logins that may
 * edit it. Built the same way as app/actions/churches.ts — a department
 * account only ever reaches its own record, because
 * `resolveEditableDepartmentId` discards whatever id the browser sends.
 *
 * Events and activities live in app/actions/department-activities.ts.
 */

const ORDER = [{ sortOrder: 'asc' as const }, { createdAt: 'asc' as const }];

/**
 * Everything that shows a department. `layout` also refreshes the activity
 * pages under it, which carry the department's name.
 */
function revalidateDepartment(slug?: string | null) {
  revalidatePath('/admin');
  revalidatePath('/admin/departments');
  revalidatePath('/admin/my-department');
  revalidatePath('/departments');
  if (slug) revalidatePath(`/departments/${slug}`, 'layout');
  // The home page lists the departments too, and is otherwise cached for an
  // hour.
  revalidatePath('/');
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base;
  let suffix = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.department.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

/** The address the council typed, or else one built from the English name. */
function slugBase(values: FormValues): string {
  return generateSlug(asString(values.slug)) || generateSlug(readTranslation(values.name).en);
}

const cleanAcronym = (values: FormValues) => asString(values.acronym).trim().toUpperCase();

/**
 * A seed text as the editor would store it: `{ en, fr }`, trimmed. Returned as
 * a fresh literal, which Prisma's Json input type accepts.
 */
function seedJson(value: SeedText): { en: string; fr: string };
function seedJson(value: SeedText | undefined): { en: string; fr: string } | undefined;
function seedJson(value: SeedText | undefined) {
  if (!value) return undefined;
  const { en, fr } = normalizeTranslation(value);
  return { en, fr };
}

/* ------------------------------------------------------------------ reads */

export async function getAllDepartments(): Promise<ActionOutcome<any[]>> {
  return guarded(async () => {
    await requireSuperAdmin();
    const data = await prisma.department.findMany({
      orderBy: ORDER,
      include: { _count: { select: { activities: true } } },
    });
    return { success: true, data };
  });
}

export async function getDepartmentById(id: string): Promise<ActionOutcome> {
  return guarded(async () => {
    const departmentId = await resolveEditableDepartmentId(id);
    const data = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!data) return { success: false, error: 'Department not found' };
    return { success: true, data };
  });
}

/** The department tied to the signed-in account, for /admin/my-department. */
export async function getMyDepartment(): Promise<ActionOutcome> {
  return guarded(async () => {
    const session = await requireAdminSession();

    if (session.role !== 'department') {
      return { success: false, error: 'This page is for department accounts' };
    }
    if (!session.departmentId) {
      return {
        success: false,
        error: 'This account is not linked to a department yet. Ask the council to set it up.',
      };
    }

    const data = await prisma.department.findUnique({
      where: { id: session.departmentId },
    });
    if (!data) return { success: false, error: 'Department not found' };

    return { success: true, data };
  });
}

/* ----------------------------------------------------------------- writes */

export async function createDepartment(
  values: FormValues,
  publish: boolean
): Promise<ActionOutcome> {
  return guarded(async () => {
    await requireSuperAdmin();

    const validationError = validateValues(departmentConfig, values, publish);
    if (validationError) return { success: false, error: validationError };

    const base = slugBase(values);
    if (!base) {
      return { success: false, error: 'Could not build a page address from the department name' };
    }

    const payload = toPayload(departmentConfig, values);
    payload.slug = await uniqueSlug(base);
    payload.acronym = cleanAcronym(values);
    payload.published = publish;

    // No position given: it goes to the end of the list.
    if (typeof payload.sortOrder !== 'number') {
      const last = await prisma.department.findFirst({ orderBy: { sortOrder: 'desc' } });
      payload.sortOrder = (last?.sortOrder ?? 0) + 1;
    }

    const data = await prisma.department.create({ data: payload as any });
    revalidateDepartment(data.slug);

    return { success: true, data };
  });
}

/**
 * Update a department. A department account may only ever reach its own
 * record, may not change its address, acronym or position, and may not take
 * the page live or offline — those stay with the council.
 */
export async function updateDepartment(
  id: string,
  values: FormValues,
  publish: boolean
): Promise<ActionOutcome> {
  return guarded(async () => {
    const session = await requireAdminSession();
    const departmentId = await resolveEditableDepartmentId(id);

    const existing = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!existing) return { success: false, error: 'Department not found' };

    const isCouncil = session.role === 'super_admin';
    const config = isCouncil ? departmentConfig : departmentProfileConfig;

    // A department account cannot change the publish state, so it is held to
    // the rule for the state the page is actually in — not the flag it sent.
    const validationError = validateValues(
      config,
      values,
      isCouncil ? publish : existing.published
    );
    if (validationError) return { success: false, error: validationError };

    // Built from the config the caller is allowed, so fields outside it never
    // reach the payload whatever the browser submits.
    const payload = toPayload(config, values);
    const orphaned = findOrphanedImages(config, existing, values);

    if (isCouncil) {
      const base = slugBase(values);
      payload.slug = base ? await uniqueSlug(base, departmentId) : existing.slug;
      payload.acronym = cleanAcronym(values);
      if (typeof payload.sortOrder !== 'number') payload.sortOrder = existing.sortOrder;
      payload.published = publish;
    } else {
      for (const name of COUNCIL_ONLY_DEPARTMENT_FIELDS) delete payload[name];
      delete payload.published;
    }

    const data = await prisma.department.update({
      where: { id: departmentId },
      data: payload as any,
    });

    await removeImages(orphaned);
    revalidateDepartment(data.slug);
    if (existing.slug !== data.slug) revalidateDepartment(existing.slug);

    return { success: true, data };
  });
}

/**
 * Delete a department together with its activities (the relation cascades)
 * and every login attached to it. `User.departmentId` has no foreign key, so
 * without this the accounts would outlive the department and still be able to
 * sign in to an empty workspace.
 */
export async function deleteDepartment(id: string): Promise<ActionOutcome> {
  return guarded(async () => {
    await requireSuperAdmin();

    const existing = await prisma.department.findUnique({
      where: { id },
      include: { activities: true },
    });
    if (!existing) return { success: false, error: 'Department not found' };

    // Gathered before the rows go, so the uploads can be cleaned up after.
    const images = [
      ...collectImages(departmentConfig, existing),
      ...existing.activities.flatMap((activity) =>
        collectImages(departmentActivityConfig, activity)
      ),
    ];

    // Sessions go with their user (Session cascades).
    await prisma.$transaction([
      prisma.user.deleteMany({ where: { role: 'department', departmentId: id } }),
      prisma.department.delete({ where: { id } }),
    ]);

    await removeImages(images);
    revalidateDepartment(existing.slug);

    return { success: true };
  });
}

export async function toggleDepartmentPublish(id: string): Promise<ActionOutcome> {
  return guarded(async () => {
    await requireSuperAdmin();

    const existing = await prisma.department.findUnique({ where: { id } });
    if (!existing) return { success: false, error: 'Department not found' };

    // Same rule as every other content type: a draft goes live only once the
    // French translation is complete. Unpublishing is always allowed.
    if (!existing.published && !rowIsTranslated(departmentConfig, existing)) {
      return {
        success: false,
        error: 'Add the French translation before publishing this department',
      };
    }

    const data = await prisma.department.update({
      where: { id },
      data: { published: !existing.published },
    });

    revalidateDepartment(data.slug);
    return { success: true, data };
  });
}

/**
 * Add the council's eight departments from lib/departments-seed.ts, with the
 * draft activities that belong to them. Only slugs that are missing are
 * inserted, and a department that already exists takes none of the drafts —
 * so running it again never overwrites or resurrects anything.
 */
export async function importCouncilDepartments(): Promise<
  ActionOutcome<{ departments: number; activities: number; skipped: number }>
> {
  return guarded(async () => {
    await requireSuperAdmin();

    const existing = await prisma.department.findMany({ select: { slug: true } });
    const taken = new Set(existing.map((row) => row.slug));

    const takenActivities = new Set(
      (await prisma.departmentActivity.findMany({ select: { slug: true } })).map(
        (row) => row.slug
      )
    );

    let departments = 0;
    let activities = 0;

    for (const seed of DEPARTMENT_SEEDS) {
      if (taken.has(seed.slug)) continue;

      const drafts = DEPARTMENT_ACTIVITY_SEEDS.filter(
        (activity) =>
          activity.departmentSlug === seed.slug && !takenActivities.has(activity.slug)
      );

      await prisma.department.create({
        data: {
          slug: seed.slug,
          acronym: seed.acronym,
          sortOrder: seed.sortOrder,
          published: seed.published,
          name: seedJson(seed.name),
          tagline: seedJson(seed.tagline),
          summary: seedJson(seed.summary),
          vision: seedJson(seed.vision),
          mission: seedJson(seed.mission),
          objectives: seedJson(seed.objectives),
          services: seedJson(seed.services),
          structures: seedJson(seed.structures),
          keyFigures: seedJson(seed.keyFigures),
          support: seedJson(seed.support),
          coverage: seedJson(seed.coverage),
          location: seedJson(seed.location),
          headTitle: seedJson(seed.headTitle),
          headName: seed.headName ?? null,
          phone: seed.phone ?? null,
          email: seed.email ?? null,
          address: seed.address ?? null,
          website: seed.website ?? null,
          images: [],
          activities: {
            create: drafts.map((activity) => ({
              slug: activity.slug,
              kind: activity.kind,
              title: seedJson(activity.title),
              summary: seedJson(activity.summary),
              body: seedJson(activity.body),
              location: seedJson(activity.location),
              date: new Date(`${activity.date}T00:00:00.000Z`),
              endDate: activity.endDate ? new Date(`${activity.endDate}T00:00:00.000Z`) : null,
              images: [],
              published: activity.published,
            })),
          },
        },
      });

      departments += 1;
      activities += drafts.length;
    }

    if (departments > 0) {
      revalidateDepartment();
      revalidatePath('/departments/[slug]', 'layout');
    }

    return {
      success: true,
      data: { departments, activities, skipped: DEPARTMENT_SEEDS.length - departments },
    };
  });
}

/* --------------------------------------------------------------- accounts */

/**
 * Logins that may edit one department.
 *
 * As with church logins, nothing is emailed — there is no mailer for this. The
 * secretariat either types the password itself or has one generated, and it
 * is shown on screen once to be passed on. Only the bcrypt hash is stored.
 */
export interface DepartmentAccount {
  id: string;
  email: string;
  /** `pending` — still on the password the secretariat issued. */
  status: 'active' | 'pending';
  createdAt: string;
}

// Never select passwordHash — it has no business leaving the server.
const accountSelect = {
  id: true,
  email: true,
  mustChangePassword: true,
  createdAt: true,
  departmentId: true,
} as const;

function toDepartmentAccount(user: {
  id: string;
  email: string;
  mustChangePassword: boolean;
  createdAt: Date;
}): DepartmentAccount {
  return {
    id: user.id,
    email: user.email,
    status: user.mustChangePassword ? 'pending' : 'active',
    createdAt: user.createdAt.toISOString(),
  };
}

function revalidateAccounts(departmentId: string) {
  revalidatePath(`/admin/departments/${departmentId}/edit`);
  revalidatePath('/admin/departments');
  revalidatePath('/admin');
}

/**
 * The password the secretariat typed, held to the site-wide rule, or — when
 * the box was left blank — a generated one.
 */
function passwordToIssue(typed?: string | null):
  | { error: string }
  | { password: string; generated: boolean } {
  const password = (typed || '').trim() ? (typed as string) : '';
  if (!password) return { password: generateTemporaryPassword(), generated: true };

  const weak = validatePasswordStrength(password);
  return weak ? { error: weak } : { password, generated: false };
}

/** Every account currently linked to this department. */
export async function listDepartmentAccounts(
  departmentId: string
): Promise<ActionOutcome<DepartmentAccount[]>> {
  return guarded(async () => {
    await requireSuperAdmin();

    const users = await prisma.user.findMany({
      where: { role: 'department', departmentId },
      orderBy: { createdAt: 'asc' },
      select: accountSelect,
    });

    return { success: true, data: users.map(toDepartmentAccount) };
  });
}

/** Every department login, keyed by department id — the login column of the list. */
export async function listAccountsByDepartment(): Promise<
  ActionOutcome<Record<string, DepartmentAccount[]>>
> {
  return guarded(async () => {
    await requireSuperAdmin();

    const users = await prisma.user.findMany({
      where: { role: 'department', departmentId: { not: null } },
      orderBy: { createdAt: 'asc' },
      select: accountSelect,
    });

    const byDepartment: Record<string, DepartmentAccount[]> = {};
    for (const user of users) {
      if (!user.departmentId) continue;
      (byDepartment[user.departmentId] ??= []).push(toDepartmentAccount(user));
    }

    return { success: true, data: byDepartment };
  });
}

/**
 * Create a login for a department.
 *
 * The role and the departmentId are written here by the council, from the id
 * of the department being edited — they are never read back from the browser
 * when that account later signs in.
 *
 * `password` is optional: when the secretariat leaves it blank one is
 * generated and returned, the only moment it exists in plaintext. A password
 * the secretariat typed is not echoed back — it already has it. Either way the
 * department is asked to choose its own after signing in.
 */
export async function createDepartmentAccount(
  departmentId: string,
  email: string,
  password?: string
): Promise<ActionOutcome<{ email: string; temporaryPassword: string | null }>> {
  return guarded(async () => {
    await requireSuperAdmin();

    const address = normalizeEmail(email || '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      return { success: false, error: 'Enter a valid email address' };
    }

    const issued = passwordToIssue(password);
    if ('error' in issued) return { success: false, error: issued.error };

    const department = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!department) return { success: false, error: 'Department not found' };

    const existing = await prisma.user.findUnique({ where: { email: address } });
    if (existing) {
      return {
        success: false,
        error: 'That email already has an account. Remove it first, or reset its password.',
      };
    }

    await prisma.user.create({
      data: {
        email: address,
        passwordHash: await hashPassword(issued.password),
        role: 'department',
        departmentId,
        mustChangePassword: true,
      },
    });

    revalidateAccounts(departmentId);
    return {
      success: true,
      data: { email: address, temporaryPassword: issued.generated ? issued.password : null },
    };
  });
}

/**
 * Issue a new password — typed by the secretariat or generated — for the "I
 * lost it" case. Every open session for that account is dropped.
 */
export async function resetDepartmentAccountPassword(
  departmentId: string,
  accountId: string,
  password?: string
): Promise<ActionOutcome<{ email: string; temporaryPassword: string | null }>> {
  return guarded(async () => {
    await requireSuperAdmin();

    const user = await prisma.user.findUnique({ where: { id: accountId } });
    if (!user || user.role !== 'department' || user.departmentId !== departmentId) {
      throw new AccessError('That account does not belong to this department');
    }

    const issued = passwordToIssue(password);
    if ('error' in issued) return { success: false, error: issued.error };

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(issued.password),
        mustChangePassword: true,
      },
    });

    await destroyAllSessionsForUser(user.id);

    revalidateAccounts(departmentId);
    return {
      success: true,
      data: { email: user.email, temporaryPassword: issued.generated ? issued.password : null },
    };
  });
}

/** Withdraw a department login. Its sessions go with it (Session cascades). */
export async function removeDepartmentAccount(
  departmentId: string,
  accountId: string
): Promise<ActionOutcome> {
  return guarded(async () => {
    await requireSuperAdmin();

    const user = await prisma.user.findUnique({ where: { id: accountId } });
    if (!user) return { success: false, error: 'Account not found' };

    if (user.role !== 'department' || user.departmentId !== departmentId) {
      throw new AccessError('That account does not belong to this department');
    }

    await prisma.user.delete({ where: { id: user.id } });

    revalidateAccounts(departmentId);
    return { success: true };
  });
}

/** Editor values for a department record. */
export async function getDepartmentFormValues(id: string): Promise<ActionOutcome> {
  return guarded(async () => {
    const departmentId = await resolveEditableDepartmentId(id);
    const row = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!row) return { success: false, error: 'Department not found' };

    return {
      success: true,
      data: { values: toFormValues(departmentConfig, row), published: row.published },
    };
  });
}

/* ----------------------------------------------------------------- public */

/** Published departments, in the council's order, for /departments and the home page. */
export async function getPublishedDepartments(): Promise<ActionOutcome<any[]>> {
  try {
    const data = await prisma.department.findMany({
      where: { published: true },
      orderBy: ORDER,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error loading departments:', error);
    return { success: false, error: 'Failed to load departments', data: [] };
  }
}

/** One published department with its published activities. */
export async function getPublishedDepartmentBySlug(slug: string): Promise<ActionOutcome> {
  try {
    const data = await prisma.department.findFirst({
      where: { slug, published: true },
      include: {
        activities: { where: { published: true }, orderBy: { date: 'desc' } },
      },
    });
    if (!data) return { success: false, error: 'Department not found' };
    return { success: true, data };
  } catch (error) {
    console.error('Error loading department:', error);
    return { success: false, error: 'Failed to load department' };
  }
}
