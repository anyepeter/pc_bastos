'use client';

import { Fragment, type ElementType } from 'react';
import { useInView } from './useInView';

export interface SplitPart {
  text: string;
  /** Classes for this run of words, e.g. the accent colour on a highlight. */
  className?: string;
}

interface SplitRevealProps {
  /** A plain string, or runs of words styled differently. */
  text: string | SplitPart[];
  as?: ElementType;
  className?: string;
  /** Delay before the first word, ms. */
  delay?: number;
  /** Gap between words, ms. */
  stagger?: number;
}

/**
 * A heading whose words rise one after another from behind a mask.
 *
 * Every word stays real text in reading order, so screen readers, search
 * engines and copy-paste see an ordinary heading. Hidden only under `.js`
 * (set before first paint), and the motion is stripped under reduced motion.
 */
export default function SplitReveal({ text, as: Tag = 'span', className = '', delay = 0, stagger = 60 }: SplitRevealProps) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
  const parts: SplitPart[] = typeof text === 'string' ? [{ text }] : text;

  let index = 0;

  return (
    <Tag ref={ref} data-revealed={inView} className={`split ${className}`}>
      {parts.map((part, p) => {
        const words = part.text.split(/\s+/).filter(Boolean);
        return (
          <Fragment key={p}>
            {p > 0 && ' '}
            {words.map((word, w) => {
              const order = index++;
              return (
                <Fragment key={w}>
                  {w > 0 && ' '}
                  <span className="split-mask">
                    <span
                      className={`split-word ${part.className ?? ''}`}
                      style={{ '--split-delay': `${delay + order * stagger}ms` } as React.CSSProperties}
                    >
                      {word}
                    </span>
                  </span>
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
    </Tag>
  );
}
