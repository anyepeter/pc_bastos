import HeroCarousel from '@/components/HeroCarousel';
import WelcomeSection from '@/components/WelcomeSection';
import ServiceTimesSection from '@/components/ServiceTimesSection';
import EventsSection from '@/components/EventsSection';
import SermonsSection from '@/components/SermonsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import MinistriesSection from '@/components/MinistriesSection';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navigation />
      <HeroCarousel />
      <WelcomeSection />
      <ServiceTimesSection />
      <EventsSection />
      <SermonsSection />
      <TestimonialsSection />
      <MinistriesSection />
      <Footer />
    </>
  );
}