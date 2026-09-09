/**
 * Where to land after signing in when nothing else is asked for.
 */
export const DEFAULT_LANDING = '/admin';

/**
 * Only a same-origin relative path is honoured for `?redirect=`.
 *
 * `//evil.example` and `/\evil.example` are protocol-relative URLs that a
 * browser resolves off-site, and anything containing a scheme is plainly
 * off-site — all fall back to the default, so the login form cannot be turned
 * into an open redirect.
 */
export function sanitizeRedirect(target: string | null | undefined): string {
  if (!target) return DEFAULT_LANDING;
  if (!target.startsWith('/')) return DEFAULT_LANDING;
  if (target.startsWith('//') || target.startsWith('/\\')) return DEFAULT_LANDING;
  if (target.includes('://')) return DEFAULT_LANDING;
  if (target.includes('\n') || target.includes('\r')) return DEFAULT_LANDING;
  return target;
}
