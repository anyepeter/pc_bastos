'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

interface MenuItem {
  name: string;
  href?: string;
  submenu?: { name: string; href: string }[];
  /** Long lists (the member churches) open as a two-column panel. */
  wide?: boolean;
}

const Navigation = ({ scroll = false }: { scroll?: boolean }) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(scroll);
  const progressRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    // Written straight to the DOM rather than through state: this fires on
    // every scroll frame and must not re-render the whole navigation.
    const handleScroll = () => {
      if (!scroll) setIsScrolled(window.scrollY > 10);

      const bar = progressRef.current;
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        bar.style.transform = `scaleX(${ratio})`;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scroll]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // A route change closes the sheet — otherwise it lingers over the new page.
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdowns([]);
  }, [pathname]);

  // Past `xl` the desktop nav takes over and the sheet is hidden by CSS. Close
  // it for real as well, or a resize while it is open leaves the body scroll
  // lock on with nothing visible to explain it.
  useEffect(() => {
    if (!isMenuOpen) return;
    const desktop = window.matchMedia('(min-width: 1280px)');
    const sync = () => {
      if (desktop.matches) setIsMenuOpen(false);
    };
    sync();
    desktop.addEventListener('change', sync);
    return () => desktop.removeEventListener('change', sync);
  }, [isMenuOpen]);

  const toggleDropdown = (itemName: string) =>
    setOpenDropdowns((prev) => (prev.includes(itemName) ? [] : [itemName]));

  const closeMenu = () => setIsMenuOpen(false);

  const menuItems: MenuItem[] = [
    {
      name: t('navbar.aboutUs'),
      href: '/about',
      submenu: [
        { name: t('navbar.ourMissionVision'), href: '/about/mission-vision' },
        { name: t('navbar.leadership'), href: '/about/departments' },
        { name: t('navbar.ourHistory'), href: '/about/history' },
        { name: t('navbar.cepcaStructures'), href: '/about/structure' },
      ],
    },
    {
      name: t('navbar.members'),
      wide: true,
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
        { name: 'FULL GOSPEL Mission (Mission du plein Evangile)(MPE)', href: '/members/mpe' },
      ],
    },
    { name: t('navbar.departements'), href: '/departments' },
    {
      name: t('navbar.activities'),
      submenu: [
        { name: t('navbar.charity'), href: '/charity' },
        { name: t('navbar.workshopsTrainings'), href: '/workshops' },
      ],
    },
    {
      name: t('navbar.news'),
      submenu: [
        { name: t('navbar.futureEvents'), href: '/events' },
        { name: t('navbar.announcements'), href: '/announcements' },
      ],
    },
    { name: t('navbar.blogs'), href: '/blogs' },
    { name: t('navbar.contactUs'), href: '/contact' },
  ];

  /** A branch is current when its own page, or any child page, is open. */
  const isCurrent = (item: MenuItem) => {
    const hrefs = [item.href, ...(item.submenu?.map((s) => s.href) ?? [])].filter(
      (h): h is string => Boolean(h) && h !== '#',
    );
    return hrefs.some((h) => pathname === h || pathname.startsWith(`${h}/`));
  };

  const raised = isScrolled || isMenuOpen;
  /**
   * The landing page opens with a full-bleed photographic hero, so at the very
   * top the bar sits on a dark image and has to invert. Inner pages pass
   * `scroll` and stay solid throughout.
   */
  const overHero = !scroll && !raised;

  return (
    <>
      <header
        className={`fixed top-0 z-nav w-full transition-all duration-500 ease-spring ${
          overHero
            ? 'border-b border-transparent bg-gradient-to-b from-ink-950/70 to-transparent'
            : raised
              ? 'border-b border-ink-200 bg-white/90 shadow-[0_12px_32px_-24px_rgba(45,27,90,0.5)] backdrop-blur-xl'
              : 'border-b border-ink-200 bg-white/90 backdrop-blur-md'
        }`}
      >
        <nav aria-label="Primary" className="shell">
          <div className="flex h-16 items-center justify-between gap-6 sm:h-20">
            {/* Wordmark */}
            <Link href="/" className="focus-ring group flex shrink-0 items-center gap-3" aria-label="CEPCA home">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset transition-colors duration-300 sm:h-11 sm:w-11 ${
                  overHero
                    ? 'bg-white/10 ring-white/25 group-hover:ring-white/50'
                    : 'bg-plum-50 ring-plum-100 group-hover:ring-plum-300'
                }`}
              >
                <Image
                src="/images/logo_CEPCA.png"
                alt=""
                width={26}
                height={26}
                aria-hidden="true"
                className="h-auto w-auto"
              />
              </span>
              <span className="leading-none">
                <span
                  className={`block font-display text-lg font-semibold tracking-tight transition-colors duration-300 sm:text-xl ${
                    overHero ? 'text-white' : 'text-ink-900'
                  }`}
                >
                  {t('common.cepca')}
                </span>
                <span
                  className={`mt-1 hidden font-mono text-[0.55rem] uppercase tracking-[0.2em] transition-colors duration-300 sm:block ${
                    overHero ? 'text-white/70' : 'text-ink-500'
                  }`}
                >
                  {t('footer.tagline')}
                </span>
              </span>
            </Link>

            {/* Desktop */}
            <div className="hidden items-center gap-0.5 xl:flex">
              {menuItems.map((item) => {
                const current = isCurrent(item);
                const trigger = `focus-ring relative flex items-center gap-1 rounded-lg px-3 py-2 font-ui text-[0.83rem] font-medium transition-colors duration-300 ${
                  overHero
                    ? current
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                    : current
                      ? 'text-plum-700'
                      : 'text-ink-600 hover:text-ink-900'
                }`;
                const rule = `pointer-events-none absolute inset-x-3 bottom-1 h-[2px] origin-left rounded-full transition-transform duration-300 ease-spring ${
                  overHero ? 'bg-white' : 'bg-plum-600'
                } ${
                  current ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`;

                return (
                  <div key={item.name} className="group relative">
                    {item.href ? (
                      <Link href={item.href} aria-current={current ? 'page' : undefined} className={trigger}>
                        {item.name}
                        {item.submenu && (
                          <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                        )}
                        <span className={rule} />
                      </Link>
                    ) : (
                      <button type="button" aria-haspopup="true" className={trigger}>
                        {item.name}
                        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                        <span className={rule} />
                      </button>
                    )}

                    {item.submenu && (
                      <div
                        className={`invisible absolute left-1/2 top-full z-nav -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-200 ease-spring group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${
                          item.wide ? 'w-[38rem]' : 'w-max min-w-[15rem] max-w-[22rem]'
                        }`}
                      >
                        <div className="panel overflow-hidden rounded-2xl p-2">
                          {/* The twelve member churches would be an unusable
                              single column, so the long list splits in two. */}
                          <div className={item.wide ? 'grid grid-cols-2 gap-1' : ''}>
                            {item.submenu.map((subitem) => {
                              const subCurrent = pathname === subitem.href;
                              return (
                                <Link
                                  key={subitem.href}
                                  href={subitem.href}
                                  aria-current={subCurrent ? 'page' : undefined}
                                  className={`focus-ring block rounded-xl px-3.5 py-2.5 text-[0.82rem] leading-snug transition-colors duration-200 ${
                                    subCurrent
                                      ? 'bg-plum-50 font-medium text-plum-700'
                                      : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                                  }`}
                                >
                                  {subitem.name}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="ml-4 flex items-center gap-3">
                <LanguageSelector onDark={overHero} />
                <Link
                  href="/give"
                  className="focus-ring rounded-full bg-leaf-600 px-5 py-2.5 font-ui text-[0.83rem] font-semibold text-white transition-all duration-300 ease-spring hover:bg-leaf-700 hover:shadow-[0_14px_30px_-12px_rgba(39,113,78,0.75)] active:translate-y-px"
                >
                  {t('common.donate')}
                </Link>
              </div>
            </div>

            {/* Mobile trigger */}
            <div className="flex items-center gap-2 xl:hidden">
              <LanguageSelector onDark={overHero} />
              <button
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                className={`focus-ring rounded-lg p-2.5 transition-colors duration-200 ${
                  overHero
                    ? 'text-white hover:bg-white/[0.15] active:bg-white/25'
                    : 'text-ink-800 hover:bg-ink-100 active:bg-ink-200'
                }`}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Reading progress — sits on the header's bottom edge */}
        <span
          ref={progressRef}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-plum-600 to-plum-400"
        />
      </header>

      {/*
        Mobile sheet — deliberately a sibling of <header>, never a child.
        The bar carries `backdrop-blur`, and a backdrop-filter makes an element
        the containing block for its `position: fixed` descendants: nested
        inside it, `top-16 bottom-0` resolved against the 64px bar instead of
        the viewport and the sheet collapsed to zero height. It must also clear
        the floating WhatsApp button, which sits at z-float (70).
      */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-16 z-[80] flex flex-col bg-white sm:top-20 xl:hidden"
        >
          <div className="shell flex-1 overflow-y-auto py-6">
            {/* The trigger runs up to 1280px, so on a tablet the list has to
                stop short of the full width or the rows read as stray rules. */}
            <ul className="mx-auto w-full max-w-2xl space-y-1">
              {menuItems.map((item) => {
                const current = isCurrent(item);
                const expanded = openDropdowns.includes(item.name);

                return (
                  <li key={item.name} className="border-b border-ink-200">
                    {item.submenu ? (
                      <>
                        <button
                          type="button"
                          onClick={() => toggleDropdown(item.name)}
                          aria-expanded={expanded}
                          className={`focus-ring flex w-full items-center justify-between gap-3 py-4 text-left font-ui text-[0.95rem] font-medium transition-colors ${
                            current ? 'text-plum-700' : 'text-ink-900'
                          }`}
                        >
                          {item.name}
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-ink-400 transition-transform duration-300 ease-spring ${
                              expanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {expanded && (
                          <ul
                            className={`space-y-0.5 pb-3 pl-3 ${
                              // Twelve member churches in a single column
                              // outrun even a tablet; from `sm` they pair up.
                              item.wide ? 'sm:grid sm:grid-cols-2 sm:gap-x-2 sm:space-y-0' : ''
                            }`}
                          >
                            {item.href && (
                              <li className={item.wide ? 'sm:col-span-2' : undefined}>
                                <Link
                                  href={item.href}
                                  onClick={closeMenu}
                                  className="focus-ring block rounded-lg px-3 py-2.5 text-sm font-medium text-plum-700 transition-colors hover:bg-plum-50"
                                >
                                  {t('common.viewAll')}
                                </Link>
                              </li>
                            )}
                            {item.submenu.map((subitem) => (
                              <li key={subitem.href}>
                                <Link
                                  href={subitem.href}
                                  onClick={closeMenu}
                                  aria-current={pathname === subitem.href ? 'page' : undefined}
                                  className={`focus-ring block rounded-lg px-3 py-2.5 text-sm leading-snug transition-colors ${
                                    pathname === subitem.href
                                      ? 'bg-plum-50 font-medium text-plum-700'
                                      : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                                  }`}
                                >
                                  {subitem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href ?? '#'}
                        onClick={closeMenu}
                        aria-current={current ? 'page' : undefined}
                        className={`focus-ring block py-4 font-ui text-[0.95rem] font-medium transition-colors ${
                          current ? 'text-plum-700' : 'text-ink-900 hover:text-plum-700'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="shell border-t border-ink-200 py-4">
            <Link
              href="/give"
              onClick={closeMenu}
              className="focus-ring mx-auto block w-full max-w-2xl rounded-full bg-leaf-600 px-5 py-3.5 text-center font-ui text-sm font-semibold text-white transition-colors hover:bg-leaf-700 active:translate-y-px"
            >
              {t('common.donate')}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
