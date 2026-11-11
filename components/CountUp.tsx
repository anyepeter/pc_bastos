'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/store/hooks';

interface CountUpProps {
  /** Target value. Rendered with tabular figures so it never jitters. */
  value: number;
  /** Rendered before/after the number, e.g. "11.5" + "M". */
  suffix?: string;
  prefix?: string;
  durationMs?: number;
  className?: string;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Counts from zero to `value` the first time it enters the viewport.
 *
 * Falls straight to the final value when the visitor has asked for reduced
 * motion, so the figure is never merely decorative.
 */
export default function CountUp({
  value,
  suffix = '',
  prefix = '',
  durationMs = 1400,
  className = '',
}: CountUpProps) {
  const language = useAppSelector((state) => state.blog.language);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);
  // A figure like 11.5 keeps its decimal while counting and at rest.
  const decimals = (String(value).split('.')[1] ?? '').length;
  const factor = 10 ** decimals;
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1);
          // Ease-out cubic: fast to begin, settles rather than stopping dead.
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * value * factor) / factor);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, durationMs, factor]);

  return (
    <span ref={ref} className={`tnum ${className}`}>
      {prefix}
      {/* Grouped the page's way (1,580 / 1 580), never the browser's. French
          uses a no-break space: the fonts carry U+00A0 but not U+202F. */}
      {display
        .toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
        .replace(/\u202F/g, '\u00A0')}
      {/* French sets a space before a unit: « 11,5 M ». */}
      {language === 'fr' && /^[A-Za-z]/.test(suffix) ? '\u00A0' : ''}
      {suffix}
    </span>
  );
}
