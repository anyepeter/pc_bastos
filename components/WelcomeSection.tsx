'use client';

import Image from 'next/image';
import { Heart, Users, Cross } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WelcomeSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="text-purple-600 font-semibold text-sm uppercase tracking-wide">
              {t('welcome.tagline')}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900">
              {t('welcome.title')}
              <span className="text-purple-600"> {t('welcome.titleHighlight')}</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('welcome.description')}
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('welcome.healthcare.title')}</h3>
                  <p className="text-gray-600">{t('welcome.healthcare.description')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('welcome.education.title')}</h3>
                  <p className="text-gray-600">{t('welcome.education.description')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Cross className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('welcome.spiritualLeadership.title')}</h3>
                  <p className="text-gray-600">{t('welcome.spiritualLeadership.description')}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <a
                href="/about"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('welcome.learnMore')}
              </a>
              <a
                href="/donate"
                className="bg-green-600 text-white px-8 py-3 rounded font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                {t('welcome.supportOurWork')}
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/logo5.jpg"
                alt="Church community"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-sm">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-gray-600">{t('welcome.stats.memberChurches')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">13M</div>
                  <div className="text-sm text-gray-600">{t('welcome.stats.believers')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;