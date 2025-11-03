import { Heart, GraduationCap, Cross, Users, Radio, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const AreasOfWorkSection = () => {
  const areas = [
    {
      icon: Heart,
      title: "Healthcare",
      description: "Providing quality care and compassionate service across 350 hospitals and health centers",
      highlights: [
        "Combating HIV/AIDS, malaria, and tuberculosis",
        "Maternal and child health programs",
        "Community health improvement initiatives",
        "Medical training and capacity building"
      ],
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&auto=format",
      link: "/activities/healthcare",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: GraduationCap,
      title: "Education",
      description: "Training over 500,000 students annually through 1,580 schools and 15 universities",
      highlights: [
        "Quality education from primary to university level",
        "Christian ethics and values integration",
        "Vocational training and skill development",
        "Scholarship programs for disadvantaged students"
      ],
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=800&h=600&fit=crop&auto=format",
      link: "/activities/education",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Cross,
      title: "Pastoral Ministry & Evangelism",
      description: "Serving 13 million believers across 15,500 congregations throughout Cameroon",
      highlights: [
        "Spiritual guidance and counseling",
        "Church planting and growth initiatives",
        "Religious education and discipleship",
        "Community outreach programs"
      ],
      image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=600&fit=crop&auto=format",
      link: "/activities/ministry",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Users,
      title: "Women & Social Affairs",
      description: "Empowering women and strengthening communities through leadership and social programs",
      highlights: [
        "Women's leadership training and development",
        "Economic empowerment initiatives",
        "Social welfare and community support",
        "Advocacy for women's rights and dignity"
      ],
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format",
      link: "/activities/women",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: Radio,
      title: "Media & Communication",
      description: "Broadcasting the Gospel and sharing information through 9 radio stations across 5 regions",
      highlights: [
        "Radio and TV program production",
        "Digital content and social media outreach",
        "Event coverage and live transmission",
        "Communication training for churches"
      ],
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop&auto=format",
      link: "/activities/media",
      color: "from-teal-500 to-cyan-600"
    },
    {
      icon: TrendingUp,
      title: "Economic Development",
      description: "Supporting financial independence through 3 microfinance institutions and development programs",
      highlights: [
        "Microfinance and small business loans",
        "Agricultural development projects",
        "Youth entrepreneurship training",
        "Community development initiatives"
      ],
      image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&h=600&fit=crop&auto=format",
      link: "/activities/development",
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-purple-600 font-semibold text-sm uppercase tracking-wide mb-3">
            What We Do
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Our Areas of Work
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Holistic ministry addressing spiritual, physical, and social needs across Cameroon
          </p>
        </div>

        {/* Areas Grid */}
        <div className="space-y-12">
          {areas.map((area, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
            >
              {/* Image */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  <img
                    src={area.image}
                    alt={area.title}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className={`absolute top-4 left-4 w-16 h-16 bg-gradient-to-r ${area.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <area.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{area.title}</h3>
                <p className="text-lg text-gray-600 mb-6">{area.description}</p>

                <ul className="space-y-3 mb-6">
                  {area.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className={`w-2 h-2 bg-gradient-to-r ${area.color} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={area.link}
                  className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${area.color} text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  Learn More
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Support Our Work
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Your contribution helps us continue our mission of healing, education, and community development
          </p>
          <a
            href="/donate"
            className="bg-gradient-to-r from-green-600 via-emerald-600 to-purple-600 text-white px-10 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 inline-flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" />
            Make a Donation
          </a>
        </div>
      </div>
    </section>
  );
};

export default AreasOfWorkSection;
