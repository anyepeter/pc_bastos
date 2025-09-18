import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

const EventsSection = () => {
  const events = [
    {
      id: 1,
      title: 'Community Food Drive',
      date: 'March 15, 2025',
      time: '10:00 AM - 2:00 PM',
      location: 'Church Parking Lot',
      description: 'Help us collect food items for local families in need. Volunteers welcome!',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Community Service'
    },
    {
      id: 2,
      title: 'Easter Celebration Service',
      date: 'April 6, 2025',
      time: '9:00 AM & 11:00 AM',
      location: 'Main Sanctuary',
      description: 'Join us for our special Easter worship service celebrating the resurrection of Jesus.',
      image: 'https://images.pexels.com/photos/8468017/pexels-photo-8468017.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Worship'
    },
    {
      id: 3,
      title: 'Youth Spring Retreat',
      date: 'April 12-14, 2025',
      time: 'Friday 6 PM - Sunday 2 PM',
      location: 'Camp Galilee',
      description: 'A weekend of fun, fellowship, and spiritual growth for teens ages 13-18.',
      image: 'https://images.pexels.com/photos/8468264/pexels-photo-8468264.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Youth Ministry'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-accent font-semibold text-sm uppercase tracking-wide mb-4">
            Upcoming Events
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">
            Join Us for <span className="text-primary">Special Events</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From worship services to community outreach, there's always something happening 
            at Grace Community Church. Come be part of our church family!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {event.category}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <button className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;