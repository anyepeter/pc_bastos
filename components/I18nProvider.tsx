'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLanguage } from '@/store/blogSlice';
import i18n from '@/lib/i18n';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.blog.language);

  useEffect(() => {
    // Initialize i18next with the stored language or browser preference
    const initLanguage = async () => {
      // Check localStorage first
      const storedLanguage = localStorage.getItem('language') as 'en' | 'fr' | null;

      if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'fr')) {
        // Use stored language
        await i18n.changeLanguage(storedLanguage);
        dispatch(setLanguage(storedLanguage));
      } else {
        // Use browser language detection
        const detectedLanguage = i18n.language;
        const lang = detectedLanguage.startsWith('fr') ? 'fr' : 'en';
        dispatch(setLanguage(lang));
      }
    };

    initLanguage();
  }, [dispatch]);

  // Sync i18next when Redux language changes
  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  return <>{children}</>;
}
