'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import BrushEdge from '@/components/BrushEdge';

/** The hero's ground. Shared with the painted edge, which must match it exactly. */
const GROUND = '#1F1338'; // plum-950

export interface Crumb {
  label: string;
  /** Omit on the final crumb — the current page is not a link. */
  href?: string;
}

interface PageHeroProps {
  /** Small mono label above the title, e.g. "Member churches". */
  eyebrow: string;
  title: string;
  /** Rendered in the leaf accent, on its own line. Optional. */
  titleHighlight?: string;
  /** One or two sentences. Anything longer belongs in the page body. */
  lede?: string;
  crumbs?: Crumb[];
  /** Actions, counts or filters that belong with the title. */
  children?: React.ReactNode;
}

/**
 * The standard header for every interior page.
 *
 * Deliberately typographic — no photograph. The council owns three usable
 * photographs, and the pages this replaced papered over that with hardcoded
 * Unsplash stock (a US church on a Cameroonian council's site). A set banner
 * colour reads as more considered than borrowed imagery, and it cannot go
 * stale.
 *
 * The painted foot is the hero's OWN colour thrown down onto whatever follows,
 * so no page has to declare the colour of its first section for the join to be
 * seamless.
 */
export default function PageHero({
  eyebrow,
  title,
  titleHighlight,
  lede,
  crumbs = [],
  children,
}: PageHeroProps) {
  return (
    /* No `overflow-hidden`: the painted foot overhangs the section, and
       clipping would shear the bristles off. The glow is clipped separately. */
    <section className="grain relative bg-plum-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-24 h-[34rem] w-[34rem] rounded-full bg-plum-800/60 blur-[150px]" />
        <div className="absolute -left-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-leaf-900/40 blur-[150px]" />
      </div>

      {/* Clears the fixed navigation (h-16 / sm:h-20) with room to breathe. */}
      <div className="shell relative pb-20 pt-28 sm:pt-36 lg:pb-28 lg:pt-44">
        {crumbs.length > 0 && (
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-9">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-plum-300">
                {crumbs.map((crumb, i) => (
                  <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                    {i > 0 && (
                      <ChevronRight aria-hidden="true" className="h-3 w-3 shrink-0 text-plum-400" />
                    )}
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="focus-ring rounded transition-colors duration-300 hover:text-leaf-300"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-plum-200">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        )}

        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-10 bg-leaf-400" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-leaf-300">
                  {eyebrow}
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-7 font-display text-[clamp(2.4rem,5.2vw,4.25rem)] font-semibold leading-[1.02] tracking-tight text-white text-balance">
                {title}
                {titleHighlight && (
                  <>
                    {' '}
                    <span className="text-leaf-300">{titleHighlight}</span>
                  </>
                )}
              </h1>
            </Reveal>
          </div>

          {lede && (
            <Reveal delay={140} className="lg:col-span-4 lg:col-start-9">
              <p className="max-w-[52ch] text-base leading-relaxed text-plum-200 text-pretty lg:pb-2">
                {lede}
              </p>
            </Reveal>
          )}
        </div>

        {children && <Reveal delay={200}>{children}</Reveal>}
      </div>

      <BrushEdge
        fill={GROUND}
        className="pointer-events-none absolute inset-x-0 top-full z-10 h-11 w-full rotate-180 sm:h-14 lg:h-[55px]"
      />
    </section>
  );
}
