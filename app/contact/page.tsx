'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Heart, MessageCircle } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    requestType: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      requestType: 'general'
    });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePrayerRequest = () => {
    setFormData({
      ...formData,
      requestType: 'prayer',
      subject: 'Prayer Request'
    });
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton />
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Get in <span className="text-yellow-300">Touch</span>
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              We'd love to hear from you! Whether you're planning your first visit, 
              need prayer, or want to learn more about our church family.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
                We're Here for You
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our team is ready to answer your questions, pray with you, 
                or help you take your next step in faith. Don't hesitate to reach out!
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 opacity-0 translate-y-8 animate-[fadeInUp_1.2s_ease-out_0.2s_forwards] group">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/15 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">Visit Us</h3>
                    <p className="text-gray-600 mb-2">
                      Presbyterian Church<br />
                      Bastos, Yaoundé, Cameroon
                    </p>
                    <a href="https://www.google.com/maps/search/Presbyterian+Church+Bastos+Yaound%C3%A9+Cameroon" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-medium transition-colors duration-300">
                      Get Directions →
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 opacity-0 translate-y-8 animate-[fadeInUp_1.2s_ease-out_0.4s_forwards] group">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/15 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">Call Us</h3>
                    <a href="https://wa.me/237242657608" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-medium mb-2 block transition-colors duration-300">+237 242 657 608</a>
                    <p className="text-sm text-gray-500">
                      Monday - Friday: 9:00 AM - 5:00 PM<br />
                      Emergency: Available 24/7
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 opacity-0 translate-y-8 animate-[fadeInUp_1.2s_ease-out_0.6s_forwards] group">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/15 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">Email Us</h3>
                    <a href="mailto:generalsecretarycepca@gmail.com" className="text-primary hover:text-primary/80 font-medium mb-2 block transition-colors duration-300">generalsecretarycepca@gmail.com</a>
                    <p className="text-sm text-gray-500">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 opacity-0 translate-y-8 animate-[fadeInUp_1.2s_ease-out_0.8s_forwards] group">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary/15 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">Contact on WhatsApp</h3>
                    <a href="https://wa.me/237677875300" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-medium block mb-1 transition-colors duration-300">+237 677 875 300</a>
                    <a href="https://wa.me/237656779874" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-medium block mb-2 transition-colors duration-300">+237 656 779 874</a>
                    <p className="text-sm text-gray-500">
                      Quick responses via WhatsApp
                    </p>
                  </div>
                </div>
              </div>


            </div>
          </div>

          {/* Contact Form */}
          <div id="contact-form" className="bg-white rounded-2xl shadow-xl hover:shadow-2xl p-8 opacity-0 translate-y-8 animate-[fadeInUp_1.2s_ease-out_0.3s_forwards] transition-all duration-500 ease-out">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                Send Us a Message
              </h2>
              <p className="text-gray-600">
                We'd love to hear from you. Fill out the form below and we'll be in touch!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 mb-1">
                    Request Type
                  </label>
                  <select
                    id="requestType"
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="visit">Planning a Visit</option>
                    <option value="prayer">Prayer Request</option>
                    <option value="ministry">Ministry Information</option>
                    <option value="pastoral">Pastoral Care</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="What would you like to discuss?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Prayer Request Section */}
        <div className="mt-20 bg-accent rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Need Prayer?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Our prayer team is committed to lifting up your needs before God. 
            No request is too big or too small - we're here to pray with you.
          </p>
          <button 
            onClick={handlePrayerRequest}
            className="bg-white text-accent hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Submit Prayer Request
          </button>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Find Us
            </h2>
            <p className="text-lg text-gray-600 mb-8">
We're located in Bastos, Yaoundé, serving the Presbyterian community with faith and fellowship.
            </p>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.8947!2d11.5021!3d3.8480!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf1a1a1a1a1a%3A0x1a1a1a1a1a1a1a1a!2sPresbyterian%20Church%2C%20Bastos%2C%20Yaound%C3%A9%2C%20Cameroon!5e0!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.google.com/maps/dir//Presbyterian+Church,+Bastos,+Yaoundé,+Cameroon"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              >
                Get Directions
              </a>
              <a
                href="https://www.google.com/maps/place/Presbyterian+Church,+Bastos,+Yaoundé,+Cameroon"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              >
                View on Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}