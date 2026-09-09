'use client';

import { Church, Landmark, Stethoscope, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CountUp from '@/components/CountUp';
import Reveal from '@/components/Reveal';

/**
 * The council in figures.
 *
 * Built to the supplied reference: four centred columns, each led by a ringed
 * icon, then the figure, then its label. It sits between the "who we are"
 * section and the programmes band, where the reference puts it.
 */
const StatsSection = () => {
  const { t } = useTranslation();

  const stats = [
    { value: 12, suffix: '', label: t('home.stats.churches'), Icon: Church },
    { value: 13, suffix: 'M', label: t('home.stats.believers'), Icon: Users },
    { value: 15500, suffix: '', label: t('home.stats.congregations'), Icon: Landmark },
    { value: 350, suffix: '', label: t('home.stats.health'), Icon: Stethoscope },
  ];

  return (
    <section className="grain relative overflow-hidden bg-white py-14 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-plum-50 blur-[120px]"
      />

      <div className="shell relative">
        <ul className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal as="li" key={stat.label} delay={i * 90}>
              <div className="flex flex-col items-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-50 ring-1 ring-inset ring-leaf-100">
                  <stat.Icon className="h-7 w-7 text-leaf-600" strokeWidth={1.6} />
                </span>
                <div className="mt-5 font-ui text-4xl font-semibold text-ink-900 sm:text-5xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-500">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default StatsSection;
