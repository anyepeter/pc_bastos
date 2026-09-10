'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/Reveal';
import { DEPARTMENTS } from '@/lib/departments';

/**
 * The eight departments, on the home page.
 *
 * Sits between the council's figures and its programmes: the numbers say how
 * large the council is, this says how it is organised to act, and the charity
 * band then shows what that produces. Each tile deep-links to its own entry on
 * `/departments`, which already carries an anchor per department.
 */
export default function DepartmentsSection() {
  const { t } = useTranslation();

  return (
    <section className="grain relative overflow-hidden bg-ink-50 py-14 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-plum-100/60 blur-[130px]"
      />

      <div className="shell relative">
        {/* Header — title left, standfirst right, matching the other bands. */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-10 bg-plum-500" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-700">
                  {t('home.sections.departments')}
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-7 font-display text-[clamp(2.1rem,4.2vw,3.4rem)] font-semibold leading-[1.04] tracking-tight text-ink-900 text-balance">
                {t('home.departments.title')}{' '}
                <span className="text-leaf-600">{t('home.departments.titleHighlight')}</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={140} className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-[48ch] text-base leading-relaxed text-ink-600 text-pretty lg:pb-2">
              {t('about.departments.pageSubtitle')}
            </p>
          </Reveal>
        </div>

        <ul className="mt-11 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {DEPARTMENTS.map(({ id, Icon }, i) => (
            <Reveal as="li" key={id} delay={Math.min(i, 8) * 60}>
              <Link
                href={`/departments#${id}`}
                className="card card-hover focus-ring group flex h-full flex-col p-5 lg:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white transition-colors duration-300 group-hover:border-leaf-300">
                    <Icon aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                  </span>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <span className="mt-5 block font-mono text-[0.62rem] uppercase tracking-[0.2em] text-plum-700">
                  {t(`about.departments.${id}.short`)}
                </span>

                <span className="mt-2 block font-display text-base font-semibold leading-snug tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-plum-700">
                  {t(`about.departments.${id}.name`)}
                </span>

                <span className="mt-auto pt-4 inline-flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink-500">
                  {t(`about.departments.${id}.location`)}
                  <ArrowUpRight className="h-3 w-3 shrink-0 text-ink-400 opacity-0 transition-all duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-plum-700 group-hover:opacity-100" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={200}>
          <Link
            href="/departments"
            className="focus-ring group mt-10 inline-flex items-center gap-2.5 rounded-full border border-ink-200 bg-white px-6 py-3 font-ui text-sm font-medium text-ink-700 transition-all duration-300 ease-spring hover:border-plum-400 hover:text-plum-700"
          >
            {t('common.viewAll')}
            <ArrowRight className="h-4 w-4 text-leaf-600 transition-transform duration-300 ease-spring group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
