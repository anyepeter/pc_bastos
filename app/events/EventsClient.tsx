'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import { formatLongDate, formatMonthDay, formatTime, isUpcoming } from '@/lib/format';

export interface PublicEvent {
  id: string;
  slug: string;
  title: unknown;
  description: unknown;
  location: unknown;
  category: unknown;
  date: string;
  time: string | null;
  imageUrl: string | null;
}

export default function EventsClient({ events }: { events: PublicEvent[] }) {
  const [isVisible, setIsVisible] = useState(false);
  const language = useAppSelector((state) => state.blog.language);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      <div className="text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&h=600&fit=crop&auto=format")',
          }}
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-10 md:pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold font-playfair mb-4 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              {language === 'fr' ? 'Événements à venir' : 'Upcoming Events'}
            </h1>
            <p className="text-xl text-purple-100 font-inter max-w-3xl mx-auto leading-relaxed">
              {language === 'fr'
                ? 'Rejoignez-nous pour ces rassemblements et événements communautaires'
                : 'Join us for these meaningful gatherings and community events'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {events.length === 0 ? (
          <div className="rounded-2xl border border-white/50 bg-white/80 py-16 text-center">
            <Calendar className="mx-auto h-12 w-12 text-purple-300" />
            <p className="mt-4 text-lg text-gray-700">
              {language === 'fr'
                ? "Aucun événement n'est programmé pour le moment."
                : 'No events are scheduled at the moment.'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {language === 'fr'
                ? 'Revenez bientôt pour découvrir nos prochains rassemblements.'
                : 'Check back soon for our next gatherings.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile: List View */}
            <div className="block lg:hidden space-y-6">
              {events.map((event, index) => {
                const title = getTranslatedText(event.title as any, language);
                const description = getTranslatedText(event.description as any, language);
                const location = getTranslatedText(event.location as any, language);
                const monthDay = formatMonthDay(event.date, language);

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className={`block bg-white/80 hover:scale[1.02] border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform cursor-pointer ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="p-4">
                      {isUpcoming(event.date) && (
                        <div className="mb-2">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            {language === 'fr' ? 'À venir' : 'Upcoming'}
                          </span>
                        </div>
                      )}
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex flex-col items-center justify-center text-white shadow-lg">
                            <span className="text-xs font-medium">{monthDay.month}</span>
                            <span className="text-lg font-bold">{monthDay.day}</span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col-reverse flex-wrap items-start gap-2 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span className="line-clamp-1">{location}</span>
                            </div>
                            <div className="flex gap-4">
                              {event.time && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{formatTime(event.time, language)}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span className="line-clamp-1">
                                  {formatLongDate(event.date, language)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <h3 className="font-bold font-playfair text-gray-900 text-lg mb-2 leading-tight group-hover:text-purple-700 transition-colors duration-300 line-clamp-1">
                          {title}
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                          {description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Desktop: Grid View */}
            <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {events.map((event, index) => {
                const title = getTranslatedText(event.title as any, language);
                const description = getTranslatedText(event.description as any, language);
                const location = getTranslatedText(event.location as any, language);
                const monthDay = formatMonthDay(event.date, language);

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className={`block bg-white/80 border border-white/50 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.05] transition-all duration-500 transform group cursor-pointer ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex flex-col items-center justify-center text-white shadow-lg">
                          <span className="text-xs font-medium">{monthDay.month}</span>
                          <span className="text-lg font-bold">{monthDay.day}</span>
                        </div>

                        {isUpcoming(event.date) && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                            {language === 'fr' ? 'À venir' : 'Upcoming'}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold font-playfair text-gray-900 text-xl mb-3 leading-tight group-hover:text-purple-700 transition-colors duration-300">
                        {title}
                      </h3>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <span>{formatLongDate(event.date, language)}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-purple-500" />
                            <span>{formatTime(event.time, language)}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-purple-500" />
                          <span>{location}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                        {description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
