'use client';

import Link from '@/components/LocalizedLink';
import { ArrowUpRight, Calendar, Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText, readTranslation } from '@/lib/translations';
import { formatDateRange, formatMonthDay, formatTime } from '@/lib/format';
import type { PublicActivity } from '@/lib/departments';

interface DepartmentActivityCardProps {
  activity: PublicActivity;
  departmentSlug: string;
  /**
   * `row` — a full-width line led by the date chip, for what is coming up.
   * `tile` — a card with its photograph on top, for reports and projects.
   */
  layout?: 'row' | 'tile';
  /** Decided on the server, so the badge cannot disagree with the band it sits in. */
  upcoming?: boolean;
}

/**
 * One event, activity report or project on a department's page.
 *
 * Built from the vocabulary of the council's events list — the plum date
 * chip, mono metadata, the lift on hover — so a department's diary reads as
 * part of the same site. A card shows the department's own uploaded photo
 * where there is one; nothing is substituted where there is not.
 */
export default function DepartmentActivityCard({
  activity,
  departmentSlug,
  layout = 'tile',
  upcoming = false,
}: DepartmentActivityCardProps) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);
  const read = (value: unknown) => getTranslatedText(readTranslation(value), language);

  const title = read(activity.title);
  const summary = read(activity.summary);
  const location = read(activity.location);
  const cover = activity.imageUrl || activity.images[0] || null;
  const isProject = activity.kind === 'project';
  const monthDay = formatMonthDay(activity.date, language);
  const when = formatDateRange(
    activity.date,
    activity.endDate,
    language,
    isProject ? 'month' : 'day'
  );
  const href = `/departments/${departmentSlug}/activities/${activity.slug}`;

  const kicker = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-500">
        {t(`departments.activity.${activity.kind}`)}
      </span>
      {upcoming && (
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-plum-700">
          {t('departments.activity.upcoming')}
        </span>
      )}
    </div>
  );

  const meta = (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.68rem] tracking-[0.04em] text-ink-500">
      <li className="tnum inline-flex items-center gap-2">
        <Calendar aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-leaf-600" />
        {when}
      </li>
      {activity.time && !isProject && (
        <li className="tnum inline-flex items-center gap-2">
          <Clock aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-leaf-600" />
          {formatTime(activity.time, language)}
        </li>
      )}
      {location && (
        <li className="inline-flex min-w-0 items-center gap-2">
          <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-leaf-600" />
          <span className="truncate">{location}</span>
        </li>
      )}
    </ul>
  );

  if (layout === 'row') {
    return (
      <Link
        href={href}
        className="card card-hover focus-ring group flex h-full flex-col gap-5 rounded-2xl p-4 sm:p-6 lg:flex-row lg:items-center lg:gap-8"
      >
        {cover && (
          <div className="shrink-0 overflow-hidden rounded-xl bg-ink-100 lg:order-last lg:w-60 xl:w-72">
            <div className="aspect-[16/9] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.04]"
              />
            </div>
          </div>
        )}

        <div className="flex flex-1 items-start gap-4 sm:gap-6">
          <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-xl bg-plum-50 ring-1 ring-inset ring-plum-100 sm:h-20 sm:w-20">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-plum-700">
              {monthDay.month}
            </span>
            <span className="tnum mt-1 font-display text-3xl font-semibold leading-none text-ink-900">
              {monthDay.day}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            {kicker}
            <h3 className="mt-3 line-clamp-2 font-display text-xl font-medium leading-snug tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-plum-700 sm:text-2xl">
              {title}
            </h3>
            {summary && (
              <p className="mt-3 line-clamp-2 max-w-[62ch] text-[0.95rem] leading-relaxed text-ink-600 text-pretty">
                {summary}
              </p>
            )}
            <div className="mt-5">{meta}</div>
          </div>

          <ArrowUpRight
            aria-hidden="true"
            className="mt-1 hidden h-5 w-5 shrink-0 text-ink-400 transition-all duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-plum-600 sm:block"
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="card card-hover focus-ring group flex h-full flex-col overflow-hidden rounded-2xl"
    >
      {cover ? (
        <div className="overflow-hidden bg-ink-100">
          <div className="aspect-[16/10] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.04]"
            />
          </div>
        </div>
      ) : (
        /* Without a photograph the date carries the top of the card, in the
           same chip the rows use. */
        <div className="px-6 pt-6">
          <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-plum-50 ring-1 ring-inset ring-plum-100">
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-plum-700">
              {monthDay.month}
            </span>
            {/* A project is placed by its year; the ISO string is read
                directly so no time zone can tip 1 January into the year
                before. */}
            <span className="tnum mt-1 font-display text-2xl font-semibold leading-none text-ink-900">
              {isProject ? activity.date.slice(0, 4) : monthDay.day}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        {kicker}
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-plum-700">
          {title}
        </h3>
        {summary && (
          <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-ink-600 text-pretty">
            {summary}
          </p>
        )}
        <div className="mt-auto pt-5">{meta}</div>
      </div>
    </Link>
  );
}
