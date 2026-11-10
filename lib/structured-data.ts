import type { Language } from '@/lib/translations';
import { readTranslation } from '@/lib/translations';
import { inLanguage, logoSrc, socialLinks, type SiteSettingsValues } from '@/lib/site-settings';
import { pageUrl, plainText } from '@/lib/seo';
import {
  absoluteUrl,
  LANGUAGE_TAG,
  ORGANIZATION_ALIASES,
  ORGANIZATION_ID,
  ORGANIZATION_NAME,
  SITE_NAME,
  SITE_URL,
  WEBSITE_ID,
} from '@/lib/site';

/**
 * schema.org JSON-LD for search engines and AI answer engines.
 *
 * Every builder states only what the database or the site settings actually
 * hold — nothing is inferred. In particular there is no founding date for the
 * council itself: the site says both 1957 and 1969 and the council has not yet
 * said which is right.
 *
 * Render the result with <JsonLd data={…} /> (components/JsonLd.tsx).
 */

type Thing = Record<string, unknown>;

/** Text of a bilingual value in `language`, falling back to English. */
const t = (value: unknown, language: Language) => {
  const translation = readTranslation(value);
  return (translation[language] || translation.en || '').trim();
};

/** A short reference to the council, enough for Google without the full graph. */
export function organizationRef(language: Language, settings?: SiteSettingsValues): Thing {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: ORGANIZATION_NAME[language],
    alternateName: SITE_NAME,
    url: pageUrl('/', language),
    ...(settings ? { logo: absoluteUrl(logoSrc(settings)) } : {}),
  };
}

interface OrganizationInput {
  language: Language;
  settings: SiteSettingsValues;
  churches?: { name: string; path: string; website?: string | null }[];
  departments?: { name: string; acronym?: string; path: string }[];
}

/** The council in full: contact details, profiles, members and departments. */
export function organizationJsonLd({ language, settings, churches = [], departments = [] }: OrganizationInput): Thing {
  const address = inLanguage(settings.address, language);
  const sameAs = socialLinks(settings).map(([, href]) => href);

  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: ORGANIZATION_NAME[language],
    alternateName: ORGANIZATION_ALIASES.filter((alias) => alias !== ORGANIZATION_NAME[language]),
    url: pageUrl('/', language),
    logo: { '@type': 'ImageObject', url: absoluteUrl(logoSrc(settings)) },
    description:
      language === 'fr'
        ? "Le Conseil des Églises Protestantes du Cameroun (CEPCA) est l'organisation œcuménique des Églises protestantes du Cameroun. Il rassemble 12 Églises membres et coordonne leur action commune en santé, éducation, jeunesse, femmes, témoignage chrétien et communication."
        : 'The Council of Protestant Churches of Cameroon (CEPCA, CPCC in English) is the ecumenical body of the Protestant churches of Cameroon. It brings together 12 member churches and coordinates their common work in health, education, youth, women, Christian witness and communication.',
    areaServed: { '@type': 'Country', name: 'Cameroon', identifier: 'CM' },
    knowsLanguage: ['en', 'fr'],
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(address
      ? { address: { '@type': 'PostalAddress', streetAddress: address, addressCountry: 'CM' } }
      : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: language === 'fr' ? 'secrétariat général' : 'general secretariat',
      ...(settings.email ? { email: settings.email } : {}),
      ...(settings.phone ? { telephone: settings.phone } : {}),
      availableLanguage: ['English', 'French'],
      areaServed: 'CM',
    },
    ...(sameAs.length ? { sameAs } : {}),
    ...(churches.length
      ? {
          member: churches.map((church) => ({
            '@type': 'Organization',
            name: church.name,
            url: pageUrl(church.path, language),
            ...(church.website ? { sameAs: church.website } : {}),
          })),
        }
      : {}),
    ...(departments.length
      ? {
          department: departments.map((department) => ({
            '@type': 'Organization',
            name: department.name,
            ...(department.acronym ? { alternateName: department.acronym } : {}),
            url: pageUrl(department.path, language),
          })),
        }
      : {}),
  };
}

export function websiteJsonLd(language: Language): Thing {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: [ORGANIZATION_NAME.en, ORGANIZATION_NAME.fr],
    inLanguage: [LANGUAGE_TAG.en, LANGUAGE_TAG.fr],
    publisher: { '@id': ORGANIZATION_ID },
    description: ORGANIZATION_NAME[language],
  };
}

/** Breadcrumbs from the home page down to the current page. */
export function breadcrumbJsonLd(language: Language, trail: { name: string; path: string }[]): Thing {
  const home = { name: language === 'fr' ? 'Accueil' : 'Home', path: '/' };
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [home, ...trail].map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: pageUrl(crumb.path, language),
    })),
  };
}

/**
 * The start of an event in ISO 8601. Dates are stored as midnight UTC of the
 * calendar day; the optional time ("10:00", "10h00") is local to Cameroon,
 * which keeps West Africa Time (UTC+1) all year.
 */
