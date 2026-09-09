'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BrushEdge from '@/components/BrushEdge';

/* ───────────────────────────────────────────────────────────────────────────
   HERO BACKDROP — the knobs. Edit these numbers, nothing else.

     0 = no darkening at all      1 = solid colour
   ─────────────────────────────────────────────────────────────────────────── */
const DIM = {
  /** Wash across the whole photograph, strongest on the left. */
  side: 0.2,
  /** Top and bottom edges — keeps the navigation and painted foot legible. */
  edge: 0.38,
  /** The pool behind the copy. THIS is what governs readability: white body
   *  copy needs 4.5:1 against the lightest slide, so do not drop it far. */
  textTint: 0.74,
  textTintMobile: 0.6,
};

/** A NEUTRAL charcoal, deliberately not the plum tint — the brand colour over
 *  the photograph read as a purple cast. Change this to re-colour every layer
 *  below at once. */
const TINT = '12, 12, 14';
const rgba = (a: number) => `rgba(${TINT}, ${Math.max(0, Math.min(1, a))})`;

const SIDE_WASH = `linear-gradient(to right, ${rgba(DIM.side)} 0%, ${rgba(DIM.side * 0.4)} 45%, ${rgba(0)} 100%)`;
const EDGE_WASH = `linear-gradient(to top, ${rgba(DIM.edge)} 0%, ${rgba(0)} 45%, ${rgba(DIM.edge * 0.5)} 100%)`;

/* The pool is faded out with a mask so it dissolves into the photograph rather
   than ending on a visible edge — scoping it to the copy element instead made
   it read as a dark panel. */
const MASK_DESKTOP = 'radial-gradient(54% 64% at 27% 50%, #000 0%, #000 42%, rgba(0,0,0,0.45) 66%, transparent 86%)';
const MASK_MOBILE = 'radial-gradient(128% 80% at 50% 42%, #000 0%, #000 46%, rgba(0,0,0,0.45) 70%, transparent 90%)';

/** The photographs the hero cycles through. */
const SLIDES = [
  {
    src: '/images/hero2.jpg',
    alt: 'A member church of the council, its nave lined with arched windows',
  },
  {
    src: '/images/hero-image.jpg',
    alt: 'The Salle Polyvalente CEPCA in Yaoundé during a council forum',
  },
  {
    src: '/images/logo5.jpg',
    alt: "The council's meeting hall, its wall carrying the CEPCA emblem",
  },
];

const SLIDE_MS = 6500;

