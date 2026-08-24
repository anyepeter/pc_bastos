'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { MapPin, Calendar, Users } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';

export interface PublicChurch {
  id: string;
  slug: string;
  denomination: unknown;
  leader: unknown;
  location: unknown;
  founded: string | null;
  logo: string | null;
}

export default function MembersClient({ churches }: { churches: PublicChurch[] }) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      {/* Hero Section */}
      <div className="text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1920&h=600&fit=crop&auto=format")'
          }}
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-12 md:pb-16">
          <div className={`transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h1 className="text-4xl sm:text-6xl font-bold font-playfair mb-4">
              {t('members.pageTitle')} <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">{t('members.pageTitleHighlight')}</span>
            </h1>
            <p className="text-xl text-purple-100 font-inter leading-relaxed max-w-3xl">
              {t('members.pageSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className={`transform transition-all duration-1000 ease-out delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-playfair bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {t('members.unitedInFaith')}
              </h2>
              <p className="text-gray-600 font-inter">
                {t('members.servingTogether')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">{churches.length}</div>
                <div className="text-gray-600 font-inter">{t('members.memberChurches')}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">13M+</div>
                <div className="text-gray-600 font-inter">{t('welcome.stats.believers')}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">15,500</div>
                <div className="text-gray-600 font-inter">Congregations</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {churches.map((member, index) => {
            const slug = member.slug;
            const denomination = getTranslatedText(member.denomination as any, language);
            const leader = getTranslatedText(member.leader as any, language);
            const location = getTranslatedText(member.location as any, language);

            return (
            <div
              key={slug}
              className={`transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <Link href={`/members/${slug}`}>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={member.logo || '/images/logo_CEPCA.png'}
                        alt={`${denomination} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold font-playfair text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {denomination}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-purple-500" />
                      <span className="truncate">{leader}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-green-500" />
                      <span>{t('members.founded')} {member.founded}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-purple-600 font-semibold text-sm group-hover:text-purple-700 transition-colors">
                      {t('members.viewDetails')} →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}