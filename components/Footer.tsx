'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Facebook, Instagram, ArrowUp, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BrushEdge from '@/components/BrushEdge';

/** The footer's ground. Shared with the painted edge, which must match it exactly. */
const GROUND = '#33205C'; // plum-900

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
  { label: 'Facebook', href: '#', Icon: Facebook },
  { label: 'Instagram', href: '#', Icon: Instagram },
  { label: 'X', href: '#', Icon: XIcon },
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

  const contacts = [
    {
      href: 'https://wa.me/237242657608',
      external: true,
      Icon: Phone,
      value: t('footer.phone'),
      className: 'tnum',
    },
    {
      href: 'mailto:generalsecretarycepca@gmail.com',
      external: false,
      Icon: Mail,
      // The address is one unbroken token — it must be allowed to wrap.
      value: t('footer.email'),
      className: 'break-words',
    },
    {
      href: 'https://www.google.com/maps/search/Presbyterian+Church+Bastos+Yaound%C3%A9+Cameroon',
      external: true,
      Icon: MapPin,
      value: t('footer.address'),
      className: '',
    },
  ];

  return (
    /* No `overflow-hidden` here: the painted edge deliberately overhangs the
       top of the footer, and clipping would shear the streaks off. */
    <footer className="grain relative bg-plum-900 text-plum-200">
      {/* The paint is the footer's OWN colour, thrown up onto the page above.
          Every route ends on a different pale ground (white, gray-50, #fbfbfa,
          two violet gradients, a green one — all measured), so an edge painted
          in the neighbour's colour would seam somewhere. Painting upward in the
          footer's ground leaves the area around the bristles transparent, and
          the join is then correct on every page by construction.

          The ground is a single flat colour by request — no glows — so the
          whole band is `GROUND` and the edge matches it everywhere. */}
      <BrushEdge
        fill={GROUND}
        className="pointer-events-none absolute inset-x-0 bottom-full z-10 h-11 w-full sm:h-14 lg:h-[55px]"
      />

      <div className="relative shell py-16">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="focus-ring group inline-flex items-center gap-3.5">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors duration-300 group-hover:border-leaf-400/60">
                <Image
                  src="/images/logo_CEPCA.png"
                  alt=""
                  width={28}
                  height={28}
                  aria-hidden="true"
                  className="h-auto w-auto"
                />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-xl font-semibold tracking-tight text-white">
                  {t('common.cepca')}
                </span>
                <span className="mt-1 block font-mono text-[0.58rem] uppercase tracking-[0.2em] text-plum-300">
                  {t('footer.tagline')}
                </span>
              </span>
            </Link>

            <p className="mt-7 max-w-[42ch] text-sm leading-relaxed text-plum-200 text-pretty">
              {t('footer.description')}
            </p>

            <p className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-leaf-400" />
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-plum-200">
                {t('footer.servingSince')}
              </span>
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer" className="lg:col-span-4">
            <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-leaf-300">
              {t('footer.quickLinks')}
            </h2>
            <ul className="mt-6 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              {quickLinks.map((link) => (
                <li key={link.href} className="border-b border-white/10">
                  <Link
                    href={link.href}
                    className="focus-ring group flex items-center justify-between gap-3 py-3 text-sm text-plum-200 transition-colors duration-300 hover:text-white"
                  >
                    <span className="truncate">{link.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-plum-400 opacity-0 transition-all duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-leaf-300 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-leaf-300">
              {t('footer.getInTouch')}
            </h2>

            <ul className="mt-6 space-y-1">
              {contacts.map(({ href, external, Icon, value, className }) => (
                <li key={href}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="focus-ring group -mx-3 flex items-start gap-3.5 rounded-xl px-3 py-3 transition-colors duration-300 hover:bg-white/5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors duration-300 group-hover:border-leaf-400/60">
                      <Icon className="h-4 w-4 text-leaf-300" />
                    </span>
                    <span
                      className={`min-w-0 pt-1.5 text-sm leading-relaxed text-plum-200 transition-colors duration-300 group-hover:text-white ${className}`}
                    >
                      {value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-plum-300">
                {t('footer.followUs')}
              </p>
              <div className="mt-4 flex gap-2.5">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-plum-200 transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:border-leaf-400/60 hover:bg-leaf-400/10 hover:text-white"
                  >
                    <Icon className="h-[17px] w-[17px]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-center font-mono text-[0.68rem] tracking-wide text-plum-300 sm:text-left">
            {t('footer.copyright')}
          </p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="focus-ring group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 font-ui text-xs font-medium text-plum-200 transition-all duration-300 ease-spring hover:border-leaf-400/60 hover:text-white"
          >
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5" />
            {t('footer.backToTop')}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