const HeroSection = () => {
  const { t } = useTranslation();

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => setActive((next + SLIDES.length) % SLIDES.length),
    [],
  );

  useEffect(() => {
    // Someone who asked the OS for less motion gets a still first frame.
    const still =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (still || paused) return;

    timer.current = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  return (
    <section className="relative bg-ink-950">
      <div
        className="relative isolate flex min-h-[42rem] flex-col justify-center overflow-hidden lg:min-h-[52rem]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        aria-roledescription="carousel"
        aria-label="CEPCA member churches and gatherings"
      >
        {/* ── Slides ───────────────────────────────────────────────── */}
        <div className="absolute inset-0">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              aria-hidden={i !== active}
              className={`absolute inset-0 transition-opacity duration-1000 ease-spring ${
                i === active ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src}
                alt={i === active ? slide.alt : ''}
                className={`h-full w-full object-cover ${i === active ? 'kenburns' : ''}`}
                // The first frame is the page's largest paint — never lazy.
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'low'}
              />
            </div>
          ))}
        </div>

        {/* Scrims: heavier on the text side, then a foot so the strokes and
            the section below have something to sit against. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundImage: SIDE_WASH }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundImage: EDGE_WASH }}
        />
        {/* The darkening sits only where the words are. Full-bleed so nothing
            can clip it into a visible panel; it feathers out long before the
            edges, leaving the rest of the photograph alone. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 sm:hidden"
          style={{
            backgroundColor: rgba(DIM.textTintMobile),
            WebkitMaskImage: MASK_MOBILE,
            maskImage: MASK_MOBILE,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden sm:block"
          style={{
            backgroundColor: rgba(DIM.textTint),
            WebkitMaskImage: MASK_DESKTOP,
            maskImage: MASK_DESKTOP,
          }}
        />

        {/* ── Copy ─────────────────────────────────────────────────── */}
        <div className="shell relative z-10 w-full pb-28 pt-32 lg:pb-32 lg:pt-40">
          <div className="max-w-3xl">
            <div className="relative flex items-center gap-3">
              <span className="h-px w-10 bg-leaf-300" />
              <p className="font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.18em] text-leaf-200 sm:text-[0.68rem] sm:tracking-[0.28em]">
                {t('home.eyebrow')}
              </p>
            </div>

            <h1 className="relative mt-7 font-ui text-[clamp(2.7rem,6.2vw,5.25rem)] font-bold uppercase leading-[0.98] tracking-tightest text-white">
              {t('hero.title')}{' '}
              {/* `block` so the highlighted word always takes its own line,
                  instead of riding up beside the first part on wide screens.
                  The space above is kept so the accessible name stays two
                  words — without it screen readers announce them run together. */}
              <span className="block text-leaf-300">{t('hero.titleHighlight')}</span>
            </h1>

            <p className="relative mt-7 max-w-[54ch] text-base leading-relaxed text-white text-pretty sm:text-lg">
              {t('hero.description')}
            </p>

            <div className="relative mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href="/give"
                className="focus-ring group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-leaf-600 px-7 py-3.5 font-ui text-sm font-semibold text-white transition-all duration-300 ease-spring hover:bg-leaf-500 hover:shadow-[0_18px_40px_-14px_rgba(39,113,78,0.85)] active:translate-y-px"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-opacity group-hover:animate-sheen group-hover:opacity-100"
                />
                <Heart className="h-4 w-4" strokeWidth={2.2} />
                {t('hero.donateNow')}
              </Link>

              <Link
                href="/contact"
                className="focus-ring group inline-flex items-center gap-2.5 rounded-full border border-white/[0.35] bg-white/10 px-7 py-3.5 font-ui text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 ease-spring hover:border-white/60 hover:bg-white/20 active:translate-y-px"
              >
                {t('hero.contactUs')}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
              </Link>

              <Link
                href="/about"
                className="focus-ring group inline-flex items-center gap-1.5 font-ui text-sm font-medium text-white underline decoration-white/40 decoration-1 underline-offset-[6px] transition-colors duration-300 hover:text-plum-200 hover:decoration-plum-300"
              >
                {t('welcome.learnMore')}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Carousel controls ────────────────────────────────────── */}
        <div className="shell pointer-events-none absolute inset-x-0 bottom-16 z-20 sm:bottom-20 lg:bottom-28">
          <div className="flex items-end justify-between gap-6">
            <div className="pointer-events-auto flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label="Previous slide"
                className="focus-ring flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 ease-spring hover:border-white/60 hover:bg-white/20 active:translate-y-px sm:h-14 sm:w-14"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label="Next slide"
                className="focus-ring flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 ease-spring hover:border-white/60 hover:bg-white/20 active:translate-y-px sm:h-14 sm:w-14"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Pagination — a filled bar marks the active frame */}
            <div className="pointer-events-auto flex items-center gap-2.5">
              {SLIDES.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === active}
                  className="focus-ring group py-2"
                >
                  <span
                    className={`block h-1 rounded-full transition-all duration-500 ease-spring ${
                      i === active
                        ? 'w-10 bg-white'
                        : 'w-4 bg-white/40 group-hover:bg-white/70'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Painted edge along the foot ──────────────────────────── */}
        <BrushEdge className="pointer-events-none absolute inset-x-0 -bottom-px z-10 h-11 w-full sm:h-14 lg:h-[55px]" />
      </div>

    </section>
  );
};

export default HeroSection;
