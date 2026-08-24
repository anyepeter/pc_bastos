/**
 * Translation types and utilities for multilingual support
 */

export type Language = 'en' | 'fr';

export const LANGUAGES: Language[] = ['en', 'fr'];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
};

export interface Translation {
  en: string;
  fr: string;
}

/**
 * Read an unknown value (a Prisma `Json` column, a legacy plain string, null)
 * back into a `Translation`. A bare string counts as English only.
 */
export function readTranslation(value: unknown): Translation {
  if (typeof value === 'string') return { en: value, fr: '' };

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return {
      en: typeof record.en === 'string' ? record.en : '',
      fr: typeof record.fr === 'string' ? record.fr : '',
    };
  }

  return { en: '', fr: '' };
}

/** Trim both languages so the stored JSON shape is always `{ en, fr }`. */
export function normalizeTranslation(value: Translation): Translation {
  return {
    en: (value?.en || '').trim(),
    fr: (value?.fr || '').trim(),
  };
}

/** True when the translation has real text for the given language. */
export function hasTranslation(value: unknown, language: Language): boolean {
  return readTranslation(value)[language].trim().length > 0;
}

/**
 * Get translated text based on the current language
 * @param translation - The translation object containing text in multiple languages
 * @param language - The target language
 * @returns The translated text in the specified language
 */
export function getTranslatedText(translation: Translation | string, language: Language): string {
  // If translation is already a string, return it as-is
  if (typeof translation === 'string') {
    return translation;
  }

  // Return the translation for the specified language, fallback to English
  return translation[language] || translation.en || '';
}
