'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';

interface MediaGalleryProps {
  images: string[];
  /** Describes the subject, e.g. the church's name. Used to build alt text. */
  alt: string;
  /** Announced on the enlarge control and the dialog. */
  labels?: { enlarge: string; close: string; previous: string; next: string };
}

const DEFAULT_LABELS = {
  enlarge: 'View larger',
  close: 'Close',
  previous: 'Previous image',
  next: 'Next image',
};

/**
 * A lead photograph with a thumbnail strip, and a dialog for the full view.
 *
 * Replaces a Swiper carousel that auto-advanced every five seconds, hid its
 * arrows until hover (so they were unreachable on a touch screen) and drew
 * white pagination dots that were invisible against a light page. A carousel
 * also hides everything but one frame; with two or three photographs a strip
 * shows the lot at once and lets the reader choose.
 */
export default function MediaGallery({ images, alt, labels }: MediaGalleryProps) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const step = useCallback(
    (delta: number) => setActive((i) => (i + delta + images.length) % images.length),
    [images.length],
  );

  const openDialog = useCallback(() => {
    returnFocusRef.current = document.activeElement as HTMLElement;
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    returnFocusRef.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close, step]);

  if (images.length === 0) return null;

  const many = images.length > 1;

  return (
    <div>
      <figure className="m-0">
        <button
          type="button"
          onClick={openDialog}
          aria-label={l.enlarge}
          className="focus-ring group relative block w-full overflow-hidden rounded-2xl border border-ink-200 bg-ink-50"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active]}
            alt={`${alt} — ${active + 1}/${images.length}`}
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.02]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-plum-950/60 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <Expand className="h-4 w-4" />
          </span>
        </button>
      </figure>

      {many && (
        <ul className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {images.map((src, i) => (
            <li key={src + i}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${alt} — ${i + 1}/${images.length}`}
                aria-current={i === active}
                className={`focus-ring block w-full overflow-hidden rounded-xl border transition-all duration-300 ${
                  i === active
                    ? 'border-plum-400 ring-1 ring-inset ring-plum-400'
                    : 'border-ink-200 opacity-70 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" aria-hidden="true" loading="lazy" className="aspect-[4/3] w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={close}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-plum-950/95 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={l.close}
            className="focus-ring absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors duration-300 hover:bg-white/20 sm:right-8 sm:top-8"
          >
            <X className="h-5 w-5" />
          </button>

          {many && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(-1); }}
                aria-label={l.previous}
                className="focus-ring absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors duration-300 hover:bg-white/20 sm:left-8 sm:h-14 sm:w-14"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(1); }}
                aria-label={l.next}
                className="focus-ring absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors duration-300 hover:bg-white/20 sm:right-8 sm:h-14 sm:w-14"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </>
          )}

          <figure className="max-h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[active]}
              alt={`${alt} — ${active + 1}/${images.length}`}
              className="mx-auto max-h-[80vh] w-auto rounded-2xl object-contain shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)]"
            />
            {many && (
              <figcaption className="mt-4 text-center font-mono text-[0.62rem] uppercase tracking-[0.2em] text-plum-300">
                {active + 1} / {images.length}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </div>
  );
}
