'use client';

import { useState, useEffect } from 'react';
import { Users, Crown, Building, FileText } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import BackButton from '@/components/BackButton';
import { useTranslation } from 'react-i18next';

export default function StructurePage() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setAnimateChart(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        <div className="text-white relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&h=600&fit=crop&auto=format")'
            }}
          />
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-10 md:pb-16 relative z-10">
            {/* <BackButton /> */}
            <div className={`text-center transform transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-4xl sm:text-6xl font-bold font-playfair mb-6">
                {t('about.structure.pageTitle')}
              </h1>
              <p className="text-xl text-blue-100 font-inter max-w-3xl mx-auto leading-relaxed">
                {t('about.structure.pageSubtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          <div className={`mb-16 transform transition-all duration-1000 ease-out delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className="text-3xl font-bold font-playfair text-gray-900 mb-12 text-center">
              {t('about.structure.organizationalChart')}
            </h2>
            
            <div className="relative">
              <div className="flex flex-col items-center space-y-8">
                
                <div className={`transform transition-all duration-1000 ease-out ${
                  animateChart ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}>
                  <div className="group bg-gray-200 text-gray-800 p-6 text-center min-w-64 hover:scale-100 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Crown className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="text-xl font-bold mb-2">{t('about.structure.generalAssembly')}</h3>
                    <p className="text-sm group-hover:hidden transition-opacity duration-300">{t('about.structure.generalAssemblyShort')}</p>
                    <p className="text-xs mt-1 group-hover:hidden transition-opacity duration-300">{t('about.structure.meetsEvery2Years')}</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">{t('about.structure.generalAssemblyLong')}</p>
                  </div>
                </div>

                <div className={`w-px h-12 bg-gray-300 transform transition-all duration-500 delay-500 ${
                  animateChart ? 'scale-y-100' : 'scale-y-0'
                }`}></div>

                <div className={`transform transition-all duration-1000 ease-out delay-700 ${
                  animateChart ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}>
                  <div className="group bg-gray-200 text-gray-800 p-6 text-center min-w-64 hover:scale-100 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="text-xl font-bold mb-2">{t('about.structure.executiveCommittee')}</h3>
                    <p className="text-sm group-hover:hidden transition-opacity duration-300">{t('about.structure.executiveCommitteeShort')}</p>
                    <p className="text-xs mt-1 group-hover:hidden transition-opacity duration-300">{t('about.structure.meetsTwiceYearly')}</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">{t('about.structure.executiveCommitteeLong')}</p>
                  </div>
                </div>

                <div className={`w-px h-12 bg-gray-300 transform transition-all duration-500 delay-1000 ${
                  animateChart ? 'scale-y-100' : 'scale-y-0'
                }`}></div>

                <div className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 transform transition-all duration-1000 ease-out delay-1200 ${
                  animateChart ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}>
                  <div className="group bg-gray-200 text-gray-800 p-4 text-center hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <h4 className="font-bold mb-1">SAF</h4>
                    <p className="text-xs group-hover:hidden transition-opacity duration-300">{t('about.departments.saf.short')}</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">{t('about.departments.saf.description')}</p>
                  </div>
                  <div className="group bg-gray-200 text-gray-800 p-4 text-center hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <h4 className="font-bold mb-1">DS</h4>
                    <p className="text-xs group-hover:hidden transition-opacity duration-300">{t('about.departments.ds.short')}</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">{t('about.departments.ds.description')}</p>
                  </div>
                  <div className="group bg-gray-200 text-gray-800 p-4 text-center hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <h4 className="font-bold mb-1">OEPP</h4>
                    <p className="text-xs group-hover:hidden transition-opacity duration-300">{t('about.departments.oepp.short')}</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">{t('about.departments.oepp.description')}</p>
                  </div>
                  <div className="group bg-gray-200 text-gray-800 p-4 text-center hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <h4 className="font-bold mb-1">DFAS</h4>
                    <p className="text-xs group-hover:hidden transition-opacity duration-300">{t('about.departments.dfas.short')}</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">{t('about.departments.dfas.description')}</p>
                  </div>
                </div>

                <div className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 transform transition-all duration-1000 ease-out delay-1400 ${
                  animateChart ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}>
                  <div className="group bg-gray-200 text-gray-800 p-4 text-center hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <h4 className="font-bold mb-1">DTC</h4>
                    <p className="text-xs group-hover:hidden transition-opacity duration-300">{t('about.departments.dtc.short')}</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">{t('about.departments.dtc.description')}</p>
                  </div>
                  <div className="group bg-gray-200 text-gray-800 p-4 text-center hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <h4 className="font-bold mb-1">DJ</h4>
                    <p className="text-xs group-hover:hidden transition-opacity duration-300">{t('about.departments.dj.short')}</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">{t('about.departments.dj.description')}</p>
                  </div>
                  <div className="group bg-gray-200 text-gray-800 p-4 text-center hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <h4 className="font-bold mb-1">DIC</h4>
                    <p className="text-xs group-hover:hidden transition-opacity duration-300">{t('about.departments.dic.short')}</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">{t('about.departments.dic.description')}</p>
                  </div>
                  <div className="group bg-gray-200 text-gray-800 p-4 text-center hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <h4 className="font-bold mb-1">BURED</h4>
                    <p className="text-xs group-hover:hidden transition-opacity duration-300">{t('about.departments.bured.short')}</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">{t('about.departments.bured.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className={`transform transition-all duration-1000 ease-out delay-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="bg-white border border-gray-200 p-6 h-full">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-purple-100 p-2">
                    <Crown className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold font-playfair text-gray-900">
                    {t('about.structure.generalAssembly')}
                  </h3>
                </div>
                <p className="text-gray-700 font-inter leading-relaxed mb-4">
                  {t('about.structure.generalAssemblyFull')}
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• {t('about.structure.definesPolicy')}</li>
                  <li>• {t('about.structure.electsLeadership')}</li>
                  <li>• {t('about.structure.approvesPlans')}</li>
                  <li>• {t('about.structure.reviewsPerformance')}</li>
                </ul>
              </div>
            </div>

            <div className={`transform transition-all duration-1000 ease-out delay-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="bg-white border border-gray-200 p-6 h-full">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-100 p-2">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold font-playfair text-gray-900">
                    {t('about.structure.executiveCommittee')}
                  </h3>
                </div>
                <p className="text-gray-700 font-inter leading-relaxed mb-4">
                  {t('about.structure.executiveCommitteeFull')}
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• {t('about.structure.churchLeaders')}</li>
                  <li>• {t('about.structure.generalSecretary')}</li>
                  <li>• {t('about.structure.executiveSecretaries')}</li>
                  <li>• {t('about.structure.headOfAdmin')}</li>
                </ul>
              </div>
            </div>

            <div className={`transform transition-all duration-1000 ease-out delay-900 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="bg-white border border-gray-200 p-6 h-full">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 p-2">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold font-playfair text-gray-900">
                    {t('about.structure.commissionsTitle')}
                  </h3>
                </div>
                <p className="text-gray-700 font-inter leading-relaxed mb-4">
                  {t('about.structure.commissionsFull')}
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• {t('about.structure.programPlanning')}</li>
                  <li>• {t('about.structure.activityMonitoring')}</li>
                  <li>• {t('about.structure.resourceAllocation')}</li>
                  <li>• {t('about.structure.performanceEvaluation')}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={`bg-gray-50 p-8 lg:p-12 transform transition-all duration-1000 ease-out delay-1100 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h3 className="text-2xl font-bold font-playfair text-gray-900 mb-6 text-center">
              {t('about.structure.headquartersInfo')}
            </h3>
            <div className="text-center space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('about.structure.address')}</h4>
                <p className="text-gray-700 font-inter">{t('about.structure.addressText')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('about.structure.logo')}</h4>
                <div className="flex justify-center mb-2">
                  <img
                    src="/images/logo_CEPCA.png"
                    alt="CEPCA Logo - Map of Cameroon with cross"
                    className="w-24 h-24 object-contain rounded-lg shadow-md"
                  />
                </div>
                <p className="text-gray-700 font-inter text-sm">{t('about.structure.logoDescription')}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{t('about.structure.motto')}</h4>
                <p className="text-xl font-playfair italic text-purple-600">{t('about.structure.mottoText')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}