import { getSiteSettings } from '@/app/actions/settings';
import { getSiteIndex, type IndexedItem } from '@/lib/site-index';
import { PAGE_COPY, PAGE_PATHS, pageUrl, plainText, type PageKey } from '@/lib/seo';
import { inLanguage, socialLinks } from '@/lib/site-settings';
import { ORGANIZATION_NAME, SITE_URL } from '@/lib/site';

/**
 * /llms.txt — a plain-Markdown guide to the site for AI assistants and answer
 * engines (https://llmstxt.org): who the council is, the facts people ask
 * about, and links to the pages that hold the details, in both languages.
 *
 * Built from the same published data as the pages, refreshed hourly.
 */
export const revalidate = 3600;

const OFFICE_ORDER = ['president', 'vice_president', 'general_secretary', 'member'];

const line = (title: string, url: string, note?: string) => `- [${title}](${url})${note ? `: ${note}` : ''}`;

const item = (entry: IndexedItem, note?: string) =>
  line(entry.title.en || entry.title.fr, pageUrl(entry.path, 'en'), note ?? plainText(entry.summary.en, 200));

export async function GET() {
  const [index, settings] = await Promise.all([getSiteIndex(), getSiteSettings()]);

  const has = (key: PageKey) => index.pages.some((page) => page.key === key);
  const page = (key: PageKey) =>
    has(key) ? line(PAGE_COPY[key].en.title, pageUrl(PAGE_PATHS[key], 'en'), PAGE_COPY[key].en.description) : null;
  const pageFr = (key: PageKey) =>
    has(key) ? line(PAGE_COPY[key].fr.title, pageUrl(PAGE_PATHS[key], 'fr'), PAGE_COPY[key].fr.description) : null;

  const leaders = [...index.board]
    .filter((member) => member.name)
    .sort((a, b) => OFFICE_ORDER.indexOf(a.office) - OFFICE_ORDER.indexOf(b.office))
    .map((member) => `${member.title.en || member.office}: ${member.name}`);

  const address = inLanguage(settings.address, 'en');
  const social = socialLinks(settings).map(([, href]) => href);

  const sections: (string | null)[] = [
    `# CEPCA — ${ORGANIZATION_NAME.en}`,
    '',
    `> The ${ORGANIZATION_NAME.en} (CEPCA, from the French "${ORGANIZATION_NAME.fr}"; CPCC in English) is the ecumenical council of Cameroon's Protestant churches. It brings together 12 member churches — about 11.5 million believers in 15,500 congregations — and coordinates their common work in health, education, youth, women and social affairs, Christian witness, and communication. The site is bilingual: English pages at ${SITE_URL}/…, French pages at ${SITE_URL}/fr/….`,
    '',
    '## Key facts',
    '',
    `- Name: ${ORGANIZATION_NAME.en} / ${ORGANIZATION_NAME.fr}; acronyms CEPCA (French) and CPCC (English)`,
    '- Members: 12 Protestant churches (listed below), about 11.5 million believers, 15,500 congregations',
    '- Origins: FEMEC, founded in 1969 after the Evangelical Federation of French Equatorial Africa, later became CEPCA',
    address ? `- General Secretariat: ${address}, Cameroon` : null,
    settings.email ? `- Email: ${settings.email}` : null,
    settings.phone ? `- Phone: ${settings.phone}` : null,
    ...leaders.map((leader) => `- ${leader}`),
    ...(social.length ? [`- Official profiles: ${social.join(', ')}`] : []),
    '- Languages: English and French',
    '',
    '## About the council',
    '',
    page('about'),
    page('history'),
    page('missionVision'),
    page('structure'),
    page('generalSecretariat'),
    page('board'),
    page('contact'),
    page('give'),
    '',
    '## Member churches',
    '',
    ...index.churches.map((church) => {
      const facts = [
        church.extra?.location && `based in ${church.extra.location}`,
        church.extra?.founded && `founded ${church.extra.founded}`,
        church.extra?.leader && `head: ${church.extra.leader}`,
        church.extra?.website && `website ${church.extra.website}`,
      ].filter(Boolean);
      return item(church, facts.join('; ') || undefined);
    }),
    '',
    '## Departments',
    '',
    ...index.departments.map((department) => item(department)),
    '',
    ...(index.news.length ? ['## Latest news', '', ...index.news.slice(0, 15).map((entry) => {
      const day = entry.date?.toISOString().slice(0, 10);
      return item(entry, `${day ? `${day}. ` : ''}${plainText(entry.summary.en, 200)}`);
    }), ''] : []),
    ...(index.events.length ? ['## Events', '', ...index.events.slice(0, 15).map((entry) => {
      const day = entry.date?.toISOString().slice(0, 10);
      const where = entry.extra?.location;
      return item(entry, [day, where].filter(Boolean).join(', '));
    }), ''] : []),
    ...(index.blogs.length ? ['## Blog', '', ...index.blogs.slice(0, 15).map((entry) => item(entry)), ''] : []),
    ...(index.workshops.length ? ['## Workshops', '', ...index.workshops.map((entry) => item(entry)), ''] : []),
    ...(index.charity.length ? ['## Charity programmes', '', ...index.charity.map((entry) => item(entry)), ''] : []),
    '## En français',
    '',
    pageFr('home'),
    pageFr('about'),
    pageFr('history'),
    pageFr('members'),
    pageFr('departments'),
    pageFr('events'),
    pageFr('news'),
    pageFr('contact'),
    '',
    '## Optional',
    '',
    line('Sitemap', `${SITE_URL}/sitemap.xml`, 'every page in both languages'),
    page('announcements'),
    page('sermons'),
  ];

  const body = sections.filter((section) => section !== null).join('\n').replace(/\n{3,}/g, '\n\n');

  return new Response(`${body.trim()}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
