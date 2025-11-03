import { Target, Eye, Heart } from 'lucide-react';

const MissionVisionSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-purple-600 font-semibold text-sm uppercase tracking-wide mb-3">
            Our Purpose
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Mission & Vision
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            "Being Church Together" - United in purpose, diverse in expression
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vision Card */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              While we may differ from one another, it remains true that through the work of the Holy Spirit
              and respect for democratic principles, we can all speak a common language—the language of love.
            </p>
            <p className="text-gray-700 leading-relaxed">
              CEPCA strengthens our shared sense of belonging as Churches united in defending a common cause.
              This is no longer a mere juxtaposition of denominations, but a true ecumenical institution
              committed to advancing Protestant interests—a vision of integration.
            </p>
            <div className="mt-6 p-4 bg-white/60 rounded-lg">
              <p className="text-purple-800 font-semibold italic">
                "What can we accomplish together?"
              </p>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our renewed mission focuses on healing, liberation, and the holistic development of the human person.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Health</h4>
                  <p className="text-gray-600 text-sm">
                    Providing quality care and compassionate service, combating HIV/AIDS, malaria, tuberculosis,
                    and improving community health.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Education</h4>
                  <p className="text-gray-600 text-sm">
                    Continuing the legacy of Christian missions, training competent citizens who uphold
                    Christian ethics wherever they serve.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Pastoral Ministry</h4>
                  <p className="text-gray-600 text-sm">
                    Remaining a prophetic voice, standing beside those in distress and speaking through
                    diverse media and worship contexts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 mr-3" />
            <h3 className="text-2xl font-bold">Our Core Principles</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-white/90">Confesses Jesus Christ as the only Lord and Savior</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-white/90">Recognizes the Holy Scriptures as the sole standard of faith</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-white/90">Confesses the Apostles' Creed</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-white/90">Works closely with member churches to achieve objectives</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
