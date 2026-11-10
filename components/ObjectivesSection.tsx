'use client';

import { useEffect, useRef, useState } from 'react';
import Link from '@/components/LocalizedLink';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/Reveal';
import SplitReveal from '@/components/motion/SplitReveal';

/**
 * The council's six objectives, on the About page.
 *
 * The heading pins on the left while the objectives scroll past on the right;
 * the one crossing the middle of the screen is set in full ink with a green
 * numeral, the rest stay readable (ink-500, 4.9:1) — the page reads like a
 * charter being gone through line by line rather than a grid of equal boxes.
 */
const ObjectivesSection = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  const objectives = [
    t('objectives.objective1'),
    t('objectives.objective2'),
    t('objectives.objective3'),
    t('objectives.objective4'),
    t('objectives.objective5'),
    t('objectives.objective6'),
  ];

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = items.current.indexOf(entry.target as HTMLLIElement);
            if (index >= 0) setActive(index);
          }
        });
      },
      { rootMargin: '-42% 0px -42% 0px' },
    );
    items.current.forEach((item) => item && observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const next = [
    { href: '/about/history', label: t('navbar.ourHistory') },
    { href: '/about/structure', label: t('navbar.cepcaStructures') },
    { href: '/members', label: t('navbar.members') },
  ];

  return (
    <section className="grain relative bg-white py-20 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-plum-700/[0.12] blur-[130px]" />
      </div>

      <div className="shell relative grid gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Pinned heading */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="grow-x h-px w-10 origin-left bg-plum-500" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-700">
                  {t('home.sections.mandate')}
                </p>
              </div>
            </Reveal>

            <SplitReveal
              as="h2"
              delay={80}
              className="mt-7 block font-display text-[clamp(2.3rem,4.8vw,4rem)] font-semibold leading-[1.02] tracking-tightest text-ink-900 text-balance"
              text={t('objectives.title')}
            />

            <Reveal delay={200}>
              <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-ink-600 text-pretty">
                {t('objectives.subtitle')}
              </p>
            </Reveal>

            {/* Progress through the six. */}
            <Reveal delay={260} className="mt-10 hidden lg:block">
              <div aria-hidden="true" className="flex items-center gap-4">
                <span className="tnum font-mono text-xs text-plum-700">{String(active + 1).padStart(2, '0')}</span>
                <span className="relative h-px flex-1 max-w-[12rem] bg-ink-200">
                  <span
                    className="absolute inset-y-0 left-0 bg-leaf-600 transition-[width] duration-700 ease-spring"
                    style={{ width: `${((active + 1) / objectives.length) * 100}%` }}
                  />
                </span>
                <span className="tnum font-mono text-xs text-ink-400">{String(objectives.length).padStart(2, '0')}</span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* The objectives */}
        <ol className="border-t border-ink-200 lg:col-span-7">
          {objectives.map((objective, i) => {
            const on = i === active;
            return (
              <li
                key={i}
                ref={(node) => {
                  items.current[i] = node;
                }}
                className="border-b border-ink-200"
              >
                <Reveal delay={Math.min(i, 3) * 70}>
                  <div className="group flex items-start gap-6 py-8 sm:gap-10 lg:py-10">
                    <span
                      aria-hidden="true"
                      className={`tnum w-14 shrink-0 font-display text-[2.4rem] font-semibold leading-none tracking-tight transition-colors duration-500 sm:w-20 sm:text-[3.2rem] ${
                        on ? 'text-leaf-600' : 'text-outline text-ink-400 group-hover:text-plum-500'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p
                      className={`max-w-[34ch] pt-1 font-display text-[clamp(1.3rem,2.1vw,1.75rem)] leading-[1.3] tracking-tight text-pretty transition-colors duration-500 ${
                        on ? 'text-ink-900' : 'text-ink-500 group-hover:text-ink-800'
                      }`}
                    >
                      {objective}
                    </p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Where to go next — the three things the line below names. */}
      <div className="shell relative mt-16">
        <Reveal>
          <div className="flex flex-col gap-6 rounded-2xl border border-ink-200 bg-ink-50 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-[44ch] font-display text-xl leading-snug text-ink-800 text-pretty">
              {t('objectives.ctaDescription')}
            </p>
            <ul className="flex flex-wrap gap-3">
              {next.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="focus-ring group inline-flex items-center gap-2 rounded-full border border-ink-300 bg-white px-5 py-2.5 font-ui text-sm font-semibold text-ink-800 transition-all duration-300 ease-spring hover:border-plum-400 hover:bg-plum-50 active:translate-y-px"
                  >
                    {link.label}
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ObjectivesSection;
