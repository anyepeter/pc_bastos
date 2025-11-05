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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {currentCards.map((card, index) => (
            <div
              key={index}
              className="bg-white/80 border border-white/50 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 transform group cursor-pointer animate-fade-in-up"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex flex-col items-center justify-center text-white shadow-lg">
                    <span className="text-xs font-medium">{card.date.split(' ')[0].toUpperCase()}</span>
                    <span className="text-lg font-bold">{card.date.split(' ')[1]}</span>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    Upcoming
                  </span>
                </div>
                
                <h3 className="font-bold font-playfair text-gray-900 text-xl mb-3 leading-tight group-hover:text-purple-700 transition-colors duration-300">
                  {card.title}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>{card.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{card.time}</span>
                  </div>
                </div>
                
                <a
                  href={`/events/${index + 1}`}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md group-hover:shadow-lg"
                >
                  <span>LearnMore</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
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
