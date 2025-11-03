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
          backgroundImage: 'url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop&auto=format")'
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Main Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex-1 flex flex-col justify-center">

        {/* Green Tagline */}
        <p className="text-green-500 text-sm font-semibold tracking-wider mt-28 uppercase mb-4">
          WE HELP YOU GET THINGS DONE
        </p>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
          GOD GIVES US POWER
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
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event 1 */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-900 font-bold text-xl mb-3">
                  Event: Spiritually Reborn As God's Children
                </h3>
                <Link href="/events" className="text-green-600 font-semibold text-base hover:underline inline-block">
                  Event Details
                </Link>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <span className="text-green-600 font-bold text-base">Sep 20</span>
              </div>
              <div className="bg-green-600 text-white text-sm px-3 py-1 rounded">
                8:00 pm
              </div>
            </div>
          </div>

          {/* Event 2 */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-900 font-bold text-xl mb-3">
                  Event: Grace Church Jesus Hymn Song
                </h3>
                <Link href="/events" className="text-green-600 font-semibold text-base hover:underline inline-block">
                  Event Details
                </Link>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <span className="text-green-600 font-bold text-base">Oct 27</span>
              </div>
              <div className="bg-green-600 text-white text-sm px-3 py-1 rounded">
                12 pm
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;