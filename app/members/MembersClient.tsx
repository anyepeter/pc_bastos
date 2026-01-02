'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { MapPin, Calendar, Users } from 'lucide-react';

const membersData = {
  ea: {
    denomination: "Eglise Anglicane (EA)",
    leader: "Evêque Mgr. DIBO BLANGWE Thomas",
    location: "Douala",
    founded: "1922",
    logo: "/images/ea.jpg"
  },
  cbc: {
    denomination: "Cameroon Baptist Convention (CBC)",
    leader: "President National Rev. Dr TEKE John Ekema",
    location: "Bamenda",
    founded: "1884",
    logo: "/images/cbc.jpg"
  },
  eec: {
    denomination: "Eglise Evangélique du Cameroun (EEC)",
    leader: "Président Rev. BILLA MBENGA Alexandre",
    location: "Douala",
    founded: "1957",
    logo: "/images/eec.jpg"
  },
  eelc: {
    denomination: "Eglise Evangélique Luthérienne du Cameroun (EELC)",
    leader: "Evêque national Mgr. BAIGUEL Jean",
    location: "Ngaoundéré",
    founded: "1923",
    logo: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format"
  },
  eflc: {
    denomination: "Eglise Fraternelle Luthérienne du Cameroun (EFLC)",
    leader: "Président Rev. DEBSIA DABA Alvius",
    location: "Garoua",
    founded: "1960",
    logo: "/images/eflc.jpg"
  },
  epc: {
    denomination: "Eglise Presbytérienne Camerounaise (E P C)",
    leader: "Secrétaire Général Rev. ABESSOLO ZE",
    location: "Yaoundé",
    founded: "1957",
    logo: "/images/epc.jpg"
  },
  epa: {
    denomination: "Eglise Protestante Africaine (EPA)",
    leader: "Secrétaire Général Rev MFOM Jules Perigord",
    location: "Lokolot",
    founded: "1934",
    logo: "/images/epa.jpg"
  },
  nbc: {
    denomination: "Native Baptist Church (NBC)",
    leader: "Président National Rev. Dr NSOGA Job Salomon Modérateur",
    location: "Douala Buéa",
    founded: "1898",
    logo: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format"
  },
  pcc: {
    denomination: "Presbyterian Church in Cameroon (PCC)",
    leader: "Rt. Rev MIKI Hans ABIA Rt. Vice",
    location: "Buea",
    founded: "1886",
    logo: "/images/pcc.jpg"
  },
  uebc: {
    denomination: "Union des Eglises Baptistes du Cameroun (UEBC)",
    leader: "Président Rev. EDOUBE Ernest",
    location: "Douala",
    founded: "1952",
    logo: "/images/uebc.jpg"
  },
  ueec: {
    denomination: "Union des Eglises Evangéliques du Cameroun (UEEC)",
    leader: "Président Rev. HAMADINA Salomon",
    location: "Maroua",
    founded: "1965",
    logo: "/images/ueec.jpg"
  },
  mpe: {
    denomination: "FULL GOSPEL Mission (Mission du plein Evangile)(MPE)",
    leader: "Général Surintendant Rev. SOKENG ALAIN Clément",
    location: "Yaoundé",
    founded: "1963",
    logo: "/images/full.jpg"
  }
};

export default function MembersClient() {
  const { t } = useTranslation();
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
                <div className="text-4xl font-bold text-purple-600 mb-2">12</div>
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
          {Object.entries(membersData).map(([slug, member], index) => (
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
                        src={member.logo}
                        alt={`${member.denomination} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold font-playfair text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {t(`members.churches.${slug}.denomination`)}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-purple-500" />
                      <span className="truncate">{t(`members.churches.${slug}.leader`)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{member.location}</span>
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
          ))}
        </div>
      </div>
    </div>
  );
}