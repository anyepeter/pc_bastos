import { Clock, MapPin, Coffee, Users } from 'lucide-react';

const ServiceTimesSection = () => {
  const services = [
    {
      name: 'Sunday Morning Worship',
      time: '9:00 AM',
      description: 'Traditional service with hymns and organ music',
      icon: Clock,
      features: ['Nursery Available', 'Coffee Fellowship']
    },
    {
      name: 'Sunday Morning Worship',
      time: '11:00 AM', 
      description: 'Contemporary service with modern worship',
      icon: Clock,
      features: ["Children's Church", 'Live Streaming']
    },
    {
      name: 'Wednesday Prayer Meeting',
      time: '7:00 PM',
      description: 'Midweek prayer and bible study',
      icon: Users,
      features: ['All Ages Welcome', 'Light Refreshments']
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-accent font-semibold text-sm uppercase tracking-wide mb-4">
            Join Us for Worship
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">
            Service Times & <span className="text-primary">What to Expect</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Whether you're new to faith or have been walking with God for years, 
            we have a service that will meet you where you are.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <div className="text-3xl font-bold text-primary mb-3">{service.time}</div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="text-sm text-primary bg-primary/5 rounded-full px-3 py-1 inline-block mr-2">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* What to Expect Section */}
        <div className="bg-primary rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6">
                First Time Visiting?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-green-300 mt-1" />
                  <div>
                    <h4 className="font-semibold">Easy to Find</h4>
                    <p className="text-green-100">Free parking available with clear signage and friendly greeters.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Coffee className="w-6 h-6 text-green-300 mt-1" />
                  <div>
                    <h4 className="font-semibold">Come as You Are</h4>
                    <p className="text-green-100">Casual dress is welcome. Coffee and pastries available before each service.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-6 h-6 text-green-300 mt-1" />
                  <div>
                    <h4 className="font-semibold">Warm Welcome</h4>
                    <p className="text-green-100">Our hospitality team will help you feel at home and answer any questions.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center lg:text-right">
              <img
                src="https://images.pexels.com/photos/8468063/pexels-photo-8468063.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Church welcome"
                className="rounded-xl w-full max-w-md mx-auto lg:mx-0"
              />
              <button className="mt-6 bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                Plan Your Visit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceTimesSection;