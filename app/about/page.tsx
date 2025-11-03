'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Calendar, Users, Building, Layers } from 'lucide-react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import HomeButton from '@/components/homeButton';

const aboutSections = [
  {
    id: 'history',
    title: 'Our History',
    icon: Calendar,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format',
    description: 'The wave of independence movements that disrupted the Evangelical Federation of French Equatorial Africa led to the creation of FEMEC in 1969, which later evolved into CEPCA.',
    preview: 'CEPCA was born from the need to coordinate Protestant Churches in Cameroon after independence. The first General Secretary, Rev. Eugène MALLO, coordinated activities through the Education and Health Committee.',
    href: '/about/history'
  },
  {
    id: 'mission-vision',
    title: 'Mission & Vision',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&auto=format',
    description: 'Our mission focuses on healing, liberation, and holistic development. Our vision is integration through the language of love, uniting Churches in defending a common cause.',
    preview: 'CEPCA strengthens our shared sense of belonging as Churches united. Through the Holy Spirit and democratic principles, we speak the common language of love.',
    href: '/about/mission-vision'
  },
  {
    id: 'departments',
    title: 'Departments',
    icon: Building,
    image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop&auto=format',
    description: 'CEPCA operates through specialized departments including Health, Education, Women and Social Affairs, Christian Witness, Youth, Information and Communication.',
    preview: 'Our departments coordinate activities across member churches, from health services and education to youth programs and communication initiatives.',
    href: '/about/departments'
  },
  {
    id: 'structure',
    title: 'CEPCA Structure',
    icon: Layers,
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format',
    description: 'Our organizational structure includes the General Assembly, Executive Committee, and specialized Commissions that ensure effective governance and coordination.',
    preview: 'The General Assembly serves as our supreme decision-making body, meeting every two years to define overall policy and direction.',
    href: '/about/structure'
  }
];

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setVisibleCards(aboutSections.map(section => section.id));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 py-16">
            <HomeButton />
            <div className={`text-center transform transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-4xl sm:text-6xl font-bold font-playfair mb-6">
                About CEPCA
              </h1>
              <p className="text-xl text-blue-100 font-inter max-w-4xl mx-auto leading-relaxed">
                The Council of Protestant Churches of Cameroon - Uniting Churches in faith, service, and community development
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-16">
            {aboutSections.map((section, index) => {
              const IconComponent = section.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={section.id}
                  className={`transform transition-all duration-1000 ease-out ${
                    visibleCards.includes(section.id)
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center`}>
                    <div className="w-full lg:w-1/2">
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-64 sm:h-80 object-cover"
                      />
                    </div>
                    
                    <div className="w-full lg:w-1/2 space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-3">
                          <IconComponent className="w-6 h-6 text-purple-600" />
                        </div>
                        <h2 className="text-3xl font-bold font-playfair text-gray-900">
                          {section.title}
                        </h2>
                      </div>
                      
                      <p className="text-lg text-gray-700 font-inter leading-relaxed">
                        {section.description}
                      </p>
                      
                      <p className="text-gray-600 font-inter leading-relaxed">
                        {section.preview}
                      </p>
                      
                      <Link
                        href={section.href}
                        className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 font-semibold hover:bg-purple-700 transition-colors group"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`mt-20 text-center transform transition-all duration-1000 ease-out delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="bg-gray-50 p-8 lg:p-12">
              <h2 className="text-3xl font-bold font-playfair text-gray-900 mb-6">
                Our Impact
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
                  <div className="text-gray-600 font-inter">Member Churches</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">13M+</div>
                  <div className="text-gray-600 font-inter">Believers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">1,580</div>
                  <div className="text-gray-600 font-inter">Educational Institutions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">350</div>
                  <div className="text-gray-600 font-inter">Health Centers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}