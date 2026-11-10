'use client';

import { useEffect, useRef, useState } from 'react';

interface InViewOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * True once the element has entered the viewport; it then stops observing.
 *
 * Fails open: without IntersectionObserver the element counts as seen, so
 * nothing gated on this can stay hidden.
 */
export function useInView<T extends Element = HTMLElement>({
  threshold = 0.12,
  rootMargin = '0px 0px -80px 0px',
}: InViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView] as const;
}
