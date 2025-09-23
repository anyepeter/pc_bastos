'use client';

import { useState } from 'react';
import { ChevronDown, MapPin, User } from 'lucide-react';
import BackButton from '@/components/BackButton';

const membersData = [
  {
    id: 1,
    denomination: "Eglise Anglicane (EA)",
    leader: "Evêque Mgr. DIBO BLANGWE Thomas",
    location: "Douala"
  },
  {
    id: 2,
    denomination: "Cameroon Baptist Convention (CBC)",
    leader: "President National Rev. Dr TEKE John Ekema",
    location: "Bamenda"
  },
  {
    id: 3,
    denomination: "Eglise Evangélique du Cameroun (EEC)",
    leader: "Président Rev. BILLA MBENGA Alexandre",
    location: "Douala"
  },
  {
    id: 4,
    denomination: "Eglise Evangélique Luthérienne du Cameroun (EELC)",
    leader: "Evêque national Mgr. BAIGUEL Jean",
    location: "Ngaoundéré"
  },
  {
    id: 5,
    denomination: "Eglise Fraternelle Luthérienne du Cameroun (EFLC)",
    leader: "Président Rev. DEBSIA DABA Alvius",
    location: "Garoua"
  },
  {
    id: 6,
    denomination: "Eglise Presbytérienne Camerounaise (E P C)",
    leader: "Secrétaire Général Rev. ABESSOLO ZE",
    location: "Yaoundé"
  },
  {
    id: 7,
    denomination: "Eglise Protestante Africaine (EPA)",
    leader: "Secrétaire Général Rev MFOM Jules Perigord",
    location: "Lokolot"
  },
  {
    id: 8,
    denomination: "Native Baptist Church (NBC)",
    leader: "Président National Rev. Dr NSOGA Job Salomon Modérateur",
    location: "Douala Buéa"
  },
  {
    id: 9,
    denomination: "Presbyterian Church in Cameroon (PCC)",
    leader: "Rt. Rev MIKI Hans ABIA Rt. Vice",
    location: ""
  },
  {
    id: 10,
    denomination: "Union des Eglises Baptistes du Cameroun (UEBC)",
    leader: "Président Rev. EDOUBE Ernest",
    location: "Douala"
  },
  {
    id: 11,
    denomination: "Union des Eglises Evangéliques du Cameroun (UEEC)",
    leader: "Président Rev. HAMADINA Salomon",
    location: "Maroua 6094471"
  },
  {
    id: 12,
    denomination: "FULL GOSPEL Mission (Mission du plein Evangile)(MPE)",
    leader: "Général Surintendant Rev. SOKENG ALAIN Clément",
    location: "Yaoundé- Nouvelle Route Bastos"
  }
];

export default function MembersPage() {
  const [openDropdowns, setOpenDropdowns] = useState<number[]>([]);

  const toggleDropdown = (id: number) => {
    setOpenDropdowns(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 pt-20">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <BackButton />
            <h1 className="text-4xl sm:text-5xl font-bold font-playfair mb-4 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              Members
            </h1>
            <p className="text-xl text-purple-100 font-inter max-w-3xl mx-auto leading-relaxed">
              Council of Protestant Churches of Cameroon
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6">
          {membersData.map((member, index) => (
            <div key={member.id} className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 transform">
              <button
                onClick={() => toggleDropdown(member.id)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 rounded-2xl"
              >
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold font-poppins text-lg">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-bold font-playfair bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent text-lg sm:text-xl leading-tight">
                      {member.denomination}
                    </h3>
                  </div>
                </div>
                <ChevronDown className={`h-6 w-6 text-purple-500 transform transition-all duration-300 ${
                  openDropdowns.includes(member.id) ? 'rotate-180 text-indigo-600' : ''
                }`} />
              </button>
              
              {openDropdowns.includes(member.id) && (
                <div className="px-8 pb-8 border-t border-gradient-to-r from-purple-200 to-indigo-200">
                  <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex items-start space-x-4 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mt-1 shadow-md">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold font-poppins text-gray-900 text-base mb-2">Organisation Head</h4>
                        <p className="text-gray-700 font-inter text-sm leading-relaxed">{member.leader}</p>
                      </div>
                    </div>
                    {member.location && (
                      <div className="flex items-start space-x-4 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mt-1 shadow-md">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold font-poppins text-gray-900 text-base mb-2">Location</h4>
                          <p className="text-gray-700 font-inter text-sm leading-relaxed">{member.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}