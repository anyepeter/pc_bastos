'use client';

import { Target, Heart, Users, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/components/PageLayout';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import ImpactSection from '@/components/ImpactSection';

/**
 * Mission and vision.
 *
 * Text-only by design: the four Unsplash photographs this replaced were US
 * stock, and the council has nothing of its own to put in their place. The
 * page is carried by measure and rhythm — a vision statement with its question
 * set as a pull quote, the mission's three priorities as a ruled trio, the
 * principles as a numbered list, and the motto alone on a dark band.
 */
export default function MissionVisionPage() {
  const { t } = useTranslation();

  const priorities = [
    {
      id: 'health',
      icon: Heart,
      title: t('about.missionVision.healthTitle'),
      text: t('about.missionVision.healthText'),
    },
    {
      id: 'education',
      icon: Users,
      title: t('about.missionVision.educationTitle'),
      text: t('about.missionVision.educationText'),
    },
    {
      id: 'pastoral',
      icon: Globe,
      title: t('about.missionVision.pastoralTitle'),
      text: t('about.missionVision.pastoralText'),
    },
  ];

  const principles = [
    t('about.missionVision.principle1'),
    t('about.missionVision.principle2'),
    t('about.missionVision.principle3'),
    t('about.missionVision.principle4'),
  ];

  return (
    <PageLayout>
      <PageHero
        title={t('about.missionVision.pageTitle')}
        lede={t('about.missionVision.pageSubtitle')}
      />

      {/* Vision. The standfirst carries the first paragraph opposite the
          heading; the question the council asks itself sits alongside the
          second as a pull quote. */}
      <PageSection tone="white">
        <SectionHeading
          title={t('about.missionVision.ourVision')}
          standfirst={t('about.missionVision.visionText1')}
        />

        <div className="mt-11 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink-200 bg-white">
                <Target aria-hidden="true" className="h-5 w-5 text-leaf-600" />
              </span>
            </Reveal>

            <Reveal delay={60}>
              <p className="mt-7 max-w-[70ch] text-lg leading-[1.75] text-ink-700 text-pretty">
                {t('about.missionVision.visionText2')}
              </p>
            </Reveal>
          </div>

          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
            <figure className="card rounded-2xl p-7 lg:p-8">
              <span aria-hidden="true" className="block h-px w-10 bg-leaf-400" />
              <blockquote className="mt-6 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold italic leading-[1.25] tracking-tight text-plum-700 text-balance">
                {t('about.missionVision.visionQuote')}
              </blockquote>
            </figure>
          </Reveal>
        </div>
      </PageSection>

      {/* Mission — the three priorities the renewed agenda names. */}
      <PageSection tone="tint">
        <SectionHeading
          title={t('about.missionVision.ourMission')}
          standfirst={t('about.missionVision.missionText')}
        />

        <ul className="mt-11 grid gap-6 lg:grid-cols-3">
          {priorities.map((priority, i) => {
            const Icon = priority.icon;

            return (
              <Reveal as="li" key={priority.id} delay={Math.min(i, 8) * 60}>
                <div className="card card-hover flex h-full flex-col rounded-2xl p-7">
                  <div className="flex items-start justify-between gap-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white">
                      <Icon aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                    </span>
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900">
                    {priority.title}
                  </h3>

                  <p className="mt-4 text-base leading-relaxed text-ink-600 text-pretty">
                    {priority.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </PageSection>

      {/* The council in figures. Left as-is: ImpactSection is a shared
          component and off-limits to this pass — it still carries the starter
          template's styling and is not wired to i18next. */}
      <PageSection tone="white">
        <ImpactSection />
      </PageSection>

      {/* The confessional basis, as a numbered list rather than bullet dots. */}
      <PageSection tone="tint">
        <SectionHeading title={t('about.missionVision.corePrinciples')} layout="stack" />

        <ol className="mt-11 grid gap-x-12 lg:grid-cols-2">
          {principles.map((principle, i) => (
            <Reveal
              as="li"
              key={principle}
              delay={Math.min(i, 8) * 60}
              className="border-t border-ink-200"
            >
              <div className="flex items-baseline gap-6 py-6">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-ink-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="max-w-[52ch] text-base leading-relaxed text-ink-700 text-pretty">
                  {principle}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </PageSection>

      {/* The motto, alone on the page's one dark band. */}
      <PageSection tone="white" className="py-20 lg:py-28">
        <SectionHeading title={t('about.missionVision.ourMotto')}  layout="stack" />

        <Reveal delay={140}>
          <blockquote className="mt-11 max-w-[20ch] font-display text-[clamp(2rem,5vw,3.4rem)] font-semibold italic leading-[1.1] tracking-tight text-leaf-600 text-balance">
            {t('about.missionVision.motto')}
          </blockquote>
        </Reveal>
      </PageSection>
    </PageLayout>
  );
}
