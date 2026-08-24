'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ImageSlider from './ImageSlider';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';

export interface PublicWorkshopDetail {
  id: string;
  slug: string;
  title: unknown;
  description: unknown;
  fullDescription: unknown;
  location: unknown;
  duration: unknown;
  capacity: unknown;
  date: string;
  images: string[];
}

export default function WorkshopClient({
  workshop,
}: {
  workshop: PublicWorkshopDetail;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const language = useAppSelector((state) => state.blog.language);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const title = getTranslatedText(workshop.title as any, language);
  const description = getTranslatedText(workshop.description as any, language);
  const fullDescription = getTranslatedText(workshop.fullDescription as any, language);
  const location = getTranslatedText(workshop.location as any, language);
  const duration = getTranslatedText(workshop.duration as any, language);
  const capacity = getTranslatedText(workshop.capacity as any, language);

  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32">
          <div
            className={`transform transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <h1 className="text-4xl sm:text-6xl font-bold font-playfair mb-4">{title}</h1>
            <p className="text-xl text-gray-900 font-inter leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            className={`transform transition-all duration-1000 ease-out delay-300 group ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            {workshop.images.length > 0 && (
              <ImageSlider images={workshop.images} alt={title} />
            )}
          </div>

          <div
            className={`space-y-8 transform transition-all duration-1000 ease-out delay-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <div className="bg-white backdrop-blur-sm border border-white/50">
              <h2 className="text-2xl font-bold font-playfair bg-clip-text mb-4">
                {language === 'fr' ? "Détails de l'atelier" : 'Workshop Details'}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-inter">
                    {formatLongDate(workshop.date, language)}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 font-inter">{location}</span>
                </div>
                {duration && (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700 font-inter">{duration}</span>
                  </div>
                )}
                {capacity && (
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700 font-inter">{capacity}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mt-12 transform transition-all duration-1000 ease-out delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="bg-white/90">
            <h2 className="text-2xl font-bold font-playfair mb-6">
              {language === 'fr' ? 'À propos de cet atelier' : 'About This Workshop'}
            </h2>
            <div className="prose prose-lg max-w-none font-inter text-gray-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{fullDescription}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
