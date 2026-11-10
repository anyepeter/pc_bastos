'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/components/PageLayout';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import NextChapter from '@/components/NextChapter';
import ScrollWords from '@/components/motion/ScrollWords';
import { useInView } from '@/components/motion/useInView';
import { useScrollProgress } from '@/components/motion/useScrollProgress';

/**
 * The council's history, set as a long read.
 *
 * A sticky rail on the left names the three chapters, marks the one being
 * read and fills a hairline as the reader progresses. The Preamble — a
 * confession of faith quoting John 17:21 — lights up word by word as it is
 * scrolled through. The milestones close the story on a dark band, the line
 * between them drawing itself as the reader goes down it.
 *
 * Photography is the council's own: its signboard at the Yaoundé headquarters
 * and the Secretariat building. No archival photographs of 1969 exist on the
 * site, and none is invented.
 */
export default function HistoryPage() {
  const { t } = useTranslation();
  const article = useRef<HTMLDivElement | null>(null);
  useScrollProgress(article, { mode: 'anchor', anchor: 0.5 });

  const chapters = [
    { id: 'beginning', title: t('about.history.theBeginning') },
    { id: 'preamble', title: t('about.history.thePreamble') },
    { id: 'evolution', title: t('about.history.evolutionToCepca') },
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const nodes = chapters.map((chapter) => document.getElementById(chapter.id));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = nodes.indexOf(entry.target as HTMLElement);
            if (index >= 0) setActive(index);
          }
        });
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
    nodes.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
    // The chapter ids are fixed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const milestones = [
    { year: '1969', text: t('about.history.milestone1969') },
    // Every label is a plain four-digit year. The committees have no exact date
    // in the council's records, so the text says "during the 1970s".
    { year: '1970', text: t('about.history.milestone1970s') },
    { year: '2009', text: t('about.history.milestone2009') },
    { year: String(new Date().getFullYear()), text: t('about.history.milestoneToday') },
  ];

  return (
    <PageLayout>
      <PageHero
        title={t('about.history.pageTitle')}
        lede={t('about.history.pageSubtitle')}
        media={{ src: '/images/logo5.jpg', alt: t('about.photos.signAlt'), position: '50% 45%' }}
      />

      <section className="relative bg-white py-16 lg:py-28">
        <div ref={article} className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Chapter rail */}
          <nav aria-label={t('about.history.pageTitle')} className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-32">
              <div className="relative pl-6">
                <span aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-ink-200" />
                <span aria-hidden="true" className="draw-y absolute bottom-0 left-0 top-0 w-px bg-leaf-600" />
                <ol className="space-y-6">
                  {chapters.map((chapter, i) => (
                    <li key={chapter.id}>
                      <a
                        href={`#${chapter.id}`}
                        className={`focus-ring group flex items-baseline gap-4 transition-colors duration-300 ${
                          i === active ? 'text-ink-900' : 'text-ink-500 hover:text-ink-800'
                        }`}
                      >
                        <span className={`tnum font-mono text-[0.68rem] tracking-[0.2em] ${i === active ? 'text-leaf-600' : 'text-ink-400'}`}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-display text-lg font-semibold leading-snug">{chapter.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </nav>

          <div className="lg:col-span-8 lg:col-start-5">
            {/* 01 — the founding */}
            <article id="beginning" className="scroll-mt-32">
              <ChapterTitle index={1} title={chapters[0].title} />
              <Reveal delay={80}>
                <p className="drop-cap mt-10 max-w-[64ch] text-lg leading-[1.85] text-ink-700 text-pretty">
                  {t('about.history.beginningText1')}
                </p>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-7 max-w-[64ch] text-lg leading-[1.85] text-ink-600 text-pretty">
                  {t('about.history.beginningText2')}
                </p>
              </Reveal>
            </article>

            {/* 02 — the preamble, read aloud */}
            <article id="preamble" className="mt-24 scroll-mt-32 lg:mt-32">
              <ChapterTitle index={2} title={chapters[1].title} />
              <div className="relative mt-10">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-2 -top-14 select-none font-display text-[9rem] italic leading-none text-plum-100 sm:-left-8 lg:-left-14"
                >
                  &ldquo;
                </span>
                <ScrollWords
                  as="blockquote"
                  className="relative font-display text-[clamp(1.45rem,2.6vw,2.15rem)] italic leading-[1.42] tracking-tight text-ink-900 text-pretty"
                  text={t('about.history.preambleText1')}
                />
              </div>
              <Reveal delay={80}>
                <p className="mt-10 max-w-[64ch] text-lg leading-[1.85] text-ink-600 text-pretty">
                  {t('about.history.preambleText2')}
                </p>
              </Reveal>
            </article>

            {/* 03 — the council today */}
            <article id="evolution" className="mt-24 scroll-mt-32 lg:mt-32">
              <ChapterTitle index={3} title={chapters[2].title} />
              <div className="mt-10 grid gap-10 xl:grid-cols-12">
                <div className="xl:col-span-7">
                  <Reveal delay={80}>
                    <p className="max-w-[64ch] text-lg leading-[1.85] text-ink-700 text-pretty">
                      {t('about.history.evolutionText1')}
                    </p>
                  </Reveal>
                  <Reveal delay={120}>
                    <p className="mt-7 max-w-[64ch] text-lg leading-[1.85] text-ink-600 text-pretty">
                      {t('about.history.evolutionText2')}
                    </p>
                  </Reveal>
                </div>
                <Reveal variant="wipe" delay={160} className="xl:col-span-5">
                  <figure>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-100">
                      <Image
                        src="/images/hero-image.jpg"
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 30vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="mt-3 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-ink-500">
                      {t('about.photos.headquartersAlt')}
                    </figcaption>
                  </figure>
                </Reveal>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* The milestones, on the page's one dark band. */}
      <PageSection tone="dark" paint className="py-20 lg:py-32">
        <SectionHeading title={t('about.history.keyMilestones')} tone="dark" layout="stack" />
        <Timeline milestones={milestones} />
      </PageSection>

      <NextChapter
        href="/about/mission-vision"
        title={t('about.missionVision.title')}
        description={t('about.missionVision.description')}
        image="/images/about/congregation.jpg"
      />
    </PageLayout>
  );
}

function ChapterTitle({ index, title }: { index: number; title: string }) {
  return (
    <Reveal>
      <div className="flex items-end gap-5">
        <span aria-hidden="true" className="tnum font-display text-[clamp(3.2rem,6vw,5rem)] font-semibold leading-[0.85] tracking-tight text-outline text-plum-300">
          {String(index).padStart(2, '0')}
        </span>
        <h2 className="pb-1 font-display text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-[1.04] tracking-tight text-ink-900 text-balance">
          {title}
        </h2>
      </div>
      <span aria-hidden="true" className="grow-x mt-6 block h-px w-full origin-left bg-ink-200" />
    </Reveal>
  );
}

/**
 * A vertical line that draws itself as the reader goes down it, each year
 * filling in green as the line reaches it. The years alternate sides on wide
 * screens.
 */
function Timeline({ milestones }: { milestones: { year: string; text: string }[] }) {
  const list = useRef<HTMLOListElement | null>(null);
  useScrollProgress(list, { mode: 'anchor', anchor: 0.62 });

  return (
    <ol ref={list} className="relative mt-16 lg:mt-20">
      <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-2 w-px bg-white/10 lg:left-1/2" />
      <span aria-hidden="true" className="draw-y absolute bottom-0 left-[7px] top-2 w-px bg-leaf-300 lg:left-1/2" />
      {milestones.map((milestone, i) => (
        <Milestone key={milestone.year} {...milestone} flip={i % 2 === 1} last={i === milestones.length - 1} />
      ))}
    </ol>
  );
}

function Milestone({ year, text, flip, last }: { year: string; text: string; flip: boolean; last: boolean }) {
  const [ref, reached] = useInView<HTMLLIElement>({ threshold: 0, rootMargin: '0px 0px -38% 0px' });

  return (
    <li ref={ref} data-reached={reached} className={`group relative pl-10 lg:grid lg:grid-cols-2 lg:pl-0 ${last ? '' : 'pb-16 lg:pb-24'}`}>
      <span
        aria-hidden="true"
        className="absolute left-0 top-3 h-[15px] w-[15px] rounded-full border-2 border-plum-950 bg-white/20 transition-all duration-500 group-data-[reached=true]:scale-125 group-data-[reached=true]:bg-leaf-300 group-data-[reached=true]:shadow-[0_0_0_6px_rgb(127_196_160/0.18)] lg:left-1/2 lg:-translate-x-1/2"
      />
      <div className={`${flip ? 'lg:col-start-2 lg:pl-16' : 'lg:pr-16 lg:text-right'}`}>
        <p
          className={`tnum font-display text-[clamp(3.2rem,7vw,6rem)] font-semibold leading-none tracking-tight transition-colors duration-700 ${
            reached ? 'text-leaf-300' : 'text-outline text-plum-300'
          }`}
        >
          {year}
        </p>
        <p
          className={`mt-4 max-w-[40ch] text-lg leading-relaxed text-plum-100 text-pretty transition-[opacity,transform] duration-700 ease-spring ${
            flip ? '' : 'lg:ml-auto'
          } ${reached ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-60'}`}
        >
          {text}
        </p>
      </div>
    </li>
  );
}
