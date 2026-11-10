'use client';

import Image from 'next/image';
import Reveal from '@/components/Reveal';
import SplitReveal from '@/components/motion/SplitReveal';
import Parallax from '@/components/motion/Parallax';

interface PageHeroProps {
  title: string;
  /** Rendered in the leaf accent, after the title. Optional. */
  titleHighlight?: string;
  /** One or two sentences. Anything longer belongs in the page body. */
  lede?: string;
  /** Actions, counts or metadata that belong with the title. */
  children?: React.ReactNode;
  /**
   * A wide photograph under the title — the council's own imagery only, never
   * stock. It uncovers from below and drifts against the scroll.
   */
  media?: { src: string; alt: string; position?: string };
  /** An emblem set above the title (a member church's logo, say). */
  mark?: React.ReactNode;
}

/**
 * The page header for every interior page.
 *
 * Still a light, typographic header — the client removed the dark banner, the
 * breadcrumb and the painted foot (2026-09) because they pushed content below
 * the fold. What it gains instead is motion and a little ceremony: the title
 * rises word by word, a hairline ornament with a small cross draws itself
 * outward under the lede, and a faint architectural dot grid sits behind it.
 * A page with real photography can add a cinematic `media` band.
 */
export default function PageHero({ title, titleHighlight, lede, children, media, mark }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-white pb-6 pt-28 sm:pt-32 lg:pb-8 lg:pt-36">
      {/* Dot grid, fading out from the centre. Pure decoration. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage: 'radial-gradient(rgb(91 50 166 / 0.13) 1px, transparent 1.2px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse 55% 60% at 50% 38%, #000 0%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse 55% 60% at 50% 38%, #000 0%, transparent 72%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 -z-10 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-plum-100/60 blur-[110px] animate-drift"
      />

      <div className="shell relative">
        <div className="mx-auto max-w-4xl text-center">
          {mark && (
            <Reveal variant="scale" className="mb-8 flex justify-center">
              {mark}
            </Reveal>
          )}
          <SplitReveal
            as="h1"
            className="font-display text-[clamp(2.25rem,4.6vw,3.75rem)] font-semibold leading-[1.06] tracking-tight text-ink-900 text-balance"
            text={[
              { text: title },
              ...(titleHighlight ? [{ text: titleHighlight, className: 'text-leaf-600' }] : []),
            ]}
          />

          {lede && (
            <Reveal delay={260}>
              <p className="mx-auto mt-5 max-w-[56ch] text-base leading-relaxed text-ink-600 text-pretty">
                {lede}
              </p>
            </Reveal>
          )}

          {/* Ornament: two hairlines growing out of a small cross. */}
          <Reveal delay={320} variant="fade">
            <div aria-hidden="true" className="mx-auto mt-7 flex w-48 items-center gap-3">
              <span className="grow-x h-px flex-1 origin-right bg-gradient-to-l from-plum-300 to-transparent" />
              <svg viewBox="0 0 12 16" className="h-3.5 w-2.5 shrink-0 text-leaf-600" fill="currentColor">
                <rect x="5" y="0" width="2" height="16" rx="0.6" />
                <rect x="0.5" y="4.5" width="11" height="2" rx="0.6" />
              </svg>
              <span className="grow-x h-px flex-1 origin-left bg-gradient-to-r from-plum-300 to-transparent" />
            </div>
          </Reveal>
        </div>

        {/* Children keep their own internal layout; only the block is centred,
            so a metadata grid stays a grid rather than collapsing. */}
        {children && (
          <Reveal delay={360}>
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </Reveal>
        )}

        {media && (
          <Reveal variant="wipe" delay={240} className="mt-10 lg:mt-12">
            <Parallax strength={90} className="h-[clamp(14rem,34vw,30rem)] rounded-2xl bg-ink-100">
              <Image
                src={media.src}
                alt={media.alt}
                fill
                priority
                sizes="(min-width: 1600px) 1500px, 100vw"
                className="object-cover"
                style={{ objectPosition: media.position ?? 'center' }}
              />
            </Parallax>
          </Reveal>
        )}
      </div>
    </section>
  );
}
