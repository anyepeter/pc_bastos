'use client';

import Image from 'next/image';
import Link from '@/components/LocalizedLink';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText, readTranslation } from '@/lib/translations';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import NextChapter from '@/components/NextChapter';
import MottoSeal from '@/components/MottoSeal';
import SplitReveal from '@/components/motion/SplitReveal';
import { boardPortrait, type PublicBoardMember } from '@/lib/board';
import {
  DEPARTMENTS,
  departmentIcon,
  type PublicDepartmentSummary,
} from '@/lib/departments';

/**
 * The General Secretariat: what it is, who leads it, then the departments
 * and services attached to it. The description is the council's own wording.
 */
export default function GeneralSecretariatClient({
  departments,
  secretary,
}: {
  departments: PublicDepartmentSummary[];
  /** The General Secretary as published in /admin/board, or null. */
  secretary: PublicBoardMember | null;
}) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);
  const read = (value: unknown) => getTranslatedText(readTranslation(value), language).trim();

  const entries =
    departments.length > 0
      ? departments.map((department) => ({
          key: department.id,
          href: `/departments/${department.slug}`,
          Icon: departmentIcon(department.acronym),
          acronym: department.acronym,
          name: read(department.name),
          summary: read(department.summary),
        }))
      : DEPARTMENTS.map(({ id, acronym, Icon }) => ({
          key: id,
          href: `/departments#${id}`,
          Icon,
          acronym,
          name: t(`about.departments.${id}.name`),
          summary: t(`about.departments.${id}.description`),
        }));

  return (
    <>
      <PageHero
        title={t('about.generalSecretariat.pageTitle')}
        lede={t('about.generalSecretariat.description')}
        media={{ src: '/images/hero-image.jpg', alt: t('about.photos.headquartersAlt'), position: '50% 55%' }}
      />

      {secretary && (
        <PageSection tone="white" className="lg:py-28">
          {/* The General Secretary as a portrait feature: the photograph
              uncovers from below, the name is set large beside it. Without a
              photo the text stands alone. */}
          <div className={`grid items-center gap-10 ${secretary.photo ? 'lg:grid-cols-12 lg:gap-16' : ''}`}>
            {secretary.photo && (
              <div className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
                <Reveal variant="wipe">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-100">
                    <Image
                      src={boardPortrait(secretary.photo)}
                      alt={secretary.name || t('about.generalSecretariat.photoAlt')}
                      fill
                      sizes="(min-width: 1024px) 38vw, 24rem"
                      priority
                      className="object-cover object-top"
                    />
                  </div>
                </Reveal>
                <Reveal variant="scale" delay={700} className="absolute -right-5 top-1/2 -translate-y-1/2 sm:-right-10">
                  <MottoSeal className="h-24 w-24 sm:h-28 sm:w-28" />
                </Reveal>
                <div
                  aria-hidden="true"
                  className="absolute -bottom-6 -left-6 -z-10 h-32 w-44"
                  style={{
                    backgroundImage: 'radial-gradient(theme(colors.leaf.300) 1.4px, transparent 1.6px)',
                    backgroundSize: '16px 16px',
                  }}
                />
              </div>
            )}

            <div className={`min-w-0 ${secretary.photo ? 'lg:col-span-7' : 'mx-auto max-w-3xl'}`}>
              <Reveal>
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="grow-x h-px w-10 origin-left bg-plum-500" />
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-700">
                    {read(secretary.title) || t('about.generalSecretariat.secretaryTitle')}
                  </p>
                </div>
              </Reveal>
              <SplitReveal
                as="h2"
                delay={100}
                className="mt-7 block font-display text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[1.02] tracking-tight text-ink-900 text-balance"
                text={secretary.name || t('about.generalSecretariat.secretaryTitle')}
              />
              <Reveal delay={260}>
                <p className="mt-8 max-w-[52ch] font-display text-[clamp(1.2rem,1.8vw,1.5rem)] leading-[1.5] text-ink-700 text-pretty">
                  {t('about.generalSecretariat.secretaryRole')}
                </p>
                <Link
                  href="/board"
                  className="focus-ring group mt-9 inline-flex items-center gap-3 rounded-full border border-ink-300 bg-white py-2 pl-6 pr-2 font-ui text-sm font-semibold text-ink-800 transition-all duration-300 ease-spring hover:border-plum-400 hover:bg-plum-50"
                >
                  {t('about.generalSecretariat.seeBoard')}
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf-600 text-white transition-transform duration-300 ease-spring group-hover:translate-x-1">
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </PageSection>
      )}

      {/* The departments and services, as a directory: the acronym large and
          outlined, filling with colour under the pointer. */}
      <PageSection tone="tint" className="lg:py-28">
        <SectionHeading
          eyebrow={t('home.sections.departments')}
          title={t('about.generalSecretariat.attachedTitle')}
          standfirst={t('about.generalSecretariat.attachedLede')}
        />

        <ul className="mt-14 grid border-t border-ink-200 md:grid-cols-2">
          {entries.map(({ key, href, Icon, acronym, name, summary }, i) => (
            <Reveal
              as="li"
              key={key}
              delay={Math.min(i, 8) * 50}
              className="border-b border-ink-200 md:[&:nth-child(odd)]:border-r"
            >
              <Link
                href={href}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
                }}
                className="spotlight focus-ring group flex h-full gap-6 p-6 transition-colors duration-500 hover:bg-white sm:gap-8 sm:p-8 lg:p-10"
              >
                <span
                  aria-hidden="true"
                  className="w-24 shrink-0 font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold leading-none tracking-tight text-outline text-plum-400 transition-colors duration-500 group-hover:[-webkit-text-fill-color:currentColor] group-hover:text-plum-700 sm:w-32"
                >
                  {acronym}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-4">
                    <span className="font-display text-xl font-semibold leading-snug tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-plum-700">
                      {name}
                    </span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink-200 bg-white transition-all duration-500 ease-spring group-hover:-rotate-45 group-hover:border-leaf-600 group-hover:bg-leaf-600">
                      <Icon aria-hidden="true" className="h-4 w-4 text-leaf-600 transition-colors duration-300 group-hover:hidden" />
                      <ArrowRight aria-hidden="true" className="hidden h-4 w-4 text-white group-hover:block" />
                    </span>
                  </span>
                  <span className="mt-3 block max-w-[52ch] text-sm leading-relaxed text-ink-600 text-pretty">{summary}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </PageSection>

      <NextChapter
        href="/about/structure"
        title={t('about.structure.title')}
        description={t('about.structure.description')}
        image="/images/about/assembly-steps.jpg"
      />
    </>
  );
}
