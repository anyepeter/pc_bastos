'use client';

import { useRef, type ElementType } from 'react';
import { useScrollProgress } from './useScrollProgress';

interface ScrollWordsProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** Where in the viewport the reading line sits (fraction from the top). */
  anchor?: number;
}

/**
 * A statement that lights up word by word as it is scrolled through, as if
 * being read aloud. Pure CSS off one `--progress` value — no per-word state.
 *
 * Without scripts, or under reduced motion, every word is simply at full ink.
 */
export default function ScrollWords({ text, as: Tag = 'p', className = '', anchor = 0.72 }: ScrollWordsProps) {
  const ref = useRef<HTMLElement | null>(null);
  useScrollProgress(ref, { mode: 'anchor', anchor });
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag
      ref={ref}
      className={`scroll-words ${className}`}
      style={{ '--words': words.length } as React.CSSProperties}
    >
      {words.map((word, i) => (
        <span key={i} style={{ '--i': i } as React.CSSProperties}>
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
