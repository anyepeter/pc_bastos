import { BookOpen, Users, Globe, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const AboutCEPCASection = () => {
  const memberChurches = [
    "Cameroon Baptist Convention (CBC), Bamenda",
    "Anglican Church (EA), Douala",
    "Evangelical Church of Cameroon (EEC), Douala",
    "Evangelical Lutheran Church in Cameroon (EELC), Ngaoundéré",
    "Lutheran Fraternal Church of Cameroon (EFLC), Garoua",
    "Presbyterian Church of Cameroon (EPC), Yaoundé",
    "African Protestant Church (EPA), Lolodorf",
    "Native Baptist Church (NBC/EBC), Douala",
    "Presbyterian Church in Cameroon (PCC), Buea",
    "Union of Baptist Churches of Cameroon (UEBC), Douala",
    "Union of Evangelical Churches in Cameroon (UEEC), Maroua",
    "Full Gospel Mission of Cameroon"
  ];

  const objectives = [
    "Bear witness to the profound unity of Protestantism in Cameroon",
    "Develop and coordinate joint efforts in evangelism and Christian service",
    "Promote Christian life through common social and economic projects",
    "Coordinate joint Protestant events across Cameroon",
    "Represent Cameroonian Protestantism before public authorities",
    "Express the 'Voice of Protestants' on matters of public and ethical concern"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-purple-600 font-semibold text-sm uppercase tracking-wide mb-3">
            About Us
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Council of Protestant Churches of Cameroon
          </h2>
          <p className="text-2xl text-purple-600 font-semibold italic">
            "Being Church Together"
          </p>
        </div>

        {/* History Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="flex items-center mb-4">
              <BookOpen className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-3xl font-bold text-gray-900">Our History</h3>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                The Council of Protestant Churches of Cameroon (CEPCA) was established in 1969,
                emerging from the transformation of the Evangelical Federation of French Equatorial Africa.
              </p>
              <p>
                Originally founded as FEMEC (Federation of Evangelical Churches and Missions of Cameroon),
                our organization was born from the wave of independence movements and the desire of
                Churches and Evangelical Missions to create a unified body for coordinating educational,
                health, rural activities, and radio broadcasting.
              </p>
              <p>
                Under the leadership of our first General Secretary, Rev. Eugène MALLO, CEPCA has grown
                into a vital ecumenical organization representing the diversity and unity of Protestant
                Christianity in Cameroon.
              </p>
              <div className="bg-purple-50 rounded-lg p-6 mt-6">
                <p className="text-purple-900 italic">
                  "We acknowledge ourselves as integral parts of the Universal Church, the Body of Christ,
                  determined to fulfill the cherished wish of our Lord Jesus Christ: 'I pray that they may all be one.'"
                  <span className="block mt-2 text-sm font-semibold">— John 17:21</span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800&h=600&fit=crop&auto=format"
              alt="CEPCA History"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
          </div>
        </div>

        {/* Objectives Section */}
        <div className="mb-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 lg:p-12">
          <div className="flex items-center mb-8">
            <Globe className="w-8 h-8 text-green-600 mr-3" />
            <h3 className="text-3xl font-bold text-gray-900">Our Objectives</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objectives.map((objective, index) => (
              <div key={index} className="flex items-start">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <p className="text-gray-700 pt-1">{objective}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Member Churches Section */}
        <div className="mb-12">
          <div className="flex items-center mb-8">
            <Users className="w-8 h-8 text-purple-600 mr-3" />
            <h3 className="text-3xl font-bold text-gray-900">Our Member Churches</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memberChurches.map((church, index) => (
              <div
                key={index}
                className="bg-white border-2 border-purple-100 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all duration-300 flex items-start"
              >
                <ChevronRight className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{church}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-600 mt-6 text-center italic">
            Since 2009, CEPCA has been open to the admission of other Protestant Churches
          </p>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 rounded-2xl p-10 text-white">
          <h3 className="text-2xl font-bold mb-4">
            Want to Learn More About CEPCA?
          </h3>
          <p className="mb-6 text-purple-100">
            Discover our structure, departments, and how we serve the people of Cameroon
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/about"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
            >
              Read Full Story
            </Link>
            <Link
              href="/members"
              className="bg-purple-500 hover:bg-purple-400 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
            >
              View Member Churches
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCEPCASection;
