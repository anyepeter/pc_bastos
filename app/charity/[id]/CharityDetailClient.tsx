'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Target } from 'lucide-react';
import BackButton from '@/components/BackButton';
import ImageSlider from './ImageSlider';

interface Charity {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  location: string;
  date: string;
  beneficiaries: string;
  amountUsed: string;
  totalGoal: string;
  impact: string;
  images: string[];
}

interface CharityDetailClientProps {
  charity: Charity;
}

export default function CharityDetailClient({ charity }: CharityDetailClientProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getProgressPercentage = (used: string, total: string) => {
    const usedAmount = parseFloat(used.replace(/[$,]/g, ''));
    const totalAmount = parseFloat(total.replace(/[$,]/g, ''));
    return Math.round((usedAmount / totalAmount) * 100);
  };

  const progressPercentage = getProgressPercentage(charity.amountUsed, charity.totalGoal);

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-4">
          {/* <BackButton /> */}
          <div className={`transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h1 className="text-4xl text-center sm:text-6xl font-bold font-playfair mb-4 bg-gradient-to-r from-white to-cyan-100 bg-clip-text pt-10">
              {charity.title}
            </h1>
            <p className="text-xl font-inter leading-relaxed max-w-3xl mx-auto text-center">
              {charity.impact}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className={`transform transition-all duration-1000 ease-out delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="mb-8">
                <ImageSlider images={charity.images} alt={charity.title} />
              </div>
            </div>

            <div className={`transform transition-all duration-1000 ease-out delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="">
                <h2 className="text-2xl font-bold font-playfair text-gray-900 mb-6">
                  About This Program
                </h2>
                <p className="text-gray-700 leading-relaxed font-inter text-lg">
                  {charity.fullDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 flex flex-col gap-4">
            <div className={`transform transition-all duration-1000 ease-out delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold font-playfair text-gray-900 mb-4">
                  Funding Progress
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Raised</span>
                    <span className="font-bold text-blue-600">{charity.amountUsed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Goal</span>
                    <span className="font-bold text-gray-900">{charity.totalGoal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-blue-600">{progressPercentage}%</span>
                    <span className="text-gray-600 ml-2">Complete</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`transform transition-all duration-1000 ease-out delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold font-playfair text-gray-900 mb-4">
                  Program Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700 font-inter">{formatDate(charity.date)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-700 font-inter">{charity.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700 font-inter">{charity.beneficiaries}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-teal-600" />
                    <span className="text-gray-700 font-inter">Community Impact</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`transform transition-all duration-1000 ease-out delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="bg-green-500 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold font-playfair mb-3">
                  Make a Difference
                </h3>
                <p className="mb-4 font-inter">
                  Your contribution can help us reach our goal and impact more lives in the community.
                </p>
                <button className="w-full bg-white text-green-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors">
                  Donate Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}