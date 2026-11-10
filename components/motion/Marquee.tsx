'use client';

import type { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  /** Seconds per loop. */
  duration?: number;
  /** Run right-to-left (default) or the other way. */
  reverse?: boolean;
  className?: string;
  /** Accessible text for the ribbon; the moving copies are hidden from readers. */
  label?: string;
}

/**
 * An endless ribbon. The run is rendered twice and slid by exactly half its
 * width, so the loop closes on an identical frame. Pauses under the pointer;
 * static under reduced motion.
 */
export default function Marquee({ children, duration = 40, reverse = false, className = '', label }: MarqueeProps) {
  return (
    <div className={`marquee ${className}`} role={label ? 'img' : undefined} aria-label={label}>
      <div
        className="marquee-track"
        aria-hidden="true"
        style={{ '--marquee-duration': `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' } as React.CSSProperties}
      >
        <div className="marquee-run">{children}</div>
        <div className="marquee-run">{children}</div>
      </div>
    </div>
  );
}
