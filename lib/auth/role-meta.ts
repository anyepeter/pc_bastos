import type { AppRole } from './session';

/**
 * Per-role facts the dashboard chrome needs on the client as well as the
 * server. Deliberately free of any server import, so the sidebar and header
 * can use it; the checks themselves live in lib/auth/roles.ts.
 */

/** Where each role lands in /admin, and where a stray URL sends it back to. */
export const ROLE_HOME: Record<AppRole, string> = {
  super_admin: '/admin',
  church: '/admin/my-church',
  department: '/admin/my-department',
};

/** How the signed-in account is described in the sidebar, header and account page. */
export const ROLE_LABEL: Record<AppRole, string> = {
  super_admin: 'Council secretariat',
  church: 'Church account',
  department: 'Department account',
};
