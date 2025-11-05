'use client';

import { useState, useEffect } from 'react';
import { Play, Download, Calendar, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import AudioPlayer from './AudioPlayer';


const SermonsSection = () => {
  const [activePlayerId, setActivePlayerId] = useState<number | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const sermons = [
    {
      id: 1,
      title: 'Walking in Faith Through Life\'s Storms',
      address: 'Simbock Yaounde',
      date: 'February 25, 2025',
      duration: '42 min',
      description: 'Discover how to maintain your faith and trust in God even when life gets difficult.',
      image: 'https://images.pexels.com/photos/8468077/pexels-photo-8468077.jpeg?auto=compress&cs=tinysrgb&w=400',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      id: 2,
      title: 'The Power of Community in Christian Living',
      address: 'Simbock Yaounde',
      date: 'February 18, 2025',
      duration: '38 min',
      description: 'Learn about the importance of Christian community and how we can support',
      image: 'https://images.pexels.com/photos/8468048/pexels-photo-8468048.jpeg?auto=compress&cs=tinysrgb&w=400',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    {
      id: 3,
      title: 'God\'s Grace: Sufficient for Every Season',
      address: 'Simbock Yaounde',
      date: 'February 11, 2025',
      duration: '45 min',
      description: 'Explore the depth and richness of God\'s grace in every aspect of our lives.',
      image: 'https://images.pexels.com/photos/8468025/pexels-photo-8468025.jpeg?auto=compress&cs=tinysrgb&w=400',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    }
  ];

  const handleListenClick = (sermonId: number) => {
    setLoadingAudio(sermonId);
    setTimeout(() => {
      setLoadingAudio(null);
      setActivePlayerId(sermonId);
    }, 1500);
  };

  const handlePlayVideo = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  const closeVideoPopup = () => {
    setSelectedVideo(null);
  };

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

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">
            Latest <span className="text-primary">Sermons</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Listen to our recent messages and grow in your faith journey. 
            All sermons are available for streaming and download.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {sermons.map((sermon) => (
            <div key={sermon.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-700 transform group">
              <div className="relative">
                <img
                  src={sermon.image}
                  alt={sermon.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {sermon.duration}
                  </span>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handlePlayVideo(sermon.videoUrl)}
                    className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-300"
                  >
                    <Play className="w-6 h-6 text-purple-600 ml-1" fill="currentColor" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                  {sermon.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {sermon.description}
                </p>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{sermon.date}</span>
                  <span className="text-gray-400">•</span>
                  <span>{sermon.address}</span>
                </div>
                
                <div className="flex space-x-2">
                  {
                    activePlayerId === sermon.id ? (
                      <div className="w-full">
                        <AudioPlayer src={sermon.audioUrl} />
                      </div>
                    ) : loadingAudio === sermon.id ? (
                      <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleListenClick(sermon.id)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
                      >
                        <Play className="w-4 h-4" fill="currentColor" />
                        <span>Listen</span>
                      </button>
                    )
                  }
                  <button className="p-2 border border-gray-300 hover:border-purple-300 rounded-lg transition-colors duration-300">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/sermons" className="inline-block bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
            View All Sermons
          </Link>
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
    </section>
  );
};

export default SermonsSection;