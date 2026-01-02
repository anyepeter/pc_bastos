'use client';

import { Target, Eye, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MissionVisionSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('missionVision.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('missionVision.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vision Card */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{t('missionVision.vision.title')}</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('missionVision.vision.description1')}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {t('missionVision.vision.description2')}
            </p>
            <div className="mt-6 p-4 bg-white/60 rounded-lg">
              <p className="text-purple-800 font-semibold italic">
                {t('missionVision.vision.quote')}
              </p>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{t('missionVision.mission.title')}</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              {t('missionVision.mission.description')}
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('missionVision.mission.health.title')}</h4>
                  <p className="text-gray-600 text-sm">
                    {t('missionVision.mission.health.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('missionVision.mission.education.title')}</h4>
                  <p className="text-gray-600 text-sm">
                    {t('missionVision.mission.education.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('missionVision.mission.pastoral.title')}</h4>
                  <p className="text-gray-600 text-sm">
                    {t('missionVision.mission.pastoral.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 mr-3" />
            <h3 className="text-2xl font-bold">{t('missionVision.corePrinciples.title')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-white/90">{t('missionVision.corePrinciples.principle1')}</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-white/90">{t('missionVision.corePrinciples.principle2')}</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-white/90">{t('missionVision.corePrinciples.principle3')}</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-white/90">{t('missionVision.corePrinciples.principle4')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
