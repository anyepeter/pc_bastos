'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string;
  content: string;
}

interface BlogDetailClientProps {
  blog: Blog;
}

export default function BlogDetailClient({ blog }: BlogDetailClientProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Faith': 'bg-purple-100 text-purple-700',
      'Community': 'bg-green-100 text-green-700',
      'Hope': 'bg-blue-100 text-blue-700',
      'Service': 'bg-orange-100 text-orange-700'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-24 md:pt-28 pb-2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <BackButton /> */}
          <div className={`transform transition-all pt-2 duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {/* <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${getCategoryColor(blog.category)}`}>
              {blog.category}
            </span> */}
            <h1 className="text-4xl sm:text-5xl font-bold font-playfair mb-4 leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="font-poppins">{blog.date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <article className={`transform transition-all duration-700 ease-out delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className=" overflow-hidden">
            <img 
              src={blog.image} 
              alt={blog.title}
              className="w-full object-cover shadow-md"
            />
            <div className="pt-8 sm:pt-10">
              <div className="prose prose-lg max-w-none">
                {blog.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed font-inter mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}