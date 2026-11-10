'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from '@/components/LocalizedLink';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/components/PageLayout';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import ObjectivesSection from '@/components/ObjectivesSection';
import MottoRibbon from '@/components/MottoRibbon';
import MottoSeal from '@/components/MottoSeal';
import ChurchLogoRibbon, { type RibbonChurch } from '@/components/ChurchLogoRibbon';
import SplitReveal from '@/components/motion/SplitReveal';
import Parallax from '@/components/motion/Parallax';

/**
 * The About hub.
 *
 * Built from the council's own photographs — leaders of the member churches
 * standing in one line at the Littoral Week of Protestantism, a pastor at the
 * national closing — never stock. The page runs: an editorial hero with a
 * layered photo composition, the motto as a bilingual ribbon, the four About
 * chapters as an index whose picture follows the chapter you are on, the
 * council in figures with the member churches' emblems drifting beneath, and
 * the objectives as a ledger that brightens line by line.
 */
export default function AboutClient({ churches }: { churches: RibbonChurch[] }) {
  return (
    <PageLayout>
      <AboutHero />
      <MottoRibbon />
      <ChapterIndex />
      <Figures churches={churches} />
      <ObjectivesSection />
    </PageLayout>
  );
}

/* -------------------------------------------------------------------------- */

function AboutHero() {
  const { t } = useTranslation();
  const title = t('about.pageTitle');
  const words = title.split(' ');
  const last = words.pop() ?? '';

  const facts = [
    { value: 12, suffix: '', label: t('home.stats.churches') },
    { value: 13, suffix: 'M+', label: t('home.stats.believers') },
    { value: 15500, suffix: '', label: t('home.stats.congregations') },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-white pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-24 -z-10 h-[30rem] w-[30rem] rounded-full bg-plum-100/60 blur-[120px]"
      />

      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Copy */}
        <div className="lg:col-span-6 xl:col-span-5">
          <Reveal>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="grow-x h-px w-10 origin-left bg-plum-500" />
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-700">
                {t('home.eyebrow')}
              </p>
            </div>
          </Reveal>

          <SplitReveal
            as="h1"
            delay={120}
            className="mt-7 block font-display text-[clamp(2.9rem,6.4vw,5.6rem)] font-semibold leading-[0.98] tracking-tightest text-ink-900 text-balance"
            text={[{ text: words.join(' ') }, { text: last, className: 'italic text-leaf-600' }]}
          />

          <Reveal delay={380}>
            <p className="mt-7 max-w-[46ch] text-lg leading-relaxed text-ink-600 text-pretty">
              {t('about.pageSubtitle')}
            </p>
          </Reveal>

          <Reveal delay={460}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/about/history"
                className="focus-ring group inline-flex items-center gap-2.5 rounded-full bg-leaf-600 px-6 py-3.5 font-ui text-sm font-semibold text-white shadow-[0_14px_30px_-14px_rgb(39_113_78/0.8)] transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:bg-leaf-700 active:translate-y-px"
              >
                {t('navbar.ourHistory')}
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
              </Link>
              <Link
                href="/board"
                className="focus-ring group inline-flex items-center gap-2 rounded-full border border-ink-300 bg-white px-6 py-3.5 font-ui text-sm font-semibold text-ink-800 transition-all duration-300 ease-spring hover:border-plum-400 hover:bg-plum-50 active:translate-y-px"
              >
                {t('navbar.board')}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={540}>
            <dl className="mt-12 grid grid-cols-3 divide-x divide-ink-200 border-t border-ink-200 pt-7">
              {facts.map((fact, i) => (
                <div key={fact.label} className={i === 0 ? 'pr-4' : 'px-4'}>
                  <dt className="sr-only">{fact.label}</dt>
                  <dd>
                    <span className="block font-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-none tracking-tight text-ink-900">
                      <CountUp value={fact.value} suffix={fact.suffix} />
                    </span>
                    <span aria-hidden="true" className="mt-3 block font-mono text-[0.6rem] uppercase leading-snug tracking-[0.18em] text-ink-500">
                      {fact.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Photographs: the leaders of the member churches in one line, with
            a pastor of the national closing laid over the lower left. */}
        <div className="relative lg:col-span-6 xl:col-span-6 xl:col-start-7">
          <div
            aria-hidden="true"
            className="absolute -bottom-8 -right-6 -z-10 h-40 w-56 opacity-80"
            style={{
              backgroundImage: 'radial-gradient(theme(colors.leaf.300) 1.4px, transparent 1.6px)',
              backgroundSize: '16px 16px',
            }}
          />

          <div className="relative pb-16 pl-10 sm:pb-20 sm:pl-24">
            <Reveal variant="wipe" delay={200}>
              <Parallax strength={70} className="aspect-[4/3.3] rounded-2xl bg-ink-100">
                <Image
                  src="/images/about/leaders-together.jpg"
                  alt={t('about.photos.leadersAlt')}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-[50%_40%]"
                />
              </Parallax>
            </Reveal>

            <Reveal
              variant="wipe"
              delay={620}
              className="absolute bottom-0 left-0 w-[38%] max-w-[15rem]"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink-100 ring-[6px] ring-white">
                <Image
                  src="/images/about/pastor-with-bible.jpg"
                  alt={t('about.photos.pastorAlt')}
                  fill
                  sizes="15rem"
                  className="object-cover object-top"
                />
              </div>
            </Reveal>

            <Reveal variant="scale" delay={900} className="absolute -top-10 left-[34%] sm:-top-12 sm:left-[42%]">
              <MottoSeal className="h-24 w-24 sm:h-28 sm:w-28" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The four About chapters as an index. On wide screens a sticky picture frame
 * follows the chapter under the pointer — or, while scrolling, the one crossing
 * the middle of the screen — so the page works the same with a mouse, a finger
 * or a keyboard (focus moves the picture too). On phones each chapter carries
 * its own picture.
 */
function ChapterIndex() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  const chapters = [
    {
      id: 'history',
      title: t('about.history.title'),
      description: t('about.history.description'),
      preview: t('about.history.preview'),
      href: '/about/history',
      image: '/images/logo5.jpg',
      alt: t('about.photos.signAlt'),
    },
    {
      id: 'mission-vision',
      title: t('about.missionVision.title'),
      description: t('about.missionVision.description'),
      preview: t('about.missionVision.preview'),
      href: '/about/mission-vision',
      image: '/images/about/congregation.jpg',
      alt: t('about.photos.congregationAlt'),
    },
    {
      id: 'general-secretariat',
      title: t('about.generalSecretariat.title'),
      description: t('about.generalSecretariat.description'),
      preview: t('about.generalSecretariat.preview'),
      href: '/about/general-secretariat',
      image: '/images/hero-image.jpg',
      alt: t('about.photos.headquartersAlt'),
    },
    {
      id: 'structure',
      title: t('about.structure.title'),
      description: t('about.structure.description'),
      preview: t('about.structure.preview'),
      href: '/about/structure',
      image: '/images/about/assembly-steps.jpg',
      alt: t('about.photos.assemblyAlt'),
    },
  ];

  // While scrolling, the chapter crossing the middle band is the active one.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = rows.current.indexOf(entry.target as HTMLLIElement);
            if (index >= 0) setActive(index);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    rows.current.forEach((row) => row && observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return (
    <PageSection tone="white" className="lg:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Sticky frame (wide screens only). */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-28">
            <Reveal variant="wipe">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-100">
                {chapters.map((chapter, i) => (
                  <Image
                    key={chapter.id}
                    src={chapter.image}
                    alt={i === active ? chapter.alt : ''}
                    aria-hidden={i === active ? undefined : true}
                    fill
                    sizes="40vw"
                    className={`object-cover transition-[opacity,transform] duration-700 ease-spring ${
                      i === active ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                    }`}
                  />
                ))}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 shadow-[0_14px_30px_-18px_rgb(31_19_56/0.6)]">
                  <span className="tnum font-mono text-[0.68rem] uppercase tracking-[0.22em] text-plum-700">
                    {String(active + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}
                  </span>
                  <span className="truncate font-display text-base font-semibold text-ink-900">
                    {chapters[active].title}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* The index. */}
        <div className="lg:col-span-7">
          <Reveal>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="grow-x h-px w-10 origin-left bg-plum-500" />
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-700">
                {t('home.sections.whoWeAre')}
              </p>
            </div>
          </Reveal>

          <ol className="mt-8 border-t border-ink-200">
            {chapters.map((chapter, i) => (
              <li
                key={chapter.id}
                ref={(node) => {
                  rows.current[i] = node;
                }}
                className="border-b border-ink-200"
              >
                <Reveal delay={Math.min(i, 4) * 80}>
                  <Link
                    href={chapter.href}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="focus-ring group relative block py-9 lg:py-11"
                  >
                    {/* Phone and tablet: the chapter's own picture. */}
                    <div className="relative mb-7 aspect-[16/9] overflow-hidden rounded-2xl bg-ink-100 lg:hidden">
                      <Image src={chapter.image} alt="" fill sizes="100vw" className="object-cover" />
                    </div>

                    <div className="flex items-start gap-6 sm:gap-10">
                      <span
                        aria-hidden="true"
                        className={`tnum shrink-0 font-display text-[clamp(2.4rem,4vw,3.6rem)] font-semibold leading-none tracking-tight transition-colors duration-500 ${
                          i === active ? 'text-leaf-600' : 'text-outline text-ink-400'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-6">
                          <h2 className="font-display text-[clamp(1.75rem,3vw,2.6rem)] font-semibold leading-[1.08] tracking-tight text-ink-900 transition-[color,transform] duration-500 ease-spring group-hover:translate-x-1.5 group-hover:text-plum-700">
                            {chapter.title}
                          </h2>
                          <span
                            aria-hidden="true"
                            className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-spring group-hover:-rotate-45 group-hover:border-leaf-600 group-hover:bg-leaf-600 group-hover:text-white ${
                              i === active ? 'border-leaf-600 text-leaf-600' : 'border-ink-200 text-ink-500'
                            }`}
                          >
                            <ArrowRight className="h-5 w-5" />
                          </span>
                        </div>

                        <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-ink-600 text-pretty">
                          {chapter.description}
                        </p>
                        <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-ink-500 text-pretty">
                          {chapter.preview}
                        </p>
                        <span className="sr-only">{t('about.learnMore')}</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </PageSection>
  );
}

/* -------------------------------------------------------------------------- */

function Figures({ churches }: { churches: RibbonChurch[] }) {
  const { t } = useTranslation();

  const impact = [
    { value: 12, suffix: '', label: t('about.impact.memberChurches') },
    { value: 13, suffix: 'M+', label: t('about.impact.believers') },
    { value: 1580, suffix: '', label: t('about.impact.educationalInstitutions') },
    { value: 350, suffix: '', label: t('about.impact.healthCenters') },
  ];

  return (
    <PageSection tone="dark" paint className="py-20 lg:py-28">
      <SectionHeading
        eyebrow={t('home.sections.pillars')}
        title={t('about.impact.title')}
        tone="dark"
        layout="stack"
      />

      <dl className="mt-14 grid grid-cols-2 gap-y-12 lg:grid-cols-4">
        {impact.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={Math.min(i, 8) * 90}
            className={`pr-6 ${i > 0 ? 'lg:border-l lg:border-white/10 lg:pl-8' : ''} ${i % 2 === 1 ? 'border-l border-white/10 pl-6 lg:pl-8' : ''}`}
          >
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="block font-display text-[clamp(2.8rem,5.6vw,5rem)] font-semibold leading-none tracking-tight text-white">
                <CountUp value={stat.value} suffix={stat.suffix} durationMs={1800} />
              </span>
              <span aria-hidden="true" className="grow-x mt-5 block h-px w-16 origin-left bg-leaf-400" />
              <span aria-hidden="true" className="mt-4 block font-mono text-[0.64rem] uppercase tracking-[0.2em] text-leaf-300">
                {stat.label}
              </span>
            </dd>
          </Reveal>
        ))}
      </dl>

      {churches.length > 0 && (
        <Reveal delay={200} className="mt-16 lg:mt-20">
          <ChurchLogoRibbon churches={churches} />
        </Reveal>
      )}
    </PageSection>
  );
}
