'use client';

import Image from 'next/image';
import { Users, Crown, Building, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/components/PageLayout';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

/**
 * How the council is governed.
 *
 * The organisational chart was a stack of centred grey boxes whose real
 * content — the long description of each body — only appeared on hover, so it
 * was invisible on touch and to assistive technology. It is rebuilt here as an
 * indented, numbered tier list where every string is on the page at all times.
 */
export default function StructurePage() {
  const { t } = useTranslation();

  /** The two governing bodies, in order of authority. */
  const tiers = [
    {
      id: 'assembly',
      icon: Crown,
      title: t('about.structure.generalAssembly'),
      summary: t('about.structure.generalAssemblyShort'),
      cadence: t('about.structure.meetsEvery2Years'),
      body: t('about.structure.generalAssemblyLong'),
    },
    {
      id: 'executive',
      icon: Users,
      title: t('about.structure.executiveCommittee'),
      summary: t('about.structure.executiveCommitteeShort'),
      cadence: t('about.structure.meetsTwiceYearly'),
      body: t('about.structure.executiveCommitteeLong'),
    },
  ];

  /** The abbreviations are the council's own and are not translated. */
  const departments = [
    { code: 'SAF', key: 'saf' },
    { code: 'DS', key: 'ds' },
    { code: 'OEPP', key: 'oepp' },
    { code: 'DFAS', key: 'dfas' },
    { code: 'DTC', key: 'dtc' },
    { code: 'DJ', key: 'dj' },
    { code: 'DIC', key: 'dic' },
    { code: 'BURED', key: 'bured' },
  ];

  const bodies = [
    {
      id: 'assembly',
      icon: Crown,
      title: t('about.structure.generalAssembly'),
      body: t('about.structure.generalAssemblyFull'),
      points: [
        t('about.structure.definesPolicy'),
        t('about.structure.electsLeadership'),
        t('about.structure.approvesPlans'),
        t('about.structure.reviewsPerformance'),
      ],
    },
    {
      id: 'executive',
      icon: Users,
      title: t('about.structure.executiveCommittee'),
      body: t('about.structure.executiveCommitteeFull'),
      points: [
        t('about.structure.churchLeaders'),
        t('about.structure.generalSecretary'),
        t('about.structure.executiveSecretaries'),
        t('about.structure.headOfAdmin'),
      ],
    },
    {
      id: 'commissions',
      icon: FileText,
      title: t('about.structure.commissionsTitle'),
      body: t('about.structure.commissionsFull'),
      points: [
        t('about.structure.programPlanning'),
        t('about.structure.activityMonitoring'),
        t('about.structure.resourceAllocation'),
        t('about.structure.performanceEvaluation'),
      ],
    },
  ];

  return (
    <PageLayout>
      <PageHero
        title={t('about.structure.pageTitle')}
        lede={t('about.structure.pageSubtitle')}
      />

      {/* The chart, as an indented ladder: authority reads top to bottom and
          the rule down the left carries the eye between tiers. */}
      <PageSection tone="white">
        <SectionHeading title={t('about.structure.organizationalChart')} layout="stack" />

        <ol className="mt-11">
          {tiers.map((tier, i) => {
            const Icon = tier.icon;

            return (
              <Reveal
                as="li"
                key={tier.id}
                delay={Math.min(i, 8) * 60}
                className="relative pb-8 pl-16 sm:pl-20"
              >
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-[23px] top-14 w-px bg-ink-200"
                />
                <span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl border border-ink-200 bg-white">
                  <Icon aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                </span>

                <div className="card rounded-2xl p-6 lg:p-7">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900">
                      {tier.title}
                    </h3>
                  </div>

                  <p className="mt-4 font-ui text-sm font-medium uppercase tracking-[0.12em] text-plum-700">
                    {tier.summary}
                  </p>

                  <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-500">
                    {tier.cadence}
                  </p>

                  <p className="mt-5 max-w-[70ch] text-base leading-relaxed text-ink-600 text-pretty">
                    {tier.body}
                  </p>
                </div>
              </Reveal>
            );
          })}

          {/* Tier three. The departments have no heading of their own in the
              copy, so the existing Departments label is reused rather than a
              new locale key being invented. */}
          <Reveal as="li" delay={120} className="relative pl-16 sm:pl-20">
            <span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl border border-ink-200 bg-white">
              <Building aria-hidden="true" className="h-5 w-5 text-leaf-600" />
            </span>

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 pt-2">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-400">
                03
              </span>
              <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900">
                {t('about.departments.title')}
              </h3>
            </div>

            <ul className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {departments.map((department) => (
                <li key={department.code} className="card card-hover h-full rounded-2xl p-5">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-plum-700">
                    {department.code}
                  </p>
                  <h4 className="mt-3 font-display text-lg font-semibold leading-tight tracking-tight text-ink-900">
                    {t(`about.departments.${department.key}.short`)}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-ink-600 text-pretty">
                    {t(`about.departments.${department.key}.description`)}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </ol>
      </PageSection>

      {/* What each body actually does. No heading of its own in the copy, so
          the band leads with the cards — as the About index does. */}
      <PageSection tone="tint">
        <ul className="grid gap-6 lg:grid-cols-3">
          {bodies.map((governingBody, i) => {
            const Icon = governingBody.icon;

            return (
              <Reveal as="li" key={governingBody.id} delay={Math.min(i, 8) * 60}>
                <div className="card card-hover flex h-full flex-col rounded-2xl p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink-200 bg-white">
                    <Icon aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                  </span>

                  <h3 className="mt-6 font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900">
                    {governingBody.title}
                  </h3>

                  <p className="mt-4 text-base leading-relaxed text-ink-600 text-pretty">
                    {governingBody.body}
                  </p>

                  <ol className="mt-7 border-t border-ink-200">
                    {governingBody.points.map((point, index) => (
                      <li
                        key={point}
                        className="flex items-baseline gap-4 border-b border-ink-200 py-3"
                      >
                        <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-400">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm leading-relaxed text-ink-600 text-pretty">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </PageSection>

      {/* Headquarters, arms and motto — the page's one dark band. */}
      <PageSection tone="white" className="py-20 lg:py-28">
        <SectionHeading
          title={t('about.structure.headquartersInfo')}
          layout="stack"
        />

        <div className="mt-11 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <dl>
              <dt className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-leaf-600">
                {t('about.structure.address')}
              </dt>
              <dd className="mt-4 max-w-[28ch] font-display text-2xl font-semibold leading-snug tracking-tight text-ink-900">
                {t('about.structure.addressText')}
              </dd>

              <div className="mt-10 border-t border-ink-200 pt-10">
                <dt className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-leaf-600">
                  {t('about.structure.motto')}
                </dt>
                <dd className="mt-4 max-w-[20ch] font-display text-[clamp(1.9rem,4.4vw,3rem)] font-semibold italic leading-[1.1] tracking-tight text-leaf-600 text-balance">
                  {t('about.structure.mottoText')}
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={80} className="lg:col-span-4 lg:col-start-9">
            <dl>
              <dt className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-leaf-600">
                {t('about.structure.logo')}
              </dt>
              <dd className="mt-4">
                <span className="inline-flex rounded-2xl border border-ink-200 bg-white p-4">
                  <Image
                    src="/images/logo_CEPCA.png"
                    alt="CEPCA Logo - Map of Cameroon with cross"
                    width={96}
                    height={96}
                    className="h-24 w-24 object-contain"
                  />
                </span>
                <p className="mt-6 max-w-[38ch] text-base leading-relaxed text-ink-600 text-pretty">
                  {t('about.structure.logoDescription')}
                </p>
              </dd>
            </dl>
          </Reveal>
        </div>
      </PageSection>
    </PageLayout>
  );
}
