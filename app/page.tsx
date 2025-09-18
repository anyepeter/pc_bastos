import HeroSection from '@/components/HeroSection';
import WelcomeSection from '@/components/WelcomeSection';
import ServiceTimesSection from '@/components/ServiceTimesSection';
import EventsSection from '@/components/EventsSection';
import SermonsSection from '@/components/SermonsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import MinistriesSection from '@/components/MinistriesSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <WelcomeSection />
      <ServiceTimesSection />
      <EventsSection />
      <SermonsSection />
      <TestimonialsSection />
      <MinistriesSection />
    </>
  );
}