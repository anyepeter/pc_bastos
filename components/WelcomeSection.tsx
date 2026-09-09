'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/Reveal';
import PaintedFrame from '@/components/PaintedFrame';

/**
 * "Who we are".
 *
 * Two columns: a layered photo cluster on the left, the council's own account
 * of itself on the right. The three arenas the council works in are a tab set
 * rather than a stacked list — one paragraph is visible at a time, so the
 * column stays short enough to sit beside the photographs instead of running
 * far past them.
 */
const WelcomeSection = () => {
  const { t } = useTranslation();

  const tabsId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const pillars = [
    { title: t('welcome.healthcare.title'), description: t('welcome.healthcare.description') },
    { title: t('welcome.education.title'), description: t('welcome.education.description') },
    {
      title: t('welcome.spiritualLeadership.title'),
      description: t('welcome.spiritualLeadership.description'),
    },
  ];

  const activePillar = pillars[active];

  /** Roving arrow-key navigation, as the tablist pattern expects. */
  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = pillars.length - 1;
    let next: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index === 0 ? last : index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;

    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="grain relative overflow-hidden bg-white py-14 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-plum-100/60 blur-[130px]"
      />

      <div className="shell relative">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          <Reveal className="order-2 lg:order-none lg:col-span-6" delay={60}>
            <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
              <div className="relative grid grid-cols-12">
                {/* Arch one — upper left, the larger of the pair */}
                <div className="relative col-span-9 col-start-1 row-start-1 self-start">
                  <div className="overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/hero2.jpg"
                      alt="A red-brick member church with a tall bell tower and rows of pointed arched windows"
                      className="aspect-[3/4] w-full object-cover object-[72%_center] transition-transform duration-1000 ease-spring hover:scale-[1.04]"
                      loading="lazy"
                    />
                  </div>

                  {/* Dotted grid, anchored to THIS photo rather than the wrapper:
                      `top-full` sets its top on the photo's bottom edge and the
                      quarter-height lift pulls exactly 1/4 of it over the image,
                      holding at every breakpoint. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-3 top-full h-28 w-36 -translate-y-1/4 text-leaf-300 sm:-left-6 sm:h-36 sm:w-48"
                    style={{
                      backgroundImage: 'radial-gradient(currentColor 1.5px, transparent 1.5px)',
                      backgroundSize: '14px 14px',
                    }}
                  />
                </div>

                {/* Arch two — smaller, offset down and to the right. The thick
                    ink-50 border is the section ground, so it reads as a clean
                    cut where the two photographs overlap and disappears where
                    the frame sits on the page. */}
                <PaintedFrame
                  variant={1}
                  className="col-span-7 col-start-6 row-start-1 mt-[76%] self-start overflow-hidden rounded-t-[50%_34%]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo5.jpg"
                    alt="The council's headquarters wall, a cross-shaped window above a banner naming its member churches"
                    className="aspect-[3/4] w-full object-cover object-center"
                    loading="lazy"
                  />
                </PaintedFrame>

                {/* Member-church count, in the empty space beside the domes */}
                <div className="absolute right-0 top-[9%] rounded-2xl bg-leaf-600 px-5 py-4 text-center shadow-[0_22px_44px_-20px_rgba(39,113,78,0.75)] sm:px-6 sm:py-5">
                  <p className="tnum font-ui text-3xl font-semibold leading-none text-white sm:text-4xl">
                    12
                  </p>
                  <p className="mt-2 max-w-[6.5rem] font-mono text-[0.56rem] uppercase leading-tight tracking-[0.18em] text-leaf-100">
                    {t('welcome.stats.memberChurches')}
                  </p>
                </div>

                {/* Believer count, pinned over the lower-left of the cluster */}
                <div className="absolute bottom-[22%] left-0 flex items-center gap-3 rounded-2xl bg-plum-900 px-3.5 py-3 shadow-[0_22px_44px_-20px_rgba(51,32,92,0.8)] sm:-left-5 sm:gap-4 sm:px-5 sm:py-4">
                  <span className="tnum font-ui text-2xl font-semibold leading-none text-white sm:text-3xl">
                    13M
                  </span>
                  <span className="max-w-[5.5rem] font-mono text-[0.56rem] uppercase leading-tight tracking-[0.18em] text-plum-200">
                    {t('welcome.stats.believers')}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── Content ──────────────────────────────────────────────────── */}
          <div className="order-1 lg:order-none lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-plum-500" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-700">
                  {t('home.sections.whoWeAre')}
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-7 max-w-[16ch] text-balance font-display text-[clamp(2.1rem,4.2vw,3.4rem)] font-semibold leading-[1.04] tracking-tight text-ink-900">
                {t('welcome.title')}{' '}
                <span className="text-leaf-600">{t('welcome.titleHighlight')}</span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-7 max-w-[60ch] text-pretty text-base leading-relaxed text-ink-600 lg:text-lg">
                {t('welcome.description')}
              </p>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-11 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-500">
                {t('home.sections.pillars')}
              </p>
            </Reveal>

            {/* Tabs. They wrap rather than squash, so three long French labels
                stack cleanly at 390px instead of being crushed onto one row. */}
            <Reveal delay={250}>
              <div
                role="tablist"
                aria-label={t('home.sections.pillars')}
                className="mt-5 flex flex-wrap items-center gap-2 sm:gap-2.5"
              >
                {pillars.map((pillar, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={pillar.title}
                      type="button"
                      role="tab"
                      id={`${tabsId}-tab-${i}`}
                      aria-selected={isActive}
                      aria-controls={`${tabsId}-panel-${i}`}
                      tabIndex={isActive ? 0 : -1}
                      ref={(node) => {
                        tabRefs.current[i] = node;
                      }}
                      onClick={() => setActive(i)}
                      onKeyDown={(event) => handleTabKeyDown(event, i)}
                      className={`focus-ring inline-flex items-center rounded-full border px-4 py-2.5 font-ui text-sm font-semibold transition-all duration-300 ease-spring active:translate-y-px sm:px-5 ${
                        isActive
                          ? 'border-plum-600 bg-plum-600 text-white shadow-[0_14px_28px_-14px_rgba(93,50,166,0.8)]'
                          : 'border-transparent text-ink-600 hover:text-plum-700'
                      }`}
                    >
                      {pillar.title}
                    </button>
                  );
                })}
              </div>
            </Reveal>

            {/* Panel. A min-height holds the block steady so switching tabs
                does not shunt the buttons below it up and down. */}
            <Reveal delay={300}>
              <div
                key={active}
                role="tabpanel"
                id={`${tabsId}-panel-${active}`}
                aria-labelledby={`${tabsId}-tab-${active}`}
                tabIndex={0}
                className="focus-ring mt-7 min-h-[5.5rem] border-t border-ink-200 pt-7 sm:min-h-[4.75rem]"
              >
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-700"
                  >
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <p className="max-w-[54ch] text-pretty text-base leading-relaxed text-ink-600">
                    {activePillar.description}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={360}>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href="/about"
                  className="focus-ring group inline-flex items-center gap-2.5 rounded-full bg-leaf-600 px-6 py-3.5 font-ui text-sm font-semibold text-white shadow-[0_18px_36px_-18px_rgba(93,50,166,0.85)] transition-all duration-300 ease-spring hover:bg-plum-700 active:translate-y-px"
                >
                  {t('welcome.learnMore')}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/give"
                  className="focus-ring group inline-flex items-center gap-1.5 font-ui text-sm font-medium text-plum-700 underline decoration-plum-300 decoration-1 underline-offset-[6px] transition-colors duration-300 hover:text-plum-800 hover:decoration-plum-500"
                >
                  {t('welcome.supportOurWork')}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
