'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronRight, ChevronLeft } from 'lucide-react';

const eventsData = [
  {
    id: 1,
    title: 'Annual General Assembly 2025',
    date: '2025-03-15',
    time: '09:00 AM',
    description: 'Join us for our annual gathering where member churches will present their yearly reports and discuss future initiatives for the Protestant community in Cameroon.',
    priority: 'high',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=300&fit=crop&auto=format'
  },
  {
    id: 2,
    title: 'Youth Leadership Conference',
    date: '2025-02-08',
    time: '10:00 AM',
    description: 'Empowering the next generation of Christian leaders through workshops, mentorship sessions, and spiritual development programs.',
    priority: 'high',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=300&fit=crop&auto=format'
  },
  {
    id: 3,
    title: 'Community Outreach Program Launch',
    date: '2025-01-25',
    time: '02:00 PM',
    description: 'Launch of our comprehensive community outreach program focusing on education, healthcare, and social welfare initiatives.',
    priority: 'high',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=300&fit=crop&auto=format'
  },
  {
    id: 4,
    title: 'Pastors\' Retreat Weekend',
    date: '2025-04-12',
    time: '06:00 PM',
    description: 'A spiritual retreat for pastors and church leaders to refresh, reconnect, and strengthen their ministry calling.',
    priority: 'medium',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop&auto=format'
  }
];

export default function EventsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % eventsData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + eventsData.length) % eventsData.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const gradients = [
    'from-purple-500 via-pink-500 to-red-500',
    'from-blue-500 via-teal-500 to-green-500', 
    'from-orange-500 via-red-500 to-pink-500',
    'from-green-500 via-blue-500 to-purple-500'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold font-playfair mb-3">Upcoming Events</h1>
            <p className="text-xl text-purple-100 font-inter max-w-3xl mx-auto">
              Join us for these meaningful gatherings and community events
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {eventsData.map((event, index) => (
                <div key={event.id} className="w-full flex-shrink-0">
                  <div className={`bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    <div className="md:flex h-full">
                      <div className="md:w-1/2 relative">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-64 md:h-96 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                        {isUpcoming(event.date) && (
                          <div className="absolute top-6 left-6">
                            <span className="bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                              🎉 Upcoming
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="md:w-1/2 p-8 text-white">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5" />
                            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Event</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            event.priority === 'high' 
                              ? 'bg-red-500/80 text-white' 
                              : 'bg-yellow-500/80 text-white'
                          }`}>
                            {event.priority.toUpperCase()}
                          </span>
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl font-bold font-playfair mb-6 leading-tight">
                          {event.title}
                        </h2>
                        
                        <div className="grid grid-cols-1 gap-4 mb-6 text-sm">
                          <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{event.time}</span>
                          </div>
                        </div>
                        
                        <p className="text-white/90 leading-relaxed mb-6 text-sm">
                          {event.description}
                        </p>
                        
                        {isUpcoming(event.date) && (
                          <button className="inline-flex items-center space-x-2 bg-white text-gray-800 px-6 py-3 rounded-full font-bold hover:bg-white/90 transition-all duration-300 shadow-lg">
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
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {eventsData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-purple-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}