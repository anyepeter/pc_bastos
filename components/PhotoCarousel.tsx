'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { A11y, Autoplay, EffectCoverflow, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { isUploadedImage } from '@/lib/media';

interface PhotoCarouselProps {
  images: string[];
  /** What the photographs show (a church's name, an event's title). Builds the alt text. */
  alt: string;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * One photograph. Uploads and the site's own /images go through next/image,
 * which serves a resized WebP; anything else (an old stock URL, say) falls back
 * to a plain <img>, because next/image throws on a host next.config.js does not
 * allow, and that would take the whole page down.
 */
function Photo({
  src,
  alt,
  sizes,
  fit = 'cover',
  eager = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  fit?: 'cover' | 'contain';
  eager?: boolean;
}) {
  const fitClass = fit === 'cover' ? 'object-cover' : 'object-contain';
  const loading = eager ? 'eager' : 'lazy';
  if (src.startsWith('/') || isUploadedImage(src)) {
    return (
      <Image src={src} alt={alt} fill sizes={sizes} loading={loading} draggable={false} className={`select-none ${fitClass}`} />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={loading}
      draggable={false}
      className={`absolute inset-0 h-full w-full select-none ${fitClass}`}
    />
  );
}

/**
 * A horizontal scroll-snap track. Swiping is the browser's own (momentum and
 * all), so it works on touch with no script; the script only measures. On
 * every scroll frame each slide gets `--p`, its offset from the resting
 * position in slide widths (-1…1), and `--d`, the distance; CSS turns those
 * into the parallax and the dimming of the neighbours. Mouse users can also
 * drag the track.
 */
function useTrack(count: number) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const frame = useRef(0);
  const drag = useRef<{ x: number; left: number; moved: boolean; id: number } | null>(null);
  const suppressClick = useRef(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const left = track.scrollLeft;
    const atEnd = left >= track.scrollWidth - track.clientWidth - 2;
    let nearest = 0;
    let best = Infinity;
    slides.forEach((slide, i) => {
      const width = slide.offsetWidth || 1;
      const p = Math.max(-1, Math.min(1, (slide.offsetLeft - left) / width));
      slide.style.setProperty('--p', p.toFixed(4));
      slide.style.setProperty('--d', Math.abs(p).toFixed(4));
      const distance = Math.abs(slide.offsetLeft - left);
      if (distance < best) {
        best = distance;
        nearest = i;
      }
    });
    // At the far end the last slide cannot reach the left edge; it is still the one in view.
    if (atEnd && slides.length > 0 && best > 2) nearest = slides.length - 1;
    if (nearest !== activeRef.current) {
      activeRef.current = nearest;
      setActive(nearest);
    }
  }, []);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(measure);
  }, [measure]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    measure();
    const observer = new ResizeObserver(() => measure());
    observer.observe(track);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [measure, count]);

  const goTo = useCallback(
    (index: number, instant = false) => {
      const track = trackRef.current;
      if (!track) return;
      const target = Math.max(0, Math.min(count - 1, index));
      const slide = track.children[target] as HTMLElement | undefined;
      if (!slide) return;
      track.scrollTo({ left: slide.offsetLeft, behavior: instant || prefersReducedMotion() ? 'auto' : 'smooth' });
    },
    [count]
  );

  // Mouse drag. Touch and pens already scroll natively. Capture starts only
  // once the pointer has really moved, so a plain click still reaches the slide.
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !trackRef.current) return;
    drag.current = { x: event.clientX, left: trackRef.current.scrollLeft, moved: false, id: event.pointerId };
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const state = drag.current;
    if (!track || !state) return;
    const dx = event.clientX - state.x;
    if (!state.moved && Math.abs(dx) > 5) {
      state.moved = true;
      track.dataset.dragging = 'true';
      track.setPointerCapture(state.id);
    }
    if (state.moved) track.scrollLeft = state.left - dx;
  };
  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const state = drag.current;
    drag.current = null;
    if (!track || !state || !state.moved) return;
    delete track.dataset.dragging;
    if (track.hasPointerCapture(state.id)) track.releasePointerCapture(state.id);
    suppressClick.current = true;
    // A short flick still turns the page: bias towards the direction of travel.
    const dx = event.clientX - state.x;
    const from = activeRef.current;
    const flick = Math.abs(dx) > 40 ? (dx < 0 ? 1 : -1) : 0;
    const startIndex = Array.from(track.children).findIndex(
      (child) => (child as HTMLElement).offsetLeft >= state.left - 2
    );
    goTo(flick !== 0 ? Math.max(0, startIndex) + flick : from);
  };
  const onClickCapture = (event: React.MouseEvent) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return {
    trackRef,
    active,
    goTo,
    measure,
    trackProps: {
      ref: trackRef,
      onScroll,
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onClickCapture,
    },
  };
}

