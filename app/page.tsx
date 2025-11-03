import HeroSection from '@/components/HeroSection';
import WelcomeSection from '@/components/WelcomeSection';
import ImpactSection from '@/components/ImpactSection';
import MissionVisionSection from '@/components/MissionVisionSection';
import ObjectivesSection from '@/components/ObjectivesSection';
import CharitySection from '@/components/CharitySection';
import SermonsSection from '@/components/SermonsSection';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Home() {
  return (
    <>
      <Navigation />
      {/* Hero Section with Event Cards */}
      <HeroSection />

      {/* Introduction to CEPCA */}
      <WelcomeSection />

      {/* Mission, Vision & Core Principles */}
      <MissionVisionSection />

      {/* Our Objectives with link to About page */}
      <ObjectivesSection />

      {/* Recent Sermons/Messages */}
      <SermonsSection />

            {/* Charity Programs */}
            <CharitySection />

      <Footer />
      <WhatsAppButton />
    </>
  );
}