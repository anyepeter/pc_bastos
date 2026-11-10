'use client';

import { useState } from 'react';
import { HeartPulse, GraduationCap, Megaphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/components/PageLayout';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import ImpactSection from '@/components/ImpactSection';
import MottoRibbon from '@/components/MottoRibbon';
import NextChapter from '@/components/NextChapter';
import ScrollWords from '@/components/motion/ScrollWords';
import SplitReveal from '@/components/motion/SplitReveal';

/**
 * Mission and vision.
 *
 * The vision is a statement, so it is set as one: large, and lighting up word
 * by word as it is read. The mission's three priorities are panels on a dark
 * band that open out under the pointer (every word stays visible at every
 * width — the opening is emphasis, never disclosure). Then the council in
 * figures, the confessional basis set like a creed, and the motto running in
 * both languages.
 */
export default function MissionVisionPage() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(0);

  const priorities = [
    { id: 'health', icon: HeartPulse, title: t('about.missionVision.healthTitle'), text: t('about.missionVision.healthText') },
    { id: 'education', icon: GraduationCap, title: t('about.missionVision.educationTitle'), text: t('about.missionVision.educationText') },
    { id: 'pastoral', icon: Megaphone, title: t('about.missionVision.pastoralTitle'), text: t('about.missionVision.pastoralText') },
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
        media={{ src: '/images/about/greeting.jpg', alt: t('about.photos.greetingAlt'), position: '50% 35%' }}
      />

      {/* Vision */}
      <section className="relative bg-white py-16 lg:py-28">
        <div className="shell">
          <Reveal>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="grow-x h-px w-10 origin-left bg-plum-500" />
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-700">{t('home.visionLabel')}</p>
            </div>
          </Reveal>
          <SplitReveal
            as="h2"
            delay={80}
            className="mt-6 block font-display text-[clamp(2.1rem,4.2vw,3.4rem)] font-semibold leading-[1.04] tracking-tight text-ink-900"
            text={t('about.missionVision.ourVision')}
          />

          <ScrollWords
            className="mt-12 max-w-[30ch] font-display text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.22] tracking-tight text-ink-900 lg:max-w-[34ch]"
            text={t('about.missionVision.visionText1')}
          />

          <div className="mt-16 grid gap-12 border-t border-ink-200 pt-12 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-6">
              <p className="max-w-[58ch] text-lg leading-[1.85] text-ink-600 text-pretty">
                {t('about.missionVision.visionText2')}
              </p>
            </Reveal>
            <Reveal delay={120} variant="right" className="lg:col-span-5 lg:col-start-8">
              <figure className="relative">
                <span aria-hidden="true" className="block h-px w-12 bg-leaf-500" />
                <blockquote className="mt-6 font-display text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold italic leading-[1.12] tracking-tight text-plum-700 text-balance">
                  {t('about.missionVision.visionQuote')}
                </blockquote>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission — three priorities as panels that open out. */}
      <PageSection tone="dark" paint className="py-20 lg:py-28">
        <SectionHeading
          eyebrow={t('home.missionLabel')}
          title={t('about.missionVision.ourMission')}
          standfirst={t('about.missionVision.missionText')}
          tone="dark"
        />

        <ul className="mt-14 flex flex-col gap-4 lg:h-[30rem] lg:flex-row">
          {priorities.map((priority, i) => {
            const Icon = priority.icon;
            const isOpen = open === i;
            return (
              <li
                key={priority.id}
                onMouseEnter={() => setOpen(i)}
                className={`min-w-0 transition-[flex-grow] duration-700 ease-spring lg:flex-1 ${isOpen ? 'lg:flex-[1.9]' : ''}`}
              >
                <Reveal delay={i * 90} className="h-full">
                <div
                  className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 transition-colors duration-700 lg:p-9 ${
                    isOpen ? 'border-leaf-300/40 bg-plum-900' : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 top-0 h-[3px] origin-left bg-leaf-300 transition-transform duration-700 ease-spring ${
                      isOpen ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />

                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <Icon aria-hidden="true" className="h-5 w-5 text-leaf-300" />
                    </span>
                    <span className="tnum font-mono text-[0.68rem] tracking-[0.24em] text-plum-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-auto pt-10 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] font-semibold leading-tight tracking-tight text-white">
                    {priority.title}
                  </h3>
                  <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-plum-200 text-pretty">{priority.text}</p>
                </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </PageSection>

      {/* The council in figures. */}
      <section className="bg-white py-16 lg:py-28">
        <div className="shell">
          <ImpactSection />
        </div>
      </section>

      {/* The confessional basis, set like a creed. */}
      <PageSection tone="tint" className="lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={t('home.sections.principles')} title={t('about.missionVision.corePrinciples')} layout="stack" />
          </div>
          <ol className="lg:col-span-8">
            {principles.map((principle, i) => (
              <Reveal as="li" key={i} delay={Math.min(i, 8) * 90} className="group">
                <div className="flex items-baseline gap-6 py-7 sm:gap-10">
                  <span aria-hidden="true" className="w-12 shrink-0 font-display text-3xl italic text-leaf-600 sm:w-16 sm:text-4xl">
                    {['I', 'II', 'III', 'IV'][i]}
                  </span>
                  <p className="font-display text-[clamp(1.35rem,2.4vw,2rem)] leading-[1.3] tracking-tight text-ink-900 text-pretty">
                    {principle}
                  </p>
                </div>
                <span aria-hidden="true" className="grow-x block h-px origin-left bg-ink-200" />
              </Reveal>
            ))}
          </ol>
        </div>
      </PageSection>

      {/* The motto, in both of the council's languages. */}
      <section className="bg-white pt-16 lg:pt-24">
        <div className="shell">
          <Reveal>
            <div className="flex items-center justify-center gap-3">
              <span aria-hidden="true" className="h-px w-10 bg-plum-500" />
              <h2 className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-700">
                {t('about.missionVision.ourMotto')}
              </h2>
              <span aria-hidden="true" className="h-px w-10 bg-plum-500" />
            </div>
          </Reveal>
        </div>
        <MottoRibbon className="mt-8" />
      </section>

      <NextChapter
        href="/about/general-secretariat"
        title={t('about.generalSecretariat.title')}
        description={t('about.generalSecretariat.description')}
        image="/images/hero-image.jpg"
      />
    </PageLayout>
  );
}
