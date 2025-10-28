'use client';

import { useState, useEffect } from 'react';
import { Calendar, Bell, X, Clock } from 'lucide-react';
import BackButton from '@/components/BackButton';
import PageLayout from '@/components/PageLayout';

const announcementsData = [
  {
    id: 1,
    title: 'New Partnership with International Christian Organizations',
    date: '2024-12-20',
    description: 'We are pleased to announce strategic partnerships with several international Christian organizations to enhance our mission work and community outreach programs. These partnerships will bring new resources, training opportunities, and collaborative initiatives that will strengthen our collective impact in serving communities across Cameroon.',
    priority: 'high',
    image: '/images/partnership.jpg',
    fullContent: 'We are pleased to announce strategic partnerships with several international Christian organizations to enhance our mission work and community outreach programs. These partnerships will bring new resources, training opportunities, and collaborative initiatives that will strengthen our collective impact in serving communities across Cameroon.\n\nThese partnerships include collaboration with organizations from Europe, North America, and other African nations, focusing on capacity building, resource sharing, and joint mission initiatives. The partnerships will enable us to expand our reach and effectiveness in serving communities across Cameroon.'
  },
  {
    id: 2,
    title: 'Updated Guidelines for Member Churches',
    date: '2024-12-18',
    description: 'New operational guidelines have been established to strengthen unity and coordination among member churches. All church leaders are encouraged to review the updated documentation, which includes revised procedures for reporting, resource sharing, and collaborative ministry initiatives.',
    priority: 'medium',
    image: '/images/guidelines.jpg',
    fullContent: 'New operational guidelines have been established to strengthen unity and coordination among member churches. All church leaders are encouraged to review the updated documentation, which includes revised procedures for reporting, resource sharing, and collaborative ministry initiatives.\n\nThe updated guidelines cover areas such as financial reporting, ministry coordination, resource allocation, and inter-church collaboration protocols. These changes are designed to enhance transparency and improve our collective effectiveness in ministry.'
  },
  {
    id: 3,
    title: 'Annual Financial Report Available',
    date: '2024-12-15',
    description: 'The 2024 annual financial report is now available for review by all member churches. The report demonstrates our commitment to transparency and responsible stewardship of resources entrusted to our organization.',
    priority: 'medium',
    image: '/images/financial.jpg',
    fullContent: 'The 2024 annual financial report is now available for review by all member churches. The report demonstrates our commitment to transparency and responsible stewardship of resources entrusted to our organization.\n\nThe report includes detailed breakdowns of income, expenditures, ministry investments, and future financial projections. All member churches can access the full report through our secure portal or request a physical copy from the administrative office.'
  },
  {
    id: 4,
    title: 'New Leadership Training Program Launch',
    date: '2024-12-10',
    description: 'We are excited to announce the launch of our comprehensive leadership training program designed to equip church leaders with modern ministry skills, administrative capabilities, and spiritual development tools.',
    priority: 'high',
    image: '/images/training.jpg',
    fullContent: 'We are excited to announce the launch of our comprehensive leadership training program designed to equip church leaders with modern ministry skills, administrative capabilities, and spiritual development tools.\n\nThe program includes modules on pastoral care, church administration, community engagement, financial management, and spiritual leadership. Training sessions will be conducted both in-person and online to accommodate leaders from all regions.'
  },
  {
    id: 5,
    title: 'Website and Communication Platform Updates',
    date: '2024-12-05',
    description: 'Our digital communication platforms have been updated to provide better connectivity and resource sharing among member churches. New features include document sharing, event coordination, and enhanced communication tools.',
    priority: 'low',
    image: '/images/website.jpg',
    fullContent: 'Our digital communication platforms have been updated to provide better connectivity and resource sharing among member churches. New features include document sharing, event coordination, and enhanced communication tools.\n\nThe updated platform includes a new member portal, improved mobile accessibility, real-time messaging capabilities, and integrated calendar systems for better coordination of activities across all member churches.'
  }
];

export default function AnnouncementsPage() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<typeof announcementsData[0] | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const openModal = (announcement: typeof announcementsData[0]) => {
    setSelectedAnnouncement(announcement);
  };

  const closeModal = () => {
    setSelectedAnnouncement(null);
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (selectedAnnouncement) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedAnnouncement]);

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24 pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold font-playfair mb-4 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              Announcements
            </h1>
            <p className="text-xl text-purple-100 font-inter max-w-3xl mx-auto leading-relaxed">
              Important updates and news from the Council of Protestant Churches
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile: List View */}
        <div className="block lg:hidden space-y-6">
          {announcementsData.map((announcement, index) => (
            <div 
              key={announcement.id} 
              className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => openModal(announcement)}
            >
              <div className="relative h-48 rounded-t-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500"></div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold font-playfair text-gray-900 text-lg mb-2 leading-tight">
                  {announcement.title}
                </h3>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(announcement.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{getTimeAgo(announcement.date)}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                  {announcement.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Grid View */}
        <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {announcementsData.map((announcement, index) => (
            <div 
              key={announcement.id} 
              className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 transform group cursor-pointer ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onClick={() => openModal(announcement)}
            >
              <div className="relative h-48 rounded-t-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500"></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold font-playfair text-gray-900 text-xl mb-3 leading-tight group-hover:text-purple-700 transition-colors duration-300">
                  {announcement.title}
                </h3>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>{formatDate(announcement.date)}</span>
                  <span className="text-gray-400">•</span>
                  <span>{getTimeAgo(announcement.date)}</span>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                  {announcement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="relative h-64">
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500"></div>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedAnnouncement.priority)}`}>
                  {selectedAnnouncement.priority.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <Bell className="w-4 h-4 text-purple-500" />
                <span>Announcement</span>
                <span className="text-gray-400">•</span>
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>{formatDate(selectedAnnouncement.date)}</span>
              </div>
              
              <h2 className="text-2xl font-bold font-playfair text-gray-900 mb-6 leading-tight">
                {selectedAnnouncement.title}
              </h2>
              
              <div className="prose prose-gray max-w-none">
                {selectedAnnouncement.fullContent.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </PageLayout>
  );
}