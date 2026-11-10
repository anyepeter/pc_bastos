import { revalidatePath } from 'next/cache';
import { LANGUAGES } from '@/lib/translations';

/**
 * Refresh a public page in both languages after an edit.
 *
 * The pages live under app/[lang], so the cached copies are keyed /en/… and
 * /fr/… — revalidatePath('/events') on its own would refresh nothing. Pass the
 * address in its plain English form; a route pattern ('/departments/[slug]')
 * is refreshed for every language at once.
 */
export function revalidatePublicPath(path: string, type?: 'page' | 'layout') {
  const suffix = path === '/' ? '' : path;

  if (path.includes('[')) {
    revalidatePath(`/[lang]${suffix}`, type ?? 'page');
    return;
  }

  for (const language of LANGUAGES) revalidatePath(`/${language}${suffix}`, type);
}
