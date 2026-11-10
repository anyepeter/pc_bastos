'use client';

import { useRef, type ReactNode } from 'react';
import { useScrollProgress } from './useScrollProgress';

interface ParallaxProps {
  children: ReactNode;
  /** Total travel in px across the element's pass through the viewport. */
  strength?: number;
  className?: string;
}

/**
 * Slides its contents against the scroll. The wrapper clips; the inner layer
 * is oversized by the travel so no edge ever shows. Put a `fill` image inside.
 */
export default function Parallax({ children, strength = 80, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useScrollProgress(ref, { mode: 'through' });

  return (
    <div
      ref={ref}
      className={`${/\b(absolute|fixed|sticky)\b/.test(className) ? '' : 'relative'} overflow-hidden ${className}`}
      style={{ '--parallax': `${strength}px` } as React.CSSProperties}
    >
      <div className="parallax-layer absolute inset-x-0" style={{ top: -strength / 2, bottom: -strength / 2 }}>
        {children}
      </div>
    </div>
  );
}
