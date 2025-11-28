'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Heart, Calendar, Users, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navigation = ({scroll = false}: {scroll?: boolean}) => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(scroll);

  useEffect(() => {
    const handleScroll = () => {
      if (!scroll){
        setIsScrolled(window.scrollY > 10);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scroll]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleDropdown = (itemName: string) => {
    setOpenDropdowns(prev =>
      prev.includes(itemName) ? [] : [itemName]
    );
  };

  const closeMenu = () => setIsMenuOpen(false);

  const getNavbarStyles = () => {
    const isActive = isScrolled || isMenuOpen;
    return `fixed w-full top-0 z-50 transition-all duration-300 ${
      isActive ? 'bg-white shadow-lg' : 'bg-transparent'
    }`;
  };

  const getLogoTextStyles = () => {
    const isActive = isScrolled || isMenuOpen;
    return `text-xl sm:text-2xl font-playfair font-bold transition-colors duration-300 tracking-tight ${
      isActive ? 'text-purple-600' : 'text-white drop-shadow-lg'
    }`;
  };

  const getDesktopLinkStyles = () => {
    return `font-medium font-poppins transition-colors duration-200 flex items-center tracking-wide ${
      isScrolled
        ? 'text-gray-700 hover:text-purple-600'
        : 'text-white hover:text-white/80 drop-shadow'
    }`;
  };

  const getDonateButtonStyles = () => {
    return `px-4 py-2 sm:px-6 rounded-full font-semibold font-poppins transition-all duration-200 text-sm sm:text-base tracking-wide ${
      isScrolled
        ? 'bg-green-600 hover:bg-green-700 text-white'
        : 'bg-green-600 hover:bg-green-700 text-white backdrop-blur-sm border border-white/30'
    }`;
  };

  const getMobileMenuButtonStyles = () => {
    const isActive = isScrolled || isMenuOpen;
    return `transition-colors duration-200 p-3 rounded-md touch-manipulation ${
      isActive
        ? 'text-gray-700 hover:text-purple-600 hover:bg-purple-50 active:bg-purple-100'
        : 'text-white hover:text-white/80 hover:bg-white/10 active:bg-white/20 drop-shadow backdrop-blur-sm'
    }`;
  };

  const mobileMenuItemStyles = "block text-gray-700 hover:text-purple-600 active:text-purple-700 font-medium py-3 hover:bg-purple-50 active:bg-purple-100 px-3 rounded-lg touch-manipulation";
  const mobileSubMenuItemStyles = "block text-sm text-gray-600 hover:text-purple-600 active:text-purple-700 py-3 hover:bg-purple-50 active:bg-purple-100 px-3 rounded-lg touch-manipulation";

  const menuItems = [
    {
      name: t('navbar.aboutUs'), href: '/about',
      submenu: [
        { name: t('navbar.ourMissionVision'), href: '/about/mission-vision' },
        { name: t('navbar.leadership'), href: '/about/departments' },
        { name: t('navbar.ourHistory'), href: '/about/history' },
        { name: t('navbar.cepcaStructures'), href: '/about/structure' },
      ]
    },
    {
      name: t('navbar.members'), href: '#',
      submenu: [
        { name: 'Eglise Anglicane (EA)', href: '/members/ea' },
        { name: 'Cameroon Baptist Convention (CBC)', href: '/members/cbc' },
        { name: 'Eglise Evangélique du Cameroun (EEC)', href: '/members/eec' },
        { name: 'Eglise Evangélique Luthérienne du Cameroun (EELC)', href: '/members/eelc' },
        { name: 'Eglise Fraternelle Luthérienne du Cameroun (EFLC)', href: '/members/eflc' },
        { name: 'Eglise Presbytérienne Camerounaise (E P C)', href: '/members/epc' },
        { name: 'Eglise Protestante Africaine (EPA)', href: '/members/epa' },
        { name: 'Native Baptist Church (NBC)', href: '/members/nbc' },
        { name: 'Presbyterian Church in Cameroon (PCC)', href: '/members/pcc' },
        { name: 'Union des Eglises Baptistes du Cameroun (UEBC)', href: '/members/uebc' },
        { name: 'Union des Eglises Evangéliques du Cameroun (UEEC)', href: '/members/ueec' },
        { name: 'FULL GOSPEL Mission (Mission du plein Evangile)(MPE)', href: '/members/mpe' }
      ]
    },
    {
      name: t('navbar.sermons'),
      href: '/sermons'
    },
    {
      name: t('navbar.activities'),
      href: '#',
      submenu: [
        { name: t('navbar.charity'), href: '/charity' },
        { name: t('navbar.workshopsTrainings'), href: '/workshops' },
      ]
    },
    {
      name: t('navbar.news'),
      href: '#',
      submenu: [
        { name: t('navbar.futureEvents'), href: '/events' },
        { name: t('navbar.announcements'), href: '/announcements' },
      ]
    },
    { name: t('navbar.blogs'), href: '/blogs' },
    { name: t('navbar.contactUs'), href: '/contact' },
  ];

  return (
    <nav className={getNavbarStyles()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <Image
                src="/images/logo_CEPCA.png"
                alt="CEPCA Logo"
                width={40}
                height={40}
                className="sm:w-[50px] sm:h-[50px]"
              />
            </div>
            <div>
              <h1 className={getLogoTextStyles()}>{t('common.cepca')}</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link href={item.href || '#'} className={getDesktopLinkStyles()}>
                  {item.name}
                </Link>
                {item.submenu && (
                  <div className="absolute left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-white/20">
                    <div className="py-2">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href || '#'}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <LanguageSelector />
            <Link href="/give" className={getDonateButtonStyles()}>
              {t('common.donate')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            <LanguageSelector />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={getMobileMenuButtonStyles()}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[3.9rem] sm:top-[4.9rem] bottom-0 z-10 bg-white/95 backdrop-blur-md flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <div key={item.name}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="flex items-center justify-between w-full text-gray-700 hover:text-purple-600 active:text-purple-700 font-medium py-3 hover:bg-purple-50 active:bg-purple-100 px-3 rounded-lg touch-manipulation"
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
                              href={subitem.href || '#'}
                              className={mobileSubMenuItemStyles}
                              onClick={closeMenu}
                            >
                              {subitem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      className={mobileMenuItemStyles}
                      onClick={closeMenu}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Fixed donate button at bottom */}
          <div className="p-4">
            <Link
              href="/give"
              className="block bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-3 rounded-lg font-medium text-center touch-manipulation"
              onClick={closeMenu}
            >
              {t('common.donate')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
