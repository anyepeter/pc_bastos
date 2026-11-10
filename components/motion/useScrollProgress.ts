'use client';

import { useEffect, type RefObject } from 'react';

export type ProgressMode =
  /** 0 as the element's top meets the viewport's foot, 1 as its foot leaves the top. Parallax. */
  | 'through'
  /** 0 as the element's top reaches `anchor`, 1 as its foot does. Lines that draw as you read. */
  | 'anchor';

interface Options {
  mode?: ProgressMode;
  /** For `anchor`: the line in the viewport, as a fraction of its height from the top. */
  anchor?: number;
}

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Writes the element's scroll progress (0–1) to its `--progress` custom
 * property, so CSS does the animating and React never re-renders per frame.
 *
 * The scroll listener only runs while the element is near the viewport. Under
 * reduced motion the value is pinned to its resting state: fully drawn for
 * `anchor`, centred (no offset) for `through`.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, { mode = 'through', anchor = 0.6 }: Options = {}) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reducedMotion()) {
      node.style.setProperty('--progress', mode === 'anchor' ? '1' : '0.5');
      return;
    }

    let frame = 0;
    let active = false;

    const measure = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw =
        mode === 'through'
          ? (vh - rect.top) / (vh + rect.height)
          : (vh * anchor - rect.top) / Math.max(rect.height, 1);
      const progress = Math.min(1, Math.max(0, raw));
      node.style.setProperty('--progress', progress.toFixed(4));
    };

    const onScroll = () => {
      if (active && !frame) frame = requestAnimationFrame(measure);
    };

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            (entries) => {
              active = entries.some((entry) => entry.isIntersecting);
              if (active) onScroll();
            },
            { rootMargin: '25% 0px 25% 0px' },
          );

    if (observer) observer.observe(node);
    else active = true;

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, mode, anchor]);
}
