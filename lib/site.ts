import type { Language } from '@/lib/translations';

/**
 * The council's public identity, used by metadata, structured data, the
 * sitemap, robots.txt and llms.txt.
 *
 * SITE_URL is the canonical host. www.cepcacameroun.com and the *.vercel.app
 * aliases serve the same pages; next.config.js redirects www here and every
 * page's canonical tag points here, so search engines index one copy.
 */
export const SITE_URL = 'https://cepcacameroun.com';

/** The short name used in titles ("Events · CEPCA"). */
export const SITE_NAME = 'CEPCA';

export const ORGANIZATION_NAME: Record<Language, string> = {
  en: 'Council of Protestant Churches of Cameroon',
  fr: 'Conseil des Églises Protestantes du Cameroun',
};

/** Every name the council is known by, for structured data. */
export const ORGANIZATION_ALIASES = [
  'CEPCA',
  'CPCC',
  'Conseil des Églises Protestantes du Cameroun',
  'Council of Protestant Churches of Cameroon',
];

/** Open Graph wants language_TERRITORY. */
export const OG_LOCALE: Record<Language, string> = { en: 'en_US', fr: 'fr_FR' };

/** BCP 47 tags for `inLanguage` and hreflang. */
export const LANGUAGE_TAG: Record<Language, string> = { en: 'en', fr: 'fr' };

/** Shared social preview, 1200×630, one per language (public/images/og/). */
export const DEFAULT_SHARE_IMAGE: Record<Language, string> = {
  en: '/images/og/cepca-en.jpg',
  fr: '/images/og/cepca-fr.jpg',
};

export const absoluteUrl = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

/** IDs that let every page's structured data point at the same entities. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
