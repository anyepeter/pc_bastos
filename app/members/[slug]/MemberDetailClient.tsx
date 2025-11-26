'use client';

import { useState, useEffect } from 'react';
import { MapPin, User, Phone, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ImageSlider from './ImageSlider';

interface Member {
  denomination: string;
  leader: string;
  location: string;
  images: string[];
  history: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  founded: string;
  logo: string;
}

interface MemberDetailClientProps {
  member: Member;
}

export default function MemberDetailClient({ member }: MemberDetailClientProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
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
            <h1 className="text-4xl sm:text-6xl font-bold font-playfair mb-4 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              {member.denomination}
            </h1>
            <p className="text-xl text-purple-100 font-inter leading-relaxed">Founded in {member.founded} • {member.location}</p>
          </div>
        </div>
      </div>

      {/* Floating Logo Badge - Apple-inspired Design (Mobile-First) */}
      <div className="relative max-w-7xl mx-auto -mt-12 sm:-mt-10 md:-mt-20">
        <div className={`transform transition-all duration-1000 ease-out delay-200 scale-100 opacity-100`}>
          <div className="flex justify-center">
            <div className="relative group">

              {/* Logo container */}
              <div className="relative bg-transparent">
                <div className="">
                  {/* Mobile-first sizing: 96px → 128px → 160px → 192px */}
                  <div className="relative w-48 h-48 mx-auto">
                    <img
                      src={member.logo}
                      alt={`${member.denomination} logo`}
                      className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Subtle shine effect */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className={`transform transition-all duration-1000 ease-out delay-300 group ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <ImageSlider images={member.images} alt={member.denomination} />
          </div>

          <div className={`space-y-8 transform transition-all duration-1000 ease-out delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <h2 className="text-2xl font-bold font-playfair bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">History</h2>
              <p className="text-gray-700 leading-relaxed font-inter">{member.history}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-playfair text-gray-900 mb-2">Leadership</h3>
                  <p className="text-gray-700 font-inter">{member.leader}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-playfair text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-700 font-inter">{member.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-12 transform transition-all duration-1000 ease-out delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
            <h2 className="text-2xl font-bold font-playfair bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Phone</p>
                  <p className="text-gray-800 font-inter">{member.contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Email</p>
                  <p className="text-gray-800 font-inter">{member.contact.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Address</p>
                  <p className="text-gray-800 font-inter">{member.contact.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}