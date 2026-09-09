'use client';

import { useTranslation } from 'react-i18next';
import Reveal from '@/components/Reveal';

const MissionVisionSection = () => {
  const { t } = useTranslation();

  const missionAreas = [
    {
      title: t('missionVision.mission.health.title'),
      description: t('missionVision.mission.health.description'),
    },
    {
      title: t('missionVision.mission.education.title'),
      description: t('missionVision.mission.education.description'),
    },
    {
      title: t('missionVision.mission.pastoral.title'),
      description: t('missionVision.mission.pastoral.description'),
    },
  ];

  const principles = [
    t('missionVision.corePrinciples.principle1'),
    t('missionVision.corePrinciples.principle2'),
    t('missionVision.corePrinciples.principle3'),
    t('missionVision.corePrinciples.principle4'),
  ];

  return (
    <section className="grain relative overflow-hidden bg-ink-50 py-14 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 h-[34rem] w-[34rem] rounded-full bg-plum-100/70 blur-[150px]"
      />

      <div className="shell relative">
        {/* ── Header: title left, standfirst right ───────────────────── */}
        <div className="grid gap-8 border-b border-ink-200 pb-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-plum-500" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-plum-700">
                  {t('home.sections.missionVision')}
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-7 font-display text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-[1.02] tracking-tightest text-ink-900 text-balance">
                {t('missionVision.title')}
              </h2>
            </Reveal>
          </div>

          <Reveal delay={140} className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-[46ch] text-base leading-relaxed text-ink-600 text-pretty lg:pb-2">
              {t('missionVision.subtitle')}
            </p>
          </Reveal>
        </div>

        {/* ── Vision / Mission ───────────────────────────────────────── */}
        <div className="grid gap-12 pt-12 lg:grid-cols-12 lg:gap-12">
          {/* Vision reads as an essay with a pull-quote */}
          <div className="flex flex-col lg:col-span-5">
            <Reveal>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-400">
                {t('home.visionLabel')}
              </p>
              <h3 className="mt-4 font-display text-2xl font-medium text-ink-900">
                {t('missionVision.vision.title')}
              </h3>
            </Reveal>

            <Reveal delay={90}>
              <p className="mt-6 max-w-[54ch] text-[0.95rem] leading-relaxed text-ink-600 text-pretty">
                {t('missionVision.vision.description1')}
              </p>
              <p className="mt-4 max-w-[54ch] text-[0.95rem] leading-relaxed text-ink-600 text-pretty">
                {t('missionVision.vision.description2')}
              </p>
            </Reveal>

            {/* mt-auto anchors the quote to the foot of the column so it
                lines up with the end of the mission ledger beside it. */}
            <Reveal delay={160} className="mt-auto">
              <blockquote className="mt-10 border-l-2 border-plum-500 pl-6">
                <p className="font-display text-xl font-light italic leading-snug text-plum-800 sm:text-2xl">
                  {t('missionVision.vision.quote')}
                </p>
              </blockquote>
            </Reveal>
          </div>

          {/* Mission is the operational ledger */}
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-400">
                {t('home.missionLabel')}
              </p>
              <h3 className="mt-4 font-display text-2xl font-medium text-ink-900">
                {t('missionVision.mission.title')}
              </h3>
            </Reveal>

            <Reveal delay={90}>
              <p className="mt-6 max-w-[58ch] text-[0.95rem] leading-relaxed text-ink-600 text-pretty">
                {t('missionVision.mission.description')}
              </p>
            </Reveal>

            <dl className="mt-10">
              {missionAreas.map((area, i) => (
                <Reveal as="div" key={area.title} delay={150 + i * 90}>
                  <div className="group grid grid-cols-[auto_1fr] gap-x-5 border-t border-ink-200 py-6 transition-colors duration-300 hover:border-plum-400/40 sm:gap-x-8">
                    <span className="tnum pt-1 font-mono text-xs text-ink-400 transition-colors duration-300 group-hover:text-plum-700">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <dt className="font-display text-lg font-medium text-ink-900 transition-colors duration-300 group-hover:text-plum-700">
                        {area.title}
                      </dt>
                      <dd className="mt-2 max-w-[56ch] text-sm leading-relaxed text-ink-500 text-pretty">
                        {area.description}
                      </dd>
                    </div>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>

        {/* ── Core principles ────────────────────────────────────────── */}
        <Reveal delay={100}>
          <div className="mt-11 overflow-hidden rounded-[1.75rem] border border-ink-200 bg-white">
            <div className="grid lg:grid-cols-12">
              <div className="flex flex-col justify-between gap-10 border-b border-ink-200 p-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:p-10">
                <div>
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-plum-700">
                    {t('home.sections.principles')}
                  </p>
                  <h3 className="mt-5 max-w-[14ch] font-display text-2xl font-medium leading-snug text-ink-900 text-balance sm:text-[1.7rem]">
                    {t('missionVision.corePrinciples.title')}
                  </h3>
                </div>

                {/* Arched window with a cross mullion — the motif the council's
                    own building carries, and it fills a cell that was empty. */}
                <svg
                  viewBox="0 0 80 120"
                  aria-hidden="true"
                  className="hidden h-32 w-auto text-plum-600/30 lg:block"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                >
                  <path d="M4 118 V40 a36 36 0 0 1 72 0 v78 z" />
                  <path d="M40 8 V118" />
                  <path d="M6 68 H74" />
                </svg>
              </div>

              <ol className="lg:col-span-8">
                {principles.map((principle, i) => (
                  <li
                    key={principle}
                    className={`group flex items-start gap-5 p-8 transition-colors duration-300 hover:bg-ink-50 sm:gap-7 lg:p-9 ${
                      i > 0 ? 'border-t border-ink-200' : ''
                    }`}
                  >
                    <span className="tnum shrink-0 pt-0.5 font-mono text-xs text-ink-400 transition-colors duration-300 group-hover:text-plum-700">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="max-w-[62ch] text-[0.95rem] leading-relaxed text-ink-700 text-pretty transition-colors duration-300 group-hover:text-plum-700">
                      {principle}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default MissionVisionSection;
