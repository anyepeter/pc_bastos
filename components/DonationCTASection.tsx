import { Heart, HandHeart, Sparkles, ArrowRight } from 'lucide-react';

const DonationCTASection = () => {
  const impactAreas = [
    {
      title: "Healthcare",
      description: "Support 350 hospitals serving communities",
      icon: "🏥"
    },
    {
      title: "Education",
      description: "Help educate 500,000+ students annually",
      icon: "📚"
    },
    {
      title: "Community Development",
      description: "Empower families through microfinance",
      icon: "🌱"
    },
    {
      title: "Pastoral Care",
      description: "Strengthen 15,500 congregations",
      icon: "⛪"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-800 to-purple-900"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <Heart className="w-10 h-10 text-white" fill="currentColor" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Transform Lives Through
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-300">
              Your Generosity
            </span>
          </h2>

          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Your donation supports our mission of healing, education, and community development
            across Cameroon, touching the lives of 13 million believers and their communities.
          </p>
        </div>

        {/* Impact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impactAreas.map((area, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-4xl mb-3">{area.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{area.title}</h3>
              <p className="text-sm text-gray-300">{area.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a
            href="/donate"
            className="group bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white px-12 py-5 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-400/50 inline-flex items-center gap-3"
          >
            <HandHeart className="w-6 h-6" />
            Donate Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="/donate/recurring"
            className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-purple-900 px-12 py-5 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 inline-flex items-center gap-3"
          >
            <Sparkles className="w-6 h-6" />
            Become a Monthly Partner
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <p className="text-gray-300 text-sm mb-4">Trusted by thousands of supporters</p>
          <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure Donations
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Tax Deductible
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% Transparent
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationCTASection;
