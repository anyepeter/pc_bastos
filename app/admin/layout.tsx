import { redirect } from 'next/navigation';
import { getSessionRole } from '@/lib/auth/roles';
import { getSession } from '@/lib/auth/session';
import AdminShell from './AdminShell';

/**
 * Server-side gate for the whole dashboard. The role is resolved here once and
 * handed to the shell so the navigation only offers what the account may use;
 * every page and server action re-checks it independently.
 *
 * `middleware.ts` has already turned away anyone without a signed cookie, but
 * only this check reaches the database — a revoked session or an account whose
 * role changed is caught here.
 */
/**
 * Never prerender any of the dashboard. Every route under /admin reads the
 * session cookie, so static generation both fails at build time
 * (DYNAMIC_SERVER_USAGE) and would be wrong in principle — these pages are
 * per-account. Clerk used to force this implicitly; the self-hosted session
 * does not, so it is declared here for the whole segment.
 */
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionRole();

  // Signed out, or signed in without an admin role at all.
  if (!session) {
    redirect('/sign-in');
  }

  // Same request-cached lookup as above; only the extra display fields.
  const account = await getSession();

  return (
    <AdminShell
      role={session.role}
      email={session.email}
      name={account?.name ?? null}
      mustChangePassword={account?.mustChangePassword ?? false}
    >
      {children}
    </AdminShell>
  );
}
