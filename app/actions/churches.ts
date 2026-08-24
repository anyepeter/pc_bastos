'use server';

import { revalidatePath } from 'next/cache';
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
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

export interface ChurchAccount {
  id: string;
  email: string;
  status: 'active' | 'invited';
  createdAt: string;
}

/** Accounts already linked to a church, plus outstanding invitations. */
export async function listChurchAccounts(
  churchId: string
): Promise<ActionOutcome<ChurchAccount[]>> {
  return guarded(async () => {
    await requireSuperAdmin();

    const client = await clerkClient();
    const accounts: ChurchAccount[] = [];

    const users = await client.users.getUserList({ limit: 200 });
    for (const user of users.data) {
      const metadata = (user.publicMetadata || {}) as { churchId?: string };
      if (metadata.churchId !== churchId) continue;

      accounts.push({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? '(no email)',
        status: 'active',
        createdAt: new Date(user.createdAt).toISOString(),
      });
    }

    const invitations = await client.invitations.getInvitationList({
      status: 'pending',
      limit: 200,
    });
    for (const invitation of invitations.data) {
      const metadata = (invitation.publicMetadata || {}) as { churchId?: string };
      if (metadata.churchId !== churchId) continue;

      accounts.push({
        id: invitation.id,
        email: invitation.emailAddress,
        status: 'invited',
        createdAt: new Date(invitation.createdAt).toISOString(),
      });
    }

    return { success: true, data: accounts };
  });
}

/** Invite someone to manage a church. The role travels with the invitation. */
export async function inviteChurchAccount(
  churchId: string,
  email: string
): Promise<ActionOutcome> {
  return guarded(async () => {
    await requireSuperAdmin();

    const address = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      return { success: false, error: 'Enter a valid email address' };
    }

    const church = await prisma.memberChurch.findUnique({ where: { id: churchId } });
    if (!church) return { success: false, error: 'Church not found' };

    const client = await clerkClient();

    try {
      await client.invitations.createInvitation({
        emailAddress: address,
        publicMetadata: { role: 'church', churchId },
        ignoreExisting: true,
      });
    } catch (error: any) {
      const detail = error?.errors?.[0]?.message;
      return {
        success: false,
        error: detail || 'Clerk rejected the invitation. Check the email address.',
      };
    }

    revalidatePath(`/admin/churches/${churchId}/edit`);
    return { success: true };
  });
}

/** Revoke a pending invitation, or unlink an active account from its church. */
export async function removeChurchAccount(
  churchId: string,
  accountId: string,
  status: 'active' | 'invited'
): Promise<ActionOutcome> {
  return guarded(async () => {
    await requireSuperAdmin();

    const client = await clerkClient();

    if (status === 'invited') {
      await client.invitations.revokeInvitation(accountId);
    } else {
      const user = await client.users.getUser(accountId);
      const metadata = (user.publicMetadata || {}) as { churchId?: string };

      if (metadata.churchId !== churchId) {
        throw new AccessError('That account does not belong to this church');
      }

      // Clear the role rather than deleting the person's Clerk account.
      await client.users.updateUser(accountId, { publicMetadata: {} });
    }

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
