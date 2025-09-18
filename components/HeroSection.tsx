import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1920&q=80")'
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
        
        {/* Contact Button */}
        <div className="mb-8">
          <Link
            href="/contact"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 font-semibold transition-colors duration-300 inline-block"
          >
            Contact Us
          </Link>
        </div>
      </div>
      
      {/* Event Cards */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event 1 */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-2">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-green-600 font-bold text-sm">Sep 20</div>
                <div className="bg-green-600 text-white text-xs px-2 py-1 rounded mt-1">8:00 pm</div>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 font-bold text-lg mb-2">
                  Event: Spiritually Reborn As God's Children
                </h3>
                <Link href="/events" className="text-green-600 font-semibold text-sm hover:underline">
                  Event Details
                </Link>
              </div>
            </div>
          </div>
          
          {/* Event 2 */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-2">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-green-600 font-bold text-sm">Oct 27</div>
                <div className="bg-green-600 text-white text-xs px-2 py-1 rounded mt-1">12 pm</div>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 font-bold text-lg mb-2">
                  Event: Grace Church Jesus Hymn Song
                </h3>
                <Link href="/events" className="text-green-600 font-semibold text-sm hover:underline">
                  Event Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;