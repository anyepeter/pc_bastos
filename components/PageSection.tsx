'use client';

import BrushEdge from '@/components/BrushEdge';

type Tone = 'white' | 'tint' | 'dark';

interface PageSectionProps {
  /** `white` and `tint` alternate down a page; `dark` is a punctuating band. */
  tone?: Tone;
  /**
   * Paint the section's own colour outward onto its neighbours. Reserved for
   * `dark` bands — a light band painting onto a light one is invisible.
   *
   * `true` paints both edges. Use `'top'` for a dark band that sits directly
   * above the footer: the footer paints its own top edge upward, so a bottom
   * edge here puts two brush strokes in the same 110px — in two different
   * purples, since the footer is plum-900 and a dark band is plum-950.
   */
  paint?: boolean | 'top' | 'bottom';
  /** A soft accent glow. On by default; turn it off for dense, tabular pages. */
  glow?: boolean;
  /** Extra classes on the <section>. */
  className?: string;
  /** Extra classes on the inner `.shell`. */
  innerClassName?: string;
  id?: string;
  children: React.ReactNode;
}

const GROUNDS = {
  white: { bg: 'bg-white', hex: '#ffffff', glow: 'bg-plum-50' },
  tint: { bg: 'bg-ink-50', hex: '#FAF9FC', glow: 'bg-plum-100/60' },
  dark: { bg: 'bg-plum-950', hex: '#1F1338', glow: 'bg-plum-800/60' },
} satisfies Record<Tone, { bg: string; hex: string; glow: string }>;

/**
 * A page band: ground, rhythm, grain and — for dark bands — the painted edges.
 *
 * The paint is always the section's OWN colour thrown outward, never the
 * neighbour's colour laid inward. That is what makes it safe to drop a band
 * anywhere: it needs no knowledge of what sits above or below it, so it cannot
 * seam. (A neighbour-matched edge has to be re-checked every time the page
 * order changes, and silently breaks when it isn't.)
 */
export default function PageSection({
  tone = 'white',
  paint = false,
  glow = true,
  className = '',
  innerClassName = '',
  id,
  children,
}: PageSectionProps) {
  const g = GROUNDS[tone];
  const paintTop = paint === true || paint === 'top';
  const paintBottom = paint === true || paint === 'bottom';

  return (
    <section
      id={id}
      /* Painted bands must not clip: the edges overhang top and bottom. */
      className={`grain relative ${g.bg} ${paint ? '' : 'overflow-hidden'} py-12 lg:py-20 ${className}`}
    >
      {paintTop && (
        <BrushEdge
          fill={g.hex}
          className="pointer-events-none absolute inset-x-0 bottom-full z-10 h-11 w-full sm:h-14 lg:h-[55px]"
        />
      )}

      {glow && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className={`absolute -right-40 top-0 h-[30rem] w-[30rem] rounded-full ${g.glow} blur-[140px]`} />
        </div>
      )}

      <div className={`shell relative ${innerClassName}`}>{children}</div>

      {paintBottom && (
        <BrushEdge
          fill={g.hex}
          className="pointer-events-none absolute inset-x-0 top-full z-10 h-11 w-full rotate-180 sm:h-14 lg:h-[55px]"
        />
      )}
    </section>
  );
}
