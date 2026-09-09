'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';
import Reveal from '@/components/Reveal';
import type { PublicAnnouncement } from '@/app/announcements/AnnouncementsClient';

interface AnnouncementsSectionProps {
  /** Published announcements, fetched by the page. Hides itself when empty. */
  announcements: PublicAnnouncement[];
}

/** Priority is stored as a plain string; map it to a label and a colour. */
const PRIORITY = {
  high: { key: 'home.announcements.priorityHigh', dot: 'bg-plum-600', text: 'text-plum-700' },
  medium: { key: 'home.announcements.priorityMedium', dot: 'bg-leaf-500', text: 'text-leaf-700' },
  low: { key: 'home.announcements.priorityLow', dot: 'bg-ink-300', text: 'text-ink-500' },
} as const;

export default function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  if (announcements.length === 0) return null;

  const shown = announcements.slice(0, 3);
  const read = (value: unknown) => getTranslatedText(value as any, language);

  return (
    <section className="grain relative overflow-hidden bg-white py-14 lg:py-20">
      <div className="shell relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-plum-500" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-700">
                  {t('home.sections.announcements')}
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-7 font-display text-[clamp(2.1rem,4.2vw,3.4rem)] font-semibold leading-[1.04] tracking-tight text-ink-900 text-balance">
                {t('home.announcements.title')}{' '}
                <span className="text-leaf-600">{t('home.announcements.titleHighlight')}</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={140} className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-[46ch] text-base leading-relaxed text-ink-600 text-pretty lg:pb-2">
              {t('home.announcements.subtitle')}
            </p>
          </Reveal>
        </div>

        {/* A notice board, not cards: announcements are a chronological list and
            read better as ruled entries than as three equal boxes. */}
        <ol className="mt-11 border-t border-ink-200">
          {shown.map((announcement, i) => {
            const meta = PRIORITY[announcement.priority as keyof typeof PRIORITY] ?? PRIORITY.low;

            return (
              <Reveal as="li" key={announcement.id} delay={i * 90}>
                <Link
                  href="/announcements"
                  className="focus-ring group grid gap-x-8 gap-y-3 border-b border-ink-200 py-7 transition-colors duration-300 hover:bg-ink-50 lg:grid-cols-12 lg:items-baseline"
                >
                  <div className="lg:col-span-3">
                    <p className="tnum font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-500">
                      {formatLongDate(announcement.date, language)}
                    </p>
                    <p
                      className={`mt-2 inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] ${meta.text}`}
                    >
                      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                      {t(meta.key)}
                    </p>
                  </div>

                  <div className="lg:col-span-8">
                    <h3 className="font-display text-xl font-medium leading-snug text-ink-900 transition-colors duration-300 group-hover:text-plum-700">
                      {read(announcement.title)}
                    </h3>
                    <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-ink-600 text-pretty">
                      {read(announcement.description)}
                    </p>
                  </div>

                  <ArrowUpRight className="hidden h-5 w-5 shrink-0 text-ink-400 transition-all duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-plum-600 lg:col-span-1 lg:block lg:justify-self-end" />
                </Link>
              </Reveal>
            );
          })}
        </ol>

        <Reveal delay={160}>
          <div className="mt-9">
            <Link
              href="/announcements"
              className="focus-ring group inline-flex items-center gap-2.5 rounded-full border border-ink-300 bg-white px-6 py-3 font-ui text-sm font-semibold text-ink-800 transition-all duration-300 ease-spring hover:border-plum-400 hover:bg-plum-50 active:translate-y-px"
            >
              {t('home.announcements.viewAll')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
