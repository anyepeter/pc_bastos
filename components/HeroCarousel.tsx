'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Play, Pause, Heart, Calendar, MapPin } from 'lucide-react';
import 'swiper/css';

import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export const heroSlidesData = [
  {
    id: 1,
    headline: "Being Church Together",
      subheadline: "The United Voice of Protestant Churches in Cameroon",
      supportingText: "12 Member Churches • 13 Million Believers • 15,500 Congregations",
      primaryCTA: { text: "Discover Our Mission", href: "#about" },
      secondaryCTA: { text: "View Our Members", href: "/members" },
      backgroundImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop&auto=format",
      cards: [
        {
          title: "General Assembly 2025",
          date: "Mar 15",
          time: "9:00 am",
          link: "/events"
        },
        {
          title: "Member Churches Summit",
          date: "Apr 5",
          time: "10:00 am",
          link: "/events"
        }
      ]
    },
    {
      id: 2,
      headline: "Healing Communities with Compassion",
      subheadline: "350 Hospitals & Health Centers Serving Cameroon",
      supportingText: "From combating HIV/AIDS to maternal health, we provide quality medical care reaching millions across all regions.",
      primaryCTA: { text: "See Our Health Work", href: "/activities/healthcare" },
      secondaryCTA: { text: "Support Healthcare", href: "/donate?focus=health" },
      backgroundImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&h=1080&fit=crop&auto=format",
      cards: [
        {
          title: "Health Workers Training Program",
          date: "Feb 20",
          time: "8:00 am",
          link: "/activities/healthcare"
        },
        {
          title: "Community Health Outreach",
          date: "Mar 10",
          time: "2:00 pm",
          link: "/activities/healthcare"
        }
      ]
    },
    {
      id: 3,
      headline: "Shaping Tomorrow's Leaders Today",
      subheadline: "1,580 Schools & 15 Universities Empowering Excellence",
      supportingText: "Continuing the legacy of Christian missions, we educate over 500,000 students annually, building ethical, competent citizens.",
      primaryCTA: { text: "Explore Our Schools", href: "/activities/education" },
      secondaryCTA: { text: "Support Education", href: "/donate?focus=education" },
      backgroundImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=1920&h=1080&fit=crop&auto=format",
      cards: [
        {
          title: "Scholarship Award Ceremony",
          date: "Apr 18",
          time: "11:00 am",
          link: "/activities/education"
        },
        {
          title: "Teachers Development Workshop",
          date: "May 2",
          time: "9:00 am",
          link: "/activities/education"
        }
      ]
    },
    {
      id: 4,
      headline: "Empowering Communities, Transforming Lives",
      subheadline: "Building Economic Independence & Leadership Skills",
      supportingText: "Through women's empowerment, youth development, and microfinance, we're creating sustainable change for the next generation.",
      primaryCTA: { text: "See Our Programs", href: "/activities" },
      secondaryCTA: { text: "Get Involved", href: "/contact" },
      backgroundImage: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&h=1080&fit=crop&auto=format",
      cards: [
        {
          title: "Women's Leadership Conference",
          date: "Mar 25",
          time: "10:00 am",
          link: "/activities/women"
        },
        {
          title: "Youth Entrepreneurship Training",
          date: "Apr 12",
          time: "1:00 pm",
          link: "/activities"
        }
      ]
    },
    {
      id: 5,
      headline: "Join Us at Our Next Event",
      subheadline: "Youth Leadership Summit 2025 | April 10-12, Yaoundé",
      supportingText: "Connect with thousands of believers, learn from inspiring speakers, and be part of something transformative.",
      primaryCTA: { text: "Register Now", href: "/events/register" },
      secondaryCTA: { text: "View All Events", href: "/news/events" },
      backgroundImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop&auto=format",
      cards: [
        {
          title: "Youth Leadership Summit 2025",
          date: "Apr 10",
          time: "9:00 am",
          link: "/events/register"
        },
        {
          title: "Praise & Worship Night",
          date: "May 15",
          time: "6:00 pm",
          link: "/events"
        }
      ]
    }
];

interface HeroCarouselProps {
  onSlideChange?: (activeIndex: number) => void;
}

const HeroCarousel = ({ onSlideChange }: HeroCarouselProps = {}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  const toggleAutoplay = () => {
    if (swiperInstance) {
      if (isPlaying) {
        swiperInstance.autoplay.stop();
      } else {
        swiperInstance.autoplay.start();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (swiperInstance) {
        if (e.key === 'ArrowLeft') {
          swiperInstance.slidePrev();
        } else if (e.key === 'ArrowRight') {
          swiperInstance.slideNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [swiperInstance]);

  return (
    <section className="relative h-[90vh] overflow-hidden" style={{ maxHeight: '700px' }}>
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop={true}

        pagination={{
          clickable: true,
        }}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => {
          if (onSlideChange) {
            onSlideChange(swiper.realIndex);
          }
        }}
        className="h-full"
        role="region"
        aria-label="Hero carousel"
      >
        {heroSlidesData.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.backgroundImage})` }}
                role="img"
                aria-label={`Background image for ${slide.headline}`}
              />
              <div className="absolute inset-0 bg-black/50" />
              
              <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center text-white">
                  <h1 
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight animate-slide-up"
                    style={{ 
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      animationDelay: '0.2s',
                      animationFillMode: 'both'
                    }}
                  >
                    {slide.headline}
                  </h1>
                  
                  <h2 
                    className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 text-gray-100 animate-slide-up"
                    style={{ 
                      animationDelay: '0.3s',
                      animationFillMode: 'both'
                    }}
                  >
                    {slide.subheadline}
                  </h2>
                  
                  <p 
                    className="text-lg mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed animate-slide-up"
                    style={{ 
                      animationDelay: '0.4s',
                      animationFillMode: 'both'
                    }}
                  >
                    {slide.supportingText}
                  </p>
                  
                  <div
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
                    style={{
                      animationDelay: '0.6s',
                      animationFillMode: 'both'
                    }}
                  >
                    {/* <a
                      href={slide.primaryCTA.href}
                      className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-4 rounded font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-black"
                      tabIndex={index === 0 ? 0 : -1}
                    >
                      {slide.primaryCTA.text}
                    </a> */}
                    <a
                      href={slide.secondaryCTA.href}
                      className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-4 rounded font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                      tabIndex={index === 0 ? 0 : -1}
                    >
                      {slide.secondaryCTA.text}
                    </a>
                    <a
                      href="/donate"
                      className="bg-gradient-to-r from-green-600 via-emerald-600 to-purple-600 text-white px-10 py-4 rounded font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-black flex items-center gap-2"
                      tabIndex={index === 0 ? 0 : -1}
                    >
                      <Heart className="w-5 h-5" />
                      Donate Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Play/Pause Button */}
      <button
        onClick={toggleAutoplay}
        className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>

      {/* Pagination Dots */}
      <div className="hero-pagination absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-2" />

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        :global(.swiper-pagination-bullet) {
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }

        :global(.swiper-pagination-bullet-active) {
          background: white;
        }pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .hero-pagination-bullet-active {
          background: #7B2CBF;
          transform: scale(1.2);
        }

        .hero-pagination-bullet:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 768px) {
          .hero-carousel {
            height: 70vh;
          }
          
          h1 {
            font-size: 2rem !important;
          }
          
          h2 {
            font-size: 1.25rem !important;
          }
          
          p {
            font-size: 1rem !important;
          }
        }

        @media (max-width: 640px) {
          .animate-fade-in-up > div {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-slide-up,
          .animate-fade-in,
          .animate-fade-in-up {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroCarousel;