'use client';

import Link from 'next/link';
import { Calendar, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import { formatLongDate, formatMonthDay, formatTime, isUpcoming } from '@/lib/format';
import type { PublicEvent } from '@/app/events/EventsClient';

interface HeroSectionProps {
  /**
   * At most two events, already chosen by the page. Empty when nothing is
   * published — the cards are then left out entirely rather than faked.
   */
  events?: PublicEvent[];
}

const HeroSection = ({ events = [] }: HeroSectionProps) => {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/images/hero-image.jpg")',
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Main Content */}
      <div className="relative z-10 text-center mt-40 mb-4 text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex-1 flex flex-col justify-center">

        {/* Green Tagline */}
        {/* <p className="text-green-500 text-sm font-semibold tracking-wider mt-28 uppercase mb-4">
        BEING CHURCH TOGETHER
        </p> */}

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
        {t('hero.title')}
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('hero.description')}
        </p>

        {/* CTA Buttons */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="border hover:bg-purple-700 text-white px-10 py-4 font-semibold transition-all duration-300 inline-block rounded shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {t('hero.contactUs')}
          </Link>
          <Link
            href="/donate"
            className="bg-green-600 text-white px-10 py-4 font-semibold transition-all duration-300 inline-flex items-center gap-2 rounded shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Heart className="w-5 h-5" />
            {t('hero.donateNow')}
          </Link>
        </div>
      </div>
      
      {/* Event Cards — omitted entirely when nothing is published */}
      {events.length > 0 && (
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
            {events.map((event) => {
              const title = getTranslatedText(event.title as any, language);
              const monthDay = formatMonthDay(event.date, language);

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="bg-white/80 border border-white/50 rounded shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 transform group cursor-pointer"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex flex-col items-center justify-center text-white shadow-lg">
                          <span className="text-xs font-medium">{monthDay.month}</span>
                          <span className="text-lg font-bold">{monthDay.day}</span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span>{formatLongDate(event.date, language)}</span>
                          </div>
                          {event.time && (
                            <div className="flex items-center space-x-2">
                              <svg
                                className="w-4 h-4 text-purple-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>{formatTime(event.time, language)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {isUpcoming(event.date) && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          {t('common.upcoming')}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold font-playfair text-gray-900 text-xl leading-tight group-hover:text-purple-700 transition-colors duration-300 line-clamp-1">
                      {title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;