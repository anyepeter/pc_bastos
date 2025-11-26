'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Calendar, X } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchBlogPosts, invalidateCache } from '@/store/blogSlice';
import { getTranslatedText } from '@/lib/translations';
import LanguageSelector from './LanguageSelector';

export default function BlogListClient() {
  const dispatch = useAppDispatch();
  const { posts, loading, error, language } = useAppSelector((state) => state.blog);

  const [visibleBlogs, setVisibleBlogs] = useState<string[]>([]);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch posts on mount (will use cache if available)
  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  useEffect(() => {
    const headerTimer = setTimeout(() => {
      setHeaderVisible(true);
    }, 200);

    const blogsTimer = setTimeout(() => {
      setVisibleBlogs(posts.map(post => post.id));
    }, 600);

    return () => {
      clearTimeout(headerTimer);
      clearTimeout(blogsTimer);
    };
  }, [posts]);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  // Extract first 150 characters for excerpt
  const getExcerpt = (description: string) => {
    const text = description || '';
    return text.length > 150
      ? text.substring(0, 150) + '...'
      : text;
  };

  // Generate category from content (simple logic)
  const getCategoryFromContent = (description: string) => {
    const lower = (description || '').toLowerCase();
    if (lower.includes('faith') || lower.includes('trust') || lower.includes('believe') ||
        lower.includes('foi') || lower.includes('confiance') || lower.includes('croire')) return language === 'fr' ? 'Foi' : 'Faith';
    if (lower.includes('community') || lower.includes('fellowship') || lower.includes('together') ||
        lower.includes('communauté') || lower.includes('fraternité') || lower.includes('ensemble')) return language === 'fr' ? 'Communauté' : 'Community';
    if (lower.includes('hope') || lower.includes('encouragement') ||
        lower.includes('espoir') || lower.includes('encouragement')) return language === 'fr' ? 'Espoir' : 'Hope';
    if (lower.includes('service') || lower.includes('serve') || lower.includes('help') ||
        lower.includes('servir') || lower.includes('aider')) return language === 'fr' ? 'Service' : 'Service';
    return language === 'fr' ? 'Foi' : 'Faith';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Faith': 'bg-purple-100 text-purple-700',
      'Foi': 'bg-purple-100 text-purple-700',
      'Community': 'bg-green-100 text-green-700',
      'Communauté': 'bg-green-100 text-green-700',
      'Hope': 'bg-blue-100 text-blue-700',
      'Espoir': 'bg-blue-100 text-blue-700',
      'Service': 'bg-orange-100 text-orange-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-white relative overflow-hidden pt-12">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=600&fit=crop&auto=format")'
            }}
          />
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 pt-12 md:pt-20 pb-10 md:pb-16">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl font-bold font-playfair text-white mb-4 tracking-tight">Blogs</h1>
              <p className="text-lg text-white font-inter max-w-3xl mx-auto leading-relaxed">
                Inspiring stories and spiritual insights from our community
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-white relative overflow-hidden pt-12">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=600&fit=crop&auto=format")'
            }}
          />
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 pt-12 md:pt-20 pb-10 md:pb-16">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl font-bold font-playfair text-white mb-4 tracking-tight">Blogs</h1>
              <p className="text-lg text-white font-inter max-w-3xl mx-auto leading-relaxed">
                Inspiring stories and spiritual insights from our community
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => {
              dispatch(invalidateCache());
              dispatch(fetchBlogPosts());
            }}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-white relative overflow-hidden pt-12">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=600&fit=crop&auto=format")'
            }}
          />
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 pt-12 md:pt-20 pb-10 md:pb-16">
            <div className="text-center">
              <div className={`transform transition-all duration-700 ease-out ${
                headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <h1 className="text-4xl sm:text-6xl font-bold font-playfair text-white mb-4 tracking-tight">Blogs</h1>
                <p className="text-lg text-white font-inter max-w-3xl mx-auto leading-relaxed">
                  Inspiring stories and spiritual insights from our community
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-gray-600 text-lg">No blog posts available at the moment. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-white relative overflow-hidden pt-12">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=600&fit=crop&auto=format")'
          }}
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 pt-12 md:pt-20 pb-10 md:pb-16">
          <div className="text-center">
            <div className={`transform transition-all duration-700 ease-out ${
              headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="flex justify-center mb-4">
                <LanguageSelector />
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold font-playfair text-white mb-4 tracking-tight">
                {language === 'fr' ? 'Blogs' : 'Blogs'}
              </h1>
              <p className="text-lg text-white font-inter max-w-3xl mx-auto leading-relaxed">
                {language === 'fr'
                  ? 'Histoires inspirantes et réflexions spirituelles de notre communauté'
                  : 'Inspiring stories and spiritual insights from our community'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8">
          {posts.map((post, index) => {
            const translatedTitle = getTranslatedText(post.title, language);
            const translatedDescription = getTranslatedText(post.description, language);
            const category = getCategoryFromContent(translatedDescription);
            const fallbackImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format';

            return (
              <article
                key={post.id}
                className={`group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-500 transform ${
                  visibleBlogs.includes(post.id)
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="md:flex">
                  <div className="md:w-1/3 relative overflow-hidden">
                    <img
                      src={post.imageUrl || fallbackImage}
                      alt={translatedTitle}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                      onClick={() => setSelectedImage(post.imageUrl || fallbackImage)}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-poppins ${getCategoryColor(category)}`}>
                        {category}
                      </span>
                    </div>
                  </div>

                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                      <Calendar className="w-4 h-4" />
                      <span className="font-poppins">
                        {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-gray-900 mb-4 leading-tight group-hover:text-purple-700 transition-colors duration-300">
                      {translatedTitle}
                    </h2>

                    <p className="text-gray-700 text-base leading-relaxed font-inter mb-6">
                      {getExcerpt(translatedDescription)}
                    </p>

                    <Link
                      href={`/blogs/${post.slug}`}
                      className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold font-poppins transition-all duration-300 group/btn"
                    >
                      <span>{language === 'fr' ? 'Lire Plus' : 'Read More'}</span>
                      <ChevronDown className="w-4 h-4 transform transition-all duration-300 group-hover/btn:translate-x-1 rotate-[-90deg]" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Blog image"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
