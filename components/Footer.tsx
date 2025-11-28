'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-6 group">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/images/logo_CEPCA.png"
                  alt="CEPCA Logo"
                  width={32}
                  height={32}
                />
              </div>
              <div>
                <h3 className="text-2xl font-playfair font-bold tracking-tight">{t('common.cepca')}</h3>
                <p className="text-purple-200 text-sm font-poppins">{t('footer.tagline')}</p>
              </div>
            </div>
            <p className="text-purple-100 leading-relaxed font-inter">
              {t('footer.description')}
            </p>
            <div className="flex items-center space-x-2 text-purple-200">
              <Heart className="w-4 h-4 text-pink-300 animate-pulse" />
              <span className="text-sm font-poppins">{t('footer.servingSince')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-playfair font-semibold text-white">{t('footer.quickLinks')}</h4>
            <nav className="grid grid-cols-2 gap-3">
              <Link href="/members" className="group flex items-center space-x-2 text-purple-200 hover:text-white transition-all duration-300 font-poppins">
                <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                <span>{t('footer.members')}</span>
              </Link>
              <Link href="/blogs" className="group flex items-center space-x-2 text-purple-200 hover:text-white transition-all duration-300 font-poppins">
                <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                <span>{t('navbar.blogs')}</span>
              </Link>
              <Link href="/contact" className="group flex items-center space-x-2 text-purple-200 hover:text-white transition-all duration-300 font-poppins">
                <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                <span>{t('footer.contact')}</span>
              </Link>
              <Link href="/about" className="group flex items-center space-x-2 text-purple-200 hover:text-white transition-all duration-300 font-poppins">
                <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:w-2 transition-all duration-300"></span>
                <span>{t('footer.about')}</span>
              </Link>
            </nav>
          </div>

          {/* Contact & Social */}
          <div className="space-y-6">
            <h4 className="text-xl font-playfair font-semibold text-white">{t('footer.getInTouch')}</h4>
            <div className="space-y-4">
              <a href="https://wa.me/237242657608" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300">
                  <Phone className="w-4 h-4 text-green-300" />
                </div>
                <span className="text-purple-100 font-poppins group-hover:text-white">+237 242 657 608</span>
              </a>
              <a href="mailto:generalsecretarycepca@gmail.com" className="flex items-center space-x-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-blue-300" />
                </div>
                <span className="text-purple-100 font-poppins group-hover:text-white">generalsecretarycepca@gmail.com</span>
              </a>
              <a href="https://www.google.com/maps/search/Presbyterian+Church+Bastos+Yaound%C3%A9+Cameroon" target="_blank" rel="noopener noreferrer" className="flex items-start space-x-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-300">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors duration-300">
                  <MapPin className="w-4 h-4 text-purple-300" />
                </div>
                <span className="text-purple-100 font-poppins leading-relaxed group-hover:text-white">Yaoundé, P.O. Box 491 Rue Ceper, Elig-Essono</span>
              </a>
            </div>
            
            {/* Social Media */}
            <div className="space-y-3">
              <p className="text-purple-200 font-poppins text-sm">{t('footer.followUs')}</p>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 group">
                  <Facebook className="w-5 h-5 text-purple-200 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 group">
                  <Instagram className="w-5 h-5 text-purple-200 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 group">
                  <Twitter className="w-5 h-5 text-purple-200 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-purple-200 text-sm font-poppins">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;