/**
 * The council's photo carousel — one design for every set of photographs on
 * the site: member churches, events, charity programmes, workshops,
 * departments and their activities.
 *
 * Swiper's coverflow: the current photograph large in the centre, its
 * neighbours turned back in depth on either side. It turns on its own every
 * few seconds while it is on screen (and rests on hover, offscreen and under
 * reduced motion); swipe, drag, the arrow keys, the arrows or the dots move
 * it by hand. A tap on a side photo brings it forward; a tap on the centre
 * one opens it whole in the full-screen viewer.
 */
export default function PhotoCarousel({ images, alt, className = '' }: PhotoCarouselProps) {
  const { t } = useTranslation();
  const count = images.length;
  const [active, setActive] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const [reduce, setReduce] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => setReduce(prefersReducedMotion()), []);

  // A turning carousel stops when nobody can see it, and while the viewer is open.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduce || count < 2) return;
    const observer = new IntersectionObserver(([entry]) => {
      const autoplay = swiperRef.current?.autoplay;
      if (!autoplay) return;
      if (entry.isIntersecting && viewer === null) autoplay.start();
      else autoplay.stop();
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, [reduce, count, viewer]);

  if (count === 0) return null;

  const openViewer = (index: number) => {
    swiperRef.current?.autoplay?.stop();
    setViewer(index);
  };

  const viewerElement =
    viewer !== null ? (
      <PhotoViewer
        images={images}
        alt={alt}
        start={viewer}
        onClose={(last) => {
          setViewer(null);
          // Come back to the photograph that was being looked at.
          if (count > 1) swiperRef.current?.slideToLoop(last, 0);
        }}
      />
    ) : null;

  // One photograph needs no carousel: it stands framed, and opens full screen.
  if (count === 1) {
    return (
      <section ref={sectionRef} aria-label={t('home.gallery.label', { name: alt })} className={className}>
        <button
          type="button"
          onClick={() => openViewer(0)}
          aria-label={t('home.gallery.enlarge')}
          className="focus-ring group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-ink-100 shadow-[0_28px_60px_-34px_rgb(45_27_90/0.55)] sm:aspect-[16/10]"
        >
          <Photo src={images[0]} alt={alt} sizes="(min-width: 1024px) 60vw, 92vw" eager />
          <ExpandBadge />
        </button>
        {viewerElement}
      </section>
    );
  }

  const loop = count >= 5;

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label={t('home.gallery.label', { name: alt })}
      className={`photo-coverflow ${className}`}
    >
      <Swiper
        modules={[EffectCoverflow, Autoplay, Keyboard, A11y]}
        effect="coverflow"
        centeredSlides
        slidesPerView="auto"
        grabCursor
        loop={loop}
        rewind={!loop}
        speed={reduce ? 0 : 750}
        coverflowEffect={{
          rotate: reduce ? 0 : 36,
          stretch: 0,
          depth: reduce ? 0 : 170,
          modifier: 1,
          slideShadows: !reduce,
        }}
        autoplay={reduce ? false : { delay: 4800, disableOnInteraction: false, pauseOnMouseEnter: true }}
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{
          prevSlideMessage: t('home.gallery.previous'),
          nextSlideMessage: t('home.gallery.next'),
          slideLabelMessage: t('home.gallery.slide', { n: '{{index}}', total: '{{slidesLength}}' }),
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setActive(swiper.realIndex)}
        className="!px-1 !pb-10 !pt-2"
      >
        {images.map((src, i) => (
          <SwiperSlide
            key={`${src}-${i}`}
            className="coverflow-slide !w-[82%] overflow-hidden rounded-2xl shadow-[0_30px_60px_-30px_rgb(45_27_90/0.55)] sm:!w-[70%] lg:!w-[66%]"
          >
            {({ isActive }: { isActive: boolean }) => (
              <button
                type="button"
                tabIndex={isActive ? 0 : -1}
                onClick={() => (isActive ? openViewer(i) : swiperRef.current?.slideToLoop(i))}
                aria-label={isActive ? t('home.gallery.enlarge') : t('home.gallery.goTo', { n: i + 1 })}
                className={`focus-ring group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink-100 sm:aspect-[16/10] ${
                  isActive ? 'cursor-zoom-in' : 'cursor-pointer'
                }`}
              >
                <Photo
                  src={src}
                  alt={`${alt} — ${i + 1}/${count}`}
                  sizes="(min-width: 1024px) 55vw, 82vw"
                  eager={i < 3 || i === count - 1}
                />
                {/* A hairline inside the edge, so pale photographs keep their shape on white. */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-ink-900/10" />
                {isActive && <ExpandBadge />}
              </button>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex items-center justify-center gap-4 sm:gap-6">
        <ArrowButton
          direction="previous"
          label={t('home.gallery.previous')}
          disabled={false}
          onClick={() => swiperRef.current?.slidePrev()}
        />
        <div className="flex flex-wrap items-center justify-center gap-0.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => swiperRef.current?.slideToLoop(i)}
              aria-label={t('home.gallery.goTo', { n: i + 1 })}
              aria-current={i === active ? 'true' : undefined}
              className="focus-ring group/dot flex h-8 items-center rounded-full px-1"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-500 ease-spring ${
                  i === active ? 'w-7 bg-leaf-600' : 'w-2 bg-ink-300 group-hover/dot:bg-ink-500'
                }`}
              />
            </button>
          ))}
        </div>
        <ArrowButton
          direction="next"
          label={t('home.gallery.next')}
          disabled={false}
          onClick={() => swiperRef.current?.slideNext()}
        />
      </div>

      {viewerElement}
    </section>
  );
}

/** The small "open full screen" mark on the photograph in front. */
function ExpandBadge() {
  return (
    <span
      aria-hidden="true"
      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(12_12_14/0.55)] text-white backdrop-blur-md transition-transform duration-300 ease-spring group-hover:scale-110"
    >
      <Expand className="h-4 w-4" />
    </span>
  );
}

function ArrowButton({
  direction,
  label,
  disabled,
  onClick,
  tone = 'light',
}: {
  direction: 'previous' | 'next';
  label: string;
  disabled: boolean;
  onClick: () => void;
  tone?: 'light' | 'dark';
}) {
  const Icon = direction === 'previous' ? ArrowLeft : ArrowRight;
  const toneClass =
    tone === 'light'
      ? 'border-ink-200 bg-white text-ink-700 hover:border-leaf-600 hover:bg-leaf-600 hover:text-white disabled:hover:border-ink-200 disabled:hover:bg-white disabled:hover:text-ink-700'
      : 'border-white/20 bg-white/[0.06] text-white hover:border-white hover:bg-white hover:text-ink-900 disabled:hover:border-white/20 disabled:hover:bg-white/[0.06] disabled:hover:text-white';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`focus-ring group/arrow flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ease-spring active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 ${toneClass}`}
    >
      <Icon
        aria-hidden="true"
        className={`h-4 w-4 transition-transform duration-300 ease-spring ${
          direction === 'previous' ? 'group-hover/arrow:-translate-x-0.5' : 'group-hover/arrow:translate-x-0.5'
        } group-disabled/arrow:translate-x-0`}
      />
    </button>
  );
}

/**
 * Full screen, on a near-black ground (neutral, never plum, behind
 * photographs) so the colours of the pictures are not tinted. The whole
 * photograph is shown, uncropped, on the same kind of track; a filmstrip
 * underneath jumps anywhere. Esc closes, the arrow keys page, Tab stays inside.
 * Portalled to <body>: a transformed ancestor (a Reveal) would otherwise trap
 * a fixed overlay inside its own box.
 */
export function PhotoViewer({
  images,
  alt,
  start,
  onClose,
}: {
  images: string[];
  alt: string;
  start: number;
  onClose: (last: number) => void;
}) {
  const { t } = useTranslation();
  const count = images.length;
  const { active, goTo, trackProps } = useTrack(count);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const filmRef = useRef<HTMLUListElement | null>(null);
  const activeRef = useRef(start);
  activeRef.current = active;

  // Open on the chosen photograph, lock the page behind, and give focus back on close.
  // The viewer only ever mounts after a click, so `document` is always there.
  useEffect(() => {
    const returnFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    goTo(start, true);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      returnFocus?.focus?.();
    };
    // Runs once per opening.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => onClose(activeRef.current), [onClose]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(activeRef.current + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(activeRef.current - 1);
      } else if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex="0"]')
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close, goTo]);

  // Keep the current frame of the filmstrip in view.
  useEffect(() => {
    const film = filmRef.current;
    const thumb = film?.children[active] as HTMLElement | undefined;
    if (!film || !thumb) return;
    const target = thumb.offsetLeft - (film.clientWidth - thumb.offsetWidth) / 2;
    film.scrollTo({ left: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [active]);

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('home.gallery.label', { name: alt })}
      className="carousel-viewer focus-light fixed inset-0 z-[90] flex flex-col bg-[rgb(10_10_12/0.96)] text-white backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-5">
        <p className="tnum flex items-baseline gap-2" aria-live="polite">
          <span className="sr-only">{t('home.gallery.slide', { n: active + 1, total: count })}</span>
          <span aria-hidden="true" className="font-display text-2xl font-semibold leading-none text-white">
            {pad(active + 1)}
          </span>
          <span aria-hidden="true" className="font-mono text-[0.7rem] tracking-[0.16em] text-white/60">
            / {pad(count)}
          </span>
        </p>
        <p className="hidden min-w-0 flex-1 truncate text-center font-ui text-sm text-white/70 sm:block">{alt}</p>
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label={t('home.gallery.close')}
          className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-white transition-all duration-300 ease-spring hover:rotate-90 hover:border-white hover:bg-white hover:text-ink-900 active:scale-95"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <div {...trackProps} className="carousel-track carousel-track--viewer absolute inset-0 flex overflow-x-auto">
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              role="group"
              aria-roledescription="slide"
              aria-label={t('home.gallery.slide', { n: i + 1, total: count })}
              className="carousel-slide carousel-slide--viewer relative h-full shrink-0 basis-full px-4 sm:px-24"
            >
              <div className="relative h-full w-full">
                <Photo
                  src={src}
                  alt={`${alt} — ${i + 1}/${count}`}
                  sizes="100vw"
                  fit="contain"
                  eager={Math.abs(i - start) <= 1}
                />
              </div>
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 sm:block lg:left-8">
              <ArrowButton tone="dark" direction="previous" label={t('home.gallery.previous')} disabled={active === 0} onClick={() => goTo(active - 1)} />
            </div>
            <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 sm:block lg:right-8">
              <ArrowButton tone="dark" direction="next" label={t('home.gallery.next')} disabled={active === count - 1} onClick={() => goTo(active + 1)} />
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <ul ref={filmRef} className="carousel-film relative flex gap-2 overflow-x-auto px-4 py-4 sm:justify-center sm:px-8 sm:py-5">
          {images.map((src, i) => (
            <li key={`${src}-${i}`} className="shrink-0">
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={t('home.gallery.goTo', { n: i + 1 })}
                aria-current={i === active ? 'true' : undefined}
                className={`focus-ring relative block h-14 w-20 overflow-hidden rounded-lg bg-white/[0.08] transition-all duration-300 ease-spring sm:h-16 sm:w-24 ${
                  i === active
                    ? 'opacity-100 ring-2 ring-leaf-300 ring-offset-2 ring-offset-[rgb(10_10_12)]'
                    : 'opacity-40 hover:opacity-80'
                }`}
              >
                <Photo src={src} alt="" sizes="96px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>,
    document.body
  );
}
