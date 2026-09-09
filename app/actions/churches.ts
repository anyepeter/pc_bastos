'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { generateTemporaryPassword, hashPassword } from '@/lib/auth/password';
import { destroyAllSessionsForUser, normalizeEmail } from '@/lib/auth/session';
import { memberChurchConfig } from '@/lib/admin/configs';
import { FormValues } from '@/lib/admin/resource-config';
import { toFormValues, toPayload, validateValues } from '@/lib/admin/resource-service';
import { generateSlug } from '@/lib/blog-utils';
import { readTranslation } from '@/lib/translations';
import {
  ActionOutcome,
  AccessError,
  getSessionRole,
  guarded,
  requireAdminSession,
  requireSuperAdmin,
  resolveEditableChurchId,
} from '@/lib/auth/roles';

const config = memberChurchConfig;

function revalidateChurch(slug?: string | null) {
  revalidatePath('/admin/churches');
  revalidatePath('/admin/my-church');
  revalidatePath('/members');
  if (slug) revalidatePath(`/members/${slug}`);
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base;
  let suffix = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.memberChurch.findUnique({
      where: { slug: candidate },
    });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

/* ------------------------------------------------------------------ reads */

export async function getAllChurches(): Promise<ActionOutcome<any[]>> {
  return guarded(async () => {
    await requireSuperAdmin();
    const data = await prisma.memberChurch.findMany({ orderBy: config.orderBy });
    return { success: true, data };
  });
}

export async function getChurchById(id: string): Promise<ActionOutcome> {
  return guarded(async () => {
    const churchId = await resolveEditableChurchId(id);
    const data = await prisma.memberChurch.findUnique({ where: { id: churchId } });
    if (!data) return { success: false, error: 'Church not found' };
    return { success: true, data };
  });
}

/** The church tied to the signed-in account, for /admin/my-church. */
export async function getMyChurch(): Promise<ActionOutcome> {
  return guarded(async () => {
    const session = await requireAdminSession();

    if (session.role !== 'church') {
      return { success: false, error: 'This page is for church accounts' };
    }
    if (!session.churchId) {
      return {
        success: false,
        error: 'This account is not linked to a church yet. Ask the council to set it up.',
      };
    }

    const data = await prisma.memberChurch.findUnique({
      where: { id: session.churchId },
    });
    if (!data) return { success: false, error: 'Church not found' };

    return { success: true, data };
  });
}

/* ----------------------------------------------------------------- writes */

export async function createChurch(
  values: FormValues,
  publish: boolean
): Promise<ActionOutcome> {
  return guarded(async () => {
    await requireSuperAdmin();

    const validationError = validateValues(config, values, publish);
    if (validationError) return { success: false, error: validationError };

    const payload = toPayload(config, values);
    const base = generateSlug(readTranslation(values.denomination).en);
    if (!base) {
      return { success: false, error: 'Could not build a URL from the church name' };
    }

    payload.slug = await uniqueSlug(base);
    payload.published = publish;

    const data = await prisma.memberChurch.create({ data: payload as any });
    revalidateChurch(data.slug);

    return { success: true, data };
  });
}

/**
 * Update a church. A church account may only ever reach its own record —
 * `resolveEditableChurchId` discards whatever id the browser sends.
 */
export async function updateChurch(
  id: string,
  values: FormValues,
  publish: boolean
): Promise<ActionOutcome> {
  return guarded(async () => {
    const session = await requireAdminSession();
    const churchId = await resolveEditableChurchId(id);

    const validationError = validateValues(config, values, publish);
    if (validationError) return { success: false, error: validationError };

    const existing = await prisma.memberChurch.findUnique({ where: { id: churchId } });
    if (!existing) return { success: false, error: 'Church not found' };

    const payload = toPayload(config, values);

    // Only the council renames a church (the slug is its public URL) or takes
    // it off the members page.
    if (session.role === 'super_admin') {
      const base = generateSlug(readTranslation(values.denomination).en);
      if (base) payload.slug = await uniqueSlug(base, churchId);
      payload.published = publish;
    } else {
      delete payload.slug;
      delete payload.published;
    }

    const data = await prisma.memberChurch.update({
      where: { id: churchId },
      data: payload as any,
    });

    revalidateChurch(data.slug);
    if (existing.slug !== data.slug) revalidateChurch(existing.slug);

    return { success: true, data };
  });
}

export async function deleteChurch(id: string): Promise<ActionOutcome> {
  return guarded(async () => {
    await requireSuperAdmin();

    const existing = await prisma.memberChurch.findUnique({ where: { id } });
    if (!existing) return { success: false, error: 'Church not found' };

    await prisma.memberChurch.delete({ where: { id } });
    revalidateChurch(existing.slug);

    return { success: true };
  });
}

export async function toggleChurchPublish(id: string): Promise<ActionOutcome> {
  return guarded(async () => {
    await requireSuperAdmin();

    const existing = await prisma.memberChurch.findUnique({ where: { id } });
    if (!existing) return { success: false, error: 'Church not found' };

    const data = await prisma.memberChurch.update({
      where: { id },
      data: { published: !existing.published },
    });

    revalidateChurch(data.slug);
    return { success: true, data };
  });
}

/* --------------------------------------------------------------- accounts */

/**
 * Logins that may edit one member church.
 *
 * There is no mailer wired into this project, so nothing is emailed. The
 * secretariat creates the account here, is shown the temporary password ONCE,
 * and passes it to the church by whatever channel it already uses. The
 * password is stored only as a bcrypt hash; if it is lost, reset it and hand
 * over a new one.
 */
export interface ChurchAccount {
  id: string;
  email: string;
  /** `pending` — still on the password the secretariat issued. */
  status: 'active' | 'pending';
  createdAt: string;
}

/** Every account currently linked to this church. */
export async function listChurchAccounts(
  churchId: string
): Promise<ActionOutcome<ChurchAccount[]>> {
  return guarded(async () => {
    await requireSuperAdmin();

    const users = await prisma.user.findMany({
      where: { role: 'church', churchId },
      orderBy: { createdAt: 'asc' },
      // Never select passwordHash — it has no business leaving the server.
      select: {
        id: true,
        email: true,
        mustChangePassword: true,
        createdAt: true,
      },
    });

    const accounts: ChurchAccount[] = users.map((user) => ({
      id: user.id,
      email: user.email,
      status: user.mustChangePassword ? 'pending' : 'active',
      createdAt: user.createdAt.toISOString(),
    }));

    return { success: true, data: accounts };
  });
}

/**
 * Create a login for a member church.
 *
 * The role and the churchId are written here by the council, from the id of
 * the church page being edited — they are never read back from the browser
 * when that account later signs in.
 *
 * Returns the temporary password so the secretariat can hand it over. This is
 * the only moment it exists in plaintext.
 */
export async function createChurchAccount(
  churchId: string,
  email: string
): Promise<ActionOutcome<{ email: string; temporaryPassword: string }>> {
  return guarded(async () => {
    await requireSuperAdmin();

    const address = normalizeEmail(email || '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      return { success: false, error: 'Enter a valid email address' };
    }

    const church = await prisma.memberChurch.findUnique({ where: { id: churchId } });
    if (!church) return { success: false, error: 'Church not found' };

    const existing = await prisma.user.findUnique({ where: { email: address } });
    if (existing) {
      return {
        success: false,
        error: 'That email already has an account. Remove it first, or reset its password.',
      };
    }

    const temporaryPassword = generateTemporaryPassword();

    await prisma.user.create({
      data: {
        email: address,
        passwordHash: await hashPassword(temporaryPassword),
        role: 'church',
        churchId,
        mustChangePassword: true,
      },
    });

    revalidatePath(`/admin/churches/${churchId}/edit`);
    return { success: true, data: { email: address, temporaryPassword } };
  });
}

/**
 * Issue a fresh temporary password — the "I lost it" path, since there is no
 * email delivery. Every open session for that account is dropped.
 */
export async function resetChurchAccountPassword(
  churchId: string,
  accountId: string
): Promise<ActionOutcome<{ email: string; temporaryPassword: string }>> {
  return guarded(async () => {
    await requireSuperAdmin();

    const user = await prisma.user.findUnique({ where: { id: accountId } });
    if (!user || user.role !== 'church' || user.churchId !== churchId) {
      throw new AccessError('That account does not belong to this church');
    }

    const temporaryPassword = generateTemporaryPassword();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(temporaryPassword),
        mustChangePassword: true,
      },
    });

    await destroyAllSessionsForUser(user.id);

    revalidatePath(`/admin/churches/${churchId}/edit`);
    return { success: true, data: { email: user.email, temporaryPassword } };
  });
}

