import { Language } from './translations';

/** Locale used for dates and times, keyed off the visitor's language choice. */
const localeFor = (language: Language) => (language === 'fr' ? 'fr-FR' : 'en-US');

export function formatLongDate(value: string | Date, language: Language): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const text = date.toLocaleDateString(localeFor(language), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // French writes the first of the month as an ordinal: « 1er novembre 2026 ».
  return language === 'fr' && date.getDate() === 1 ? text.replace(/^1(?=\s)/, '1er') : text;
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
 * Public pages show them in 12-hour form in English, and in French the French
 * way — « 14 h 30 », « 9 h » — with no-break spaces so the time never splits.
 */
export function formatTime(value: string | null | undefined, language: Language): string {
  if (!value) return '';

  const [hoursText, minutesText] = value.split(':');
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;

  if (language === 'fr') {
    const space = '\u00A0';
    return minutes === 0
      ? `${hours}${space}h`
      : `${hours}${space}h${space}${String(minutes).padStart(2, '0')}`;
  }

  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

export const isUpcoming = (value: string | Date): boolean => {
  const date = value instanceof Date ? value : new Date(value);
  return !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
};

/** "March 2026" / "mars 2026". */
export function formatMonthYear(value: string | Date, language: Language): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString(localeFor(language), { year: 'numeric', month: 'long' });
}

/**
 * A span of days. One date when there is no end or it falls on the same day,
 * otherwise "start – end". `precision: 'month'` gives "January 2026 – December
 * 2027", which is how a project's period reads best.
 */
export function formatDateRange(
  start: string | Date,
  end: string | Date | null | undefined,
  language: Language,
  precision: 'day' | 'month' = 'day'
): string {
  const format = precision === 'month' ? formatMonthYear : formatLongDate;
  const first = format(start, language);
  if (!end) return first;

  const last = format(end, language);
  return last && last !== first ? `${first} – ${last}` : first;
}
