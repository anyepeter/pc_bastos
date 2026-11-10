'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from '@/components/LocalizedLink';
import { Users, Crown, FileText, Landmark, CalendarClock, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/components/PageLayout';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import NextChapter from '@/components/NextChapter';
import MottoSeal from '@/components/MottoSeal';
import { useInView } from '@/components/motion/useInView';
import { useScrollProgress } from '@/components/motion/useScrollProgress';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { useAppSelector } from '@/store/hooks';
import { inLanguage, logoSrc } from '@/lib/site-settings';

/**
 * How the council is governed.
 *
 * The chart reads top to bottom as authority does: a spine down the left draws
 * itself as the reader descends, each body lighting its node as the line
 * reaches it, ending in the eight departments and services (each a link to its
 * page). Then what each governing body does, as cards that stack on one
 * another while scrolled, and the council's seat, arms and motto.
 *
 * Every string is on the page at all times — the chart this replaced hid its
 * descriptions behind hover, out of reach on touch screens.
 */

/** The council's own abbreviations, not translated, with each department's page. */
const DEPARTMENTS = [
  { code: 'SAF', key: 'saf', slug: 'administration-and-finance' },
  { code: 'DS', key: 'ds', slug: 'health' },
  { code: 'OEPP', key: 'oepp', slug: 'education' },
  { code: 'DFAS', key: 'dfas', slug: 'women-and-social-affairs' },
  { code: 'DTC', key: 'dtc', slug: 'christian-witness' },
  { code: 'DJ', key: 'dj', slug: 'youth' },
  { code: 'DIC', key: 'dic', slug: 'information-and-communication' },
  { code: 'BURED', key: 'bured', slug: 'research-and-development' },
];

export default function StructurePage() {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);
  const settings = useSiteSettings();
  const councilLogo = logoSrc(settings);
  const chart = useRef<HTMLOListElement | null>(null);
  useScrollProgress(chart, { mode: 'anchor', anchor: 0.55 });

  const tiers = [
    {
      id: 'assembly',
      icon: Crown,
      title: t('about.structure.generalAssembly'),
      summary: t('about.structure.generalAssemblyShort'),
      cadence: t('about.structure.meetsEvery2Years'),
      body: t('about.structure.generalAssemblyLong'),
      href: null,
    },
    {
      id: 'executive',
      icon: Users,
      title: t('about.structure.executiveCommittee'),
      summary: t('about.structure.executiveCommitteeShort'),
      cadence: t('about.structure.meetsTwiceYearly'),
      body: t('about.structure.executiveCommitteeLong'),
      href: null,
    },
    {
      id: 'secretariat',
      icon: Landmark,
      title: t('about.generalSecretariat.title'),
      summary: t('about.generalSecretariat.summary'),
      cadence: null,
      body: t('about.generalSecretariat.description'),
      href: '/about/general-secretariat',
    },
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
        media={{ src: '/images/about/assembly-steps.jpg', alt: t('about.photos.assemblyAlt'), position: '50% 30%' }}
      />

      {/* The chart */}
      <PageSection tone="white" className="lg:py-28">
        <SectionHeading eyebrow={t('home.sections.departments')} title={t('about.structure.organizationalChart')} layout="stack" />

        <ol ref={chart} className="relative mt-14">
          <span aria-hidden="true" className="absolute bottom-6 left-[27px] top-2 w-px bg-ink-200" />
          <span aria-hidden="true" className="draw-y absolute bottom-6 left-[27px] top-2 w-px bg-leaf-600" />

          {tiers.map((tier, i) => (
            <Tier key={tier.id} index={i} icon={tier.icon}>
              <div className="card rounded-2xl p-6 transition-[border-color,box-shadow] duration-500 group-data-[reached=true]:border-plum-200 lg:p-9">
                <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-5">
                    <span className="tnum font-mono text-[0.68rem] tracking-[0.24em] text-ink-400">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="mt-3 font-display text-[clamp(1.7rem,2.8vw,2.4rem)] font-semibold leading-[1.08] tracking-tight text-ink-900">
                      {tier.href ? (
                        <Link href={tier.href} className="focus-ring group/link inline-flex items-start gap-2 rounded transition-colors duration-300 hover:text-plum-700">
                          {tier.title}
                          <ArrowUpRight aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-plum-500 transition-transform duration-300 ease-spring group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                        </Link>
                      ) : (
                        tier.title
                      )}
                    </h3>
                    <p className="mt-4 font-ui text-sm font-semibold uppercase tracking-[0.12em] text-plum-700">{tier.summary}</p>
                    {tier.cadence && (
                      <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink-200 bg-ink-50 px-3.5 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ink-600">
                        <CalendarClock aria-hidden="true" className="h-3.5 w-3.5 text-leaf-600" />
                        {tier.cadence}
                      </p>
                    )}
                  </div>
                  <p className="max-w-[62ch] text-base leading-[1.8] text-ink-600 text-pretty lg:col-span-7 lg:pt-7">{tier.body}</p>
                </div>
              </div>
            </Tier>
          ))}

          {/* Tier four: the departments and services attached to the Secretariat. */}
          <Tier index={3} icon={Landmark} last>
            <h3 className="pt-3 font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-tight tracking-tight text-ink-900">
              {t('about.generalSecretariat.attachedTitle')}
            </h3>
            <ul className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {DEPARTMENTS.map((department, i) => (
                <Reveal as="li" key={department.code} delay={Math.min(i, 8) * 50}>
                  <Link
                    href={`/departments/${department.slug}`}
                    className="focus-ring card card-hover group relative flex h-full flex-col overflow-hidden rounded-2xl p-5"
                  >
                    <span className="relative font-mono text-[0.68rem] uppercase tracking-[0.2em] text-plum-700">{department.code}</span>
                    <span className="relative mt-3 font-display text-lg font-semibold leading-tight tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-plum-700">
                      {t(`about.departments.${department.key}.short`)}
                    </span>
                    <span className="relative mt-3 text-sm leading-relaxed text-ink-600 text-pretty">
                      {t(`about.departments.${department.key}.description`)}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </Tier>
        </ol>
      </PageSection>

      {/* What each body does: cards that stack as they are scrolled past. */}
      <PageSection tone="tint" className="lg:py-28">
        <ul className="relative space-y-6 lg:space-y-10">
          {bodies.map((governingBody, i) => {
            const Icon = governingBody.icon;
            return (
              <li
                key={governingBody.id}
                className="lg:sticky"
                style={{ top: `calc(7rem + ${i * 1.75}rem)` }}
              >
                <Reveal>
                  <div className="card grid gap-8 rounded-2xl p-7 shadow-[0_30px_60px_-30px_rgb(45_27_90/0.35)] sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-12">
                    <div className="lg:col-span-6">
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink-200 bg-white">
                          <Icon aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                        </span>
                        <span className="tnum font-mono text-[0.68rem] tracking-[0.24em] text-ink-400">
                          {String(i + 1).padStart(2, '0')} / {String(bodies.length).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="mt-6 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.06] tracking-tight text-ink-900">
                        {governingBody.title}
                      </h3>
                      <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-ink-600 text-pretty">{governingBody.body}</p>
                    </div>
                    <ol className="border-t border-ink-200 lg:col-span-6">
                      {governingBody.points.map((point, index) => (
                        <li key={point} className="flex items-baseline gap-5 border-b border-ink-200 py-4">
                          <span className="tnum font-mono text-[0.66rem] tracking-[0.2em] text-leaf-600">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="font-display text-lg leading-snug text-ink-800 text-pretty">{point}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </PageSection>

      {/* Seat, arms and motto. */}
      <PageSection tone="white" className="lg:py-28">
        <SectionHeading title={t('about.structure.headquartersInfo')} layout="stack" />

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <dl className="flex h-full flex-col justify-between gap-10 rounded-2xl border border-ink-200 bg-ink-50 p-7 sm:p-10">
              <div>
                <dt className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-leaf-600">{t('about.structure.address')}</dt>
                <dd className="mt-4 max-w-[26ch] font-display text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold leading-snug tracking-tight text-ink-900">
                  {inLanguage(settings.address, language)}
                </dd>
              </div>
              <div className="border-t border-ink-200 pt-8">
                <dt className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-leaf-600">{t('about.structure.motto')}</dt>
                <dd className="mt-4 font-display text-[clamp(2rem,4.6vw,3.4rem)] font-semibold italic leading-[1.06] tracking-tight text-leaf-600 text-balance">
                  {t('about.structure.mottoText')}
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-5">
            <dl className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-plum-950 p-10 text-center">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage: 'radial-gradient(rgb(255 255 255 / 0.08) 1px, transparent 1.2px)',
                  backgroundSize: '18px 18px',
                }}
              />
              <dt className="relative font-mono text-[0.64rem] uppercase tracking-[0.2em] text-leaf-300">{t('about.structure.logo')}</dt>
              <dd className="relative mt-8">
                <span className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-[0_0_0_10px_rgb(255_255_255/0.06),0_0_0_22px_rgb(255_255_255/0.03)]">
                  <Image src={councilLogo} alt={t('about.structure.logoAlt')} width={120} height={120} className="h-28 w-28 object-contain" />
                  <MottoSeal className="absolute -bottom-4 -right-12 h-20 w-20" />
                </span>
                <p className="mx-auto mt-10 max-w-[34ch] text-base leading-relaxed text-plum-200 text-pretty">
                  {t('about.structure.logoDescription')}
                </p>
              </dd>
            </dl>
          </Reveal>
        </div>
      </PageSection>

      <NextChapter
        href="/board"
        title={t('navbar.board')}
        description={t('about.board.lede')}
        image="/images/about/procession.jpg"
      />
    </PageLayout>
  );
}

/** One tier on the chart: its node on the spine lights up as the line reaches it. */
function Tier({
  index,
  icon: Icon,
  last = false,
  children,
}: {
  index: number;
  icon: LucideIcon;
  last?: boolean;
  children: React.ReactNode;
}) {
  const [ref, reached] = useInView<HTMLLIElement>({ threshold: 0, rootMargin: '0px 0px -45% 0px' });

  return (
    <li ref={ref} data-reached={reached} className={`group relative pl-[4.5rem] sm:pl-24 ${last ? '' : 'pb-8 lg:pb-10'}`}>
      <span
        className={`absolute left-0 top-0 z-10 flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500 ease-spring ${
          reached ? 'border-leaf-600 bg-leaf-600 shadow-[0_0_0_6px_rgb(39_113_78/0.12)]' : 'border-ink-200 bg-white'
        }`}
      >
        <Icon aria-hidden="true" className={`h-5 w-5 transition-colors duration-500 ${reached ? 'text-white' : 'text-leaf-600'}`} />
      </span>
      <Reveal delay={Math.min(index, 4) * 60}>{children}</Reveal>
    </li>
  );
}
