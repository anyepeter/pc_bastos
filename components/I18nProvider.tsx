'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { I18nextProvider } from 'react-i18next';
import { getI18n } from '@/lib/i18n';
import type { Language } from '@/lib/translations';
import { LANGUAGE_COOKIE, localizePath, stripLanguage } from '@/lib/locale-path';
import { writeLanguageCookie } from '@/lib/language-cookie';

/**
 * Gives react-i18next the instance for the page's language — the language of
 * the address, which the server rendered and the browser hydrates unchanged.
 */
export default function I18nProvider({
  language,
  children,
}: {
  language: Language;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // One-time move for returning visitors: the language used to live in
  // localStorage. A French reader who arrives on an English address is sent to
  // its French twin once, and from then on the cookie remembers the choice.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem('language');
      if (saved) window.localStorage.removeItem('language');
    } catch {
      return; // storage blocked: nothing to migrate
    }

    const hasCookie = document.cookie.split('; ').some((c) => c.startsWith(`${LANGUAGE_COOKIE}=`));
    if (saved === 'fr' && language === 'en' && !hasCookie) {
      writeLanguageCookie('fr');
      window.location.replace(localizePath(stripLanguage(pathname || '/'), 'fr') + window.location.hash);
    }
    // Runs once per visit; later navigations carry the cookie.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <I18nextProvider i18n={getI18n(language)}>{children}</I18nextProvider>;
}
