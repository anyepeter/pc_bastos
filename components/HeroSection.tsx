'use client';

import Link from 'next/link';
import { Calendar, Heart } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/images/hero-image.jpg")',
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Main Content */}
      <div className="relative z-10 text-center mt-40 mb-4 text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex-1 flex flex-col justify-center">

        {/* Green Tagline */}
        {/* <p className="text-green-500 text-sm font-semibold tracking-wider mt-28 uppercase mb-4">
        BEING CHURCH TOGETHER
        </p> */}

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
        BEING CHURCH TOGETHER
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
          Jesus is holy, loving, and worthy of all our worship and devotion. You will feel heaven in our Grace Community Church. Join us and Praise the Lord Jesus.
        </p>

        {/* CTA Buttons */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="border hover:bg-purple-700 text-white px-10 py-4 font-semibold transition-all duration-300 inline-block rounded shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Contact Us
          </Link>
          <Link
            href="/donate"
            className="bg-green-600 text-white px-10 py-4 font-semibold transition-all duration-300 inline-flex items-center gap-2 rounded shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Heart className="w-5 h-5" />
            Donate Now
          </Link>
        </div>
      </div>
      
      {/* Event Cards */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Event 1 */}
          <Link href="/events/1" className="bg-white/80 border border-white/50 rounded shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 transform group cursor-pointer">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex flex-col items-center justify-center text-white shadow-lg">
                  <span className="text-xs font-medium">SEP</span>
                  <span className="text-lg font-bold">20</span>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  Upcoming
                </span>
              </div>
              
              <h3 className="font-bold font-playfair text-gray-900 text-xl mb-3 leading-tight group-hover:text-purple-700 transition-colors duration-300 line-clamp-1">
                Spiritually Reborn As God's Children
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>September 20, 2024</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>8:00 PM</span>
                </div>
              </div>
              
              {/* <Link href="/events/1" className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md group-hover:shadow-lg">
                <span>Learn More</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link> */}
            </div>
          </Link>

          {/* Event 2 */}
          <Link href="/events/2" className="bg-white/80 border border-white/50 rounded shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 transform group cursor-pointer">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex flex-col items-center justify-center text-white shadow-lg">
                  <span className="text-xs font-medium">OCT</span>
                  <span className="text-lg font-bold">27</span>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  Upcoming
                </span>
              </div>
              
              <h3 className="font-bold font-playfair text-gray-900 text-xl mb-3 leading-tight group-hover:text-purple-700 transition-colors duration-300">
                Grace Church Jesus Hymn Song
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>October 27, 2024</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>12:00 PM</span>
                </div>
              </div>
              
              {/* <Link href="/events/2" className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md group-hover:shadow-lg">
                <span>Learn More</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link> */}
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;