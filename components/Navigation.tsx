'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Cross, Heart, Calendar, Users, Phone, ChevronDown, ChevronUp } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10); // Small threshold to avoid flickering
    };

    setIsScrolled(window.scrollY > 10);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (itemName: string) => {
    setOpenDropdowns(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const menuItems = [
    { name: 'Home', href: '/' },
    { 
      name: 'About', 
      href: '#', 
      submenu: [
        { name: 'Our Story', href: '/about/story' },
        { name: 'Leadership', href: '/about/leadership' },
        { name: 'Beliefs', href: '/about/beliefs' },
        { name: 'Location', href: '/about/location' },
      ]
    },
    { 
      name: 'Sermons', 
      href: '#',
      submenu: [
        { name: 'Recent Sermons', href: '/sermons/recent' },
        { name: 'Sermon Series', href: '/sermons/series' },
        { name: 'Topics', href: '/sermons/topics' },
      ]
    },
    { 
      name: 'Activities', 
      href: '#',
      submenu: [
        { name: 'Charity', href: '/events/upcoming' },
        { name: 'Workshops/Tranings', href: '/events/calendar' },
      ]
    },
    { 
      name: 'News', 
      href: '#',
      submenu: [
        { name: "Future events", href: '/ministries/children' },
        { name: 'Announcements', href: '/ministries/youth' },
      ]
    },
    { name: 'Blogs', href: '/give' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Cross className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-serif font-bold transition-colors duration-300 ${
                isScrolled ? 'text-primary' : 'text-white drop-shadow-lg'
              }`}>PC Bastos</h1>
              <p className={`text-sm -mt-1 transition-colors duration-300 ${
                isScrolled ? 'text-muted-foreground' : 'text-white/90 drop-shadow'
              }`}>Church</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`font-medium transition-colors duration-200 flex items-center ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-primary' 
                      : 'text-white hover:text-white/80 drop-shadow'
                  }`}
                >
                  {item.name}
                </Link>
                {item.submenu && (
                  <div className="absolute left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-white/20">
                    <div className="py-2">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/give"
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                isScrolled
                  ? 'bg-accent hover:bg-accent/90 text-white'
                  : 'bg-accent hover:bg-accent/90 text-white backdrop-blur-sm border border-white/30'
              }`}
            >
              Donate
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`transition-colors duration-200 p-2 rounded-md ${
                isScrolled 
                  ? 'text-gray-700 hover:text-primary hover:bg-gray-100' 
                  : 'text-white hover:text-white/80 hover:bg-white/10 drop-shadow backdrop-blur-sm'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={`lg:hidden border-t transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md border-gray-200' 
            : 'bg-white/90 backdrop-blur-md border-white/20'
        }`}>
          <div className="px-4 py-4 space-y-2">
            {menuItems.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="flex items-center justify-between w-full text-gray-700 hover:text-primary font-medium py-2 hover:bg-primary/5 px-2 rounded"
                    >
                      <span>{item.name}</span>
                      {openDropdowns.includes(item.name) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {openDropdowns.includes(item.name) && (
                      <div className="pl-4 space-y-1 pb-2">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            className="block text-sm text-gray-600 hover:text-primary py-2 hover:bg-primary/5 px-2 rounded"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block text-gray-700 hover:text-primary font-medium py-2 hover:bg-primary/5 px-2 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/give"
              className="block bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium text-center mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Donate
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;