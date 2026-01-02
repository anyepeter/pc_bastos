'use client';

import { useState, useEffect } from 'react';
import { Building, Heart, GraduationCap, Users, Radio, Briefcase, MessageCircle, Search } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import BackButton from '@/components/BackButton';
import { useTranslation } from 'react-i18next';

export default function DepartmentsPage() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);

  const departments = [
    {
      id: 'saf',
      name: t('about.departments.saf.name'),
      icon: Briefcase,
      location: t('about.departments.saf.location'),
      description: t('about.departments.saf.description'),
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&auto=format'
    },
    {
      id: 'ds',
      name: t('about.departments.ds.name'),
      icon: Heart,
      location: t('about.departments.ds.location'),
      description: t('about.departments.ds.description'),
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&auto=format'
    },
    {
      id: 'oepp',
      name: t('about.departments.oepp.name'),
      icon: GraduationCap,
      location: t('about.departments.oepp.location'),
      description: t('about.departments.oepp.description'),
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop&auto=format'
    },
    {
      id: 'dfas',
      name: t('about.departments.dfas.name'),
      icon: Users,
      location: t('about.departments.dfas.location'),
      description: t('about.departments.dfas.description'),
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&auto=format'
    },
    {
      id: 'dtc',
      name: t('about.departments.dtc.name'),
      icon: MessageCircle,
      location: t('about.departments.dtc.location'),
      description: t('about.departments.dtc.description'),
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format'
    },
    {
      id: 'dj',
      name: t('about.departments.dj.name'),
      icon: Users,
      location: t('about.departments.dj.location'),
      description: t('about.departments.dj.description'),
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&auto=format'
    },
    {
      id: 'dic',
      name: t('about.departments.dic.name'),
      icon: Radio,
      location: t('about.departments.dic.location'),
      description: t('about.departments.dic.description'),
      image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=400&fit=crop&auto=format'
    },
    {
      id: 'bured',
      name: t('about.departments.bured.name'),
      icon: Search,
      location: t('about.departments.bured.location'),
      description: t('about.departments.bured.description'),
      image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&h=400&fit=crop&auto=format'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setVisibleCards(departments.map(dept => dept.id));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <div className="text-white relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1920&h=600&fit=crop&auto=format")'
            }}
          />
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-10 md:pb-16 relative z-10">
            {/* <BackButton /> */}
            <div className={`text-center transform transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-4xl sm:text-6xl font-bold font-playfair mb-6">
                {t('about.departments.pageTitle')}
              </h1>
              <p className="text-xl text-blue-100 font-inter max-w-3xl mx-auto leading-relaxed">
                {t('about.departments.pageSubtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((department, index) => {
              const IconComponent = department.icon;
              
              return (
                <div
                  key={department.id}
                  className={`bg-white border border-gray-200 overflow-hidden transform transition-all duration-1000 ease-out ${
                    visibleCards.includes(department.id)
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="relative h-48">
                    <img
                      src={department.image}
                      alt={department.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-white p-2">
                        <IconComponent className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold font-playfair text-gray-900 mb-3 leading-tight">
                      {department.name}
                    </h3>
                    
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 text-sm text-purple-600 mb-2">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{department.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed font-inter text-sm">
                      {department.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`mt-16 transform transition-all duration-1000 ease-out delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="bg-gray-50 p-8 lg:p-12">
              <h2 className="text-3xl font-bold font-playfair text-gray-900 mb-8 text-center">
                {t('about.departments.departmentCoordination')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-purple-100 p-4 mb-4 inline-block">
                    <Building className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('about.departments.regionalOffices')}</h3>
                  <p className="text-gray-600 font-inter">{t('about.departments.regionalOfficesText')}</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 p-4 mb-4 inline-block">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('about.departments.commissions')}</h3>
                  <p className="text-gray-600 font-inter">{t('about.departments.commissionsText')}</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 p-4 mb-4 inline-block">
                    <MessageCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('about.departments.coordination')}</h3>
                  <p className="text-gray-600 font-inter">{t('about.departments.coordinationText')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}