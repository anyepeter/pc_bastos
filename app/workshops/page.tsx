'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PageLayout from '@/components/PageLayout';
import BackButton from '@/components/BackButton';
import HomeButton from '@/components/homeButton';

const workshopsData = [
  {
    id: 1,
    title: 'Leadership Development Workshop',
    description: 'Equipping church leaders with essential skills for effective ministry and community leadership.',
    location: 'Douala Conference Center',
    date: '2024-02-15',
    images: [
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format'
    ]
  },
  {
    id: 2,
    title: 'Youth Ministry Training',
    description: 'Comprehensive training program for youth pastors and volunteers working with young people.',
    location: 'Yaoundé Youth Center',
    date: '2024-02-22',
    images: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format'
    ]
  },
  {
    id: 3,
    title: 'Music Ministry Workshop',
    description: 'Training for worship leaders, musicians, and choir members to enhance musical ministry.',
    location: 'Bamenda Music Academy',
    date: '2024-03-01',
    images: [
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&auto=format'
    ]
  },
  {
    id: 4,
    title: 'Community Outreach Training',
    description: 'Strategies and practical skills for effective community engagement and social impact.',
    location: 'Garoua Community Hall',
    date: '2024-03-08',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format'
    ]
  }
];

export default function WorkshopsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setVisibleCards(workshopsData.map(workshop => workshop.id));
    }, 500);
    return () => clearTimeout(timer);
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
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-purple-100 ">
      <div className="text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&h=600&fit=crop&auto=format")'
          }}
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-8 md:pb-16">
          <div className={`text-center transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h1 className="text-4xl sm:text-6xl font-bold font-playfair mb-4 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              Workshops & Training
            </h1>
            <p className="text-xl text-green-100 font-inter max-w-3xl mx-auto leading-relaxed">
              Empowering our community through comprehensive training programs and skill development workshops
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {workshopsData.map((workshop, index) => (
            <Link
              key={workshop.id}
              href={`/workshops/${workshop.id}`}
              className={`block bg-white/90 border border-white/50 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-700 transform ${
                visibleCards.includes(workshop.id)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  className="h-full"
                >
                  {workshop.images.map((image, imgIndex) => (
                    <SwiperSlide key={imgIndex}>
                      <img
                        src={image}
                        alt={`${workshop.title} - Image ${imgIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold font-playfair text-gray-900 mb-3 leading-tight">
                  {workshop.title}
                </h3>
                <p className="text-gray-700 leading-relaxed font-inter mb-4">
                  {workshop.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span>{formatDate(workshop.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span>{workshop.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-purple-600">
                    Learn More
                  </span>
                  <ArrowRight className="w-5 h-5 text-green-600 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </PageLayout>
  );
}