import { revalidatePath } from 'next/cache';
import { deleteImage } from '@/app/actions/upload';
import { AccessError, requireSuperAdmin } from '@/lib/auth/roles';
import {
  FormValues,
  ResourceConfig,
  asString,
  asStringArray,
  isTranslatable,
} from './resource-config';
import { buildSlug, rowIsTranslated, toPayload, validateValues } from './resource-service';

/**
 * CRUD shared by every admin-managed content type.
 *
 * Each `app/actions/<type>.ts` is a thin `'use server'` wrapper that binds the
 * matching Prisma delegate and config to these functions, so the publish rules
 * and image cleanup only exist in one place.
 */

/** Structural view of a Prisma model delegate; the models differ per type. */
export interface ResourceDelegate {
  findMany(args?: any): Promise<any[]>;
  findUnique(args: any): Promise<any | null>;
  findFirst(args: any): Promise<any | null>;
  create(args: any): Promise<any>;
  update(args: any): Promise<any>;
  delete(args: any): Promise<any>;
}

export interface ResourceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Every content type behind this module is council-wide, so all of it is
 * super-admin only. Church accounts are confined to their own profile via
 * app/actions/churches.ts.
 */
function denied(error: unknown, fallback: string): ResourceResult {
  if (error instanceof AccessError) {
    return { success: false, error: error.message };
  }
  console.error(fallback, error);
  return { success: false, error: fallback };
}

const imageFieldNames = (config: ResourceConfig) =>
  config.fields
    .filter((field) => !isTranslatable(field) && field.type === 'image')
    .map((field) => field.name);

const galleryFieldNames = (config: ResourceConfig) =>
  config.fields
    .filter((field) => !isTranslatable(field) && field.type === 'gallery')
    .map((field) => field.name);

/** Every Cloudinary URL a row currently references. */
function collectImages(config: ResourceConfig, row: Record<string, unknown>): string[] {
  const urls: string[] = [];

  for (const name of imageFieldNames(config)) {
    const value = row[name];
    if (typeof value === 'string' && value) urls.push(value);
  }

  for (const name of galleryFieldNames(config)) {
    const value = row[name];
    if (Array.isArray(value)) urls.push(...value.filter(Boolean));
  }

  return urls;
}

/** Only remove files we host; pasted third-party URLs are left alone. */
const isCloudinaryUrl = (url: string) => url.includes('res.cloudinary.com');

async function removeImages(urls: string[]) {
  for (const url of urls.filter(isCloudinaryUrl)) {
    await deleteImage(url);
  }
}

function revalidate(config: ResourceConfig, slug?: string | null) {
  revalidatePath(config.adminPath);
  revalidatePath(config.publicPath);
  if (slug) revalidatePath(`${config.publicPath}/${slug}`);

  // The home page pulls the hero events and the charity band from these same
  // tables, so it has to be refreshed whenever any of them changes.
  revalidatePath('/');
}

