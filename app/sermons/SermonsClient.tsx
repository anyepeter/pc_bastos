'use client';

import { useState, useEffect } from 'react';
import { Calendar, Download, Mic, Play, X } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';

export interface PublicSermon {
  id: string;
  title: unknown;
  description: unknown;
  location: unknown;
  date: string;
  duration: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
  thumbnail: string | null;
}

const FALLBACK_THUMBNAIL =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format';

export default function SermonsClient({ sermons }: { sermons: PublicSermon[] }) {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
  const language = useAppSelector((state) => state.blog.language);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setVisibleCards(sermons.map((sermon) => sermon.id));
    }, 500);
    return () => clearTimeout(timer);
  }, [sermons]);

  useEffect(() => {
    document.body.style.overflow = selectedVideo ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedVideo]);

  const handleListenClick = (sermonId: string) => {
    setLoadingAudio(sermonId);
    setTimeout(() => {
      setLoadingAudio(null);
      setActivePlayerId(sermonId);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-purple-100">
      {/* Header */}
      <div className="text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1920&h=600&fit=crop&auto=format")',
          }}
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-10 md:pb-16">
          <div
            className={`text-center transform transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <h1 className="text-4xl sm:text-6xl font-bold font-playfair mb-4 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              {language === 'fr' ? 'Prédications' : 'Sermons'}
            </h1>
            <p className="text-xl text-green-100 font-inter max-w-3xl mx-auto leading-relaxed">
              {language === 'fr'
                ? 'Des messages inspirants de nos responsables spirituels dans les Églises membres'
                : 'Inspiring messages from our spiritual leaders across member churches'}
            </p>
          </div>
        </div>
      </div>

      {/* Sermons Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {sermons.length === 0 ? (
          <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
            <Mic className="mx-auto h-12 w-12 text-purple-300" />
            <p className="mt-4 text-lg text-gray-700">
              {language === 'fr'
                ? 'Aucune prédication publiée pour le moment.'
                : 'No sermons have been published yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sermons.map((sermon, index) => {
              const title = getTranslatedText(sermon.title as any, language);
              const description = getTranslatedText(sermon.description as any, language);
              const location = getTranslatedText(sermon.location as any, language);

              return (
                <div
                  key={sermon.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-700 transform group ${
                    visibleCards.includes(sermon.id)
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Thumbnail */}
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sermon.thumbnail || FALLBACK_THUMBNAIL}
                      alt={title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                    {sermon.duration && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                          {sermon.duration}
                        </span>
                      </div>
                    )}

                    {sermon.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => setSelectedVideo(sermon.videoUrl)}
                          aria-label={language === 'fr' ? 'Lire la vidéo' : 'Play video'}
                          className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-300"
                        >
                          <Play className="w-6 h-6 text-purple-600 ml-1" fill="currentColor" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                      {title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {description}
                    </p>

                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>{formatLongDate(sermon.date, language)}</span>
                      <span className="text-gray-400">•</span>
                      <span>{location}</span>
                    </div>

                    {sermon.audioUrl && (
                      <div className="flex space-x-2">
                        {activePlayerId === sermon.id ? (
                          <div className="w-full">
                            <AudioPlayer src={sermon.audioUrl} />
                          </div>
                        ) : (
                          <button
                            onClick={() => handleListenClick(sermon.id)}
                            disabled={loadingAudio === sermon.id}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-70"
                          >
                            <Play className="w-4 h-4" fill="currentColor" />
                            <span>
                              {loadingAudio === sermon.id
                                ? language === 'fr'
                                  ? 'Chargement...'
                                  : 'Loading...'
                                : language === 'fr'
                                ? 'Écouter'
                                : 'Listen'}
                            </span>
                          </button>
                        )}
                        <a
                          href={sermon.audioUrl}
                          download
                          aria-label={language === 'fr' ? 'Télécharger' : 'Download'}
                          className="p-2 border border-gray-300 hover:border-purple-300 rounded-lg transition-colors duration-300"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Popup */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedVideo(null)}
              aria-label={language === 'fr' ? 'Fermer' : 'Close'}
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
