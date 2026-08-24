'use client';

import { Calendar, Clock, MapPin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import { formatLongDate, formatTime } from '@/lib/format';
import type { PublicEvent } from '../EventsClient';

export default function EventDetailClient({ event }: { event: PublicEvent }) {
  const language = useAppSelector((state) => state.blog.language);

  const title = getTranslatedText(event.title as any, language);
  const description = getTranslatedText(event.description as any, language);
  const location = getTranslatedText(event.location as any, language);
  const category = getTranslatedText(event.category as any, language);

  return (
    <div className="pb-12 md:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mt-24 md:mt-32">
          {event.imageUrl && (
            <div className="mb-8 overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.imageUrl}
                alt={title}
                className="h-64 w-full object-cover sm:h-80"
              />
            </div>
          )}

          {category && (
            <div className="mb-6">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {category}
              </span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 font-playfair">
            {title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 sm:mb-12">
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'fr' ? 'Date' : 'Date'}
                </p>
                <p className="font-semibold text-gray-900">
                  {formatLongDate(event.date, language)}
                </p>
              </div>
            </div>

            {event.time && (
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">
                    {language === 'fr' ? 'Heure' : 'Time'}
                  </p>
                  <p className="font-semibold text-gray-900">
                    {formatTime(event.time, language)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'fr' ? 'Lieu' : 'Location'}
                </p>
                <p className="font-semibold text-gray-900">{location}</p>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'À propos de cet événement' : 'About This Event'}
            </h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
