'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/Reveal';
import BrushEdge from '@/components/BrushEdge';

/**
 * The council's photography, as two bands sliding in opposite directions.
 *
 * The set is CURATED here rather than scraped from whatever images happen to be
 * attached to published records. Scraping is what dragged placeholder uploads
 * (a scanned card, a screenshot) into the wall. Add real photographs to
 * `public/images/` and list them here — alt text included, since a gallery
 * without it is unreadable to a screen reader.
 */
const PHOTOS: Array<{
  src: string;
  alt: string;
  /** `object-position` for the band's landscape crop, where the centre would cut off a face. */
  position?: string;
}> = [
  { src: '/images/d0217420-25ff-4278-a445-7b464abf44a8.jpeg', alt: 'Clergy in gowns and coloured stoles gathered on the steps of a church' },
  { src: '/images/b7479a26-dac2-4cd1-9ede-2dd4e6ca0332.jpeg', alt: 'A pastor in a black gown and purple stole in a church sanctuary' },
  { src: '/images/b510667f-1dac-4745-92ee-8ea87f86d2e3.jpeg', alt: "Delegates gathered outside the council's headquarters, beneath the CEPCA banner" },
  { src: '/images/1e38a4e4-3fbe-44c5-a619-10da677c0e17.jpeg', alt: 'A delegate in an embroidered blue tunic speaking during a council meeting' },
  { src: '/images/hero-image.jpg', alt: 'The Salle Polyvalente CEPCA in Yaoundé, banners across its facade' },
  { src: '/images/8b1e4fa9-2946-4b81-a8c4-b1e24ec9cb9c.jpeg', alt: 'A pastor in a black gown, red collar and white lace bands in a church sanctuary' },
  { src: '/images/e9411293-36fa-40c3-b545-2f8cd7d7de3e.jpeg', alt: 'Clergy lining up on the church steps for a group photograph' },
  { src: '/images/09b6dbcb-814c-4350-81fc-416d0d6e5596.jpeg', alt: 'A clergyman in a purple clerical shirt and dark suit, outdoors', position: 'center 15%' },
  { src: '/images/9cb6da43-0e3b-41fa-bbd5-4f600dbb27a8.jpeg', alt: "Council delegates standing together beneath the headquarters' CEPCA banner" },
  { src: '/images/c0b67593-9919-4a59-9a50-91410f2f5949.jpeg', alt: 'A clergyman in a grey suit and red clerical shirt, outdoors', position: 'center 15%' },
  { src: '/images/logo5.jpg', alt: "The council's headquarters wall, a cross-shaped window above the member-church banner" },
];

/** Each half of the track must outrun the widest screen or the loop's seam
 *  shows; about twelve tiles does. Derived rather than fixed because the
 *  animation covers one half per cycle — a longer half would also run faster. */
const REPEATS = Math.max(1, Math.ceil(12 / PHOTOS.length));

