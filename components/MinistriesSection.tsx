import { Heart, Users, BookOpen, Music, Handshake, GraduationCap } from 'lucide-react';

const MinistriesSection = () => {
  const ministries = [
    {
      id: 1,
      name: "Children's Ministry",
      description: 'Nurturing young hearts with age-appropriate biblical teaching and fun activities.',
      icon: Heart,
      ageGroup: 'Ages 0-12',
      image: 'https://images.pexels.com/photos/8468098/pexels-photo-8468098.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Youth Ministry',
      description: 'Empowering teenagers to grow in faith through fellowship, service, and discipleship.',
      icon: Users,
      ageGroup: 'Ages 13-18',
      image: 'https://images.pexels.com/photos/8468264/pexels-photo-8468264.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Adult Bible Study',
      description: 'Deep dive into Scripture with fellow believers in small group settings.',
      icon: BookOpen,
      ageGroup: 'Ages 18+',
      image: 'https://images.pexels.com/photos/8468059/pexels-photo-8468059.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 4,
      name: 'Worship Ministry',
      description: 'Leading the congregation in heartfelt worship through music and song.',
      icon: Music,
      ageGroup: 'All Ages',
      image: 'https://images.pexels.com/photos/8468040/pexels-photo-8468040.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 5,
      name: 'Senior Ministry',
      description: 'Building community and providing care for our senior church members.',
      icon: GraduationCap,
      ageGroup: 'Ages 55+',
      image: 'https://images.pexels.com/photos/8468066/pexels-photo-8468066.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 6,
      name: 'Community Outreach',
      description: 'Serving our local community through various volunteer and service projects.',
      icon: Handshake,
      ageGroup: 'All Ages',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-accent font-semibold text-sm uppercase tracking-wide mb-4">
            Get Connected
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">
            Find Your Place in <span className="text-primary">Ministry</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover meaningful ways to grow in faith, serve others, and build lasting relationships 
            through our various ministry opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ministries.map((ministry) => {
            const IconComponent = ministry.icon;
            return (
              <div key={ministry.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={ministry.image}
                    alt={ministry.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300" />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {ministry.ageGroup}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{ministry.name}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{ministry.description}</p>
                  
                  <button className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                    Learn More
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-xl p-8 shadow-lg inline-block">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Involved?
            </h3>
            <p className="text-gray-600 mb-6">
              We'd love to help you find the perfect ministry fit for your gifts and interests.
            </p>
            <button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
              Connect with Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MinistriesSection;