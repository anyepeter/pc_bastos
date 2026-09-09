'use client';

import Reveal from '@/components/Reveal';

type Tone = 'light' | 'dark';

interface SectionHeadingProps {
  /** Optional: omit where the page hero already carries the label. */
  eyebrow?: string;
  title: string;
  /** Rendered in the leaf accent. Optional. */
  titleHighlight?: string;
  /** Standfirst. Sits opposite the title on wide screens. */
  standfirst?: string;
  /** `dark` for plum grounds, `light` for white/ink-50. */
  tone?: Tone;
  /** `split` puts the standfirst to the right; `stack` keeps it under the title. */
  layout?: 'split' | 'stack';
  className?: string;
  /** Heading level — a page must not repeat h1, and must not skip levels. */
  as?: 'h2' | 'h3';
}

const TONES = {
  light: {
    rule: 'bg-plum-500',
    eyebrow: 'text-plum-700',
    title: 'text-ink-900',
    highlight: 'text-leaf-600',
    standfirst: 'text-ink-600',
  },
  dark: {
    rule: 'bg-leaf-400',
    eyebrow: 'text-leaf-300',
    title: 'text-white',
    highlight: 'text-leaf-300',
    standfirst: 'text-plum-200',
  },
} satisfies Record<Tone, Record<string, string>>;

/**
 * The section header used across the site: a ruled mono eyebrow, a display
 * heading with an accented tail, and an optional standfirst set opposite it.
 *
 * Centralised so every page shares one rhythm — the pages this replaced each
 * invented their own heading sizes, weights and colours.
 */
export default function SectionHeading({
  eyebrow,
  title,
  titleHighlight,
  standfirst,
  tone = 'light',
  layout = 'split',
  className = '',
  as: Tag = 'h2',
}: SectionHeadingProps) {
  const c = TONES[tone];
  const split = layout === 'split' && Boolean(standfirst);

  return (
    <div className={`grid gap-8 ${split ? 'lg:grid-cols-12 lg:items-end' : ''} ${className}`}>
      <div className={split ? 'lg:col-span-6' : ''}>
        {eyebrow && (
          <Reveal>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className={`h-px w-10 ${c.rule}`} />
              <p className={`font-mono text-[0.68rem] uppercase tracking-[0.28em] ${c.eyebrow}`}>
                {eyebrow}
              </p>
            </div>
          </Reveal>
        )}

        <Reveal delay={80}>
          <Tag
            className={`${eyebrow ? 'mt-7' : ''} font-display text-[clamp(2.1rem,4.2vw,3.4rem)] font-semibold leading-[1.04] tracking-tight text-balance ${c.title}`}
          >
            {title}
            {titleHighlight && (
              <>
                {' '}
                <span className={c.highlight}>{titleHighlight}</span>
              </>
            )}
          </Tag>
        </Reveal>
      </div>

      {standfirst && (
        <Reveal delay={140} className={split ? 'lg:col-span-5 lg:col-start-8' : ''}>
          <p className={`max-w-[48ch] text-base leading-relaxed text-pretty ${c.standfirst} ${split ? 'lg:pb-2' : 'mt-5'}`}>
            {standfirst}
          </p>
        </Reveal>
      )}
    </div>
  );
}
