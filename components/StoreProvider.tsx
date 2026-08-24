'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/store/store';

/**
 * Mounted once, in the root layout.
 *
 * Do NOT nest a second one inside a page. The store holds the selected
 * language, so a nested provider gives the navigation's LanguageSelector and
 * the page content two separate stores and language switching stops working.
 * To pass server-fetched data in, hand it to the client component as a prop
 * and let that component dispatch it (see BlogListClient / BlogDetailClient).
 */
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
