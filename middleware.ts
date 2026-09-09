import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session-token';

/**
 * First gate on /admin. It only checks that the request carries a cookie this
 * server signed — middleware runs on the Edge runtime and cannot reach the
 * database, so it cannot know the account's role or whether the session was
 * revoked.
 *
 * That is deliberate, not a shortcut: the real checks live where the data is.
 * app/admin/layout.tsx re-resolves the role from the database on every render,
 * and every write action calls requireSuperAdmin()/requireAdminSession(). This
 * middleware exists so a signed-out visitor gets a clean redirect to the login
 * page instead of a rendered shell.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const payload = await verifySessionToken(token);

  if (payload) return NextResponse.next();

  const loginUrl = new URL('/sign-in', request.url);

  // Come back to where they were headed, as a relative path only — the login
  // page sanitises this again before it is used.
  const target = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (target && target !== '/admin') {
    loginUrl.searchParams.set('redirect', target);
  }

  const response = NextResponse.redirect(loginUrl);

  // Drop a stale or forged cookie so the browser stops sending it.
  if (token) response.cookies.delete(SESSION_COOKIE);

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
