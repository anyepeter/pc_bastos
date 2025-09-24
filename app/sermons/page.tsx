'use client';

import { useState, useEffect } from 'react';
import { Play, Volume2, X } from 'lucide-react';

const sermonsData = [
  {
    id: 1,
    title: 'Walking in Faith Through Trials',
    description: 'Discover how trials can strengthen our faith and draw us closer to God\'s purpose for our lives.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format'
  },
  {
    id: 2,
    title: 'The Power of Unity in Christ',
    description: 'Understanding how unity among believers reflects God\'s heart and strengthens the church community.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop&auto=format'
  },
  {
    id: 3,
    title: 'Hope in Times of Uncertainty',
    description: 'Finding peace and hope in God\'s promises when facing life\'s uncertainties and challenges.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&auto=format'
  },
  {
    id: 4,
    title: 'Serving with a Joyful Heart',
    description: 'Learning to serve others with joy and excellence as an expression of our love for Christ.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    thumbnail: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop&auto=format'
  },
  {
    id: 5,
    title: 'Grace and Forgiveness',
    description: 'Exploring the transformative power of God\'s grace and the freedom found in forgiveness.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format'
  },
  {
    id: 6,
    title: 'Living with Purpose',
    description: 'Discovering God\'s unique calling for your life and walking in divine purpose every day.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop&auto=format'
  }
];

export default function SermonsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setVisibleCards(sermonsData.map(sermon => sermon.id));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedVideo]);

  const handlePlayVideo = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  const handlePlayAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const closeVideoPopup = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-purple-100 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className={`text-center transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h1 className="text-4xl sm:text-6xl font-bold font-playfair mb-4 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              Sermons
            </h1>
            <p className="text-xl text-green-100 font-inter max-w-3xl mx-auto leading-relaxed">
              Inspiring messages from our spiritual leaders across member churches
            </p>
          </div>
        </div>
      </div>

      {/* Sermons Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sermonsData.map((sermon, index) => (
            <div
              key={sermon.id}
              className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-700 transform ${
                visibleCards.includes(sermon.id)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Video Thumbnail */}
              <div className="relative group">
                <img
                  src={sermon.thumbnail}
                  alt={sermon.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Play Buttons */}
                <div className="absolute inset-0 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handlePlayVideo(sermon.videoUrl)}
                    className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
                  >
                    <Play className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handlePlayAudio(sermon.audioUrl)}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold font-playfair bg-gradient-to-r from-green-700 to-purple-700 bg-clip-text text-transparent mb-3 leading-tight">
                  {sermon.title}
                </h3>
                <p className="text-gray-700 leading-relaxed font-inter">
                  {sermon.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Popup */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={closeVideoPopup}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full h-auto max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}