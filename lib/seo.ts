import type { Metadata } from 'next';
import type { Language } from '@/lib/translations';
import { LANGUAGES } from '@/lib/translations';
import { isLanguage, localizePath } from '@/lib/locale-path';
import { frenchTypography } from '@/lib/french-typography';
import {
  absoluteUrl,
  DEFAULT_SHARE_IMAGE,
  OG_LOCALE,
  ORGANIZATION_NAME,
  SITE_NAME,
} from '@/lib/site';

/**
 * Search and social metadata for every public page, in both languages.
 *
 * Titles and descriptions live here, not in the locale files: they are read
 * only on the server, and a typed record makes a missing French entry a type
 * error instead of an English fallback nobody notices. Titles are kept short
 * enough to survive the " · CEPCA" suffix in a results page (≈60 characters);
 * descriptions are 120–160 characters.
 */

type Copy = { title: string; description: string };

export const PAGE_PATHS = {
  home: '/',
  about: '/about',
  history: '/about/history',
  missionVision: '/about/mission-vision',
  structure: '/about/structure',
  generalSecretariat: '/about/general-secretariat',
  board: '/board',
  members: '/members',
  departments: '/departments',
  events: '/events',
  news: '/news',
  announcements: '/announcements',
  blogs: '/blogs',
  workshops: '/workshops',
  charity: '/charity',
  sermons: '/sermons',
  contact: '/contact',
  give: '/give',
} as const;

export type PageKey = keyof typeof PAGE_PATHS;

