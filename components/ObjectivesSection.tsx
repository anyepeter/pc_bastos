import { Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ObjectivesSection = () => {
  const objectives = [
    "Bear witness to the profound unity of Protestantism in Cameroon",
    "Develop and coordinate joint efforts in evangelism and Christian service",
    "Promote Christian life through common social and economic projects",
    "Coordinate joint Protestant events across Cameroon",
    "Represent Cameroonian Protestantism before public authorities",
    "Express the 'Voice of Protestants' on matters of public and ethical concern"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Our Objectives
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Working together to strengthen and unite Protestant churches across Cameroon
          </p>
        </div>

        {/* Objectives Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {objectives.map((objective, index) => (
              <div key={index} className="flex items-start group">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <p className="text-gray-700 pt-2 leading-relaxed">{objective}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Learn more about CEPCA's history, structure, and member churches
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Learn More About Us
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ObjectivesSection;
