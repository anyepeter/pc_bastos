import { cache } from 'react';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * Who may do what in /admin.
 *
 * - `super_admin` — the council secretariat. Full control of every content type
 *   and of church accounts.
 * - `church` — one member church. May edit that church's own profile and
 *   nothing else.
 *
 * The role lives in the Clerk user's `publicMetadata`, which is set when the
 * super admin invites the account. It is read here on the server for every
 * protected page and action; never trust a role sent from the browser.
 */

export type AppRole = 'super_admin' | 'church';

export interface SessionRole {
  userId: string;
  role: AppRole;
  /** Set only for `church` accounts — the MemberChurch they may edit. */
  churchId: string | null;
  email: string | null;
}

/**
 * Emails allowed to act as super admin, from `SUPER_ADMIN_EMAILS`
 * (comma-separated). When the variable is unset, any signed-in account that has
 * no role metadata is treated as super admin — that keeps the council's
 * existing logins working. Set the variable before going live so a stray Clerk
 * sign-up cannot reach the dashboard.
 */
function allowedSuperAdminEmails(): string[] {
  return (process.env.SUPER_ADMIN_EMAILS || '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Raised when Clerk itself is unreachable, as opposed to the visitor simply
 * not being allowed in. Kept separate so we never sign someone out because of
 * a network blip.
 */
export class AuthUnavailableError extends Error {
  constructor(readonly cause: unknown) {
    super('Could not reach Clerk to check your account. Please try again.');
    this.name = 'AuthUnavailableError';
  }
}

/**
 * One Clerk Backend API call per request, shared by the layout, the page guard
 * and any server action in the same render. Without this, a single page load
 * made three or four identical round-trips — slow, and three chances to fail.
 */
const fetchUser = cache(async (userId: string) => {
  try {
    const client = await clerkClient();
    return await client.users.getUser(userId);
  } catch (error) {
    // Surfaced with a real message instead of an empty server-render crash.
    console.error('[auth] Clerk getUser failed for', userId, error);
    throw new AuthUnavailableError(error);
  }
});

/** Resolve the signed-in user's role, or null when signed out. */
export async function getSessionRole(): Promise<SessionRole | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await fetchUser(userId);

  const metadata = (user.publicMetadata || {}) as {
    role?: string;
    churchId?: string;
  };
  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null;

  if (metadata.role === 'church') {
    return {
      userId,
      role: 'church',
      churchId: typeof metadata.churchId === 'string' ? metadata.churchId : null,
      email,
    };
  }

  const allowList = allowedSuperAdminEmails();
  const isSuperAdmin =
    metadata.role === 'super_admin' ||
    (allowList.length === 0 ? true : Boolean(email && allowList.includes(email)));

  if (!isSuperAdmin) return null;

  return { userId, role: 'super_admin', churchId: null, email };
}

export class AccessError extends Error {
  constructor(message = 'You do not have access to this area') {
    super(message);
    this.name = 'AccessError';
  }
}

/** Throws unless the caller is a super admin. Use at the top of council pages. */
export async function requireSuperAdmin(): Promise<SessionRole> {
  const session = await getSessionRole();

  if (!session || session.role !== 'super_admin') {
    throw new AccessError('Only the council secretariat can do this');
  }

  return session;
}

/**
 * Page-level guard for council-only screens. Sends a church account to its own
 * page instead of throwing, so a stray URL is a redirect rather than an error.
 * Server actions keep using `requireSuperAdmin`, which throws.
 */
export async function requireSuperAdminPage(): Promise<SessionRole> {
  const session = await getSessionRole();

  if (!session) redirect('/sign-in');
  if (session.role !== 'super_admin') redirect('/admin/my-church');

  return session;
}

/** Throws unless the caller is signed in with any admin role. */
export async function requireAdminSession(): Promise<SessionRole> {
  const session = await getSessionRole();
  if (!session) throw new AccessError();
  return session;
}

/**
 * The church a `church` account is allowed to edit.
 * Super admins pass an explicit id; church accounts may only ever use their own.
 */
export async function resolveEditableChurchId(
  requestedId?: string
): Promise<string> {
  const session = await requireAdminSession();

  if (session.role === 'super_admin') {
    if (!requestedId) throw new AccessError('No church specified');
    return requestedId;
  }

  if (!session.churchId) {
    throw new AccessError('This account is not linked to a church yet');
  }

  // A church account ignores whatever id the browser sent.
  return session.churchId;
}

/** Result shape shared by the admin server actions. */
export interface ActionOutcome<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Wrap an action so an AccessError becomes a clean `{ success: false }`. */
export async function guarded<T>(
  run: () => Promise<ActionOutcome<T>>
): Promise<ActionOutcome<T>> {
  try {
    return await run();
  } catch (error) {
    if (error instanceof AccessError) {
      return { success: false, error: error.message };
    }
    console.error('Admin action failed:', error);
    return { success: false, error: 'Something went wrong' };
  }
}
