'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import { formatMonthDay, formatTime, isUpcoming } from '@/lib/format';
import Reveal from '@/components/Reveal';
import type { PublicEvent } from '@/app/events/EventsClient';

interface UpcomingEventsSectionProps {
  /**
   * At most two events, already chosen by the page. Empty when nothing is
   * published — the section then renders nothing rather than an empty band.
   */
  events: PublicEvent[];
}

/**
 * The next gatherings. This used to sit inside the hero; it reads better after
 * the introduction, once a visitor knows who the council is.
 */
export default function UpcomingEventsSection({ events }: UpcomingEventsSectionProps) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  if (events.length === 0) return null;

  return (
    <section className="grain relative overflow-hidden bg-ink-50 py-14 lg:py-20">
      <div className="shell relative">
        <Reveal>
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-700">
              {t('home.nextGatherings')}
            </h2>
            <Link
              href="/events"
              className="focus-ring group inline-flex items-center gap-1.5 font-ui text-sm font-medium text-plum-700 transition-colors hover:text-plum-800"
            >
              {t('home.allEvents')}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-spring group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

          <ul className="grid gap-4 sm:grid-cols-2">
            {events.map((event) => {
              const title = getTranslatedText(event.title as any, language);
              const monthDay = formatMonthDay(event.date, language);

              return (
                <li key={event.id}>
                  <Link
                    href={`/events/${event.slug}`}
                    className="card card-hover spotlight focus-ring group flex items-center gap-5 rounded-2xl p-4 sm:p-5"
                    onMouseMove={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
                      e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
                    }}
                  >
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-plum-50 ring-1 ring-inset ring-plum-100">
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-plum-700">
                        {monthDay.month}
                      </span>
                      <span className="tnum font-ui text-2xl font-semibold leading-none text-ink-900">
                        {monthDay.day}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 font-display text-[1.05rem] font-medium leading-snug text-ink-900 transition-colors duration-300 group-hover:text-plum-700">
                        {title}
                      </h3>
                      <div className="mt-2 flex items-center gap-3 text-xs text-ink-500">
                        {event.time && (
                          <span className="tnum inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-plum-500" />
                            {formatTime(event.time, language)}
                          </span>
                        )}
                        {isUpcoming(event.date) && (
                          <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-plum-700">
                            {t('common.upcoming')}
                          </span>
                        )}
                      </div>
                    </div>

                    <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-400 transition-all duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-plum-600" />
                  </Link>
                </li>
              );
            })}
          </ul>
      </div>
    </section>
  );
}
