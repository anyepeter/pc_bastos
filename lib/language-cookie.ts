import { LANGUAGE_COOKIE } from '@/lib/locale-path';
import type { Language } from '@/lib/translations';

/**
 * Remembers the reader's language for a year. middleware.ts reads it to send a
 * French reader who follows an English link to the French page. Browser only.
 */
export function writeLanguageCookie(language: Language) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${LANGUAGE_COOKIE}=${language}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}
