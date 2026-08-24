'use client';

import { useState, useEffect } from 'react';
import { Calendar, GraduationCap, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';

export interface PublicWorkshop {
  id: string;
  slug: string;
  title: unknown;
  description: unknown;
  location: unknown;
  date: string;
  images: string[];
}

export default function WorkshopsClient({
  workshops,
}: {
  workshops: PublicWorkshop[];
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);
  const language = useAppSelector((state) => state.blog.language);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleCards(workshops.map((workshop) => workshop.id));
    }, 500);
    return () => clearTimeout(timer);
  }, [workshops]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-purple-100">
      <div className="text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&h=600&fit=crop&auto=format")',
          }}
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-8 md:pb-16">
          <div
            className={`text-center transform transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <h1 className="text-4xl sm:text-6xl font-bold font-playfair mb-4 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              {language === 'fr' ? 'Ateliers et Formations' : 'Workshops & Training'}
            </h1>
            <p className="text-xl text-green-100 font-inter max-w-3xl mx-auto leading-relaxed">
              {language === 'fr'
                ? "Renforcer notre communauté par des programmes de formation complets et le développement des compétences"
                : 'Empowering our community through comprehensive training programs and skill development workshops'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {workshops.length === 0 ? (
          <div className="rounded-2xl border border-white/50 bg-white/80 py-16 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-green-300" />
            <p className="mt-4 text-lg text-gray-700">
              {language === 'fr'
                ? "Aucun atelier n'est programmé pour le moment."
                : 'No workshops are scheduled at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {workshops.map((workshop, index) => {
              const title = getTranslatedText(workshop.title as any, language);
              const description = getTranslatedText(workshop.description as any, language);
              const location = getTranslatedText(workshop.location as any, language);

              return (
                <Link
                  key={workshop.id}
                  href={`/workshops/${workshop.slug}`}
                  className={`block bg-white/90 border border-white/50 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-700 transform ${
                    visibleCards.includes(workshop.id)
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    {workshop.images.length > 0 ? (
                      <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={0}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        className="h-full"
                      >
                        {workshop.images.map((image, imageIndex) => (
                          <SwiperSlide key={imageIndex}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={image}
                              alt={`${title} - ${imageIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-green-400 to-emerald-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold font-playfair text-gray-900 mb-3 leading-tight">
                      {title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-inter mb-4 line-clamp-3">
                      {description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span>{formatLongDate(workshop.date, language)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span>{location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-purple-600">
                        {language === 'fr' ? 'En savoir plus' : 'Learn More'}
                      </span>
                      <ArrowRight className="w-5 h-5 text-green-600 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
