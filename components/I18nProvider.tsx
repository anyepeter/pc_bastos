'use client';

import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLanguage } from '@/store/blogSlice';
import i18n from '@/lib/i18n';
import { Language, LANGUAGES } from '@/lib/translations';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.blog.language);
  const restoredRef = useRef(false);

  // Restore the visitor's saved choice. `setLanguage` writes it to localStorage,
  // so without this the site silently reverts to English on every page load.
  // Runs after hydration on purpose: the server always renders the default.
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const saved = window.localStorage.getItem('language');

    if (saved && LANGUAGES.includes(saved as Language) && saved !== currentLanguage) {
      dispatch(setLanguage(saved as Language));
    }
  }, [dispatch, currentLanguage]);

  // Sync i18next whenever Redux language changes
  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  return <>{children}</>;
}
