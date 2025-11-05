'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, Building } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import BackButton from '@/components/BackButton';

export default function HistoryPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <div className="text-white relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=600&fit=crop&auto=format")'
            }}
          />
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-10 md:pb-16 relative z-10">
            {/* <BackButton /> */}
            <div className={`text-center transform transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-4xl sm:text-6xl font-bold font-playfair mb-6">
                Our History
              </h1>
              <p className="text-xl text-blue-100 font-inter max-w-3xl mx-auto leading-relaxed">
                The journey of Protestant unity in Cameroon
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className={`space-y-12 transform transition-all duration-1000 ease-out delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            
            <div className="space-y-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-purple-100 p-3">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold font-playfair text-gray-900">
                  The Beginning
                </h2>
              </div>

              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&auto=format"
                alt="Historical church gathering"
                className="w-full h-64 sm:h-80 object-cover mb-8"
              />

              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-gray-700 font-inter leading-relaxed mb-6">
                  The wave of independence movements that disrupted and questioned the continuity of the Evangelical Federation of French Equatorial Africa—which had been responsible for coordinating educational, health, and rural activities as well as radio broadcasting—together with the decision of the Churches and Evangelical Missions working in French Equatorial Africa to withdraw from the Federation, led to the creation of FEMEC (Federation of Evangelical Churches and Missions of Cameroon) in 1969.
                </p>

                <p className="text-lg text-gray-700 font-inter leading-relaxed mb-6">
                  Its first General Secretary, Rev. Eugène MALLO (Director of the Bible Society), coordinated activities through the Education and Health Committee and the Radio Studio.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-purple-100 p-3">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold font-playfair text-gray-900">
                  The Preamble
                </h2>
              </div>

              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=400&fit=crop&auto=format"
                alt="Church unity"
                className="w-full h-64 sm:h-80 object-cover mb-8"
              />

              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-gray-700 font-inter leading-relaxed mb-6">
                  The Protestant Churches of Cameroon acknowledge themselves as integral parts of the Universal Church, the Body of Christ. They are determined to fulfill the cherished wish of our Lord Jesus Christ, as expressed in John 17:21: "I pray that they may all be one."
                </p>

                <p className="text-lg text-gray-700 font-inter leading-relaxed mb-6">
                  To this end, the Churches decided to establish an Ecumenical Organization responsible for promoting and defending Christianity, and for guiding and coordinating their common actions.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-purple-100 p-3">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold font-playfair text-gray-900">
                  Evolution to CEPCA
                </h2>
              </div>

              <img
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=400&fit=crop&auto=format"
                alt="Modern church building"
                className="w-full h-64 sm:h-80 object-cover mb-8"
              />

              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-gray-700 font-inter leading-relaxed mb-6">
                  CEPCA has both a spiritual and social calling. It is apolitical. Since 2009, it has been open to the admission of other Protestant Churches, expanding its reach and influence across Cameroon.
                </p>

                <p className="text-lg text-gray-700 font-inter leading-relaxed mb-6">
                  Today, CEPCA stands as a testament to the power of unity in diversity, bringing together twelve member churches under the banner of Christian love and service to the community.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-8 mt-12">
              <h3 className="text-2xl font-bold font-playfair text-gray-900 mb-6 text-center">
                Key Milestones
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 text-white px-3 py-1 font-bold">1969</div>
                  <div className="text-gray-700 font-inter">Creation of FEMEC (Federation of Evangelical Churches and Missions of Cameroon)</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 text-white px-3 py-1 font-bold">1970s</div>
                  <div className="text-gray-700 font-inter">Establishment of Education and Health Committees</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 text-white px-3 py-1 font-bold">2009</div>
                  <div className="text-gray-700 font-inter">Opening to admission of other Protestant Churches</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 text-white px-3 py-1 font-bold">Today</div>
                  <div className="text-gray-700 font-inter">12 member churches serving 13+ million believers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}