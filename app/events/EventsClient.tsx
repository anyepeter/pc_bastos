'use client';

import Link from 'next/link';
import { ArrowUpRight, Calendar, Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText, readTranslation } from '@/lib/translations';
import { formatLongDate, formatMonthDay, formatTime, isUpcoming } from '@/lib/format';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import Reveal from '@/components/Reveal';

export interface PublicEvent {
  id: string;
  slug: string;
  title: unknown;
  description: unknown;
  location: unknown;
  category: unknown;
  date: string;
  time: string | null;
  imageUrl: string | null;
}

/**
 * The council's diary — the fuller expression of the landing page's
 * "next gatherings" strip, so it deliberately reuses that card's vocabulary:
 * the plum date chip, the mono metadata and the same hover behaviour.
 *
 * An event is a piece of data before it is a story, so the date, time and place
 * are set in the mono face and the date chip anchors every row. Where an event
 * carries a real uploaded poster it runs alongside; where it does not the row
 * stays typographic rather than borrowing stock photography.
 */
export default function EventsClient({ events }: { events: PublicEvent[] }) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  // Values arrive from Prisma `Json` columns: legacy rows can hold a bare
  // string, and rendering the raw object as a React child crashes the page.
  const read = (value: unknown) => getTranslatedText(readTranslation(value), language);

  return (
    <>
      <PageHero
        title={language === 'fr' ? 'Événements à venir' : 'Upcoming Events'}
        lede={
          language === 'fr'
            ? 'Rejoignez-nous pour ces rassemblements et événements communautaires'
            : 'Join us for these meaningful gatherings and community events'
        }
      />

      {events.length === 0 ? (
        <PageSection tone="tint">
          <Reveal>
            <div className="card mx-auto max-w-2xl rounded-2xl p-10 text-center sm:p-14">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-ink-200 bg-white">
                <Calendar aria-hidden="true" className="h-5 w-5 text-leaf-600" />
              </span>

              <p className="mt-7 font-display text-2xl font-semibold leading-snug tracking-tight text-ink-900 text-balance">
                {language === 'fr'
                  ? "Aucun événement n'est programmé pour le moment."
                  : 'No events are scheduled at the moment.'}
              </p>

              <p className="mt-4 text-base leading-relaxed text-ink-500 text-pretty">
                {language === 'fr'
                  ? 'Revenez bientôt pour découvrir nos prochains rassemblements.'
                  : 'Check back soon for our next gatherings.'}
              </p>
            </div>
          </Reveal>
        </PageSection>
      ) : (
        <PageSection tone="white">
          <ul className="grid gap-5">
            {events.map((event, i) => {
              const title = read(event.title);
              const description = read(event.description);
              const location = read(event.location);
              const category = read(event.category);
              const monthDay = formatMonthDay(event.date, language);
              const upcoming = isUpcoming(event.date);

              return (
                <Reveal as="li" key={event.id} delay={Math.min(i, 8) * 60}>
                  <Link
                    href={`/events/${event.slug}`}
                    className="card card-hover spotlight focus-ring group flex h-full flex-col gap-5 rounded-2xl p-4 sm:p-6 lg:flex-row lg:items-center lg:gap-8"
                    onMouseMove={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
                      e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
                    }}
                  >
                    {/* A real uploaded poster where there is one. Nothing is
                        substituted where there is not. */}
                    {event.imageUrl && (
                      <div className="shrink-0 overflow-hidden rounded-xl bg-ink-100 lg:order-last lg:w-60 xl:w-72">
                        <div className="aspect-[16/9] w-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={event.imageUrl}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.04]"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-1 items-start gap-4 sm:gap-6">
                      {/* The date anchors the row — same chip as the landing
                          page's strip, set larger. */}
                      <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-xl bg-plum-50 ring-1 ring-inset ring-plum-100 sm:h-20 sm:w-20">
                        <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-plum-700">
                          {monthDay.month}
                        </span>
                        <span className="tnum mt-1 font-display text-3xl font-semibold leading-none text-ink-900">
                          {monthDay.day}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        {(category || upcoming) && (
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            {category && (
                              <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-500">
                                {category}
                              </span>
                            )}
                            {upcoming && (
                              <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-plum-700">
                                {language === 'fr' ? 'À venir' : 'Upcoming'}
                              </span>
                            )}
                          </div>
                        )}

                        <h2
                          className={`${
                            category || upcoming ? 'mt-3' : ''
                          } line-clamp-2 font-display text-xl font-medium leading-snug tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-plum-700 sm:text-2xl`}
                        >
                          {title}
                        </h2>

                        {description && (
                          <p className="mt-3 line-clamp-2 max-w-[62ch] text-[0.95rem] leading-relaxed text-ink-600 text-pretty">
                            {description}
                          </p>
                        )}

                        {/* Dates, times and places are data: mono, and always
                            through the locale-aware formatters. */}
                        <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.68rem] tracking-[0.04em] text-ink-500">
                          <li className="tnum inline-flex items-center gap-2">
                            <Calendar aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-leaf-600" />
                            {formatLongDate(event.date, language)}
                          </li>

                          {event.time && (
                            <li className="tnum inline-flex items-center gap-2">
                              <Clock aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-leaf-600" />
                              {formatTime(event.time, language)}
                            </li>
                          )}

                          {location && (
                            <li className="inline-flex min-w-0 items-center gap-2">
                              <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-leaf-600" />
                              <span className="truncate">{location}</span>
                            </li>
                          )}
                        </ul>
                      </div>

                      <ArrowUpRight
                        aria-hidden="true"
                        className="mt-1 hidden h-5 w-5 shrink-0 text-ink-400 transition-all duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-plum-600 sm:block"
                      />
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </PageSection>
      )}
    </>
  );
}
