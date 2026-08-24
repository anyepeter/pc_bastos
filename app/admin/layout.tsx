import { redirect } from 'next/navigation';
import { getSessionRole } from '@/lib/auth/roles';
import AdminShell from './AdminShell';

/**
 * Server-side gate for the whole dashboard. The role is resolved here once and
 * handed to the shell so the navigation only offers what the account may use;
 * every page and server action re-checks it independently.
 */
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

  return (
    <AdminShell role={session.role} email={session.email}>
      {children}
    </AdminShell>
  );
}
