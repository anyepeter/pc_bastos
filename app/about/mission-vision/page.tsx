'use client';

import { useState, useEffect } from 'react';
import { Target, Heart, Users, Globe } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import BackButton from '@/components/BackButton';
import ImpactSection from '@/components/ImpactSection';

export default function MissionVisionPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 py-16">
            <BackButton />
            <div className={`text-center transform transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-4xl sm:text-6xl font-bold font-playfair mb-6">
                Mission & Vision
              </h1>
              <p className="text-xl text-blue-100 font-inter max-w-3xl mx-auto leading-relaxed">
                Our calling to heal, liberate, and develop through Christian unity
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-16">
            
            <div className={`transform transition-all duration-1000 ease-out delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-purple-100 p-3">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold font-playfair text-gray-900">
                  Our Vision
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&auto=format"
                    alt="Unity in diversity"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="space-y-6">
                  <p className="text-lg text-gray-700 font-inter leading-relaxed">
                    While we may differ from one another, it remains true that through the work of the Holy Spirit and respect for democratic principles, we can all speak a common language—the language of love.
                  </p>
                  <p className="text-lg text-gray-700 font-inter leading-relaxed">
                    CEPCA strengthens our shared sense of belonging as Churches united in defending a common cause. With the Council, this is no longer a mere juxtaposition of denominations, but a true ecumenical institution committed to advancing Protestant interests—a vision of integration.
                  </p>
                  <div className="bg-purple-50 p-6 border-l-4 border-purple-600">
                    <p className="text-purple-800 font-semibold italic">
                      "What can we accomplish together?"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`transform transition-all duration-1000 ease-out delay-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-purple-100 p-3">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold font-playfair text-gray-900">
                  Our Mission
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="order-2 lg:order-1 space-y-6">
                  <p className="text-lg text-gray-700 font-inter leading-relaxed">
                    This renewed mission calls for a reorientation of our agenda. It focuses on healing, liberation, and the holistic development of the human person.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-100 p-2 mt-1">
                        <Heart className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Health</h4>
                        <p className="text-gray-700 font-inter">Our institutions must provide quality care and compassionate service. Priority areas include combating HIV/AIDS, malaria, tuberculosis, and improving community health.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 mt-1">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                        <p className="text-gray-700 font-inter">Continuing the legacy of Christian missions, we remain committed to training competent citizens who uphold Christian ethics wherever they serve.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 mt-1">
                        <Globe className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Pastoral Ministry</h4>
                        <p className="text-gray-700 font-inter">These ensure we remain a prophetic voice within our communities, standing beside those in distress and speaking through diverse media and worship contexts.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <img
                    src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop&auto=format"
                    alt="Mission in action"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>

            <ImpactSection />

            <div className={`transform transition-all duration-1000 ease-out delay-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="bg-gray-50 p-8 lg:p-12">
                <h3 className="text-2xl font-bold font-playfair text-gray-900 mb-8 text-center">
                  Core Principles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-600"></div>
                      <p className="text-gray-700 font-inter">Confesses Jesus Christ as the only Lord and Savior</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-600"></div>
                      <p className="text-gray-700 font-inter">Recognizes the Holy Scriptures as the sole standard of faith, doctrine, and discipline</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-600"></div>
                      <p className="text-gray-700 font-inter">Confesses the Apostles' Creed</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-600"></div>
                      <p className="text-gray-700 font-inter">Works closely with member churches to achieve objectives</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`transform transition-all duration-1000 ease-out delay-900 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="text-center bg-purple-600 text-white p-8 lg:p-12">
                <h3 className="text-2xl font-bold font-playfair mb-4">
                  Our Motto
                </h3>
                <p className="text-3xl font-playfair italic">
                  "Being Church Together"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}