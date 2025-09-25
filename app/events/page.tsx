'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import BackButton from '@/components/BackButton';

const eventsData = [
  {
    id: 1,
    title: 'Annual General Assembly 2025',
    date: '2025-03-15',
    time: '09:00 AM',
    description: 'Join us for our annual gathering where member churches will present their yearly reports and discuss future initiatives for the Protestant community in Cameroon.',
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

  const getCategoryColor = (category: string) => {
    const colors = {
      'Assembly': 'bg-purple-100 text-purple-700',
      'Conference': 'bg-blue-100 text-blue-700',
      'Outreach': 'bg-green-100 text-green-700',
      'Retreat': 'bg-orange-100 text-orange-700',
      'Workshop': 'bg-pink-100 text-pink-700',
      'Camp': 'bg-indigo-100 text-indigo-700'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
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
            <div key={event.id} className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${index * 100}ms` }}>
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex flex-col items-center justify-center text-white shadow-lg">
                      <span className="text-xs font-medium">{getMonthDay(event.date).month}</span>
                      <span className="text-lg font-bold">{getMonthDay(event.date).day}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                      {isUpcoming(event.date) && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          Upcoming
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-bold font-playfair text-gray-900 text-lg mb-2 leading-tight">
                      {event.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      {event.description}
                    </p>
                    
                    {isUpcoming(event.date) && (
                      <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md">
                        <span>Learn More</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Grid View */}
        <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {eventsData.map((event, index) => (
            <div key={event.id} className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 transform group ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: `${index * 150}ms` }}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex flex-col items-center justify-center text-white shadow-lg">
                    <span className="text-xs font-medium">{getMonthDay(event.date).month}</span>
                    <span className="text-lg font-bold">{getMonthDay(event.date).day}</span>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                    {isUpcoming(event.date) && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        Upcoming
                      </span>
                    )}
                  </div>
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
                
                <p className="text-gray-700 text-sm leading-relaxed mb-6">
                  {event.description}
                </p>
                
                {isUpcoming(event.date) && (
                  <button className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md group-hover:shadow-lg">
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}