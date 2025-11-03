import { Users, Church, School, Heart, Radio, Building2 } from 'lucide-react';

const ImpactSection = () => {
  const stats = [
    {
      icon: Church,
      number: "12",
      label: "Member Churches",
      description: "United in faith and purpose",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Users,
      number: "13M",
      label: "Believers",
      description: "Across Cameroon",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Building2,
      number: "15,500",
      label: "Congregations",
      description: "Churches and parishes",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: School,
      number: "1,580",
      label: "Educational Institutions",
      description: "Schools, colleges & training centers",
      color: "from-orange-500 to-amber-600"
    },
    {
      icon: Building2,
      number: "15",
      label: "Universities",
      description: "Higher education institutions",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: Heart,
      number: "350",
      label: "Health Facilities",
      description: "Hospitals and health centers",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: Radio,
      number: "9",
      label: "Radio Stations",
      description: "Across 5 regions",
      color: "from-teal-500 to-cyan-600"
    },
    {
      icon: Building2,
      number: "3",
      label: "Microfinance Institutions",
      description: "Supporting economic empowerment",
      color: "from-yellow-500 to-orange-600"
    }
  ];

  return (
    <section className="">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Transforming Lives Across Cameroon
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            As a key actor and strategic partner in promoting holistic Gospel development,
            combining both spiritual and social dimensions of Christian witness
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</div>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Be Part of Our Mission
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Your support enables us to continue our work in healthcare, education, and community development
            across Cameroon. Together, we can make a lasting impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="bg-gradient-to-r from-green-600 via-emerald-600 to-purple-600 text-white px-10 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 inline-flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Donate Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
