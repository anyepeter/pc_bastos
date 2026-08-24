import { Language, Translation } from '@/lib/translations';

/**
 * Declarative description of an admin-managed content type.
 *
 * Every content type on this site is the same shape — some bilingual text plus
 * a little metadata and one or more images — so the admin list, the editor and
 * the validation rules are all driven from these configs instead of being
 * copy-pasted per type. See lib/admin/configs.ts for the actual definitions.
 */

/** Bilingual fields are stored as a `{ en, fr }` JSON column. */
export type TranslatableFieldType = 'text' | 'textarea' | 'markdown';

/** Plain fields are stored as a normal scalar column. */
export type PlainFieldType = 'text' | 'date' | 'time' | 'select' | 'url' | 'image' | 'gallery';

interface BaseField {
  name: string;
  label: string;
  /** Shown under the label in the editor. */
  description?: string;
  placeholder?: string;
  /** English is enforced always; French only when publishing. */
  required?: boolean;
}

export interface TranslatableField extends BaseField {
  kind: 'translatable';
  type: TranslatableFieldType;
}

export interface PlainField extends BaseField {
  kind: 'plain';
  type: PlainFieldType;
  /** For `select` fields. */
  options?: { value: string; label: string }[];
}

export type ResourceField = TranslatableField | PlainField;

export interface ResourceConfig {
  /** URL segment and Prisma model key, e.g. 'events'. */
  key: string;
  singular: string;
  plural: string;
  adminPath: string;
  publicPath: string;
  /** Field the slug is generated from. Omit for types without a detail page. */
  slugFrom?: string;
  /** Bilingual field used as the row label in the admin list. */
  titleField: string;
  fields: ResourceField[];
  orderBy: Record<string, 'asc' | 'desc'>;
}

/** A single field's value in the editor. */
export type FieldValue = Translation | string | string[];
export type FormValues = Record<string, FieldValue>;

export const isTranslatable = (field: ResourceField): field is TranslatableField =>
  field.kind === 'translatable';

export const translatableFields = (config: ResourceConfig): TranslatableField[] =>
  config.fields.filter(isTranslatable);

export const plainFields = (config: ResourceConfig): PlainField[] =>
  config.fields.filter((field): field is PlainField => field.kind === 'plain');

/** Narrowing helpers — form values are heterogeneous by design. */
export const asTranslation = (value: FieldValue | undefined): Translation =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? value
    : { en: '', fr: '' };

export const asString = (value: FieldValue | undefined): string =>
  typeof value === 'string' ? value : '';

export const asStringArray = (value: FieldValue | undefined): string[] =>
  Array.isArray(value) ? value : [];

/** True when every required bilingual field has text in that language. */
export function isLanguageComplete(
  config: ResourceConfig,
  values: FormValues,
  language: Language
): boolean {
  return translatableFields(config)
    .filter((field) => field.required)
    .every((field) => asTranslation(values[field.name])[language].trim().length > 0);
}
