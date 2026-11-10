import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session-token';
import { LANGUAGE_COOKIE, splitLanguage } from '@/lib/locale-path';

/**
 * Two jobs, by address:
 *
 * 1. /admin — first gate on the dashboard (guardDashboard below).
 *
 * 2. Every public page — the language of the address. The pages live in
 *    app/[lang]; English keeps the bare addresses the site always had and
 *    French lives under /fr:
 *
 *      /events      → rendered from /en/events (a rewrite: the URL stays)
 *      /fr/events   → rendered as is
 *      /en/events   → 308 to /events, so English has one address
 *
 *    A reader whose last choice was French (the `lang` cookie, set by the
 *    language switcher or by visiting a /fr page) and who follows a bare
 *    link is sent to the French page. Crawlers carry no cookie, so they see
 *    each language at its own stable address.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return guardDashboard(request);
  }

  // The dashboard login is English-only and outside app/[lang].
  if (pathname === '/sign-in' || pathname.startsWith('/sign-in/')) {
    return NextResponse.next();
  }

  const { language, path } = splitLanguage(pathname);

  if (language === 'en') {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url, 308);
  }

  if (language === 'fr') {
    const response = NextResponse.next();
    if (request.cookies.get(LANGUAGE_COOKIE)?.value !== 'fr') {
      response.cookies.set(LANGUAGE_COOKIE, 'fr', { path: '/', maxAge: 31536000, sameSite: 'lax' });
    }
    return response;
  }

  // Only plain page loads follow the cookie; a form post or server action to
  // an English address must reach it.
  const isRead = request.method === 'GET' || request.method === 'HEAD';
  if (isRead && request.cookies.get(LANGUAGE_COOKIE)?.value === 'fr') {
    const url = request.nextUrl.clone();
    url.pathname = path === '/' ? '/fr' : `/fr${path}`;
    return NextResponse.redirect(url, 307);
  }

  const url = request.nextUrl.clone();
  url.pathname = path === '/' ? '/en' : `/en${path}`;
  return NextResponse.rewrite(url);
}

/**
 * First gate on /admin. It only checks that the request carries a cookie this
 * server signed — middleware runs on the Edge runtime and cannot reach the
 * database, so it cannot know the account's role or whether the session was
 * revoked.
 *
 * That is deliberate, not a shortcut: the real checks live where the data is.
 * app/admin/layout.tsx re-resolves the role from the database on every render,
 * and every write action calls requireSuperAdmin()/requireAdminSession(). This
 * gate exists so a signed-out visitor gets a clean redirect to the login page
 * instead of a rendered shell.
 */
async function guardDashboard(request: NextRequest) {
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
  // Everything except Next's own files, the public folder's files and the
  // generated files at the root (robots.txt, sitemap.xml, llms.txt,
  // manifest.webmanifest, favicon.ico) — anything with an extension.
  matcher: ['/((?!_next/|__nextjs|api/|images/|locales/|.*\\.[A-Za-z0-9]+$).*)'],
};
