'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText, readTranslation } from '@/lib/translations';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
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
      />

      {secretary && (
        <PageSection tone="white">
          {/* A compact profile, centred under the centred page title. The
              portrait is a fixed column at each size (160 / 208 / 272px), so
              it never grows with the screen: on a phone it sits above the
              text, from 640px it sits beside it. Without a photo the text
              stands alone. */}
          <div
            className={`mx-auto grid max-w-4xl gap-8 ${
              secretary.photo
                ? 'sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-center sm:gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16'
                : ''
            }`}
          >
            {secretary.photo && (
              <Reveal>
                <div className="w-40 overflow-hidden rounded-2xl border border-ink-200 bg-ink-50 shadow-[0_18px_40px_-24px_rgba(45,27,90,0.45)] sm:w-full">
                  <Image
                    src={boardPortrait(secretary.photo)}
                    alt={secretary.name || t('about.generalSecretariat.photoAlt')}
                    width={800}
                    height={1000}
                    sizes="(min-width: 1024px) 272px, (min-width: 640px) 208px, 160px"
                    priority
                    className="aspect-[4/5] h-auto w-full object-cover object-top"
                  />
                </div>
              </Reveal>
            )}

            <div className="min-w-0">
              <Reveal delay={60}>
                <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.1] tracking-tight text-ink-900 text-balance">
                  {secretary.name || read(secretary.title) || t('about.generalSecretariat.secretaryTitle')}
                </h2>
                {secretary.name && (
                  <p className="mt-3 font-ui text-sm font-medium uppercase tracking-[0.12em] text-plum-700">
                    {read(secretary.title) || t('about.generalSecretariat.secretaryTitle')}
                  </p>
                )}
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-ink-600 text-pretty sm:text-lg">
                  {t('about.generalSecretariat.secretaryRole')}
                </p>
                <Link
                  href="/board"
                  className="focus-ring group mt-7 inline-flex min-h-[44px] items-center gap-2 rounded font-ui text-sm font-semibold text-plum-700 transition-colors duration-300 hover:text-plum-800"
                >
                  {t('about.generalSecretariat.seeBoard')}
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 text-leaf-600 transition-transform duration-300 ease-spring group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            </div>
          </div>
        </PageSection>
      )}

      <PageSection tone="tint">
        <SectionHeading
          title={t('about.generalSecretariat.attachedTitle')}
          standfirst={t('about.generalSecretariat.attachedLede')}
          layout="stack"
        />

        <ul className="mt-11 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {entries.map(({ key, href, Icon, acronym, name, summary }, i) => (
            <Reveal as="li" key={key} delay={Math.min(i, 8) * 60}>
              <Link
                href={href}
                className="card card-hover focus-ring group flex h-full flex-col rounded-2xl p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white transition-colors duration-300 group-hover:border-leaf-300">
                    <Icon aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                  </span>
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-plum-700">
                    {acronym}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-lg font-semibold leading-snug tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-plum-700">
                  {name}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-ink-600 text-pretty">{summary}</p>

                <span className="mt-auto flex justify-end pt-4">
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 text-ink-400 transition-all duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-plum-700"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </PageSection>
    </>
  );
}
