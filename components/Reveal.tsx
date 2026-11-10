'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Stagger, in ms, applied as a CSS transition-delay. */
  delay?: number;
  className?: string;
  /** Rendered element — keeps the markup semantic (li, section, figure...). */
  as?: ElementType;
  /**
   * How it arrives. `rise` (default) lifts and fades; `wipe` uncovers the box
   * from the bottom edge up and settles an oversized image inside it; `fade`
   * only fades; `left`/`right` slide in sideways; `scale` grows from 96%.
   */
  variant?: 'rise' | 'wipe' | 'fade' | 'left' | 'right' | 'scale';
}

/**
 * Reveals its children once they scroll into view, then stops observing.
 *
 * The displacement itself lives in the `.reveal` utility so the animation runs
 * on transform/opacity only, and is disabled wholesale under
 * `prefers-reduced-motion`.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
  variant = 'rise',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No IntersectionObserver (or an old browser) must never mean invisible
    // content — show it immediately instead.
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -80px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-revealed={revealed}
      data-variant={variant === 'rise' ? undefined : variant}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
