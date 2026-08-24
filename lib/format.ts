import { Language } from './translations';

/** Locale used for dates and times, keyed off the visitor's language choice. */
const localeFor = (language: Language) => (language === 'fr' ? 'fr-FR' : 'en-US');

export function formatLongDate(value: string | Date, language: Language): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString(localeFor(language), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatMonthDay(
  value: string | Date,
  language: Language
): { month: string; day: number } {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return { month: '', day: 0 };

  return {
    month: date
      .toLocaleDateString(localeFor(language), { month: 'short' })
      .toUpperCase()
      .replace('.', ''),
    day: date.getDate(),
  };
}

/**
 * The admin stores times from an `<input type="time">` ("14:30").
 * Public pages show them in 12-hour form in English, 24-hour in French.
 */
export function formatTime(value: string | null | undefined, language: Language): string {
  if (!value) return '';

  const [hoursText, minutesText] = value.split(':');
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;

  if (language === 'fr') {
    return `${String(hours).padStart(2, '0')}h${String(minutes).padStart(2, '0')}`;
  }

  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

export const isUpcoming = (value: string | Date): boolean => {
  const date = value instanceof Date ? value : new Date(value);
  return !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
};
