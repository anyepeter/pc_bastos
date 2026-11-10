'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/store/store';
import type { Language } from '@/lib/translations';

/**
 * Mounted once, by RootShell, for the whole page.
 *
 * Do NOT nest a second one inside a page. The store holds the page's language,
 * so a nested provider gives the navigation and the page content two separate
 * stores. To pass server-fetched data in, hand it to the client component as a
 * prop and let that component dispatch it (see BlogListClient / BlogDetailClient).
 *
 * `language` comes from the address. RootShell keys this provider by it, so
 * moving between /events and /fr/events builds a fresh store in the new language.
 */
export default function StoreProvider({
  language,
  children,
}: {
  language: Language;
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = makeStore(language);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
