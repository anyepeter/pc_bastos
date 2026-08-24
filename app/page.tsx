import HeroSection from '@/components/HeroSection';
import WelcomeSection from '@/components/WelcomeSection';
import MissionVisionSection from '@/components/MissionVisionSection';
import ObjectivesSection from '@/components/ObjectivesSection';
import CharitySection from '@/components/CharitySection';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getPublishedCharityPrograms } from '@/app/actions/charity';
import { getPublishedEvents } from '@/app/actions/events';
import type { PublicCharityProgram } from '@/app/charity/CharityClient';
import type { PublicEvent } from '@/app/events/EventsClient';

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
  const [charityResult, eventsResult] = await Promise.all([
    getPublishedCharityPrograms(),
    getPublishedEvents(),
  ]);

  const charityRows = charityResult.success ? charityResult.data || [] : [];
  const eventRows = eventsResult.success ? eventsResult.data || [] : [];

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
    <>
      <Navigation />
      {/* Hero — event cards appear only once events are published */}
      <HeroSection events={selectHeroEvents(eventRows)} />

      {/* Introduction to CEPCA */}
      <WelcomeSection />

      {/* Mission, Vision & Core Principles */}
      <MissionVisionSection />

      {/* Our Objectives with link to About page */}
      <ObjectivesSection />

      {/* Charity Programs — hides itself when nothing is published */}
      <CharitySection programs={charityPrograms} />

      <Footer />
      <WhatsAppButton />
    </>
  );
}
