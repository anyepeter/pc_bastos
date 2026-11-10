import i18next, { type i18n as I18n } from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { Language } from '@/lib/translations';
import { frenchTypography } from '@/lib/french-typography';

// Bundled, not fetched: the strings are in the first render on both sides.
import enTranslation from '@/public/locales/en/translation.json';
import frTranslation from '@/public/locales/fr/translation.json';

const resources = {
  en: { translation: enTranslation },
  fr: { translation: frTranslation },
};

/**
 * One i18next instance per language, each fixed to it for life.
 *
 * The language comes from the address (/fr/… is French), and the server renders
 * English and French pages side by side — a single shared instance switched
 * with changeLanguage() would let one request's language leak into another's
 * HTML. I18nProvider hands the right instance to react-i18next through context.
 */
const instances: Partial<Record<Language, I18n>> = {};

export function getI18n(language: Language): I18n {
  const existing = instances[language];
  if (existing) return existing;

  const instance = i18next.createInstance();
  instance.use(initReactI18next);

  // French gets its non-breaking spaces (before ? ! ; : », after «) at render
  // time, so the locale file keeps ordinary, readable spaces.
  if (language === 'fr') {
    instance.use({
      type: 'postProcessor',
      name: 'frenchTypography',
      process: (value: string) => frenchTypography(value),
    });
  }

  instance.init({
    resources,
    lng: language,
    fallbackLng: 'en',
    ...(language === 'fr' ? { postProcess: ['frenchTypography'] } : {}),
    // Resources are inline, so init finishes synchronously — needed for SSR.
    initAsync: false,
    interpolation: { escapeValue: false }, // React already escapes
    react: { useSuspense: false },
  });

  instances[language] = instance;
  return instance;
}
