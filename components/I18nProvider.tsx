'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import i18n from '@/lib/i18n';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const currentLanguage = useAppSelector((state) => state.blog.language);

  // Sync i18next whenever Redux language changes
  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  return <>{children}</>;
}
