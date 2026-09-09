'use client';

import Link from 'next/link';
import { Users, School, Heart, Radio, Building2, Landmark, Church, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';

/**
 * The council in figures, shown on the mission and vision page.
 *
 * Every figure used to carry its own gradient — purple, green, blue, orange,
 * indigo, red, teal, yellow — which made a rainbow out of what is really one
 * uniform set of facts. Differentiation now comes from the figure itself; the
 * icons are one colour, as they are everywhere else on the site.
 *
 * The copy was also hardcoded English on a bilingual site, so French visitors
 * read this block in English. It now goes through i18next like everything else.
 */
const ImpactSection = () => {
  const { t } = useTranslation();

  const stats = [
    { key: 'churches', value: 12, suffix: '', Icon: Church },
    { key: 'believers', value: 13, suffix: 'M', Icon: Users },
    { key: 'congregations', value: 15500, suffix: '', Icon: Landmark },
    { key: 'schools', value: 1580, suffix: '', Icon: School },
    { key: 'universities', value: 15, suffix: '', Icon: GraduationCap },
    { key: 'health', value: 350, suffix: '', Icon: Heart },
    { key: 'radio', value: 9, suffix: '', Icon: Radio },
    { key: 'microfinance', value: 3, suffix: '', Icon: Building2 },
  ];

  return (
    <div>
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-[clamp(2.1rem,4.2vw,3.4rem)] font-semibold leading-[1.04] tracking-tight text-ink-900 text-balance">
            {t('impact.title')}
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-6 text-base leading-relaxed text-ink-600 text-pretty">
            {t('impact.subtitle')}
          </p>
        </Reveal>
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal as="li" key={stat.key} delay={Math.min(i, 8) * 60}>
            <div className="card card-hover flex h-full flex-col p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink-200 bg-white">
                <stat.Icon aria-hidden="true" className="h-5 w-5 text-leaf-600" />
              </span>

              <span className="mt-6 block font-display text-[clamp(1.9rem,3vw,2.6rem)] font-semibold leading-none tracking-tight text-ink-900">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </span>

              <span className="mt-3 block font-mono text-[0.62rem] uppercase tracking-[0.2em] text-plum-700">
                {t(`impact.stats.${stat.key}.label`)}
              </span>

              <span className="mt-2 block text-sm leading-relaxed text-ink-500 text-pretty">
                {t(`impact.stats.${stat.key}.description`)}
              </span>
            </div>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={200}>
        <div className="mt-12 rounded-2xl border border-ink-200 bg-ink-50 p-8 text-center lg:p-12">
          <h3 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
            {t('impact.ctaTitle')}
          </h3>
          <p className="mx-auto mt-4 max-w-[60ch] text-base leading-relaxed text-ink-600 text-pretty">
            {t('impact.ctaBody')}
          </p>
          {/* `/donate` does not exist — the giving page is `/give`. The old link
              here was a 404. */}
          <Link
            href="/give"
            className="focus-ring group mt-7 inline-flex items-center gap-2.5 rounded-full bg-leaf-600 px-7 py-3.5 font-ui text-sm font-semibold text-white transition-all duration-300 ease-spring hover:bg-leaf-700 active:translate-y-px"
          >
            <Heart aria-hidden="true" className="h-4 w-4" />
            {t('impact.donateNow')}
          </Link>
        </div>
      </Reveal>
    </div>
  );
};

export default ImpactSection;
