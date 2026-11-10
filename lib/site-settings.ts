import type { Language, Translation } from '@/lib/translations';

/**
 * The council's own details: logo, contact channels, social links and giving
 * accounts. Stored as one `SiteSettings` row and edited at /admin/settings;
 * read on the server by `getSiteSettings()` in app/actions/settings.ts and
 * handed to client components through `SiteSettingsProvider`.
 *
 * Pure data and helpers — safe to import from client and server alike.
 */

export interface MobileMoneyAccount {
  /** e.g. 'MTN Mobile Money', 'Orange Money'. */
  provider: string;
  number: string;
  accountName: string;
}

export interface SiteSettingsValues {
  /** Blank means the bundled logo. */
  logo: string;
  email: string;
  phone: string;
  /** Shown on the contact page; the first also drives the floating button. */
  whatsapp: string[];
  address: Translation;
  officeHours: Translation;
  mapsUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  xUrl: string;
  youtubeUrl: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankSwift: string;
  mobileMoney: MobileMoneyAccount[];
}

export const DEFAULT_LOGO = '/images/logo_CEPCA.png';

/**
 * What the site shows until the secretariat first saves /admin/settings —
 * the values that were hardcoded before the settings existed.
 *
 * The giving accounts are deliberately empty. A wrong account number sends
 * real money to the wrong place, so /give offers the office's phone and email
 * until someone enters the council's real details.
 */
export const DEFAULT_SITE_SETTINGS: SiteSettingsValues = {
  logo: '',
  email: 'info@cepcacameroun.com',
  phone: '+237 242 657 608',
  whatsapp: ['+237 677 875 300', '+237 656 779 874'],
  address: {
    en: 'Yaoundé, P.O. Box 491 Rue Ceper, Elig-Essono',
    fr: 'Yaoundé, B.P. 491 Rue Ceper, Elig-Essono',
  },
  officeHours: {
    en: 'Monday - Friday: 9:00 AM - 5:00 PM\nEmergency: Available 24/7',
    fr: 'Lundi - Vendredi: 9h00 - 17h00\nUrgence: Disponible 24h/24 et 7j/7',
  },
  mapsUrl: 'https://maps.app.goo.gl/ehjxm8QprKj2Jpv16',
  // The council's official page (the source of the site's event reports).
  facebookUrl: 'https://www.facebook.com/cepcacamerounofficial',
  instagramUrl: '',
  xUrl: '',
  youtubeUrl: '',
  bankName: '',
  bankAccountName: '',
  bankAccountNumber: '',
  bankSwift: '',
  mobileMoney: [],
};

export const logoSrc = (settings: SiteSettingsValues) => settings.logo || DEFAULT_LOGO;

/** A bilingual value in the reader's language, falling back to English. */
export const inLanguage = (value: Translation, language: Language) =>
  (value[language] || value.en || '').trim();

/** `tel:` wants the digits and a leading plus, nothing else. */
export const telHref = (number: string) => `tel:${number.replace(/[^\d+]/g, '')}`;

/** wa.me wants the international number as bare digits. */
export const whatsappHref = (number: string, message?: string) =>
  `https://wa.me/${number.replace(/\D/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

/**
 * A keyless Google Maps embed of the office address. The P.O. box is dropped
 * from the query because it is not a place and only confuses the geocoder.
 */
export const mapEmbedSrc = (address: Translation) => {
  const query = (address.en || address.fr)
    .replace(/\b(P\.?\s?O\.?\s?Box|B\.?\s?P\.?)\s*\d+/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s,]+|[\s,]+$/g, '');
  return `https://maps.google.com/maps?q=${encodeURIComponent(`${query}, Cameroon`)}&output=embed`;
};

export const hasBankTransfer = (settings: SiteSettingsValues) =>
  Boolean(settings.bankName && settings.bankAccountName && settings.bankAccountNumber);

/** True while no payment details have been entered yet. */
export const givingDetailsMissing = (settings: SiteSettingsValues) =>
  !hasBankTransfer(settings) && settings.mobileMoney.length === 0;

/** The social profiles that have been filled in, in display order. */
export const socialLinks = (settings: SiteSettingsValues) =>
  (
    [
      ['facebook', settings.facebookUrl],
      ['instagram', settings.instagramUrl],
      ['x', settings.xUrl],
      ['youtube', settings.youtubeUrl],
    ] as const
  ).filter(([, href]) => Boolean(href));