export const PAGE_COPY: Record<PageKey, Record<Language, Copy>> = {
  home: {
    en: {
      title: 'CEPCA — Council of Protestant Churches of Cameroon',
      description:
        'CEPCA (CPCC) unites 12 Protestant churches and 13 million believers across Cameroon in health, education, pastoral care and Christian witness.',
    },
    fr: {
      title: 'CEPCA — Conseil des Églises Protestantes du Cameroun',
      description:
        "Le CEPCA rassemble 12 Églises protestantes et 13 millions de fidèles au Cameroun autour de la santé, de l'éducation, de la pastorale et du témoignage chrétien.",
    },
  },
  about: {
    en: {
      title: 'About us',
      description:
        'Who we are: the Council of Protestant Churches of Cameroon — our history since FEMEC in 1969, our mission, our governing bodies and the General Secretariat.',
    },
    fr: {
      title: 'Qui sommes-nous',
      description:
        'Le Conseil des Églises Protestantes du Cameroun : notre histoire depuis la FEMEC en 1969, notre mission, nos instances et le Secrétariat général.',
    },
  },
  history: {
    en: {
      title: 'Our history',
      description:
        "From the Evangelical Federation of French Equatorial Africa to FEMEC in 1969 and today's CEPCA: the story of Protestant unity in Cameroon.",
    },
    fr: {
      title: 'Notre histoire',
      description:
        "De la Fédération évangélique de l'Afrique-Équatoriale française à la FEMEC en 1969, puis au CEPCA d'aujourd'hui : l'histoire de l'unité protestante au Cameroun.",
    },
  },
  missionVision: {
    en: {
      title: 'Mission and vision',
      description:
        "CEPCA's mission of healing, liberation and holistic human development, and its vision of Cameroon's Protestant churches united by the language of love.",
    },
    fr: {
      title: 'Mission et vision',
      description:
        "La mission du CEPCA — guérison, libération et développement intégral de la personne — et sa vision d'Églises protestantes unies par le langage de l'amour.",
    },
  },
  structure: {
    en: {
      title: 'Governance and structure',
      description:
        'The General Assembly, Executive Committee, specialised commissions and General Secretariat: how the Council of Protestant Churches of Cameroon works.',
    },
    fr: {
      title: 'Gouvernance et structure',
      description:
        "Assemblée générale, Comité exécutif, commissions spécialisées et Secrétariat général : comment fonctionne le Conseil des Églises Protestantes du Cameroun.",
    },
  },
  generalSecretariat: {
    en: {
      title: 'General Secretariat',
      description:
        "The General Secretariat coordinates CEPCA's national services and departments — health, education, youth, women, Christian witness, communication and more.",
    },
    fr: {
      title: 'Secrétariat général',
      description:
        'Le Secrétariat général coordonne les services et départements nationaux du CEPCA : santé, éducation, jeunesse, femmes, témoignage chrétien, communication…',
    },
  },
  board: {
    en: {
      title: 'Board and organogram',
      description:
        'The President, Vice-Presidents and General Secretary of the Council of Protestant Churches of Cameroon, and the departments under the General Secretariat.',
    },
    fr: {
      title: 'Bureau et organigramme',
      description:
        'Le président, les vice-présidents et le secrétaire général du Conseil des Églises Protestantes du Cameroun, et les départements du Secrétariat général.',
    },
  },
  members: {
    en: {
      title: 'Member churches',
      description:
        'The 12 Protestant churches of CEPCA — Presbyterian, Baptist, Lutheran, Evangelical, Anglican and Full Gospel — with their leaders, history and regions.',
    },
    fr: {
      title: 'Églises membres',
      description:
        'Les 12 Églises protestantes du CEPCA — presbytériennes, baptistes, luthériennes, évangéliques, anglicane, Plein Évangile — leurs responsables, leur histoire.',
    },
  },
  departments: {
    en: {
      title: 'Departments',
      description:
        "CEPCA's departments: health, education, youth, women and social affairs, Christian witness, information and communication, research and development.",
    },
    fr: {
      title: 'Départements',
      description:
        'Les départements du CEPCA : santé, éducation, jeunesse, femmes et affaires sociales, témoignage chrétien, communication, recherche et développement.',
    },
  },
  events: {
    en: {
      title: 'Events',
      description:
        'Upcoming and past gatherings of the Council of Protestant Churches of Cameroon — services, the Week of Protestantism, assemblies and visits — with photos.',
    },
    fr: {
      title: 'Événements',
      description:
        'Les rassemblements du Conseil des Églises Protestantes du Cameroun, à venir et passés — cultes, Semaine du protestantisme, assemblées, visites — en photos.',
    },
  },
  news: {
    en: {
      title: 'News',
      description:
        'Reports, milestones, appointments and communiqués from the Council of Protestant Churches of Cameroon and its member churches.',
    },
    fr: {
      title: 'Actualités',
      description:
        'Comptes rendus, étapes marquantes, nominations et communiqués du Conseil des Églises Protestantes du Cameroun et de ses Églises membres.',
    },
  },
  announcements: {
    en: {
      title: 'Announcements',
      description:
        'Notices from the CEPCA secretariat: upcoming ceremonies, meetings and calls to the member churches and the faithful across Cameroon.',
    },
    fr: {
      title: 'Annonces',
      description:
        'Les avis du secrétariat du CEPCA : cérémonies à venir, réunions et appels aux Églises membres et aux fidèles dans tout le Cameroun.',
    },
  },
  blogs: {
    en: {
      title: 'Blog',
      description:
        "Reflections from the Council of Protestant Churches of Cameroon on faith, Christian unity and the churches' service to society.",
    },
    fr: {
      title: 'Blog',
      description:
        "Réflexions du Conseil des Églises Protestantes du Cameroun sur la foi, l'unité des chrétiens et le service des Églises à la société.",
    },
  },
  workshops: {
    en: {
      title: 'Workshops and training',
      description:
        'Training sessions and workshops run by CEPCA for church leaders, staff and members of the Protestant churches of Cameroon.',
    },
    fr: {
      title: 'Ateliers et formations',
      description:
        'Les formations et ateliers organisés par le CEPCA pour les responsables, le personnel et les membres des Églises protestantes du Cameroun.',
    },
  },
  charity: {
    en: {
      title: 'Charity programmes',
      description:
        "CEPCA's charitable programmes in health, education and community development across Cameroon, and the people they serve.",
    },
    fr: {
      title: 'Programmes caritatifs',
      description:
        'Les programmes caritatifs du CEPCA en santé, éducation et développement communautaire au Cameroun, et les personnes qu’ils servent.',
    },
  },
  sermons: {
    en: {
      title: 'Sermons',
      description: "Sermons and messages from the spiritual leaders of CEPCA's member churches in Cameroon.",
    },
    fr: {
      title: 'Prédications',
      description: 'Prédications et messages des responsables spirituels des Églises membres du CEPCA au Cameroun.',
    },
  },
  contact: {
    en: {
      title: 'Contact',
      description:
        'Contact the General Secretariat of the Council of Protestant Churches of Cameroon: phone, WhatsApp, email, office hours and directions.',
    },
    fr: {
      title: 'Nous contacter',
      description:
        "Contactez le Secrétariat général du Conseil des Églises Protestantes du Cameroun : téléphone, WhatsApp, e-mail, horaires et plan d'accès.",
    },
  },
  give: {
    en: {
      title: 'Give',
      description:
        'Support the work of the Council of Protestant Churches of Cameroon: health, education and pastoral care across the country.',
    },
    fr: {
      title: 'Faire un don',
      description:
        "Soutenez l'œuvre du Conseil des Églises Protestantes du Cameroun : santé, éducation et accompagnement pastoral dans tout le pays.",
    },
  },
};

