'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';
import Reveal from '@/components/Reveal';
import type { PublicWorkshop } from '@/app/workshops/WorkshopsClient';

interface WorkshopsSectionProps {
  /** Published workshops, fetched by the page. Hides itself when empty. */
  workshops: PublicWorkshop[];
}

export default function WorkshopsSection({ workshops }: WorkshopsSectionProps) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  if (workshops.length === 0) return null;

  const shown = workshops.slice(0, 3);
  const read = (value: unknown) => getTranslatedText(value as any, language);

  return (
    <section className="grain relative overflow-hidden bg-ink-50 py-14 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 h-[26rem] w-[26rem] rounded-full bg-leaf-50 blur-[130px]"
      />

      <div className="shell relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-plum-500" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-700">
                  {t('home.sections.workshops')}
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-7 font-display text-[clamp(2.1rem,4.2vw,3.4rem)] font-semibold leading-[1.04] tracking-tight text-ink-900 text-balance">
                {t('home.workshops.title')}{' '}
                <span className="text-leaf-600">{t('home.workshops.titleHighlight')}</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={140} className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-[46ch] text-base leading-relaxed text-ink-600 text-pretty lg:pb-2">
              {t('home.workshops.subtitle')}
            </p>
          </Reveal>
        </div>

        <ul className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((workshop, i) => {
            const title = read(workshop.title);
            const cover = workshop.images[0];

            return (
              <Reveal as="li" key={workshop.id} delay={i * 110} className="h-full">
                <Link
                  href={`/workshops/${workshop.slug}`}
                  className="card card-hover focus-ring group flex h-full flex-col overflow-hidden rounded-2xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-1000 ease-spring group-hover:scale-[1.05]"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-plum-100 to-ink-100" />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="tnum inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-plum-700">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatLongDate(workshop.date, language)}
                    </p>

                    <h3 className="mt-3 line-clamp-2 font-display text-xl font-medium leading-snug text-ink-900 transition-colors duration-300 group-hover:text-plum-700">
                      {title}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-600 text-pretty">
                      {read(workshop.description)}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink-200 pt-5">
                      <span className="flex min-w-0 items-center gap-2 text-sm text-ink-500">
                        <MapPin className="h-4 w-4 shrink-0 text-leaf-600" />
                        <span className="truncate">{read(workshop.location)}</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-400 transition-all duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-plum-600" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={160}>
          <div className="mt-11 border-t border-ink-200 pt-9">
            <Link
              href="/workshops"
              className="focus-ring group inline-flex items-center gap-2.5 rounded-full border border-ink-300 bg-white px-6 py-3 font-ui text-sm font-semibold text-ink-800 transition-all duration-300 ease-spring hover:border-plum-400 hover:bg-plum-50 active:translate-y-px"
            >
              {t('home.workshops.viewAll')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
