'use client';

import Image from 'next/image';
import Link from '@/components/LocalizedLink';
import { Users, School, Heart, Radio, Building2, Landmark, Church, GraduationCap, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import SectionHeading from '@/components/SectionHeading';
import Parallax from '@/components/motion/Parallax';

/**
 * The council in figures, on the mission and vision page.
 *
 * A bento rather than eight equal boxes: the largest fact — the believers —
 * gets the photograph (a women's choir at the national closing of the Week of
 * Protestantism) and a numeral to match; congregations take a double cell;
 * the rest sit in single cells with a cursor-lit border. Icons are one colour,
 * as everywhere on the site.
 */
const ImpactSection = () => {
  const { t } = useTranslation();

  const cells = [
    { key: 'congregations', value: 15500, suffix: '', Icon: Landmark, wide: true },
    { key: 'churches', value: 12, suffix: '', Icon: Church },
    { key: 'schools', value: 1580, suffix: '', Icon: School },
    { key: 'universities', value: 15, suffix: '', Icon: GraduationCap },
    { key: 'health', value: 450, suffix: '', Icon: Heart },
    { key: 'radio', value: 9, suffix: '', Icon: Radio },
    { key: 'microfinance', value: 3, suffix: '', Icon: Building2 },
  ];

  const spotlight = (event: React.MouseEvent<HTMLElement>) => {
    const r = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${event.clientX - r.left}px`);
    event.currentTarget.style.setProperty('--my', `${event.clientY - r.top}px`);
  };

  return (
    <div>
      <SectionHeading eyebrow={t('home.sections.pillars')} title={t('impact.title')} standfirst={t('impact.subtitle')} />

      <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-[repeat(3,minmax(13rem,auto))]">
        {/* The feature cell: believers. */}
        <Reveal as="li" variant="wipe" className="col-span-2 lg:row-span-2">
          <div className="relative h-full min-h-[22rem] overflow-hidden rounded-2xl bg-ink-900">
            <Parallax strength={60} className="absolute inset-0">
              <Image
                src="/images/about/choir.jpg"
                alt={t('about.photos.choirAlt')}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </Parallax>
            {/* Neutral charcoal, never plum, over photographs. */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgb(12 12 14 / 0.88) 0%, rgb(12 12 14 / 0.45) 45%, rgb(12 12 14 / 0) 75%)' }}
            />
            <div className="absolute inset-x-0 bottom-0 p-7 lg:p-10">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                <Users aria-hidden="true" className="h-5 w-5 text-leaf-300" />
              </span>
              <span className="mt-5 block font-display text-[clamp(3.6rem,8vw,7rem)] font-semibold leading-none tracking-tight text-white">
                <CountUp value={11.5} suffix="M" durationMs={1600} />
              </span>
              <span className="mt-3 block font-mono text-[0.66rem] uppercase tracking-[0.22em] text-leaf-300">
                {t('impact.stats.believers.label')}
              </span>
              <span className="mt-1 block text-sm text-white/[0.85]">{t('impact.stats.believers.description')}</span>
            </div>
          </div>
        </Reveal>

        {cells.map((cell, i) => (
          <Reveal as="li" key={cell.key} delay={Math.min(i, 8) * 70} className={cell.wide ? 'col-span-2' : ''}>
            <div
              onMouseMove={spotlight}
              className="spotlight card group flex h-full flex-col rounded-2xl p-6 transition-transform duration-300 ease-spring hover:-translate-y-1 lg:p-7"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink-200 bg-white transition-colors duration-300 group-hover:border-leaf-300">
                  <cell.Icon aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                </span>
              </div>
              <span
                className={`mt-auto block pt-8 font-display font-semibold leading-none tracking-tight text-ink-900 ${
                  cell.wide ? 'text-[clamp(2.8rem,5vw,4.4rem)]' : 'text-[clamp(2.2rem,3.4vw,3rem)]'
                }`}
              >
                <CountUp value={cell.value} suffix={cell.suffix} />
              </span>
              <span className="mt-3 block font-mono text-[0.62rem] uppercase tracking-[0.2em] text-plum-700">
                {t(`impact.stats.${cell.key}.label`)}
              </span>
              <span className="mt-1.5 block text-sm leading-relaxed text-ink-500 text-pretty">
                {t(`impact.stats.${cell.key}.description`)}
              </span>
            </div>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={120}>
        <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-ink-200 bg-ink-50 p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-tight text-ink-900">
              {t('impact.ctaTitle')}
            </h3>
            <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-ink-600 text-pretty">{t('impact.ctaBody')}</p>
          </div>
          <Link
            href="/give"
            className="focus-ring group inline-flex shrink-0 items-center gap-2.5 self-start rounded-full bg-leaf-600 px-7 py-3.5 font-ui text-sm font-semibold text-white shadow-[0_14px_30px_-14px_rgb(39_113_78/0.8)] transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:bg-leaf-700 active:translate-y-px lg:self-center"
          >
            <Heart aria-hidden="true" className="h-4 w-4" />
            {t('impact.donateNow')}
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
    </div>
  );
};

export default ImpactSection;
