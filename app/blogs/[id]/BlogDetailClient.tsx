'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface BlogDetailClientProps {}

export default function BlogDetailClient({}: BlogDetailClientProps) {
  const [isVisible, setIsVisible] = useState(false);
  const currentPost = useAppSelector((state) => state.blog.currentPost);
  const language = useAppSelector((state) => state.blog.language);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Blog post not found.</p>
        </div>
      </div>
    );
  }

  const translatedTitle = getTranslatedText(currentPost.title, language);
  const translatedDescription = getTranslatedText(currentPost.description, language);
  const formattedDate = format(new Date(currentPost.createdAt), 'MMMM d, yyyy');

  const fallbackImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-24 md:pt-28 pb-2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transform transition-all pt-2 duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h1 className="text-4xl sm:text-5xl font-bold font-playfair mb-4 leading-tight">
              {translatedTitle}
            </h1>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="font-poppins">{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <article className={`transform transition-all duration-700 ease-out delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="overflow-hidden">
            <img
              src={currentPost.imageUrl || fallbackImage}
              alt={translatedTitle}
              className="w-full object-cover shadow-md"
            />
            <div className="pt-8 sm:pt-10">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{translatedDescription}</ReactMarkdown>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}