/** Append -2, -3 … until the slug is free. */
async function uniqueSlug(
  delegate: ResourceDelegate,
  base: string,
  excludeId?: string
): Promise<string> {
  let candidate = base;
  let suffix = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await delegate.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

export async function listRows(
  delegate: ResourceDelegate,
  config: ResourceConfig
): Promise<ResourceResult<any[]>> {
  try {
    const data = await delegate.findMany({ orderBy: config.orderBy });
    return { success: true, data };
  } catch (error) {
    console.error(`Error listing ${config.key}:`, error);
    return { success: false, error: `Failed to load ${config.plural}`, data: [] };
  }
}

export async function listPublishedRows(
  delegate: ResourceDelegate,
  config: ResourceConfig
): Promise<ResourceResult<any[]>> {
  try {
    const data = await delegate.findMany({
      where: { published: true },
      orderBy: config.orderBy,
    });
    return { success: true, data };
  } catch (error) {
    console.error(`Error listing published ${config.key}:`, error);
    return { success: false, error: `Failed to load ${config.plural}`, data: [] };
  }
}

export async function getRowById(
  delegate: ResourceDelegate,
  config: ResourceConfig,
  id: string
): Promise<ResourceResult> {
  try {
    const data = await delegate.findUnique({ where: { id } });
    if (!data) return { success: false, error: `${config.singular} not found` };
    return { success: true, data };
  } catch (error) {
    console.error(`Error loading ${config.key}:`, error);
    return { success: false, error: `Failed to load ${config.singular}` };
  }
}

export async function getPublishedRowBySlug(
  delegate: ResourceDelegate,
  config: ResourceConfig,
  slug: string
): Promise<ResourceResult> {
  try {
    const data = await delegate.findFirst({ where: { slug, published: true } });
    if (!data) return { success: false, error: `${config.singular} not found` };
    return { success: true, data };
  } catch (error) {
    console.error(`Error loading ${config.key}:`, error);
    return { success: false, error: `Failed to load ${config.singular}` };
  }
}

export async function createRow(
  delegate: ResourceDelegate,
  config: ResourceConfig,
  values: FormValues,
  publish: boolean
): Promise<ResourceResult> {
  try {
    await requireSuperAdmin();

    const validationError = validateValues(config, values, publish);
    if (validationError) return { success: false, error: validationError };

    const payload = toPayload(config, values);
    const base = buildSlug(config, values);

    if (config.slugFrom) {
      if (!base) {
        return { success: false, error: 'Could not build a URL from the English title' };
      }
      payload.slug = await uniqueSlug(delegate, base);
    }

    payload.published = publish;

    const data = await delegate.create({ data: payload });
    revalidate(config, data.slug);

    return { success: true, data };
  } catch (error) {
    return denied(error, `Failed to create ${config.singular.toLowerCase()}`);
  }
}

export async function updateRow(
  delegate: ResourceDelegate,
  config: ResourceConfig,
  id: string,
  values: FormValues,
  publish: boolean
): Promise<ResourceResult> {
  try {
    await requireSuperAdmin();

    const validationError = validateValues(config, values, publish);
    if (validationError) return { success: false, error: validationError };

    const existing = await delegate.findUnique({ where: { id } });
    if (!existing) return { success: false, error: `${config.singular} not found` };

    const payload = toPayload(config, values);
    const base = buildSlug(config, values);

    if (config.slugFrom && base) {
      payload.slug = await uniqueSlug(delegate, base, id);
    }

    payload.published = publish;

    // Drop images that are no longer referenced.
    const keptUrls = new Set([
      ...imageFieldNames(config).map((name) => asString(values[name])),
      ...galleryFieldNames(config).flatMap((name) => asStringArray(values[name])),
    ]);
    const orphaned = collectImages(config, existing).filter((url) => !keptUrls.has(url));

    const data = await delegate.update({ where: { id }, data: payload });

    await removeImages(orphaned);
    revalidate(config, data.slug);
    if (existing.slug && existing.slug !== data.slug) {
      revalidate(config, existing.slug);
    }

    return { success: true, data };
  } catch (error) {
    return denied(error, `Failed to update ${config.singular.toLowerCase()}`);
  }
}

export async function deleteRow(
  delegate: ResourceDelegate,
  config: ResourceConfig,
  id: string
): Promise<ResourceResult> {
  try {
    await requireSuperAdmin();

    const existing = await delegate.findUnique({ where: { id } });
    if (!existing) return { success: false, error: `${config.singular} not found` };

    await delegate.delete({ where: { id } });
    await removeImages(collectImages(config, existing));

    revalidate(config, existing.slug);
    return { success: true };
  } catch (error) {
    return denied(error, `Failed to delete ${config.singular.toLowerCase()}`);
  }
}

export async function toggleRowPublish(
  delegate: ResourceDelegate,
  config: ResourceConfig,
  id: string
): Promise<ResourceResult> {
  try {
    await requireSuperAdmin();

    const existing = await delegate.findUnique({ where: { id } });
    if (!existing) return { success: false, error: `${config.singular} not found` };

    // Draft -> published requires a complete French translation, the same rule
    // the editor enforces.
    if (!existing.published) {
      if (!rowIsTranslated(config, existing)) {
        return {
          success: false,
          error: 'Add the French translation before publishing this item',
        };
      }
    }

    const data = await delegate.update({
      where: { id },
      data: { published: !existing.published },
    });

    revalidate(config, data.slug);
    return { success: true, data };
  } catch (error) {
    return denied(error, 'Failed to update publish status');
  }
}
