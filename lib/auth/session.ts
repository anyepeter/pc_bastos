import { cache } from 'react';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  sessionCookieOptions,
  signSessionToken,
  verifySessionToken,
} from './session-token';

/**
 * Server-side sessions for /admin.
 *
 * The browser holds a signed, httpOnly cookie containing nothing but a session
 * id. Everything that matters — who you are, your role, the church you may
 * edit — is read from the database here, on every request. That is what makes
 * `resolveEditableChurchId` safe: there is no role or churchId anywhere in the
 * request for a caller to tamper with.
 */

export type AppRole = 'super_admin' | 'church';

export interface SessionRole {
  userId: string;
  role: AppRole;
  /** Set only for `church` accounts — the MemberChurch they may edit. */
  churchId: string | null;
  email: string | null;
}

export interface SessionUser extends SessionRole {
  sessionId: string;
  name: string | null;
  mustChangePassword: boolean;
  expiresAt: Date;
}

/** A stored role string is only ever one of the two we know. */
export function normalizeRole(role: string | null | undefined): AppRole {
  return role === 'super_admin' ? 'super_admin' : 'church';
}

/** Emails are compared and stored lowercased, so the login form is case-blind. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * The signed-in account, or null. Cached per request so the layout, the page
 * guard and any server action in the same render share one query.
 *
 * A session that has passed its expiry is treated as signed out even if the
 * cookie itself still verifies — the row is the authority.
 */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const row = await prisma.session.findUnique({
    where: { id: payload.sid },
    include: { user: true },
  });

  // Session revoked, or the cookie's user id no longer matches the row.
  if (!row || !row.user || row.userId !== payload.uid) return null;
  if (row.expiresAt.getTime() <= Date.now()) return null;

  return {
    sessionId: row.id,
    userId: row.user.id,
    role: normalizeRole(row.user.role),
    churchId: row.user.churchId ?? null,
    email: row.user.email,
    name: row.user.name ?? null,
    mustChangePassword: row.user.mustChangePassword,
    expiresAt: row.expiresAt,
  };
});

/**
 * Start a session and set the cookie. Only callable from a Server Action or a
 * Route Handler — Next forbids writing cookies while rendering.
 */
export async function createSession(user: { id: string }): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  const session = await prisma.session.create({
    data: { userId: user.id, expiresAt },
  });

  const token = await signSessionToken(
    { sid: session.id, uid: user.id },
    expiresAt
  );

  cookies().set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
}

/** End the current session on the server as well as in the browser. */
export async function destroySession(): Promise<void> {
  const store = cookies();
  const payload = await verifySessionToken(store.get(SESSION_COOKIE)?.value);

  if (payload) {
    // deleteMany, not delete: a row already gone must not throw.
    await prisma.session.deleteMany({ where: { id: payload.sid } });
  }

  store.set(SESSION_COOKIE, '', {
    ...sessionCookieOptions(new Date(0)),
    maxAge: 0,
  });
}

/**
 * Sign an account out everywhere. Used when its access is withdrawn or its
 * password is reset, so an open dashboard tab stops working immediately.
 */
export async function destroyAllSessionsForUser(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}

/** Housekeeping — expired rows are dead weight. Called on each login. */
export async function pruneExpiredSessions(): Promise<void> {
  try {
    await prisma.session.deleteMany({ where: { expiresAt: { lte: new Date() } } });
  } catch {
    /* never let housekeeping fail a login */
  }
}
