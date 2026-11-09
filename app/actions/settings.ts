'use server';

import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { guarded, requireSuperAdmin, type ActionOutcome } from '@/lib/auth/roles';
import { deleteImage } from '@/app/actions/upload';
import { isUploadedImage } from '@/lib/media';
import { normalizeTranslation, readTranslation } from '@/lib/translations';
import {
  DEFAULT_SITE_SETTINGS,
  type MobileMoneyAccount,
  type SiteSettingsValues,
} from '@/lib/site-settings';

const SETTINGS_ID = 'site';
const SETTINGS_TAG = 'site-settings';

const text = (value: unknown, max = 300) => String(value ?? '').trim().slice(0, max);

const bilingual = (value: unknown, max = 500) => {
  const { en, fr } = normalizeTranslation(readTranslation(value));
  return { en: en.slice(0, max), fr: fr.slice(0, max) };
};

function fromRow(row: Record<string, any>): SiteSettingsValues {
  const mobileMoney = Array.isArray(row.mobileMoney) ? row.mobileMoney : [];

  return {
    logo: row.logo ?? '',
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp ?? [],
    address: readTranslation(row.address),
    officeHours: readTranslation(row.officeHours),
    mapsUrl: row.mapsUrl ?? '',
    facebookUrl: row.facebookUrl ?? '',
    instagramUrl: row.instagramUrl ?? '',
    xUrl: row.xUrl ?? '',
    youtubeUrl: row.youtubeUrl ?? '',
    bankName: row.bankName ?? '',
    bankAccountName: row.bankAccountName ?? '',
    bankAccountNumber: row.bankAccountNumber ?? '',
    bankSwift: row.bankSwift ?? '',
    mobileMoney: mobileMoney.map((entry: any) => ({
      provider: text(entry?.provider),
      number: text(entry?.number),
      accountName: text(entry?.accountName),
    })),
  };
}

/* Every page reads this through the root layout, the dashboard included, so
   it is cached and dropped by tag whenever the settings are saved. */
const readSettings = unstable_cache(
  async () => {
    const row = await prisma.siteSettings.findUnique({ where: { id: SETTINGS_ID } });
    return row ? fromRow(row) : null;
  },
  [SETTINGS_TAG],
  { tags: [SETTINGS_TAG] },
);

/**
 * The saved settings, or the defaults when nothing has been saved yet. Never
 * throws: every page renders through this, so a database blip — or a
 * database the `SiteSettings` table has not been pushed to — must degrade to
 * the defaults instead of taking the whole site down. Failures are not cached.
 */
export async function getSiteSettings(): Promise<SiteSettingsValues> {
  try {
    return (await readSettings()) ?? DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.error('[settings] Could not read the site settings, using defaults:', error);
    return DEFAULT_SITE_SETTINGS;
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Blank, or an http(s) URL. */
function checkUrl(value: string, label: string): string | null {
  if (!value) return null;
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:' ? null : `${label} must start with https://`;
  } catch {
    return `${label} is not a valid link`;
  }
}

/** Validates and tidies what the settings form sent. */
function clean(input: SiteSettingsValues): { values?: SiteSettingsValues; error?: string } {
  const values: SiteSettingsValues = {
    logo: text(input.logo, 500),
    email: text(input.email, 254).toLowerCase(),
    phone: text(input.phone, 40),
    whatsapp: (Array.isArray(input.whatsapp) ? input.whatsapp : [])
      .map((number) => text(number, 40))
      .filter(Boolean),
    address: bilingual(input.address),
    officeHours: bilingual(input.officeHours),
    mapsUrl: text(input.mapsUrl, 500),
    facebookUrl: text(input.facebookUrl, 500),
    instagramUrl: text(input.instagramUrl, 500),
    xUrl: text(input.xUrl, 500),
    youtubeUrl: text(input.youtubeUrl, 500),
    bankName: text(input.bankName, 120),
    bankAccountName: text(input.bankAccountName, 120),
    bankAccountNumber: text(input.bankAccountNumber, 60),
    bankSwift: text(input.bankSwift, 20).toUpperCase(),
    mobileMoney: (Array.isArray(input.mobileMoney) ? input.mobileMoney : [])
      .map(
        (entry): MobileMoneyAccount => ({
          provider: text(entry?.provider, 60),
          number: text(entry?.number, 40),
          accountName: text(entry?.accountName, 120),
        }),
      )
      .filter((entry) => entry.provider || entry.number || entry.accountName),
  };

  if (!EMAIL.test(values.email)) return { error: 'Enter a valid email address.' };
  if (!values.phone) return { error: 'Enter the office phone number.' };
  if (!values.address.en) return { error: 'Enter the address in English.' };

  // next/image renders the logo on every page and only allows the upload
  // hosts in next.config.js; any other host would crash the header and footer.
  if (values.logo && !values.logo.startsWith('/images/') && !isUploadedImage(values.logo)) {
    return { error: 'The logo must be an uploaded image.' };
  }

  const tooShort = values.whatsapp.find((number) => number.replace(/\D/g, '').length < 8);
  if (tooShort) return { error: `"${tooShort}" is not a full WhatsApp number.` };
  if (values.whatsapp.length > 5) return { error: 'List at most five WhatsApp numbers.' };

  const urlError =
    checkUrl(values.mapsUrl, 'The map link') ||
    checkUrl(values.facebookUrl, 'The Facebook link') ||
    checkUrl(values.instagramUrl, 'The Instagram link') ||
    checkUrl(values.xUrl, 'The X link') ||
    checkUrl(values.youtubeUrl, 'The YouTube link');
  if (urlError) return { error: urlError };

  // Half an account is worse than none — it sends a gift nowhere.
  const bankParts = [values.bankName, values.bankAccountName, values.bankAccountNumber];
  if (bankParts.some(Boolean) && !bankParts.every(Boolean)) {
    return { error: 'Bank transfer needs the bank, the account name and the account number.' };
  }
  if (values.mobileMoney.some((entry) => !entry.provider || !entry.number)) {
    return { error: 'Each Mobile Money account needs a provider and a number.' };
  }
  if (values.mobileMoney.length > 6) return { error: 'List at most six Mobile Money accounts.' };

  return { values };
}

export async function updateSiteSettings(
  input: SiteSettingsValues,
): Promise<ActionOutcome<SiteSettingsValues>> {
  return guarded(async () => {
    await requireSuperAdmin();

    const { values, error } = clean(input);
    if (!values) return { success: false, error };

    const previous = await prisma.siteSettings.findUnique({
      where: { id: SETTINGS_ID },
      select: { logo: true },
    });

    // Spread into fresh objects: Prisma's Json input rejects interface types.
    const data = {
      ...values,
      logo: values.logo || null,
      address: { ...values.address },
      officeHours: { ...values.officeHours },
      mobileMoney: values.mobileMoney.map((entry) => ({ ...entry })),
    };

    await prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      create: { id: SETTINGS_ID, ...data },
      update: data,
    });

    // A replaced upload would otherwise sit in the bucket forever. deleteImage
    // only touches our own R2 files.
    if (previous?.logo && previous.logo !== values.logo) {
      await deleteImage(previous.logo);
    }

    revalidateTag(SETTINGS_TAG);
    // The footer, header and contact details are on every page.
    revalidatePath('/', 'layout');

    return { success: true, data: values };
  });
}
