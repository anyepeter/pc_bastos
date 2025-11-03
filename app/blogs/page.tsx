'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Calendar, User, BookOpen, X } from 'lucide-react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import BackButton from '@/components/BackButton';
import HomeButton from '@/components/homeButton';

const blogsData = [
  {
    id: 1,
    title: "Walking in Faith: A Journey of Trust",
    date: "December 15, 2024",
    category: "Faith",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format",
    excerpt: "Faith is not just a belief system, but a way of life that transforms how we see the world around us..."
  },
  {
    id: 2,
    title: "The Power of Community in Christian Life",
    date: "December 10, 2024",
    category: "Community",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop&auto=format",
    excerpt: "Christian community is more than just gathering together; it's about building meaningful relationships..."
  },
  {
    id: 3,
    title: "Finding Hope in Difficult Times",
    date: "December 5, 2024",
    category: "Hope",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&auto=format",
    excerpt: "Life's challenges can feel overwhelming, but our faith provides an anchor of hope..."
  },
  {
    id: 4,
    title: "The Joy of Serving Others",
    date: "November 28, 2024",
    category: "Service",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&auto=format",
    excerpt: "Service to others is at the heart of Christian living, reflecting Christ's love in action..."
  }
];

export default function BlogsPage() {
  const [visibleBlogs, setVisibleBlogs] = useState<number[]>([]);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const headerTimer = setTimeout(() => {
      setHeaderVisible(true);
    }, 200);
    
    const blogsTimer = setTimeout(() => {
      setVisibleBlogs(blogsData.map(blog => blog.id));
    }, 600);
    
    return () => {
      clearTimeout(headerTimer);
      clearTimeout(blogsTimer);
    };
  }, []);

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
    <PageLayout>
      <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-purple-600 text-white relative overflow-hidden pt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <HomeButton />
          <div className="text-center">
            <div className={`transform transition-all duration-700 ease-out ${
              headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <h1 className="text-4xl sm:text-6xl font-bold  font-playfair  text-white text-gray-900 mb-4 tracking-tight">Blogs</h1>
              <p className="text-lg text-white text-gray-600 font-inter max-w-3xl mx-auto leading-relaxed">
                Inspiring stories and spiritual insights from our community
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8">
          {blogsData.map((blog, index) => (
            <article 
              key={blog.id} 
              className={`group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-500 transform ${
                visibleBlogs.includes(blog.id) 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="md:flex">
                <div className="md:w-1/3 relative overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.title}
                    className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                    onClick={() => setSelectedImage(blog.image)}
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-poppins ${getCategoryColor(blog.category)}`}>
                      {blog.category}
                    </span>
                  </div>
                </div>
                
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="font-poppins">{blog.date}</span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-gray-900 mb-4 leading-tight group-hover:text-purple-700 transition-colors duration-300">
                    {blog.title}
                  </h2>
                  
                  <p className="text-gray-700 text-base leading-relaxed font-inter mb-6">
                    {blog.excerpt}
                  </p>
                  
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold font-poppins transition-all duration-300 group/btn"
                  >
                    <span>Read More</span>
                    <ChevronDown className="w-4 h-4 transform transition-all duration-300 group-hover/btn:translate-x-1 rotate-[-90deg]" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
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
    </PageLayout>
  );
}