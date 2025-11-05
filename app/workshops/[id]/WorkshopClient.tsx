'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import BackButton from '@/components/BackButton';
import ImageSlider from './ImageSlider';

interface Workshop {
  title: string;
  description: string;
  fullDescription: string;
  location: string;
  date: string;
  duration: string;
  capacity: string;
  images: string[];
}

export default function WorkshopClient({ workshop }: { workshop: Workshop }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className=" relative overflow-hidden">
        <div className="absolute inset-0"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32">
          {/* <BackButton /> */}
          <div className={`transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h1 className="text-4xl sm:text-6xl font-bold font-playfair mb-4">
              {workshop.title}
            </h1>
            <p className="text-xl text-gray-900 font-inter leading-relaxed max-w-3xl">
              {workshop.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`transform transition-all duration-1000 ease-out delay-300 group ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <ImageSlider images={workshop.images} alt={workshop.title} />
          </div>

          <div className={`space-y-8 transform transition-all duration-1000 ease-out delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="bg-white backdrop-blur-sm border border-white/50">
              <h2 className="text-2xl font-bold font-playfair bg-clip-text mb-4">
                Workshop Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-inter">{formatDate(workshop.date)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 font-inter">{workshop.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-inter">{workshop.duration}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 font-inter">{workshop.capacity}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-12 transform transition-all duration-1000 ease-out delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="bg-white/90">
            <h2 className="text-2xl font-bold font-playfair  mb-6">
              About This Workshop
            </h2>
            <p className="text-gray-700 leading-relaxed font-inter text-lg">
              {workshop.fullDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}