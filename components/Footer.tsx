'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Facebook, Instagram, Heart, ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * X (formerly Twitter). lucide-react still ships the retired bird glyph, which
 * looks dated next to the other marks, so the current logo is inlined here.
 */
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', Icon: Facebook, hover: 'hover:bg-[#1877F2]' },
  { label: 'Instagram', href: '#', Icon: Instagram, hover: 'hover:bg-[#E1306C]' },
  { label: 'X', href: '#', Icon: XIcon, hover: 'hover:bg-black' },
];

const Footer = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { href: '/members', label: t('footer.members') },
    { href: '/blogs', label: t('navbar.blogs') },
    { href: '/events', label: t('navbar.futureEvents') },
    { href: '/announcements', label: t('navbar.announcements') },
    { href: '/charity', label: t('navbar.charity') },
    { href: '/workshops', label: t('navbar.workshopsTrainings') },
    { href: '/about', label: t('footer.about') },
    { href: '/contact', label: t('footer.contact') },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-purple-900 via-purple-900 to-indigo-950 text-white">
      {/* Accent hairline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />

      {/* Soft glow + dot pattern */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {/* Brand */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-4">
            <div className="group flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/logo_CEPCA.png"
                  alt="CEPCA Logo"
                  width={32}
                  height={32}
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-playfair text-2xl font-bold tracking-tight">
                  {t('common.cepca')}
                </h3>
                <p className="font-poppins text-sm text-purple-200">
                  {t('footer.tagline')}
                </p>
              </div>
            </div>

            <p className="max-w-sm font-inter leading-relaxed text-purple-100/90">
              {t('footer.description')}
            </p>

            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
              <Heart className="h-4 w-4 shrink-0 text-pink-300" />
              <span className="font-poppins text-sm text-purple-100">
                {t('footer.servingSince')}
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-6 lg:col-span-4">
            <h4 className="font-playfair text-lg font-semibold tracking-wide text-white">
              {t('footer.quickLinks')}
            </h4>
            <nav className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex min-w-0 items-center gap-2.5 font-poppins text-purple-200 transition-colors duration-300 hover:text-white"
                >
                  <span className="h-1 w-1 shrink-0 rounded-full bg-purple-400 transition-all duration-300 group-hover:w-3 group-hover:bg-pink-300" />
                  <span className="truncate">{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-6 lg:col-span-4">
            <h4 className="font-playfair text-lg font-semibold tracking-wide text-white">
              {t('footer.getInTouch')}
            </h4>

            <ul className="space-y-2">
              <li>
                <a
                  href="https://wa.me/237242657608"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group -mx-2 flex items-start gap-3 rounded-xl p-2 transition-colors duration-300 hover:bg-white/5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/15 ring-1 ring-green-400/20 transition-colors duration-300 group-hover:bg-green-500/25">
                    <Phone className="h-4 w-4 text-green-300" />
                  </span>
                  <span className="min-w-0 pt-1.5 font-poppins text-purple-100 transition-colors group-hover:text-white">
                    {t('footer.phone')}
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="mailto:generalsecretarycepca@gmail.com"
                  className="group -mx-2 flex items-start gap-3 rounded-xl p-2 transition-colors duration-300 hover:bg-white/5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 ring-1 ring-sky-400/20 transition-colors duration-300 group-hover:bg-sky-500/25">
                    <Mail className="h-4 w-4 text-sky-300" />
                  </span>
                  {/* min-w-0 + break-words: the address is one long unbroken
                      token and used to push the whole column off screen. */}
                  <span className="min-w-0 break-words pt-1.5 font-poppins text-sm text-purple-100 transition-colors group-hover:text-white">
                    {t('footer.email')}
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="https://www.google.com/maps/search/Presbyterian+Church+Bastos+Yaound%C3%A9+Cameroon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group -mx-2 flex items-start gap-3 rounded-xl p-2 transition-colors duration-300 hover:bg-white/5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 ring-1 ring-purple-400/20 transition-colors duration-300 group-hover:bg-purple-500/30">
                    <MapPin className="h-4 w-4 text-purple-200" />
                  </span>
                  <span className="min-w-0 pt-1.5 font-poppins leading-relaxed text-purple-100 transition-colors group-hover:text-white">
                    {t('footer.address')}
                  </span>
                </a>
              </li>
            </ul>

            {/* Social */}
            <div className="space-y-3 pt-2">
              <p className="font-poppins text-sm text-purple-200">
                {t('footer.followUs')}
              </p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map(({ label, href, Icon, hover }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-purple-100 ring-1 ring-white/15 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:ring-white/30 ${hover}`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-center font-poppins text-sm text-purple-300 sm:text-left">
            {t('footer.copyright')}
          </p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 font-poppins text-sm text-purple-200 ring-1 ring-white/10 transition-all duration-300 hover:bg-white/10 hover:text-white"
          >
            <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            {t('footer.backToTop')}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
