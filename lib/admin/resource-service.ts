import {
  Language,
  LANGUAGE_LABELS,
  normalizeTranslation,
  readTranslation,
} from '@/lib/translations';
import { generateSlug } from '@/lib/blog-utils';
import {
  FormValues,
  ResourceConfig,
  ResourceField,
  asString,
  asStringArray,
  asTranslation,
  isTranslatable,
} from './resource-config';

/**
 * Shared conversion and validation logic for every admin-managed content type.
 *
 * Deliberately free of server-only imports: the editor uses it to decide what
 * is missing, and the server actions use the same functions to enforce it.
 */

/** A record straight out of Prisma. */
type ResourceRow = Record<string, unknown>;

const emptyValue = (field: ResourceField) => {
  if (isTranslatable(field)) return { en: '', fr: '' };
  return field.type === 'gallery' ? [] : '';
};

export function emptyValues(config: ResourceConfig): FormValues {
  const values: FormValues = {};
  for (const field of config.fields) values[field.name] = emptyValue(field);
  return values;
}

/** Format a stored date for an `<input type="date">`. */
function toDateInput(value: unknown): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

/** Turn a database row into editor state. */
export function toFormValues(config: ResourceConfig, row: ResourceRow): FormValues {
  const values: FormValues = {};

  for (const field of config.fields) {
    const raw = row[field.name];

    if (isTranslatable(field)) {
      values[field.name] = readTranslation(raw);
      continue;
    }

    if (field.type === 'gallery') {
      values[field.name] = Array.isArray(raw) ? (raw as string[]) : [];
      continue;
    }

    if (field.type === 'date') {
      values[field.name] = toDateInput(raw);
      continue;
    }

    values[field.name] = raw == null ? '' : String(raw);
  }

  return values;
}

/**
 * Turn editor state into a Prisma payload. Empty optional scalars become null
 * so they do not come back as empty strings on the public pages.
 */
export function toPayload(
  config: ResourceConfig,
  values: FormValues
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (const field of config.fields) {
    const value = values[field.name];

    if (isTranslatable(field)) {
      payload[field.name] = normalizeTranslation(asTranslation(value));
      continue;
    }

    if (field.type === 'gallery') {
      payload[field.name] = asStringArray(value).filter(Boolean);
      continue;
    }

    const text = asString(value).trim();

    if (field.type === 'date') {
      payload[field.name] = text ? new Date(text) : null;
      continue;
    }

    payload[field.name] = text || null;
  }

  return payload;
}

export interface MissingField {
  field: ResourceField;
  language?: Language;
}

/**
 * First missing required field.
 *
 * English is always required because it is the site-wide fallback; French is
 * only required to publish, so an editor can save an English draft and add the
 * translation later. Same rule as the blog.
 */
export function findMissingField(
  config: ResourceConfig,
  values: FormValues,
  publishing: boolean
): MissingField | null {
  const required = config.fields.filter((field) => field.required);

  for (const field of required) {
    if (!isTranslatable(field)) {
      if (!asString(values[field.name]).trim()) return { field };
      continue;
    }
    if (!asTranslation(values[field.name]).en.trim()) {
      return { field, language: 'en' };
    }
  }

  if (publishing) {
    for (const field of required) {
      if (!isTranslatable(field)) continue;
      if (!asTranslation(values[field.name]).fr.trim()) {
        return { field, language: 'fr' };
      }
    }
  }

  return null;
}

export function describeMissingField(missing: MissingField, publishing: boolean): string {
  const where = missing.language ? `${LANGUAGE_LABELS[missing.language]} ` : '';
  const suffix = publishing ? ' before publishing' : '';
  return `Add the ${where}${missing.field.label.toLowerCase()}${suffix}`;
}

/** Server-side guard, mirroring `findMissingField`. Returns an error message. */
export function validateValues(
  config: ResourceConfig,
  values: FormValues,
  publishing: boolean
): string | null {
  const missing = findMissingField(config, values, publishing);
  return missing ? describeMissingField(missing, publishing) : null;
}

/** Slug generated from the English text of the configured source field. */
export function buildSlug(config: ResourceConfig, values: FormValues): string | null {
  if (!config.slugFrom) return null;
  return generateSlug(asTranslation(values[config.slugFrom]).en) || null;
}

/**
 * A record can only go live once every required field has French text.
 * Used by the list view to disable the quick publish toggle.
 */
export function rowIsTranslated(config: ResourceConfig, row: ResourceRow): boolean {
  return config.fields
    .filter((field) => field.required && isTranslatable(field))
    .every((field) => readTranslation(row[field.name]).fr.trim().length > 0);
}

/** English label for a row, used in admin lists. */
export function rowTitle(config: ResourceConfig, row: ResourceRow): string {
  return readTranslation(row[config.titleField]).en;
}
