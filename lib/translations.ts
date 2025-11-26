/**
 * Translation types and utilities for multilingual support
 */

export type Language = 'en' | 'fr';

export interface Translation {
  en: string;
  fr: string;
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
