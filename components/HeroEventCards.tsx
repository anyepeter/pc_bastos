'use client';

import { Calendar } from 'lucide-react';
import { heroSlidesData } from './HeroCarousel';

interface HeroEventCardsProps {
  activeSlide: number;
}

const HeroEventCards = ({ activeSlide }: HeroEventCardsProps) => {

  // Get the cards for the current active slide
  const currentCards = heroSlidesData[activeSlide]?.cards || [];

  return (
    <section className="relative -mt-20 z-20 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-bold text-xl mb-3">
                    Event: {card.title}
                  </h3>
                  <a
                    href={card.link}
                    className="text-green-600 font-semibold text-base hover:underline inline-block"
                  >
                    Event Details
                  </a>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center">
                  <span className="text-green-600 font-bold text-base">{card.date}</span>
                </div>
                <div className="bg-green-600 text-white text-sm px-3 py-1 rounded">
                  {card.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
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

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroEventCards;
