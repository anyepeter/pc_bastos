'use client';

import Link from '@/components/LocalizedLink';
import { ArrowLeft, Calendar, Clock, MapPin, Network, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText, readTranslation } from '@/lib/translations';
import { formatDateRange, formatTime } from '@/lib/format';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import MetaRail from '@/components/MetaRail';
import MediaGallery from '@/components/MediaGallery';
import DepartmentProse from '@/components/DepartmentProse';
import DepartmentActivityCard from '@/components/DepartmentActivityCard';
import type { PublicActivity } from '@/lib/departments';

interface ActivityDetailClientProps {
  activity: PublicActivity;
  department: { slug: string; acronym: string; name: unknown };
  /** A few of the department's other published items. */
  more: PublicActivity[];
  /** Decided on the server, by the council's calendar day. */
  upcoming: boolean;
  /** Which of `more` are still to come, by id. */
  upcomingIds: string[];
}

/**
 * One event, activity report or project of a department.
 *
 * The when, where and whose sit in the hero as the site's compact data rail;
 * the account runs as a single measured column under the department's own
 * photograph, and its photo set follows as a gallery.
 */
export default function ActivityDetailClient({
  activity,
  department,
  more,
  upcoming,
  upcomingIds,
}: ActivityDetailClientProps) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);
  const read = (value: unknown) => getTranslatedText(readTranslation(value), language).trim();

  const title = read(activity.title);
  const summary = read(activity.summary);
  const body = read(activity.body);
  const location = read(activity.location);
  const departmentName = read(department.name);
  const isProject = activity.kind === 'project';
  const departmentHref = `/departments/${department.slug}`;

  const kindLabel = t(`departments.activity.${activity.kind}`);

  const meta = [
    {
      key: 'type',
      icon: Tag,
      label: t('departments.activity.type'),
      value: upcoming ? `${kindLabel} · ${t('departments.activity.upcoming')}` : kindLabel,
    },
    {
      key: 'date',
      icon: Calendar,
      label: t('departments.activity.date'),
      value: formatDateRange(activity.date, activity.endDate, language, isProject ? 'month' : 'day'),
    },
    {
      key: 'time',
      icon: Clock,
      label: t('departments.activity.time'),
      value: activity.time && !isProject ? formatTime(activity.time, language) : '',
    },
    { key: 'place', icon: MapPin, label: t('departments.activity.place'), value: location },
    {
      key: 'department',
      icon: Network,
      label: t('departments.activity.department'),
      value: (
        <Link
          href={departmentHref}
          className="focus-ring rounded underline-offset-4 transition-colors duration-300 hover:text-plum-700 hover:underline"
        >
          {department.acronym || departmentName}
        </Link>
      ),
    },
  ].filter((item) => item.value);

  // The cover leads; the rest of the photographs follow in the gallery, with
  // the cover left out so it is not shown twice in a row.
  const gallery = activity.images.filter((src) => src !== activity.imageUrl);

  return (
    <>
      <PageHero title={title} lede={summary}>
        <MetaRail items={meta} className="mt-8" />
      </PageHero>

      <PageSection tone="white">
        {activity.imageUrl && (
          <Reveal as="figure" className="mb-14 overflow-hidden rounded-2xl bg-ink-100">
            <div className="aspect-[16/9] w-full sm:aspect-[21/9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activity.imageUrl} alt={title} className="h-full w-full object-cover" />
            </div>
          </Reveal>
        )}

        {body && (
          <>
            <SectionHeading as="h2" layout="stack" title={t('departments.activity.details')} />
            <Reveal className="mt-11">
              <DepartmentProse>{body}</DepartmentProse>
            </Reveal>
          </>
        )}

        {gallery.length > 0 && (
          <div className={body ? 'mt-16' : ''}>
            <Reveal>
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight tracking-tight text-ink-900">
                {t('departments.activity.photos')}
              </h2>
            </Reveal>
            <Reveal delay={80} className="mt-8 max-w-5xl">
              <MediaGallery
                images={gallery}
                alt={title}
                labels={{
                  enlarge: t('home.gallery.view'),
                  close: t('home.gallery.close'),
                  previous: t('home.gallery.previous'),
                  next: t('home.gallery.next'),
                }}
              />
            </Reveal>
          </div>
        )}

        <Reveal className={body || gallery.length > 0 ? 'mt-14' : ''}>
          <Link
            href={departmentHref}
            className="focus-ring group inline-flex max-w-full items-center gap-2.5 rounded-full border border-ink-200 bg-white px-6 py-3 font-ui text-sm font-medium text-ink-700 transition-all duration-300 ease-spring hover:border-plum-400 hover:text-plum-700"
          >
            <ArrowLeft
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-leaf-600 transition-transform duration-300 ease-spring group-hover:-translate-x-0.5"
            />
            <span className="sr-only">{t('departments.activity.backTo')}: </span>
            <span className="truncate">{departmentName}</span>
          </Link>
        </Reveal>
      </PageSection>

      {more.length > 0 && (
        <PageSection tone="tint">
          <SectionHeading title={t('departments.activity.more')} layout="stack" />
          <ul
            className={`mt-11 grid gap-6 sm:grid-cols-2 ${
              more.length >= 3 ? 'lg:grid-cols-3' : 'lg:max-w-5xl'
            }`}
          >
            {more.map((item, i) => (
              <Reveal as="li" key={item.id} delay={Math.min(i, 8) * 60} className="h-full">
                <DepartmentActivityCard
                  activity={item}
                  departmentSlug={department.slug}
                  upcoming={upcomingIds.includes(item.id)}
                />
              </Reveal>
            ))}
          </ul>
        </PageSection>
      )}
    </>
  );
}
