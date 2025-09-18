'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Williams',
      role: 'Church Member',
      content: 'Grace Community Church has been a true blessing in my life. The warmth and love I feel here every Sunday fills my heart with joy. The community support during difficult times has been incredible.',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5
    },
    {
      id: 2,
      name: 'David Martinez',
      role: 'Small Group Leader',
      content: 'The biblical teaching here is outstanding. Pastor Michael has a gift for making scripture come alive and applicable to our daily lives. I\'ve grown so much in my faith since joining this church family.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5
    },
    {
      id: 3,
      name: 'Emily Chen',
      role: 'Youth Ministry Volunteer',
      content: 'What I love most about Grace Community is how everyone is welcomed with open arms. As a new member, I immediately felt like part of the family. The youth programs are amazing too!',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5
    },
    {
      id: 4,
      name: 'Robert Thompson',
      role: 'Deacon',
      content: 'The community outreach programs at Grace Community have given me purpose and joy in serving others. This church truly lives out the Gospel by caring for those in need.',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-primary text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full" />
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rounded-full" />
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-white rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="text-green-300 font-semibold text-sm uppercase tracking-wide mb-4">
            What Our Members Say
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
            Life-Changing <span className="text-yellow-300">Testimonies</span>
          </h2>
          <p className="text-lg text-green-100 max-w-3xl mx-auto">
            Hear from our church family about how God is working in their lives 
            and how our community has made a difference.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-300 fill-current" />
              ))}
            </div>
            
            <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
              "{testimonials[currentSlide].content}"
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4">
              <img
                src={testimonials[currentSlide].image}
                alt={testimonials[currentSlide].name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
              />
              <div className="text-left">
                <h4 className="font-bold text-lg">{testimonials[currentSlide].name}</h4>
                <p className="text-green-200">{testimonials[currentSlide].role}</p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentSlide === index ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;