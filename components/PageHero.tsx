'use client';

import Reveal from '@/components/Reveal';

interface PageHeroProps {
  title: string;
  /** Rendered in the leaf accent, after the title. Optional. */
  titleHighlight?: string;
  /** One or two sentences. Anything longer belongs in the page body. */
  lede?: string;
  /** Actions, counts or metadata that belong with the title. */
  children?: React.ReactNode;
}

/**
 * The page header for every interior page.
 *
 * It used to be a full-bleed plum banner with a painted foot. That was a lot of
 * furniture for what is only a title and a sentence, and it pushed the actual
 * content below the fold — so it is now a plain light header that shares the
 * ground with the first section and simply lets the typography carry the page.
 *
 * No painted edge: paint marks a change of ground, and there is no longer one
 * here. The dark bands further down each page still carry theirs.
 */
export default function PageHero({ title, titleHighlight, lede, children }: PageHeroProps) {
  return (
    /* `bg-white` matches the first band on nearly every page, so the header
       reads as the top of the content rather than as a separate slab — and for
       the same reason its bottom padding is only enough to keep the last line
       off the boundary — the next section's top padding carries the rest of
       the gap, rather than the two stacking to ~150px. */
    <section className="relative bg-white pb-6 pt-28 sm:pt-32 lg:pb-8 lg:pt-36">
      <div className="shell relative">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <h1 className="font-display text-[clamp(2.25rem,4.6vw,3.75rem)] font-semibold leading-[1.04] tracking-tight text-ink-900 text-balance">
              {title}
              {titleHighlight && (
                <>
                  {' '}
                  <span className="text-leaf-600">{titleHighlight}</span>
                </>
              )}
            </h1>
          </Reveal>

          {lede && (
            <Reveal delay={80}>
              <p className="mx-auto mt-5 max-w-[56ch] text-base leading-relaxed text-ink-600 text-pretty">
                {lede}
              </p>
            </Reveal>
          )}
        </div>

        {/* Children keep their own internal layout; only the block is centred,
            so a metadata grid stays a grid rather than collapsing. */}
        {children && (
          <Reveal delay={140}>
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
