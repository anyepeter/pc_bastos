import Image from 'next/image';
import { Heart, Users, Cross } from 'lucide-react';

const WelcomeSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="text-accent font-semibold text-sm uppercase tracking-wide">
              Welcome to Grace Community Church
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900">
              A Place Where Faith
              <span className="text-primary"> Comes Alive</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              For over 25 years, Grace Community Church has been a beacon of hope and love in our community. 
              We believe that everyone has a place at God's table, and we welcome you to join our family as 
              we grow in faith, serve others, and experience the transforming power of God's love.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Authentic Worship</h3>
                  <p className="text-gray-600">Experience heartfelt worship that connects you with God and community.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Strong Community</h3>
                  <p className="text-gray-600">Build lasting relationships with people who care about your spiritual journey.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Cross className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Biblical Teaching</h3>
                  <p className="text-gray-600">Grow in your faith through practical, life-changing biblical messages.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Learn More About Us
              </button>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/8468036/pexels-photo-8468036.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Church community"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
            </div>
            
            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-sm">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">25+</div>
                  <div className="text-sm text-gray-600">Years Serving</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">800+</div>
                  <div className="text-sm text-gray-600">Church Family</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;