'use client';

import { Calendar, Users, Building } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/components/PageLayout';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

/**
 * The council's history — a long-form, text-only page.
 *
 * The three Unsplash photographs this replaced were American church stock; the
 * council has no photography of 1969 Yaoundé and borrowed imagery would say
 * nothing true. The page is carried by typography instead: three numbered
 * chapters at a readable measure, then the milestones as a ruled timeline on a
 * dark band.
 */
export default function HistoryPage() {
  const { t } = useTranslation();

  const milestones = [
    { year: '1969', text: t('about.history.milestone1969') },
    { year: '1970s', text: t('about.history.milestone1970s') },
    { year: '2009', text: t('about.history.milestone2009') },
    // Untranslated in the source copy, and left that way: this is a visual
    // redesign, and the locale files are off-limits.
    { year: 'Today', text: t('about.history.milestoneToday') },
  ];

  return (
    <PageLayout>
      <PageHero
        eyebrow={t('navbar.aboutUs')}
        title={t('about.history.pageTitle')}
        lede={t('about.history.pageSubtitle')}
        crumbs={[
          { label: t('navbar.home'), href: '/' },
          { label: t('navbar.aboutUs'), href: '/about' },
          { label: t('navbar.ourHistory') },
        ]}
      />

      {/* Chapter 01 — the founding. */}
      <PageSection tone="white">
        <SectionHeading eyebrow="01" title={t('about.history.theBeginning')} />

        <div className="mt-11 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-2">
            <div className="flex items-center gap-5 lg:block">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white">
                <Calendar aria-hidden="true" className="h-5 w-5 text-leaf-600" />
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-ink-200 lg:mt-6 lg:ml-6 lg:block lg:h-20 lg:w-px"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-9 lg:col-start-4">
            <Reveal delay={60}>
              <p className="max-w-[70ch] text-lg leading-[1.75] text-ink-700 text-pretty">
                {t('about.history.beginningText1')}
              </p>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-7 max-w-[70ch] text-lg leading-[1.75] text-ink-600 text-pretty">
                {t('about.history.beginningText2')}
              </p>
            </Reveal>
          </div>
        </div>
      </PageSection>

      {/* Chapter 02 — the preamble. Its first paragraph is a confession of
          faith quoting John 17:21, so it is set as a pull quote rather than as
          another run of body copy. */}
      <PageSection tone="tint">
        <SectionHeading eyebrow="02" title={t('about.history.thePreamble')} />

        <div className="mt-11 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-2">
            <div className="flex items-center gap-5 lg:block">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white">
                <Users aria-hidden="true" className="h-5 w-5 text-leaf-600" />
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-ink-200 lg:mt-6 lg:ml-6 lg:block lg:h-20 lg:w-px"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-9 lg:col-start-4">
            <Reveal delay={60}>
              <blockquote className="max-w-[54ch] border-l-2 border-plum-300 pl-6 font-display text-[clamp(1.25rem,2.1vw,1.65rem)] leading-[1.5] text-ink-800 text-pretty sm:pl-8">
                {t('about.history.preambleText1')}
              </blockquote>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-9 max-w-[70ch] text-lg leading-[1.75] text-ink-600 text-pretty">
                {t('about.history.preambleText2')}
              </p>
            </Reveal>
          </div>
        </div>
      </PageSection>

      {/* Chapter 03 — the council as it stands. */}
      <PageSection tone="white">
        <SectionHeading eyebrow="03" title={t('about.history.evolutionToCepca')} />

        <div className="mt-11 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-2">
            <div className="flex items-center gap-5 lg:block">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white">
                <Building aria-hidden="true" className="h-5 w-5 text-leaf-600" />
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-ink-200 lg:mt-6 lg:ml-6 lg:block lg:h-20 lg:w-px"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-9 lg:col-start-4">
            <Reveal delay={60}>
              <p className="max-w-[70ch] text-lg leading-[1.75] text-ink-700 text-pretty">
                {t('about.history.evolutionText1')}
              </p>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-7 max-w-[70ch] text-lg leading-[1.75] text-ink-600 text-pretty">
                {t('about.history.evolutionText2')}
              </p>
            </Reveal>
          </div>
        </div>
      </PageSection>

      {/* The timeline. One dark band per page, used here as the closing
          punctuation the narrative builds towards. */}
      <PageSection tone="tint" className="py-20 lg:py-28">
        <SectionHeading title={t('about.history.keyMilestones')}  layout="stack" />

        <ol className="mt-11 border-t border-ink-200">
          {milestones.map((milestone, i) => (
            <Reveal
              as="li"
              key={milestone.year}
              delay={Math.min(i, 8) * 60}
              className="border-b border-ink-200"
            >
              <div className="grid gap-3 py-7 lg:grid-cols-12 lg:items-baseline lg:gap-10 lg:py-8">
                <p className="font-display text-2xl font-semibold leading-none tracking-tight text-leaf-600 lg:col-span-3">
                  {milestone.year}
                </p>
                <p className="max-w-[62ch] text-base leading-relaxed text-ink-600 text-pretty lg:col-span-9">
                  {milestone.text}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </PageSection>
    </PageLayout>
  );
}