function startDate(dateIso: string, time?: string | null): string {
  const day = dateIso.slice(0, 10);
  const match = time?.match(/^\s*(\d{1,2})\s*[:hH.]\s*(\d{2})/);
  if (!match) return day;
  const hours = Number(match[1]);
  if (hours > 23) return day;
  return `${day}T${String(hours).padStart(2, '0')}:${match[2]}:00+01:00`;
}

interface EventInput {
  language: Language;
  path: string;
  name: string;
  description: string;
  date: string;
  endDate?: string | null;
  time?: string | null;
  location: string;
  images: (string | null | undefined)[];
  /** EducationEvent for workshops. */
  type?: 'Event' | 'EducationEvent';
}

export function eventJsonLd({
  language,
  path,
  name,
  description,
  date,
  endDate,
  time,
  location,
  images,
  type = 'Event',
}: EventInput): Thing {
  const photos = Array.from(new Set(images.filter(Boolean) as string[])).slice(0, 5).map(absoluteUrl);

  return {
    '@type': type,
    name,
    description: plainText(description, 500),
    url: pageUrl(path, language),
    inLanguage: LANGUAGE_TAG[language],
    startDate: startDate(date, time),
    ...(endDate ? { endDate: endDate.slice(0, 10) } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(location
      ? {
          location: {
            '@type': 'Place',
            name: location,
            address: { '@type': 'PostalAddress', streetAddress: location, addressCountry: 'CM' },
          },
        }
      : {}),
    ...(photos.length ? { image: photos } : {}),
    organizer: organizationRef(language),
  };
}

interface ArticleInput {
  language: Language;
  path: string;
  type: 'NewsArticle' | 'BlogPosting';
  headline: string;
  description: string;
  image?: string | null;
  datePublished: string;
  dateModified?: string;
  section?: string;
  settings: SiteSettingsValues;
}

export function articleJsonLd({
  language,
  path,
  type,
  headline,
  description,
  image,
  datePublished,
  dateModified,
  section,
  settings,
}: ArticleInput): Thing {
  const url = pageUrl(path, language);
  return {
    '@type': type,
    headline: headline.length > 110 ? `${headline.slice(0, 109)}…` : headline,
    description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: LANGUAGE_TAG[language],
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    ...(image ? { image: [absoluteUrl(image)] } : {}),
    ...(section ? { articleSection: section } : {}),
    author: organizationRef(language),
    publisher: organizationRef(language, settings),
  };
}

/** A board member as a Person working for the council. */
export function personJsonLd(
  language: Language,
  person: { name: string; title: unknown; photo?: string | null }
): Thing {
  const jobTitle = t(person.title, language);
  return {
    '@type': 'Person',
    name: person.name,
    ...(jobTitle ? { jobTitle } : {}),
    ...(person.photo ? { image: absoluteUrl(person.photo) } : {}),
    worksFor: organizationRef(language),
  };
}

interface ChurchInput {
  language: Language;
  slug: string;
  denomination: unknown;
  location: unknown;
  history: unknown;
  founded?: string | null;
  logo?: string | null;
  website?: string | null;
}

/** A member church: its own organisation, a member of the council. */
export function memberChurchJsonLd({ language, slug, denomination, location, history, founded, logo, website }: ChurchInput): Thing {
  const town = t(location, language);
  const description = plainText(t(history, language), 300);
  return {
    '@type': 'Organization',
    name: t(denomination, language),
    url: pageUrl(`/members/${slug}`, language),
    ...(website ? { sameAs: website } : {}),
    ...(logo ? { logo: absoluteUrl(logo) } : {}),
    ...(founded && /^\d{4}$/.test(founded.trim()) ? { foundingDate: founded.trim() } : {}),
    ...(town ? { address: { '@type': 'PostalAddress', addressLocality: town, addressCountry: 'CM' } } : {}),
    ...(description ? { description } : {}),
    memberOf: organizationRef(language),
  };
}

interface DepartmentInput {
  language: Language;
  slug: string;
  name: unknown;
  acronym?: string;
  summary: unknown;
  logo?: string | null;
  email?: string | null;
  phone?: string | null;
}

/** A department of the council. */
export function departmentJsonLd({ language, slug, name, acronym, summary, logo, email, phone }: DepartmentInput): Thing {
  const description = plainText(t(summary, language), 300);
  return {
    '@type': 'Organization',
    name: t(name, language),
    ...(acronym ? { alternateName: acronym } : {}),
    url: pageUrl(`/departments/${slug}`, language),
    ...(description ? { description } : {}),
    ...(logo ? { logo: absoluteUrl(logo) } : {}),
    ...(email ? { email } : {}),
    ...(phone ? { telephone: phone } : {}),
    parentOrganization: organizationRef(language),
  };
}

/** Wraps several entities into one JSON-LD document. */
export const graph = (...things: (Thing | null | undefined | false)[]) => ({
  '@context': 'https://schema.org',
  '@graph': things.filter(Boolean),
});
