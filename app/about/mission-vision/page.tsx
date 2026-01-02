'use client';

import { useState, useEffect } from 'react';
import { Target, Heart, Users, Globe } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import BackButton from '@/components/BackButton';
import ImpactSection from '@/components/ImpactSection';
import { useTranslation } from 'react-i18next';

export default function MissionVisionPage() {
  const { t } = useTranslation();
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
              backgroundImage: 'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=600&fit=crop&auto=format")'
            }}
          />
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-10 md:pb-16 relative z-10">
            {/* <BackButton /> */}
            <div className={`text-center transform transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-4xl sm:text-6xl font-bold font-playfair mb-6">
                {t('about.missionVision.pageTitle')}
              </h1>
              <p className="text-xl text-blue-100 font-inter max-w-3xl mx-auto leading-relaxed">
                {t('about.missionVision.pageSubtitle')}
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
                  {t('about.missionVision.ourVision')}
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
                    {t('about.missionVision.visionText1')}
                  </p>
                  <p className="text-lg text-gray-700 font-inter leading-relaxed">
                    {t('about.missionVision.visionText2')}
                  </p>
                  <div className="bg-purple-50 p-6 border-l-4 border-purple-600">
                    <p className="text-purple-800 font-semibold italic">
                      {t('about.missionVision.visionQuote')}
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
                  {t('about.missionVision.ourMission')}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="order-2 lg:order-1 space-y-6">
                  <p className="text-lg text-gray-700 font-inter leading-relaxed">
                    {t('about.missionVision.missionText')}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-100 p-2 mt-1">
                        <Heart className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('about.missionVision.healthTitle')}</h4>
                        <p className="text-gray-700 font-inter">{t('about.missionVision.healthText')}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 mt-1">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('about.missionVision.educationTitle')}</h4>
                        <p className="text-gray-700 font-inter">{t('about.missionVision.educationText')}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 mt-1">
                        <Globe className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('about.missionVision.pastoralTitle')}</h4>
                        <p className="text-gray-700 font-inter">{t('about.missionVision.pastoralText')}</p>
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
                  {t('about.missionVision.corePrinciples')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-600"></div>
                      <p className="text-gray-700 font-inter">{t('about.missionVision.principle1')}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-600"></div>
                      <p className="text-gray-700 font-inter">{t('about.missionVision.principle2')}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-600"></div>
                      <p className="text-gray-700 font-inter">{t('about.missionVision.principle3')}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-600"></div>
                      <p className="text-gray-700 font-inter">{t('about.missionVision.principle4')}</p>
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
                  {t('about.missionVision.ourMotto')}
                </h3>
                <p className="text-3xl font-playfair italic">
                  {t('about.missionVision.motto')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}