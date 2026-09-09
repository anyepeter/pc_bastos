import HeroSection from '@/components/HeroSection';
import WelcomeSection from '@/components/WelcomeSection';
import CharitySection from '@/components/CharitySection';
import MemberChurchesSection from '@/components/MemberChurchesSection';
import StatsSection from '@/components/StatsSection';
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
import type { PublicCharityProgram } from '@/app/charity/CharityClient';
import type { PublicEvent } from '@/app/events/EventsClient';
import type { PublicChurch } from '@/app/members/MembersClient';
import type { PublicWorkshop } from '@/app/workshops/WorkshopsClient';
import type { PublicAnnouncement } from '@/app/announcements/AnnouncementsClient';

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

export default async function Home() {
  const [charityResult, eventsResult, churchesResult, workshopsResult, announcementsResult] =
    await Promise.all([
      getPublishedCharityPrograms(),
      getPublishedEvents(),
      getPublishedChurches(),
      getPublishedWorkshops(),
      getPublishedAnnouncements(),
    ]);

  const charityRows = charityResult.success ? charityResult.data || [] : [];
  const eventRows = eventsResult.success ? eventsResult.data || [] : [];
  const churchRows = churchesResult.success ? churchesResult.data || [] : [];
  const workshopRows = workshopsResult.success ? workshopsResult.data || [] : [];
  const announcementRows = announcementsResult.success ? announcementsResult.data || [] : [];

  const workshops: PublicWorkshop[] = workshopRows.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    location: row.location,
    date: new Date(row.date).toISOString(),
    images: row.images || [],
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
    // between sections stays on-theme.
    <div className="bg-white">
      <Navigation />

      {/* Hero — photographic carousel with the painted foot */}
      <HeroSection />

      {/* Introduction to CEPCA */}
      <WelcomeSection />

      {/* Next gatherings — sits straight after the introduction, and hides
          itself when nothing is published */}
      <UpcomingEventsSection events={selectHeroEvents(eventRows)} />

      {/* The council in figures */}
      <StatsSection />

      {/* Charity Programs — hides itself when nothing is published */}
      <CharitySection programs={charityPrograms} />

      {/* The twelve member churches — hides itself when nothing is published */}
      <MemberChurchesSection churches={churches} />

      {/* Workshops and trainings — hides itself when nothing is published */}
      <WorkshopsSection workshops={workshops} />

      {/* Gallery — a curated set of the council's own photography */}
      <GallerySection />

      {/* Announcements from the secretariat */}
      <AnnouncementsSection announcements={announcements} />

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
