'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Calendar, User, BookOpen, Clock } from 'lucide-react';

const blogsData = [
  {
    id: 1,
    title: "Walking in Faith: A Journey of Trust",
    date: "December 15, 2024",
    readTime: "5 min read",
    category: "Faith",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format",
    excerpt: "Faith is not just a belief system, but a way of life that transforms how we see the world around us...",
    content: "Faith is not just a belief system, but a way of life that transforms how we see the world around us. When we walk in faith, we learn to trust God's plan even when we cannot see the full picture. This journey requires courage, patience, and an unwavering belief that God's love guides us through every season of life. In our daily walk, we encounter challenges that test our faith, but these moments become opportunities for spiritual growth and deeper connection with our Creator."
  },
  {
    id: 2,
    title: "The Power of Community in Christian Life",
    date: "December 10, 2024",
    readTime: "4 min read",
    category: "Community",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop&auto=format",
    excerpt: "Christian community is more than just gathering together; it's about building meaningful relationships...",
    content: "Christian community is more than just gathering together; it's about building meaningful relationships that reflect God's love. When believers come together, they create a support system that strengthens individual faith and collective witness. Through fellowship, prayer, and shared experiences, we learn to bear one another's burdens and celebrate each other's victories. This sense of belonging helps us grow spiritually and serves as a powerful testimony to the world about God's transformative love."
  },
  {
    id: 3,
    title: "Finding Hope in Difficult Times",
    date: "December 5, 2024",
    readTime: "6 min read",
    category: "Hope",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&auto=format",
    excerpt: "Life's challenges can feel overwhelming, but our faith provides an anchor of hope...",
    content: "Life's challenges can feel overwhelming, but our faith provides an anchor of hope that keeps us steady in the storm. When we face difficulties, it's natural to question and struggle, but these moments often become the catalyst for deeper spiritual understanding. Hope is not passive waiting, but active trust in God's goodness and sovereignty. Through prayer, scripture, and community support, we discover that even in our darkest hours, God's light continues to shine, offering comfort, strength, and the promise of better days ahead."
  },
  {
    id: 4,
    title: "The Joy of Serving Others",
    date: "November 28, 2024",
    readTime: "3 min read",
    category: "Service",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&auto=format",
    excerpt: "Service to others is at the heart of Christian living, reflecting Christ's love in action...",
    content: "Service to others is at the heart of Christian living, reflecting Christ's love in action. When we serve, we discover that giving of ourselves brings unexpected joy and fulfillment. Whether it's helping a neighbor, volunteering at church, or supporting community initiatives, acts of service connect us to God's heart for humanity. Through serving others, we learn humility, compassion, and the true meaning of love. Each act of kindness, no matter how small, has the potential to transform lives and demonstrate the reality of God's kingdom on earth."
  }
];

export default function BlogsPage() {
  const [expandedBlogs, setExpandedBlogs] = useState<number[]>([]);
  const [visibleBlogs, setVisibleBlogs] = useState<number[]>([]);
  const [headerVisible, setHeaderVisible] = useState(false);

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

  const toggleBlog = (id: number) => {
    setExpandedBlogs(prev => 
      prev.includes(id) 
        ? prev.filter(blogId => blogId !== id)
        : [...prev, id]
    );
  };

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
      <div className="bg-purple-500 border-b border-gray-200 pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className={`transform transition-all duration-700 ease-out ${
              headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <h1 className="text-3xl sm:text-4xl font-bold font-playfair text-gray-900 mb-2 tracking-tight">Blogs</h1>
              <p className="text-lg text-gray-600 font-inter max-w-3xl mx-auto leading-relaxed">
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
                    className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-poppins ${getCategoryColor(blog.category)}`}>
                      {blog.category}
                    </span>
                  </div>
                </div>
                
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-poppins">{blog.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-poppins">{blog.readTime}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-gray-900 mb-4 leading-tight group-hover:text-purple-700 transition-colors duration-300">
                    {blog.title}
                  </h2>
                  
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    expandedBlogs.includes(blog.id) ? 'max-h-96' : 'max-h-20'
                  }`}>
                    <p className="text-gray-700 text-base leading-relaxed font-inter">
                      {expandedBlogs.includes(blog.id) ? blog.content : blog.excerpt}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => toggleBlog(blog.id)}
                    className="inline-flex items-center space-x-2 mt-6 text-purple-600 hover:text-purple-700 font-semibold font-poppins transition-all duration-300 group/btn"
                  >
                    <span>{expandedBlogs.includes(blog.id) ? 'Read Less' : 'Read More'}</span>
                    <ChevronDown className={`w-4 h-4 transform transition-all duration-300 group-hover/btn:translate-x-1 ${
                      expandedBlogs.includes(blog.id) ? 'rotate-180' : ''
                    }`} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}