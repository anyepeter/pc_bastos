import { Play, Download, Share, Calendar } from 'lucide-react';

const SermonsSection = () => {
  const sermons = [
    {
      id: 1,
      title: 'Walking in Faith Through Life\'s Storms',
      speaker: 'Pastor Michael Johnson',
      date: 'February 25, 2025',
      series: 'Unshakeable Faith',
      duration: '42 min',
      description: 'Discover how to maintain your faith and trust in God even when life gets difficult.',
      image: 'https://images.pexels.com/photos/8468077/pexels-photo-8468077.jpeg?auto=compress&cs=tinysrgb&w=400',
      audioUrl: '#',
      videoUrl: '#'
    },
    {
      id: 2,
      title: 'The Power of Community in Christian Living',
      speaker: 'Pastor Sarah Davis',
      date: 'February 18, 2025',
      series: 'Better Together',
      duration: '38 min',
      description: 'Learn about the importance of Christian community and how we can support one another.',
      image: 'https://images.pexels.com/photos/8468048/pexels-photo-8468048.jpeg?auto=compress&cs=tinysrgb&w=400',
      audioUrl: '#',
      videoUrl: '#'
    },
    {
      id: 3,
      title: 'God\'s Grace: Sufficient for Every Season',
      speaker: 'Pastor Michael Johnson',
      date: 'February 11, 2025',
      series: 'Amazing Grace',
      duration: '45 min',
      description: 'Explore the depth and richness of God\'s grace in every aspect of our lives.',
      image: 'https://images.pexels.com/photos/8468025/pexels-photo-8468025.jpeg?auto=compress&cs=tinysrgb&w=400',
      audioUrl: '#',
      videoUrl: '#'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-accent font-semibold text-sm uppercase tracking-wide mb-4">
            Recent Messages
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">
            Latest <span className="text-primary">Sermons</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Listen to our recent messages and grow in your faith journey. 
            All sermons are available for streaming and download.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {sermons.map((sermon) => (
            <div key={sermon.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={sermon.image}
                  alt={sermon.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <button className="bg-white/90 hover:bg-white text-primary p-4 rounded-full shadow-lg transition-all duration-200">
                    <Play className="w-6 h-6" />
                  </button>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {sermon.duration}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-accent font-semibold text-sm mb-2">{sermon.series}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{sermon.title}</h3>
                <p className="text-gray-600 mb-4">{sermon.description}</p>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{sermon.date}</span>
                  <span>•</span>
                  <span>{sermon.speaker}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Listen</span>
                  </button>
                  <button className="p-2 border border-gray-300 hover:border-primary hover:text-primary rounded-lg transition-colors duration-200">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 border border-gray-300 hover:border-primary hover:text-primary rounded-lg transition-colors duration-200">
                    <Share className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
            View All Sermons
          </button>
        </div>
      </div>
    </section>
  );
};

export default SermonsSection;