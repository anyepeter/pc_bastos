'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import PageLayout from '@/components/PageLayout';
import HomeButton from '@/components/homeButton';

const eventsData = [
  {
    id: 1,
    title: 'Annual General Assembly 2025 dsgs sdfdsf dsfsdf dsfd',
    date: '2025-12-15',
    time: '09:00 AM',
    description: 'Join us for our annual gathering where member churches will present their yearly reports and discuss future initiatives for the Protestant community in Cameroon. Join us for our annual gathering where member churches will present their yearly reports and discuss future initiatives for the Protestant community in Cameroon. Join us for our annual gathering where member churches will present their yearly reports and discuss future initiatives for the Protestant community in Cameroon. Join us for our annual gathering where member churches will present their yearly reports and discuss future initiatives for the Protestant community in Cameroon. Join us for our annual gathering where member churches will present their yearly reports and discuss future initiatives for the Protestant community in Cameroon. Join us for our annual gathering where member churches will present their yearly reports and discuss future initiatives for the Protestant community in Cameroon.Join us for our annual gathering where member churches will present their yearly reports and discuss future initiatives for the Protestant community in Cameroon. Join us for our annual gathering where member churches will present their yearly reports and discuss future initiatives for the Protestant community in Cameroon. Join us for our annual gathering where member churches will present their yearly reports and discuss future initiatives for the Protestant community in Cameroon.',
    location: 'Yaoundé',
    category: 'Assembly'
  },
  {
    id: 2,
    title: 'Youth Leadership Conference',
    date: '2025-02-08',
    time: '10:00 AM',
    description: 'Empowering the next generation of Christian leaders through workshops, mentorship sessions, and spiritual development programs.',
    location: 'Douala',
    category: 'Conference'
  },
  {
    id: 3,
    title: 'Community Outreach Program Launch',
    date: '2025-01-25',
    time: '02:00 PM',
    description: 'Launch of our comprehensive community outreach program focusing on education, healthcare, and social welfare initiatives.',
    location: 'Bamenda',
    category: 'Outreach'
  },
  {
    id: 4,
    title: 'Pastors\' Retreat Weekend',
    date: '2025-04-12',
    time: '06:00 PM',
    description: 'A spiritual retreat for pastors and church leaders to refresh, reconnect, and strengthen their ministry calling.',
    location: 'Kribi',
    category: 'Retreat'
  },
  {
    id: 5,
    title: 'Women\'s Ministry Workshop',
    date: '2025-05-20',
    time: '09:30 AM',
    description: 'Empowering women in ministry through practical workshops, spiritual growth sessions, and fellowship opportunities.',
    location: 'Garoua',
    category: 'Workshop'
  },
  {
    id: 6,
    title: 'Children\'s Bible Camp',
    date: '2025-07-15',
    time: '08:00 AM',
    description: 'A fun-filled week of Bible stories, games, crafts, and activities designed to strengthen children\'s faith and build lasting friendships.',
    location: 'Buea',
    category: 'Camp'
  }
];

export default function EventsPage() {
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

  const getMonthDay = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate()
    };
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      <div className="text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&h=600&fit=crop&auto=format")'
          }}
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-10 md:pb-16">
          {/* <HomeButton /> */}
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold font-playfair mb-4 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              Upcoming Events
            </h1>
            <p className="text-xl text-purple-100 font-inter max-w-3xl mx-auto leading-relaxed">
              Join us for these meaningful gatherings and community events
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile: List View */}
        <div className="block lg:hidden space-y-6">
          {eventsData.map((event, index) => (
            <Link key={event.id} href={`/events/${event.id}`} className={`block bg-white/80 hover:scale[1.02] border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform cursor-pointer ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${index * 100}ms` }}>
              <div className="p-4">
              {isUpcoming(event.date) && (
                      <div className="mb-2">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          Upcoming
                        </span>
                      </div>
                    )}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex flex-col items-center justify-center text-white shadow-lg">
                      <span className="text-xs font-medium">{getMonthDay(event.date).month}</span>
                      <span className="text-lg font-bold">{getMonthDay(event.date).day}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    
                    <div className="flex flex-col-reverse flex-wrap items-start gap-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span className='line-clamp-1'>{event.location}</span>
                      </div>
                      <div className='flex gap-4'>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className='line-clamp-1'>{formatDate(event.date)}</span>
                  </div>
                      </div>
                    </div>
                  </div>
                  </div>
                    <div className='mt-2'>
                      <h3 className="font-bold font-playfair text-gray-900 text-lg mb-2 leading-tight group-hover:text-purple-700 transition-colors duration-300 line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                      {event.description}
                    </p>
                    </div>
                
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop: Grid View */}
        <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {eventsData.map((event, index) => (
            <Link key={event.id} href={`/events/${event.id}`} className={`block bg-white/80 border border-white/50 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.05] transition-all duration-500 transform group cursor-pointer ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${index * 150}ms` }}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex flex-col items-center justify-center text-white shadow-lg">
                    <span className="text-xs font-medium">{getMonthDay(event.date).month}</span>
                    <span className="text-lg font-bold">{getMonthDay(event.date).day}</span>
                  </div>
                  
                  {isUpcoming(event.date) && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      Upcoming
                    </span>
                  )}
                </div>
                
                <h3 className="font-bold font-playfair text-gray-900 text-xl mb-3 leading-tight group-hover:text-purple-700 transition-colors duration-300">
                  {event.title}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                  {event.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>


      </div>
    </PageLayout>
  );
}