function Row({
  reverse = false,
  offset = 0,
  seconds,
  paused,
  onOpen,
}: {
  reverse?: boolean;
  /** Starts the band part-way through the set, so the two rows don't mirror each other. */
  offset?: number;
  seconds: number;
  paused: boolean;
  onOpen: (index: number) => void;
}) {
  const tiles = Array.from({ length: REPEATS * 2 * PHOTOS.length }, (_, i) => i);

  return (
    <div className="relative flex w-full overflow-hidden">
      <div
        className="flex shrink-0 gap-4 pr-4 will-change-transform sm:gap-6 sm:pr-6"
        style={{
          animation: `gallery-slide ${seconds}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {tiles.map((i) => {
          const index = (i + offset) % PHOTOS.length;
          const photo = PHOTOS[index];
          // Each photograph is reachable by keyboard exactly once; the repeats
          // that make the loop seamless are hidden from assistive tech.
          const isCanonical = !reverse && i < PHOTOS.length;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onOpen(index)}
              tabIndex={isCanonical ? 0 : -1}
              aria-hidden={!isCanonical}
              aria-label={isCanonical ? `${photo.alt} — open larger` : undefined}
              className="focus-ring group/tile relative h-44 w-64 shrink-0 overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10 sm:h-56 sm:w-80 lg:h-64 lg:w-[22rem]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt=""
                loading="lazy"
                draggable={false}
                style={{ objectPosition: photo.position }}
                className="h-full w-full select-none object-cover transition-transform duration-700 ease-spring group-hover/tile:scale-[1.06]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-plum-950/30 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function GallerySection() {
  const { t } = useTranslation();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  // Kept in refs, not state: this updates every pointer frame and must never
  // trigger a React render.
  const pointer = useRef({ x: 0, y: 0, angle: 0, shown: false });
  const frame = useRef<number>(0);

  const paused = hovered || open !== null;

  const openAt = useCallback((index: number) => {
    returnFocusRef.current = document.activeElement as HTMLElement;
    setOpen(index);
  }, []);

  const close = useCallback(() => {
    setOpen(null);
    returnFocusRef.current?.focus?.();
  }, []);

  const step = useCallback((delta: number) => {
    setOpen((current) =>
      current === null ? current : (current + delta + PHOTOS.length) % PHOTOS.length,
    );
  }, []);

  /** Custom cursor: rotates only while the pointer travels. */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    let lastX = 0;
    let lastY = 0;
    const draw = () => {
      const el = cursorRef.current;
      if (el) {
        const { x, y, angle, shown } = pointer.current;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${angle}deg)`;
        el.style.opacity = shown ? '1' : '0';
      }
      frame.current = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = x - lastX;
      const dy = y - lastY;
      lastX = x;
      lastY = y;
      pointer.current.angle += Math.hypot(dx, dy) * (dx >= 0 ? 0.6 : -0.6);
      pointer.current.x = x;
      pointer.current.y = y;
      pointer.current.shown = true;
    };
    const onLeave = () => {
      pointer.current.shown = false;
    };

    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    frame.current = requestAnimationFrame(draw);
    return () => {
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  /** Lightbox: keyboard, focus and background scroll. */
  useEffect(() => {
    if (open === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'unset';
    };
  }, [open, close, step]);

  const current = open === null ? null : PHOTOS[open];

  return (
    <section className="grain relative overflow-hidden bg-plum-950 pb-20 pt-20 lg:pb-28 lg:pt-28">
      <BrushEdge
        fill="#FAF9FC"
        className="pointer-events-none absolute inset-x-0 -top-px z-10 h-11 w-full rotate-180 sm:h-14 lg:h-[55px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 h-[30rem] w-[30rem] rounded-full bg-plum-800/60 blur-[150px]"
      />

      <div className="shell relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-leaf-400" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-leaf-300">
                  {t('home.sections.gallery')}
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-7 font-display text-[clamp(2.1rem,4.2vw,3.4rem)] font-semibold leading-[1.04] tracking-tight text-white text-balance">
                {t('home.gallery.title')}{' '}
                <span className="text-leaf-300">{t('home.gallery.titleHighlight')}</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={140} className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-[46ch] text-base leading-relaxed text-plum-200 text-pretty lg:pb-2">
              {t('home.gallery.subtitle')}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed on purpose: the bands should run off both edges so the
          motion reads as continuous rather than as a widget in a box. */}
      <div
        ref={wrapRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        className="relative mt-12 flex flex-col gap-4 sm:gap-6 lg:cursor-none"
      >
        <Row seconds={54} paused={paused} onOpen={openAt} />
        <Row seconds={66} reverse offset={Math.floor(PHOTOS.length / 2)} paused={paused} onOpen={openAt} />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-plum-950 to-transparent sm:w-28"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-plum-950 to-transparent sm:w-28"
        />

        <div
          ref={cursorRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-20 hidden h-20 w-20 place-items-center rounded-full bg-leaf-400 opacity-0 transition-opacity duration-300 lg:grid"
        >
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-plum-950">
            {t('home.gallery.view')}
          </span>
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────── */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-plum-950/95 p-4 backdrop-blur-sm sm:p-8"
          onClick={close}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={t('home.gallery.close')}
            className="focus-ring absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors duration-300 hover:bg-white/20 sm:right-8 sm:top-8"
          >
            <X className="h-5 w-5" />
          </button>

          {PHOTOS.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label={t('home.gallery.previous')}
                className="focus-ring absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors duration-300 hover:bg-white/20 sm:left-8 sm:h-14 sm:w-14"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label={t('home.gallery.next')}
                className="focus-ring absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors duration-300 hover:bg-white/20 sm:right-8 sm:h-14 sm:w-14"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </>
          )}

          <figure
            className="max-h-full w-full max-w-5xl"
            /* Clicks on the picture itself must not fall through to the
               backdrop handler and close the view. */
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.alt}
              className="mx-auto max-h-[78vh] w-auto rounded-2xl object-contain shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)]"
            />
            <figcaption className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-plum-200">
              {current.alt}
            </figcaption>
          </figure>
        </div>
      )}

      <BrushEdge className="pointer-events-none absolute inset-x-0 -bottom-px z-10 h-11 w-full sm:h-14 lg:h-[55px]" />
    </section>
  );
}
