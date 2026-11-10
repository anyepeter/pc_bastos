import HeroSection from '@/components/HeroSection';
import WelcomeSection from '@/components/WelcomeSection';
import CharitySection from '@/components/CharitySection';
import MemberChurchesSection from '@/components/MemberChurchesSection';
import StatsSection from '@/components/StatsSection';
import DepartmentsSection from '@/components/DepartmentsSection';
import NewsSection from '@/components/NewsSection';
import UpcomingEventsSection from '@/components/UpcomingEventsSection';
import WorkshopsSection from '@/components/WorkshopsSection';
import GallerySection from '@/components/GallerySection';
import AnnouncementsSection from '@/components/AnnouncementsSection';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getPublishedCharityPrograms } from '@/app/actions/charity';
import { getPublishedEvents } from '@/app/actions/events';
import { getPublishedChurches } from '@/app/actions/churches';
import { getPublishedWorkshops } from '@/app/actions/workshops';
import { getPublishedAnnouncements } from '@/app/actions/announcements';
import { getPublishedNews } from '@/app/actions/news';
import { getPublishedDepartments } from '@/app/actions/departments';
import { toPublicDepartmentSummary } from '@/lib/departments';
import type { PublicCharityProgram } from '@/app/[lang]/charity/CharityClient';
import type { PublicEvent } from '@/app/[lang]/events/EventsClient';
import type { PublicChurch } from '@/app/[lang]/members/MembersClient';
import type { PublicWorkshop } from '@/app/[lang]/workshops/WorkshopsClient';
import type { PublicAnnouncement } from '@/app/[lang]/announcements/AnnouncementsClient';
import type { PublicNewsArticle } from '@/app/[lang]/news/NewsClient';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getSiteSettings } from '@/app/actions/settings';
import { readTranslation } from '@/lib/translations';
import { languageOf, staticPageMetadata } from '@/lib/seo';
import { graph, organizationJsonLd, websiteJsonLd } from '@/lib/structured-data';

/**
 * Which events count as "upcoming" changes with the clock, not only with edits,
 * so the prerendered page is refreshed hourly on top of the explicit
 * `revalidatePath('/')` that runs whenever content is published.
 */
export const revalidate = 3600;

const toPublicEvent = (row: any): PublicEvent => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  description: row.description,
  location: row.location,
  category: row.category,
  date: new Date(row.date).toISOString(),
  time: row.time,
  imageUrl: row.imageUrl,
});

/**
 * The two events the hero highlights.
 *
 * Prefer the next events still to come (soonest first). Only when nothing is
 * upcoming do we fall back to the most recent past ones, so the hero does not
 * go blank the day after the last event — and the "Upcoming" badge is driven
 * by the date itself, so a past event never claims to be upcoming.
 */
function selectHeroEvents(rows: any[]): PublicEvent[] {
  const now = Date.now();
  const upcoming = rows.filter((row) => new Date(row.date).getTime() >= now);

  if (upcoming.length > 0) {
    // `getPublishedEvents` already orders by date ascending.
    return upcoming.slice(0, 2).map(toPublicEvent);
  }

  const past = rows.filter((row) => new Date(row.date).getTime() < now);
  return past.slice(-2).reverse().map(toPublicEvent);
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return staticPageMetadata('home', languageOf(params));
}

export default async function Home({ params }: { params: { lang: string } }) {
  const language = languageOf(params);
  const [
    charityResult,
    eventsResult,
    churchesResult,
    workshopsResult,
    announcementsResult,
    newsResult,
    departmentsResult,
  ] = await Promise.all([
    getPublishedCharityPrograms(),
    getPublishedEvents(),
    getPublishedChurches(),
    getPublishedWorkshops(),
    getPublishedAnnouncements(),
    getPublishedNews(),
    getPublishedDepartments(),
  ]);
  const settings = await getSiteSettings();

  const charityRows = charityResult.success ? charityResult.data || [] : [];
  const eventRows = eventsResult.success ? eventsResult.data || [] : [];
  const churchRows = churchesResult.success ? churchesResult.data || [] : [];
  const workshopRows = workshopsResult.success ? workshopsResult.data || [] : [];
  const announcementRows = announcementsResult.success ? announcementsResult.data || [] : [];
  const newsRows = newsResult.success ? newsResult.data || [] : [];
  // An empty list makes the section fall back to the locale-file departments.
  const departments = (departmentsResult.success ? departmentsResult.data || [] : []).map(
    toPublicDepartmentSummary
  );

  const workshops: PublicWorkshop[] = workshopRows.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    location: row.location,
    date: new Date(row.date).toISOString(),
    images: row.images || [],
  }));

  const news: PublicNewsArticle[] = newsRows.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category ?? null,
    date: new Date(row.date).toISOString(),
    imageUrl: row.imageUrl ?? null,
  }));

  const announcements: PublicAnnouncement[] = announcementRows.map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    fullContent: row.fullContent,
    date: new Date(row.date).toISOString(),
    priority: row.priority,
    imageUrl: row.imageUrl,
  }));

  const churches: PublicChurch[] = churchRows.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    denomination: row.denomination,
    leader: row.leader,
    location: row.location,
    founded: row.founded,
    logo: row.logo,
  }));

  const charityPrograms: PublicCharityProgram[] = charityRows.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    impact: row.impact,
    beneficiaries: row.beneficiaries,
    location: row.location,
    images: row.images || [],
  }));

  return (
    // The wrapper carries the canvas colour so overscroll and any gap
    // between sections stays on-theme. `page-root` lets the last section keep
    // clear of the footer's painted edge (see globals.css).
    <div className="page-root bg-white">
      {/* Who the council is, for search engines and AI answer engines: the
          organisation with its members and departments, and the website. */}
      <JsonLd
        data={graph(
          organizationJsonLd({
            language,
            settings,
            churches: churchRows.map((row: any) => ({
              name: readTranslation(row.denomination)[language] || readTranslation(row.denomination).en,
              path: `/members/${row.slug}`,
              website: row.website,
            })),
            departments: departments.map((department) => ({
              name: readTranslation(department.name)[language] || readTranslation(department.name).en,
              acronym: department.acronym,
              path: `/departments/${department.slug}`,
            })),
          }),
          websiteJsonLd(language)
        )}
      />
      <Navigation />

      {/* Hero — photographic carousel with the painted foot */}
      <HeroSection />

      {/* Introduction to CEPCA */}
      <WelcomeSection />

      <StatsSection />

      <NewsSection articles={news} />

      {/* Next gatherings — sits straight after the introduction, and hides
          itself when nothing is published */}
      <UpcomingEventsSection events={selectHeroEvents(eventRows)} />

      {/* The council in figures */}
  

      {/* How the council is organised — the eight departments */}
      <DepartmentsSection departments={departments} />

      {/* Charity Programs — hides itself when nothing is published */}
      <CharitySection programs={charityPrograms} />

      {/* The twelve member churches — hides itself when nothing is published */}
      <MemberChurchesSection churches={churches} />

      {/* Workshops and trainings — hides itself when nothing is published */}
      <WorkshopsSection workshops={workshops} />

      {/* Gallery — a curated set of the council's own photography */}
      <GallerySection />

      {/* Latest council news — hides itself when nothing is published */}
    

      {/* Announcements from the secretariat */}
      <AnnouncementsSection announcements={announcements} />

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
