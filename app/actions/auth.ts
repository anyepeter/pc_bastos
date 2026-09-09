'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  burnPasswordComparison,
  hashPassword,
  validatePasswordStrength,
  verifyPassword,
} from '@/lib/auth/password';
import {
  createSession,
  destroyAllSessionsForUser,
  destroySession,
  getSession,
  normalizeEmail,
  pruneExpiredSessions,
} from '@/lib/auth/session';
import { sanitizeRedirect } from '@/lib/auth/redirect';
import type { ActionOutcome } from '@/lib/auth/roles';

/**
 * Sign in / sign out for the dashboard.
 *
 * The one error message below is deliberate: an unknown address and a wrong
 * password produce exactly the same reply, so the form cannot be used to find
 * out which people hold accounts.
 */
const GENERIC_LOGIN_ERROR = 'Invalid email or password';

/**
 * Best-effort brute-force brake. In-memory, so it only covers a single server
 * instance — it slows a casual guessing run, it is not a substitute for a
 * shared rate limiter if this ever runs on many instances.
 */
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map<string, { count: number; first: number }>();

function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.first > ATTEMPT_WINDOW_MS) return false;
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(key: string): void {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.first > ATTEMPT_WINDOW_MS) {
    attempts.set(key, { count: 1, first: now });
    return;
  }
  entry.count += 1;
}

export async function login(
  email: string,
  password: string,
  redirectTo?: string
): Promise<ActionOutcome<{ redirectTo: string }>> {
  const address = normalizeEmail(email || '');

  if (!address || !password) {
    return { success: false, error: GENERIC_LOGIN_ERROR };
  }

  if (tooManyAttempts(address)) {
    return {
      success: false,
      error: 'Too many attempts. Wait a few minutes and try again.',
    };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: address } });

    if (!user) {
      // Spend the same time as a real comparison so the reply does not reveal
      // whether the address exists.
      await burnPasswordComparison(password);
      recordFailure(address);
      return { success: false, error: GENERIC_LOGIN_ERROR };
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      recordFailure(address);
      return { success: false, error: GENERIC_LOGIN_ERROR };
    }

    attempts.delete(address);
    await pruneExpiredSessions();
    await createSession(user);

    return { success: true, data: { redirectTo: sanitizeRedirect(redirectTo) } };
  } catch (error) {
    // Never log the submitted password — only that a login failed.
    console.error('[auth] login failed for an account:', error);
    return { success: false, error: 'Could not sign you in. Please try again.' };
  }
}

/** Ends the session server-side, clears the cookie, returns to the login page. */
export async function logout(): Promise<void> {
  await destroySession();
  redirect('/sign-in');
}

/**
 * Change your own password. The current one is always required, so a borrowed
 * open tab cannot lock the real owner out. Every other session for the account
 * is dropped afterwards.
 */
export async function changeOwnPassword(
  currentPassword: string,
  newPassword: string
): Promise<ActionOutcome> {
  const session = await getSession();
  if (!session) return { success: false, error: 'You are not signed in' };

  const weak = validatePasswordStrength(newPassword || '');
  if (weak) return { success: false, error: weak };

  try {
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return { success: false, error: 'Account not found' };

    const ok = await verifyPassword(currentPassword || '', user.passwordHash);
    if (!ok) return { success: false, error: 'Your current password is not right' };

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(newPassword),
        mustChangePassword: false,
      },
    });

    // Sign out everywhere, then re-issue this browser's session so the person
    // changing the password is not thrown out of the page they are on.
    await destroyAllSessionsForUser(user.id);
    await createSession(user);

    return { success: true };
  } catch (error) {
    console.error('[auth] password change failed:', error);
    return { success: false, error: 'Could not change the password' };
  }
}

/** Who is signed in, for the dashboard chrome. Never exposes the hash. */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  return {
    userId: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
    churchId: session.churchId,
    mustChangePassword: session.mustChangePassword,
  };
}