/** The page's language from its route params; anything unexpected is English. */
export const languageOf = (params: { lang?: string }): Language =>
  isLanguage(params.lang) ? params.lang : 'en';

/** Absolute URL of `path` (written unprefixed) in `language`. */
export const pageUrl = (path: string, language: Language) => absoluteUrl(localizePath(path, language));

/** hreflang alternates: each language's address, English as the default. */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const language of LANGUAGES) languages[language] = pageUrl(path, language);
  languages['x-default'] = pageUrl(path, 'en');
  return languages;
}

/**
 * Markdown or long text → a plain sentence of at most `max` characters, cut on
 * a word, for meta descriptions.
 */
export function plainText(text: string | null | undefined, max = 160): string {
  const plain = (text || '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → their text
    .replace(/^#{1,6}\s+/gm, '') // headings
    .replace(/^\s*[-*+>]\s+/gm, '') // list markers, quotes
    .replace(/[*_`~]+/g, '') // emphasis, code
    .replace(/\s+/g, ' ')
    .trim();

  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:.–—-]+$/, '')}…`;
}

interface PageMetadataInput {
  language: Language;
  /** The page's address in its English form, e.g. '/events/some-slug'. */
  path: string;
  title: string;
  description: string;
  /** Use the title as is, without the " · CEPCA" template (the home page). */
  absoluteTitle?: boolean;
  /** A photo of the item itself; otherwise the council's share card. */
  image?: string | null;
  imageAlt?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  /** Keep out of search results (links are still followed). */
  noIndex?: boolean;
}

export function pageMetadata({
  language,
  path,
  title,
  description,
  absoluteTitle = false,
  image,
  imageAlt,
  type = 'website',
  publishedTime,
  modifiedTime,
  section,
  noIndex = false,
}: PageMetadataInput): Metadata {
  if (language === 'fr') {
    title = frenchTypography(title);
    description = frenchTypography(description);
    if (imageAlt) imageAlt = frenchTypography(imageAlt);
  }
  const url = pageUrl(path, language);
  // " · CEPCA" only while the whole title still fits a results page (≈60
  // characters); a long event or article title keeps its own words instead.
  const suffixed = `${title} · ${SITE_NAME}`;
  const useSuffix = !absoluteTitle && suffixed.length <= 60;
  const fullTitle = useSuffix ? suffixed : title;
  const other = LANGUAGES.filter((l) => l !== language);

  const images = image
    ? [{ url: absoluteUrl(image), alt: imageAlt || title }]
    : [
        {
          url: absoluteUrl(DEFAULT_SHARE_IMAGE[language]),
          width: 1200,
          height: 630,
          alt: ORGANIZATION_NAME[language],
        },
      ];

  return {
    title: useSuffix ? title : { absolute: title },
    description,
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      locale: OG_LOCALE[language],
      alternateLocale: other.map((l) => OG_LOCALE[l]),
      images,
      ...(type === 'article'
        ? {
            publishedTime,
            modifiedTime,
            section,
            authors: [ORGANIZATION_NAME[language]],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: images.map((i) => i.url),
    },
  };
}

/**
 * Metadata for one of the fixed pages listed in PAGE_COPY. A list page with
 * nothing published yet passes `noIndex`: an empty page is thin content, and
 * it drops out of the sitemap too (lib/site-index.ts).
 */
export function staticPageMetadata(key: PageKey, language: Language, options: { noIndex?: boolean } = {}): Metadata {
  const copy = PAGE_COPY[key][language];
  return pageMetadata({
    language,
    path: PAGE_PATHS[key],
    title: copy.title,
    description: copy.description,
    absoluteTitle: key === 'home',
    noIndex: options.noIndex,
  });
}

/** Breadcrumb trail of fixed pages, e.g. pageTrail('fr', 'about', 'history'). */
export const pageTrail = (language: Language, ...keys: PageKey[]) =>
  keys.map((key) => ({ name: PAGE_COPY[key][language].title, path: PAGE_PATHS[key] }));
