import { redirect } from 'next/navigation';
import { getSession } from './session';
import type { AppRole, SessionRole } from './session';

/**
 * Who may do what in /admin.
 *
 * - `super_admin` — the council secretariat. Full control of every content type
 *   and of church accounts.
 * - `church` — one member church. May edit that church's own profile and
 *   nothing else.
 *
 * The role lives on the `User` row and is read from the database on every
 * request via `getSession()` (lib/auth/session.ts). The session cookie carries
 * only an opaque session id, so there is no role and no churchId anywhere in
 * the request for the browser to tamper with.
 */

export type { AppRole, SessionRole };

/**
 * Emails allowed to act as super admin, from `SUPER_ADMIN_EMAILS`
 * (comma-separated). When the variable is unset, any account whose row is
 * marked `super_admin` is accepted. Setting it adds a second lock: even a row
 * marked `super_admin` is refused unless its address is on the list.
 */
function allowedSuperAdminEmails(): string[] {
  return (process.env.SUPER_ADMIN_EMAILS || '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Raised when the account store itself is unreachable, as opposed to the
 * visitor simply not being allowed in. Kept separate so we never sign someone
 * out because of a database blip.
 */
export class AuthUnavailableError extends Error {
  constructor(readonly cause: unknown) {
    super('Could not reach the account database. Please try again.');
    this.name = 'AuthUnavailableError';
  }
}

/** Resolve the signed-in user's role, or null when signed out. */
export async function getSessionRole(): Promise<SessionRole | null> {
  let session;

  try {
    session = await getSession();
  } catch (error) {
    // Surfaced with a real message instead of an empty server-render crash.
    console.error('[auth] Could not read the session', error);
    throw new AuthUnavailableError(error);
  }

  if (!session) return null;

  const { userId, email, churchId } = session;

  if (session.role === 'church') {
    return { userId, role: 'church', churchId, email };
  }

  const allowList = allowedSuperAdminEmails();
  if (allowList.length > 0 && !(email && allowList.includes(email))) {
    return null;
  }

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
