'use client';

import { useState, useEffect } from 'react';
import { Users, Crown, Building, FileText } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import BackButton from '@/components/BackButton';

export default function StructurePage() {
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
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 py-16">
            <BackButton />
            <div className={`text-center transform transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-4xl sm:text-6xl font-bold font-playfair mb-6">
                CEPCA Structure
              </h1>
              <p className="text-xl text-blue-100 font-inter max-w-3xl mx-auto leading-relaxed">
                Organizational framework ensuring effective governance and coordination
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          <div className={`mb-16 transform transition-all duration-1000 ease-out delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className="text-3xl font-bold font-playfair text-gray-900 mb-12 text-center">
              Organizational Chart
            </h2>
            
            <div className="relative">
              <div className="flex flex-col items-center space-y-8">
                
                <div className={`transform transition-all duration-1000 ease-out ${
                  animateChart ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}>
                  <div className="group bg-gray-200 text-gray-800 p-6 text-center min-w-64 hover:scale-100 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Crown className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="text-xl font-bold mb-2">General Assembly</h3>
                    <p className="text-sm group-hover:hidden transition-opacity duration-300">Supreme Decision-Making Body</p>
                    <p className="text-xs mt-1 group-hover:hidden transition-opacity duration-300">Meets every 2 years</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">Supreme decision-making body, meets once every two years, defines overall policy.</p>
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
                    <h3 className="text-xl font-bold mb-2">Executive Committee</h3>
                    <p className="text-sm group-hover:hidden transition-opacity duration-300">Policy Execution</p>
                    <p className="text-xs mt-1 group-hover:hidden transition-opacity duration-300">Meets twice yearly</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">Executes CEPCA's policies. Meets twice a year under the President's convening. Includes 11 Church Leaders, the General Secretary, Executive Secretaries of Departments, and the Head of Administration and Finance (SAF).</p>
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
                    <p className="text-xs group-hover:hidden transition-opacity duration-300">Admin & Finance</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">Centralizes all income and expenditures of CEPCA; prepares annual financial statements and inventory reports.</p>
                  </div>
                  <div className="group bg-gray-200 text-gray-800 p-4 text-center hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <h4 className="font-bold mb-1">DS</h4>
                    <p className="text-xs group-hover:hidden transition-opacity duration-300">Health</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">Coordinates public health activities of member churches; represents church medical works before the Government, particularly the Ministry of Public Health.</p>
                  </div>
                  <div className="group bg-gray-200 text-gray-800 p-4 text-center hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <h4 className="font-bold mb-1">OEPP</h4>
                    <p className="text-xs group-hover:hidden transition-opacity duration-300">Education</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">Coordinates the educational work of member churches; develops mid- and long-term policies for Protestant private education.</p>
                  </div>
                  <div className="group bg-gray-200 text-gray-800 p-4 text-center hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <h4 className="font-bold mb-1">DFAS</h4>
                    <p className="text-xs group-hover:hidden transition-opacity duration-300">Women & Social</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">Highlights the role of women in Church and society; prepares women for effective participation within their churches and the Cameroonian community; trains them in leadership and management.</p>
                  </div>
                </div>

                <div className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 transform transition-all duration-1000 ease-out delay-1400 ${
                  animateChart ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}>
                  <div className="group bg-gray-200 text-gray-800 p-4 text-center hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <h4 className="font-bold mb-1">DTC</h4>
                    <p className="text-xs group-hover:hidden transition-opacity duration-300">Christian Witness</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">Coordinates evangelism planning; organizes theological reflection meetings; assists departments in developing appropriate evangelistic strategies.</p>
                  </div>
                  <div className="group bg-gray-200 text-gray-800 p-4 text-center hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <h4 className="font-bold mb-1">DJ</h4>
                    <p className="text-xs group-hover:hidden transition-opacity duration-300">Youth</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">Trains young people for active participation in church and society; develops tools for civic and moral education; identifies common challenges and interests.</p>
                  </div>
                  <div className="group bg-gray-200 text-gray-800 p-4 text-center hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <h4 className="font-bold mb-1">DIC</h4>
                    <p className="text-xs group-hover:hidden transition-opacity duration-300">Information</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">Handles all communication within CEPCA; produces and broadcasts Protestant radio and TV programs; assists member churches and departments with event coverage and live transmission.</p>
                  </div>
                  <div className="group bg-gray-200 text-gray-800 p-4 text-center hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer relative rounded-lg shadow-lg">
                    <Building className="w-6 h-6 mx-auto mb-2" />
                    <h4 className="font-bold mb-1">BURED</h4>
                    <p className="text-xs group-hover:hidden transition-opacity duration-300">Research</p>
                    <p className="text-xs hidden group-hover:block transition-opacity duration-300">Promotes CEPCA's and its member churches' participation in national development and socio-economic issues.</p>
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
                    General Assembly
                  </h3>
                </div>
                <p className="text-gray-700 font-inter leading-relaxed mb-4">
                  Supreme decision-making body that meets once every two years to define overall policy and strategic direction for CEPCA.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Defines organizational policies</li>
                  <li>• Elects leadership positions</li>
                  <li>• Approves strategic plans</li>
                  <li>• Reviews organizational performance</li>
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
                    Executive Committee
                  </h3>
                </div>
                <p className="text-gray-700 font-inter leading-relaxed mb-4">
                  Executes CEPCA's policies and meets twice a year under the President's convening.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 11 Church Leaders</li>
                  <li>• General Secretary</li>
                  <li>• Executive Secretaries</li>
                  <li>• Head of Administration (SAF)</li>
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
                    Commissions
                  </h3>
                </div>
                <p className="text-gray-700 font-inter leading-relaxed mb-4">
                  Each department has a commission responsible for planning and monitoring programs.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Program planning</li>
                  <li>• Activity monitoring</li>
                  <li>• Resource allocation</li>
                  <li>• Performance evaluation</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={`bg-gray-50 p-8 lg:p-12 transform transition-all duration-1000 ease-out delay-1100 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h3 className="text-2xl font-bold font-playfair text-gray-900 mb-6 text-center">
              Headquarters Information
            </h3>
            <div className="text-center space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                <p className="text-gray-700 font-inter">Yaoundé, P.O. Box 491 – Rue Ceper, Elig-Essono</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Logo</h4>
                <p className="text-gray-700 font-inter">The map of Cameroon with a cross inside, set against green, violet, and white backgrounds</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Motto</h4>
                <p className="text-xl font-playfair italic text-purple-600">"Being Church Together"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}