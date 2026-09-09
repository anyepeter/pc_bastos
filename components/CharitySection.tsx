'use client';

import { ArrowRight, ArrowUpRight, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import Reveal from '@/components/Reveal';
import BrushEdge from '@/components/BrushEdge';
import type { PublicCharityProgram } from '@/app/charity/CharityClient';

interface CharitySectionProps {
  /** Published programs, fetched by the page. The section hides itself when empty. */
  programs: PublicCharityProgram[];
}

/**
 * The council's programmes.
 *
 * Built to the supplied reference's "what we do" band: a dark ground, the
 * heading held left against a standfirst and an all-items link on the right,
 * then numbered image cards in an even row. The dark band is deliberate — the
 * reference uses one here to break a long light page.
 */
export default function CharitySection({ programs }: CharitySectionProps) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  // Nothing published yet — don't render an empty band on the home page.
  if (programs.length === 0) return null;

  const shown = programs.slice(0, 3);
  const read = (value: unknown) => getTranslatedText(value as any, language);

  /**
   * Track the row to what is actually published. The reference shows three
   * cards; with two, a fixed three-column grid strands an empty third.
   */
  const columns =
    shown.length === 1
      ? 'sm:grid-cols-1 lg:max-w-2xl'
      : shown.length === 2
        ? 'sm:grid-cols-2'
        : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="grain relative overflow-hidden bg-plum-950 pb-20 pt-20 lg:pb-28 lg:pt-28">
      {/* Painted edge at the head, in the colour of the section above, so it
          reads as that ground torn over this band. Rotated so the paint
          hangs downward and does not mirror the foot. */}
      <BrushEdge
        fill="#ffffff"
        className="pointer-events-none absolute inset-x-0 -top-px z-10 h-11 w-full rotate-180 sm:h-14 lg:h-[55px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 h-[32rem] w-[32rem] rounded-full bg-plum-800/60 blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-plum-900/70 blur-[140px]"
      />

      <div className="shell relative">
        {/* Heading left, standfirst and all-items link right */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-plum-400" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-300">
                  {t('home.sections.programs')}
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-7 max-w-[18ch] font-display text-[clamp(2.1rem,4.2vw,3.4rem)] font-semibold leading-[1.04] tracking-tight text-white text-balance">
                {t('charity.title')}{' '}
                <span className="text-leaf-300">{t('charity.titleHighlight')}</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={140} className="lg:col-span-5">
            <p className="max-w-[46ch] text-base leading-relaxed text-plum-200 text-pretty">
              {t('charity.subtitle')}
            </p>
            <Link
              href="/charity"
              className="focus-ring group mt-5 inline-flex items-center gap-2.5 font-ui text-sm font-semibold text-white transition-colors duration-300 hover:text-plum-200"
            >
              {t('charity.viewAllPrograms')}
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 transition-all duration-300 ease-spring group-hover:border-plum-300 group-hover:bg-white/10">
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-spring group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Reveal>
        </div>

        {/* Numbered cards, an even row as in the reference */}
        <ul className={`mt-12 grid gap-7 ${columns}`}>
          {shown.map((program, i) => {
            const title = read(program.title);
            const cover = program.images[0];

            return (
              <Reveal as="li" key={program.id} delay={i * 110} className="h-full">
                <Link
                  href={`/charity/${program.slug}`}
                  className="focus-ring group flex h-full flex-col"
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <div className="aspect-[4/3] w-full">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt={title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-1000 ease-spring group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-plum-800 to-plum-900" />
                      )}
                    </div>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum-950/70 via-transparent to-transparent"
                    />

                    {/* The reference numbers each card */}
                    <span className="tnum absolute right-4 top-4 rounded-full bg-plum-950/80 px-3.5 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white backdrop-blur">
                      {`No. ${String(i + 1).padStart(2, '0')}`}
                    </span>

                    {read(program.beneficiaries) && (
                      <span className="absolute bottom-4 left-4 right-4 inline-flex max-w-fit items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-medium text-ink-800">
                        <Users className="h-3.5 w-3.5 shrink-0 text-plum-600" />
                        <span className="truncate">{read(program.beneficiaries)}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col pt-6">
                    {read(program.impact) && (
                      <p className="truncate font-mono text-[0.6rem] uppercase tracking-[0.2em] text-plum-300">
                        {read(program.impact)}
                      </p>
                    )}

                    <h3 className="mt-3 line-clamp-2 font-display text-xl font-medium leading-snug text-white transition-colors duration-300 group-hover:text-plum-200 sm:text-2xl">
                      {title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-plum-200/80 text-pretty">
                      {read(program.description)}
                    </p>

                    {/* Pinned low so the row of CTAs lines up across cards */}
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                      {read(program.location) ? (
                        <span className="flex min-w-0 items-center gap-2 text-sm text-plum-200/70">
                          <MapPin className="h-4 w-4 shrink-0 text-plum-400" />
                          <span className="truncate">{read(program.location)}</span>
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="flex shrink-0 items-center gap-2 font-ui text-sm font-semibold text-white">
                        {t('charity.viewDetails')}
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
      {/* Painted hand-off into the section below */}
      <BrushEdge className="pointer-events-none absolute inset-x-0 -bottom-px z-10 h-11 w-full sm:h-14 lg:h-[55px]" />
    </section>
  );
}
