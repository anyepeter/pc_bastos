'use client';

import Link from 'next/link';
import { ArrowUpRight, Calendar, Users, Building, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/components/PageLayout';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import ObjectivesSection from '@/components/ObjectivesSection';

export default function AboutPage() {
  const { t } = useTranslation();

  const aboutSections = [
    {
      id: 'history',
      title: t('about.history.title'),
      icon: Calendar,
      description: t('about.history.description'),
      preview: t('about.history.preview'),
      href: '/about/history',
    },
    {
      id: 'mission-vision',
      title: t('about.missionVision.title'),
      icon: Users,
      description: t('about.missionVision.description'),
      preview: t('about.missionVision.preview'),
      href: '/about/mission-vision',
    },
    {
      id: 'departments',
      title: t('about.departments.title'),
      icon: Building,
      description: t('about.departments.description'),
      preview: t('about.departments.preview'),
      // The council's departments live at /departments; `/about/departments`
      // was linked here and is a 404 — there is no such route.
      href: '/departments',
    },
    {
      id: 'structure',
      title: t('about.structure.title'),
      icon: Layers,
      description: t('about.structure.description'),
      preview: t('about.structure.preview'),
      href: '/about/structure',
    },
  ];

  const impact = [
    { value: 12, suffix: '', label: t('about.impact.memberChurches') },
    { value: 13, suffix: 'M+', label: t('about.impact.believers') },
    { value: 1580, suffix: '', label: t('about.impact.educationalInstitutions') },
    { value: 350, suffix: '', label: t('about.impact.healthCenters') },
  ];

  return (
    <PageLayout>
      <PageHero
        eyebrow={t('navbar.aboutUs')}
        title={t('about.pageTitle')}
        lede={t('about.pageSubtitle')}
        crumbs={[{ label: t('navbar.home'), href: '/' }, { label: t('navbar.aboutUs') }]}
      />

      {/* The four About chapters. Set as an editorial index rather than as
          photo cards: the four images here were Unsplash stock of American
          churches, and the council has no photography to put in their place. */}
      <PageSection tone="white">
        {/* No heading here: the hero already carries this page's title and
            lede, and repeating them verbatim reads as a mistake. */}
        <ul className="grid gap-5 lg:grid-cols-2">
          {aboutSections.map((section, i) => {
            const Icon = section.icon;

            return (
              <Reveal as="li" key={section.id} delay={Math.min(i, 8) * 60}>
                <Link
                  href={section.href}
                  className="card card-hover focus-ring group flex h-full flex-col p-7 lg:p-8"
                >
                  <div className="flex items-start justify-between gap-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white transition-colors duration-300 group-hover:border-leaf-300">
                      <Icon aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                    </span>
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-plum-700">
                    {section.title}
                  </h3>

                  <p className="mt-4 text-base leading-relaxed text-ink-600 text-pretty">
                    {section.description}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-ink-500 text-pretty">
                    {section.preview}
                  </p>

                  <span className="mt-7 inline-flex items-center gap-2 font-ui text-sm font-medium text-plum-700">
                    {t('about.learnMore')}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </PageSection>

      {/* The council in figures. A painted dark band so the numbers punctuate
          the page rather than sitting in another grey box. */}
      <PageSection tone="dark" paint className="py-20 lg:py-28">
        <SectionHeading title={t('about.impact.title')} tone="dark" layout="stack" />

        <dl className="mt-11 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {impact.map((stat, i) => (
            <Reveal key={stat.label} delay={Math.min(i, 8) * 60}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-display text-[clamp(2.4rem,4.4vw,3.5rem)] font-semibold leading-none tracking-tight text-white">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="mt-3 block font-mono text-[0.62rem] uppercase tracking-[0.2em] text-leaf-300">
                  {stat.label}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </PageSection>

      {/* Moved off the landing page: the council's objectives belong with
          the rest of the About material. */}
      <ObjectivesSection />
    </PageLayout>
  );
}
