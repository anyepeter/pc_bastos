'use client';

import { useState, useEffect } from 'react';
import { Heart, Users, Droplets, Utensils, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const charityData = [
  {
    id: 1,
    title: 'Education Support Program',
    description: 'Providing scholarships and educational resources to underprivileged children in our community.',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop&auto=format',
    amountUsed: '$45,000',
    totalGoal: '$60,000',
    beneficiaries: '120 students'
  },
  {
    id: 2,
    title: 'Healthcare Outreach',
    description: 'Free medical checkups and health awareness programs for rural communities.',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&auto=format',
    amountUsed: '$32,500',
    totalGoal: '$50,000',
    beneficiaries: '800 people'
  },
  {
    id: 3,
    title: 'Clean Water Project',
    description: 'Building wells and water purification systems in underserved areas.',
    icon: Droplets,
    image: 'https://images.unsplash.com/photo-1541544181051-e46607bc22a4?w=800&h=600&fit=crop&auto=format',
    amountUsed: '$78,000',
    totalGoal: '$100,000',
    beneficiaries: '15 communities'
  }
];

export default function CharitySection() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setVisibleCards(charityData.map(charity => charity.id));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getProgressPercentage = (used: string, total: string) => {
    const usedAmount = parseFloat(used.replace(/[$,]/g, ''));
    const totalAmount = parseFloat(total.replace(/[$,]/g, ''));
    return Math.round((usedAmount / totalAmount) * 100);
  };

  return (
    <section className="py-20 bg-zic-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transform transition-all duration-1000 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-4">
            Community Impact
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">
            Our <span className="text-purple-600">Charity Programs</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Transforming lives through compassionate outreach and sustainable community development
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          {charityData.map((program, index) => {
            const IconComponent = program.icon;
            const progressPercentage = getProgressPercentage(program.amountUsed, program.totalGoal);
            
            return (
              <Link
                key={program.id}
                href={`/charity/${program.id}`}
                className={`group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform overflow-hidden border border-gray-100 ${
                  visibleCards.includes(program.id)
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-12 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-sm font-semibold text-gray-800">{program.beneficiaries}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold font-playfair text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-inter mb-6 line-clamp-2">
                    {program.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Funds Used</span>
                      <span className="font-semibold text-gray-900">{program.amountUsed} of {program.totalGoal}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">
                        {progressPercentage}% Complete
                      </span>
                      <div className="flex items-center space-x-2 text-teal-600 group-hover:translate-x-1 transition-transform">
                        <span className="text-sm font-semibold">View Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className={`text-center transform transition-all duration-1000 ease-out delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <Link href="/charity" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
            View All Programs
          </Link>
        </div>
      </div>
    </section>
  );
}