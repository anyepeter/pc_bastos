'use client';

import Link from 'next/link';
import { ArrowRight, HeartHandshake, MapPin, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText, readTranslation } from '@/lib/translations';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import Reveal from '@/components/Reveal';

export interface PublicCharityProgram {
  id: string;
  slug: string;
  title: unknown;
  description: unknown;
  impact: unknown;
  beneficiaries: unknown;
  location: unknown;
  images: string[];
}

/**
 * The council's programmes, in full.
 *
 * The fuller expression of the landing page's `CharitySection`: the same card
 * language — numbered cover, beneficiaries chip, impact eyebrow, a footer
 * pairing place against the call to action — set on light ground so a long
 * list stays readable.
 *
 * Programmes carry real uploaded photography or none at all. Where a cover is
 * missing the card degrades to a typographic head (mark + number) rather than
 * borrowing stock imagery, which is what the page this replaced did.
 */
export default function CharityClient({
  programs,
}: {
  programs: PublicCharityProgram[];
}) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  // Prisma `Json` columns may still hold a bare legacy string; `readTranslation`
  // normalises that before it reaches React.
  const read = (value: unknown) => getTranslatedText(readTranslation(value), language);

  const copy =
    language === 'fr'
      ? {
          eyebrow: 'Notre action',
          title: 'Programmes caritatifs',
          subtitle:
            'Transformer des vies par une action solidaire et un développement communautaire durable',
          count: (n: number) =>
            `${n} programme${n > 1 ? 's' : ''} en cours`,
          view: 'Découvrir le programme',
          empty: 'Aucun programme caritatif publié pour le moment.',
          emptyHint: 'Revenez bientôt pour découvrir nos actions.',
        }
      : {
          eyebrow: 'Our work',
          title: 'Charity Programs',
          subtitle:
            'Transforming lives through compassionate outreach and sustainable community development',
          count: (n: number) => `${n} programme${n > 1 ? 's' : ''} running`,
          view: 'Explore this program',
          empty: 'No charity programs have been published yet.',
          emptyHint: 'Check back soon to see the work under way.',
        };

  // A lone programme in a two-column grid strands an empty half; hold it to a
  // single readable measure instead.
  const columns = programs.length === 1 ? 'lg:max-w-3xl' : 'lg:grid-cols-2';

  return (
    <>
      <PageHero
        title={copy.title}
        lede={copy.subtitle}
      >
        {programs.length > 0 && (
          <p className="mt-12 flex items-center justify-center gap-3 border-t border-ink-200 pt-7 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ink-600">
            <span aria-hidden="true" className="h-px w-8 shrink-0 bg-leaf-400" />
            <span className="tnum">{copy.count(programs.length)}</span>
          </p>
        )}
      </PageHero>

      <PageSection tone="white">
        {programs.length === 0 ? (
          <Reveal>
            <div className="rounded-2xl border border-dashed border-ink-300 bg-ink-50 px-6 py-20 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-ink-200 bg-white">
                <HeartHandshake aria-hidden="true" className="h-6 w-6 text-leaf-600" />
              </span>
              <p className="mt-6 font-display text-xl font-semibold tracking-tight text-ink-900">
                {copy.empty}
              </p>
              <p className="mx-auto mt-3 max-w-[42ch] text-base leading-relaxed text-ink-600 text-pretty">
                {copy.emptyHint}
              </p>
            </div>
          </Reveal>
        ) : (
          <ul className={`grid gap-6 ${columns}`}>
            {programs.map((program, i) => {
              const title = read(program.title);
              const description = read(program.description);
              const impact = read(program.impact);
              const beneficiaries = read(program.beneficiaries);
              const location = read(program.location);
              const cover = program.images[0];
              const number = `No. ${String(i + 1).padStart(2, '0')}`;

              return (
                <Reveal as="li" key={program.id} delay={Math.min(i, 8) * 60} className="h-full">
                  <Link
                    href={`/charity/${program.slug}`}
                    className="card card-hover focus-ring group flex h-full flex-col overflow-hidden rounded-2xl"
                  >
                    {cover ? (
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cover}
                          alt={title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.05]"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum-950/70 via-transparent to-transparent"
                        />

                        <span className="tnum absolute right-4 top-4 rounded-full bg-plum-950/80 px-3.5 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white backdrop-blur">
                          {number}
                        </span>

                        {beneficiaries && (
                          // right-4 + max-w-fit keeps the chip inside the card and
                          // lets a long value ellipsis instead of clipping mid-word.
                          <span className="absolute bottom-4 left-4 right-4 inline-flex max-w-fit items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-medium text-ink-800">
                            <Users aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-leaf-600" />
                            <span className="truncate">{beneficiaries}</span>
                          </span>
                        )}
                      </div>
                    ) : (
                      // No photograph for this programme. A mark and its number
                      // rather than a substituted stock image.
                      <div className="flex items-center justify-between gap-4 border-b border-ink-200 bg-ink-50 px-6 py-5">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white transition-colors duration-300 group-hover:border-leaf-300">
                          <HeartHandshake aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                        </span>
                        <span className="tnum font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-400">
                          {number}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-6 lg:p-7">
                      {impact && (
                        <p className="truncate font-mono text-[0.62rem] uppercase tracking-[0.2em] text-plum-700">
                          {impact}
                        </p>
                      )}

                      <h2
                        className={`${impact ? 'mt-4' : ''} line-clamp-2 font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-plum-700`}
                      >
                        {title}
                      </h2>

                      <p className="mt-4 line-clamp-3 text-base leading-relaxed text-ink-600 text-pretty">
                        {description}
                      </p>

                      {!cover && beneficiaries && (
                        <span className="mt-5 inline-flex max-w-full items-center gap-2 self-start rounded-full border border-ink-200 bg-ink-50 px-3.5 py-1.5 text-xs font-medium text-ink-700">
                          <Users aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-leaf-600" />
                          <span className="truncate">{beneficiaries}</span>
                        </span>
                      )}

                      {/* Pinned low so the row of CTAs lines up across cards.
                          Both halves stay on a single line; the location gives
                          up space first and each ellipsises rather than wraps. */}
                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink-200 pt-5">
                        {location ? (
                          <span className="flex min-w-0 flex-1 items-center gap-2 text-sm text-ink-500">
                            <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-leaf-600" />
                            <span className="truncate">{location}</span>
                          </span>
                        ) : (
                          <span className="flex-1" />
                        )}

                        <span className="flex min-w-0 max-w-[60%] shrink-0 items-center gap-2 font-ui text-sm font-medium text-plum-700">
                          <span className="truncate">{copy.view}</span>
                          <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 ease-spring group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        )}
      </PageSection>
    </>
  );
}