/** Withdraw a church login. Its sessions go with it (Session cascades). */
export async function removeChurchAccount(
  churchId: string,
  accountId: string
): Promise<ActionOutcome> {
  return guarded(async () => {
    await requireSuperAdmin();

    const user = await prisma.user.findUnique({ where: { id: accountId } });
    if (!user) return { success: false, error: 'Account not found' };

    if (user.role !== 'church' || user.churchId !== churchId) {
      throw new AccessError('That account does not belong to this church');
    }

    await prisma.user.delete({ where: { id: user.id } });

    revalidatePath(`/admin/churches/${churchId}/edit`);
    return { success: true };
  });
}

/** Editor values for a church record, used by both admin screens. */
export async function getChurchFormValues(id: string): Promise<ActionOutcome> {
  return guarded(async () => {
    const churchId = await resolveEditableChurchId(id);
    const row = await prisma.memberChurch.findUnique({ where: { id: churchId } });
    if (!row) return { success: false, error: 'Church not found' };

    return {
      success: true,
      data: { values: toFormValues(config, row), published: row.published },
    };
  });
}

/** Public read for the members pages. */
export async function getPublishedChurches(): Promise<ActionOutcome<any[]>> {
  try {
    const data = await prisma.memberChurch.findMany({
      where: { published: true },
      orderBy: config.orderBy,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error loading member churches:', error);
    return { success: false, error: 'Failed to load member churches', data: [] };
  }
}

export async function getPublishedChurchBySlug(slug: string): Promise<ActionOutcome> {
  try {
    const data = await prisma.memberChurch.findFirst({
      where: { slug, published: true },
    });
    if (!data) return { success: false, error: 'Church not found' };
    return { success: true, data };
  } catch (error) {
    console.error('Error loading member church:', error);
    return { success: false, error: 'Failed to load member church' };
  }
}

/** Used by the admin shell to tailor navigation to the signed-in role. */
export async function getCurrentRole() {
  const session = await getSessionRole();
  return session
    ? { role: session.role, churchId: session.churchId, email: session.email }
    : null;
}
