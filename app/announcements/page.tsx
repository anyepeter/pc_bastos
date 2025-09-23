'use client';

import { useState, useEffect } from 'react';
import { Calendar, Bell, ChevronLeft, ChevronRight } from 'lucide-react';

const announcementsData = [
  {
    id: 1,
    title: 'New Partnership with International Christian Organizations',
    date: '2024-12-20',
    description: 'We are pleased to announce strategic partnerships with several international Christian organizations to enhance our mission work and community outreach programs. These partnerships will bring new resources, training opportunities, and collaborative initiatives that will strengthen our collective impact in serving communities across Cameroon.',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Updated Guidelines for Member Churches',
    date: '2024-12-18',
    description: 'New operational guidelines have been established to strengthen unity and coordination among member churches. All church leaders are encouraged to review the updated documentation, which includes revised procedures for reporting, resource sharing, and collaborative ministry initiatives.',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Annual Financial Report Available',
    date: '2024-12-15',
    description: 'The 2024 annual financial report is now available for review by all member churches. The report demonstrates our commitment to transparency and responsible stewardship of resources entrusted to our organization.',
    priority: 'medium'
  },
  {
    id: 4,
    title: 'New Leadership Training Program Launch',
    date: '2024-12-10',
    description: 'We are excited to announce the launch of our comprehensive leadership training program designed to equip church leaders with modern ministry skills, administrative capabilities, and spiritual development tools.',
    priority: 'high'
  },
  {
    id: 5,
    title: 'Website and Communication Platform Updates',
    date: '2024-12-05',
    description: 'Our digital communication platforms have been updated to provide better connectivity and resource sharing among member churches. New features include document sharing, event coordination, and enhanced communication tools.',
    priority: 'low'
  }
];

export default function AnnouncementsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % announcementsData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + announcementsData.length) % announcementsData.length);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const gradients = [
    'from-blue-500 via-cyan-500 to-teal-500',
    'from-emerald-500 via-green-500 to-lime-500',
    'from-orange-500 via-amber-500 to-yellow-500',
    'from-rose-500 via-pink-500 to-fuchsia-500',
    'from-indigo-500 via-purple-500 to-violet-500'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28 pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold font-playfair mb-3">Announcements</h1>
            <p className="text-xl text-blue-100 font-inter max-w-3xl mx-auto">
              Important updates and news from the Council of Protestant Churches
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {announcementsData.map((announcement, index) => (
                <div key={announcement.id} className="w-full flex-shrink-0">
                  <div className={`bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    <div className="p-8 md:p-12 text-white min-h-[400px] flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <Bell className="w-6 h-6" />
                          <span className="text-lg font-medium bg-white/20 px-4 py-2 rounded-full">Announcement</span>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          announcement.priority === 'high' 
                            ? 'bg-red-500/80 text-white' 
                            : announcement.priority === 'medium'
                            ? 'bg-yellow-500/80 text-white'
                            : 'bg-green-500/80 text-white'
                        }`}>
                          {announcement.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <h2 className="text-3xl sm:text-4xl font-bold font-playfair mb-6 leading-tight">
                        {announcement.title}
                      </h2>
                      
                      <div className="flex items-center space-x-3 mb-8 bg-white/10 rounded-lg p-4 w-fit">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium text-lg">Published: {formatDate(announcement.date)}</span>
                      </div>
                      
                      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                        <p className="text-white/95 leading-relaxed text-lg">
                          {announcement.description}
                        </p>
                      </div>
                      
                      <div className="mt-8 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <Bell className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-white/80 text-sm">Stay updated with CEPCA</p>
                          <p className="text-white font-medium">Council of Protestant Churches</p>
                        </div>
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
          {announcementsData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}