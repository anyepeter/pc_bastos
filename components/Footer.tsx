import Link from 'next/link';
import { Cross, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Cross className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold">Grace Community</h3>
                <p className="text-sm text-green-200">Church</p>
              </div>
            </div>
            <p className="text-green-100 text-sm">
              A place where faith grows, community thrives, and lives are transformed. 
              Join us as we walk together in God's love.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-green-100">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/sermons" className="hover:text-white transition-colors">Sermons</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
              <li><Link href="/ministries" className="hover:text-white transition-colors">Ministries</Link></li>
              <li><Link href="/give" className="hover:text-white transition-colors">Give</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Service Times</h4>
            <div className="space-y-2 text-green-100">
              <div>
                <p className="font-medium">Sunday Worship</p>
                <p className="text-sm">9:00 AM & 11:00 AM</p>
              </div>
              <div>
                <p className="font-medium">Wednesday Prayer</p>
                <p className="text-sm">7:00 PM</p>
              </div>
              <div>
                <p className="font-medium">Youth Service</p>
                <p className="text-sm">Friday 6:30 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-green-100">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 text-green-200" />
                <p className="text-sm">
                  123 Faith Street<br />
                  Springfield, IL 62701
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-200" />
                <p className="text-sm">(555) 123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-200" />
                <p className="text-sm">hello@gracecommunitychurch.org</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-green-200 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-200 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-200 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-200 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-12 pt-8 text-center text-green-200 text-sm">
          <p>&copy; 2025 Grace Community Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;