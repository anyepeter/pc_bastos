'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/Reveal';

const ObjectivesSection = () => {
  const { t } = useTranslation();

  const objectives = [
    t('objectives.objective1'),
    t('objectives.objective2'),
    t('objectives.objective3'),
    t('objectives.objective4'),
    t('objectives.objective5'),
    t('objectives.objective6'),
  ];

  return (
    <section className="grain relative overflow-hidden bg-white py-14 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-plum-700/[0.15] blur-[130px]"
      />

      <div className="shell relative">
        {/* Header — deliberately off-centre */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-plum-500" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-plum-700">
                  {t('home.sections.mandate')}
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-7 font-display text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-[1.02] tracking-tightest text-ink-900 text-balance">
                {t('objectives.title')}
              </h2>
            </Reveal>
          </div>

          <Reveal delay={140} className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-[46ch] text-base leading-relaxed text-ink-600 text-pretty lg:pb-2">
              {t('objectives.subtitle')}
            </p>
          </Reveal>
        </div>

        {/* Ledger — two columns of numbered entries, no boxes */}
        <ol className="mt-11 grid border-t border-ink-200 md:grid-cols-2">
          {objectives.map((objective, i) => (
            <Reveal
              as="li"
              key={objective}
              delay={i * 70}
              /* The right-hand column keeps a dividing rule on desktop only. */
              className={`group relative border-b border-ink-200 md:[&:nth-child(odd)]:border-r md:[&:nth-child(odd)]:border-ink-200`}
            >
              <div
                className="spotlight flex h-full items-start gap-5 p-7 transition-colors duration-300 hover:bg-ink-50 sm:gap-7 lg:p-9"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
                }}
              >
                <span className="tnum shrink-0 pt-1 font-mono text-xs text-ink-400 transition-colors duration-300 group-hover:text-plum-700">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="max-w-[46ch] text-[0.98rem] leading-relaxed text-ink-700 text-pretty transition-colors duration-300 group-hover:text-plum-700">
                  {objective}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* Closing call to action, aligned with the ledger rather than centred */}
        <Reveal delay={120}>
          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[48ch] text-sm leading-relaxed text-ink-500 text-pretty">
              {t('objectives.ctaDescription')}
            </p>
            <Link
              href="/about"
              className="focus-ring group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-ink-300 bg-white px-6 py-3 font-ui text-sm font-semibold text-ink-800 transition-all duration-300 ease-spring hover:border-plum-400 hover:bg-plum-50 active:translate-y-px"
            >
              {t('home.readMandate')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ObjectivesSection;
