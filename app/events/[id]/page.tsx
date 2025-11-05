import { Calendar, Clock, MapPin } from 'lucide-react';
import BackButton from '@/components/BackButton';
import PageLayout from '@/components/PageLayout';

const eventsData = [
  {
    id: 1,
    title: 'Annual General Assembly 2025',
    date: '2025-03-15',
    time: '09:00 AM',
    description: 'Join us for our annual gathering where member churches will present their yearly reports and discuss future initiatives for the Protestant community in Cameroon. This comprehensive assembly will feature presentations from various departments, financial reports, and strategic planning sessions for the upcoming year. We will also be recognizing outstanding contributions from our member churches and discussing new outreach programs.Join us for our annual gathering where member churches will present their yearly reports and discuss future initiatives for the Protestant community in Cameroon. This comprehensive assembly will feature presentations from various departments, financial reports, and strategic planning sessions for the upcoming year. We will also be recognizing outstanding contributions from our member churches and discussing new outreach programs.Join us for our annual gathering where member churches will present their yearly reports and discuss future initiatives for the Protestant community in Cameroon. This comprehensive assembly will feature presentations from various departments, financial reports, and strategic planning sessions for the upcoming year. We will also be recognizing outstanding contributions from our member churches and discussing new outreach programs. ',
    location: 'Yaoundé',
    category: 'Assembly',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=400&fit=crop'
  },
  {
    id: 2,
    title: 'Youth Leadership Conference',
    date: '2025-02-08',
    time: '10:00 AM',
    description: 'Empowering the next generation of Christian leaders through workshops, mentorship sessions, and spiritual development programs. This three-day conference will feature renowned speakers, interactive workshops, and networking opportunities for young leaders across Cameroon.',
    location: 'Douala',
    category: 'Conference',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=400&fit=crop'
  }
];

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' }
  ];
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = eventsData.find(e => e.id === parseInt(params.id));

  if (!event) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <BackButton />
          </div>
        </div>
      </PageLayout>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <PageLayout>
      <div className=" pb-12 md:pb-16">
        {/* Hero Image
        <div className="relative h-96 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-6 left-6">
            <BackButton />
          </div>
        </div> */}

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mt-24 md:mt-32">
            {/* <div className="mb-6">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {event.category}
              </span>
            </div> */}

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 font-playfair">
              {event.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 sm:mb-12">
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-semibold text-gray-900">{event.time}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-900">{event.location}</p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* <div className="mt-8 pt-6 border-t border-gray-200">
              <button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md">
                Register for Event
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}