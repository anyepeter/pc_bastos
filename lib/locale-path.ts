import { LANGUAGES, type Language } from '@/lib/translations';

/**
 * Every public page exists in both languages at its own address:
 *
 *   English  /events          (no prefix — the addresses the site always had)
 *   French   /fr/events
 *
 * The app/[lang] folder holds the pages; middleware.ts rewrites an unprefixed
 * address to /en/… internally and redirects a typed /en/… back to the bare
 * address, so each page has exactly one public URL per language.
 *
 * Pure string helpers — safe on the client, the server and the Edge runtime.
 */

export const DEFAULT_LANGUAGE: Language = 'en';

/** Remembers the reader's last language between visits (set by the switcher). */
export const LANGUAGE_COOKIE = 'lang';

export const isLanguage = (value: unknown): value is Language =>
  LANGUAGES.includes(value as Language);

/** Addresses outside the bilingual site: the dashboard, its login, files. */
const UNLOCALIZED = /^\/(admin|sign-in|images|locales|_next|api)(\/|$)/;

/**
 * True for a same-site page address that has a French twin. Protocol-relative
 * links, files (anything with an extension) and the dashboard are left alone.
 */
export function isLocalizable(href: string): boolean {
  if (!href.startsWith('/') || href.startsWith('//')) return false;
  const pathname = href.split(/[?#]/)[0];
  if (UNLOCALIZED.test(pathname)) return false;
  return !/\.[a-z0-9]+$/i.test(pathname);
}

/** '/fr/events' → { language: 'fr', path: '/events' }; '/events' → { language: null, … }. */
export function splitLanguage(pathname: string): { language: Language | null; path: string } {
  const match = pathname.match(/^\/(en|fr)(?=\/|$|\?|#)/);
  if (!match) return { language: null, path: pathname || '/' };

  const rest = pathname.slice(match[0].length);
  return { language: match[1] as Language, path: rest.startsWith('/') ? rest : `/${rest}` };
}

/** The address without any language prefix: '/fr/events' → '/events', '/fr' → '/'. */
export const stripLanguage = (pathname: string) => splitLanguage(pathname).path;

/**
 * The public address of `href` in `language`. English stays unprefixed;
 * French gains /fr. Anything that is not a localizable page is returned as is.
 */
export function localizePath(href: string, language: Language): string {
  if (!isLocalizable(href)) return href;

  const path = stripLanguage(href);
  if (language === DEFAULT_LANGUAGE) return path;

  // '/', '/?q', '/#top' → '/fr', '/fr?q', '/fr#top'
  return path === '/' || /^\/[?#]/.test(path) ? `/${language}${path.slice(1)}` : `/${language}${path}`;
}
