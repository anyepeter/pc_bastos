'use client';

import {
  Building,
  Heart,
  GraduationCap,
  Users,
  Radio,
  Briefcase,
  MessageCircle,
  Search,
  MapPin,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/components/PageLayout';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

export default function DepartmentsPage() {
  const { t } = useTranslation();

  // Eight departments, differentiated by number, name and place — never by
  // colour. The page this replaced gave each one a stock photograph and a
  // coloured chip; the council has no photography, and the per-department
  // hues were exactly what it objected to.
  const departments = [
    {
      id: 'saf',
      name: t('about.departments.saf.name'),
      short: t('about.departments.saf.short'),
      icon: Briefcase,
      location: t('about.departments.saf.location'),
      description: t('about.departments.saf.description'),
    },
    {
      id: 'ds',
      name: t('about.departments.ds.name'),
      short: t('about.departments.ds.short'),
      icon: Heart,
      location: t('about.departments.ds.location'),
      description: t('about.departments.ds.description'),
    },
    {
      id: 'oepp',
      name: t('about.departments.oepp.name'),
      short: t('about.departments.oepp.short'),
      icon: GraduationCap,
      location: t('about.departments.oepp.location'),
      description: t('about.departments.oepp.description'),
    },
    {
      id: 'dfas',
      name: t('about.departments.dfas.name'),
      short: t('about.departments.dfas.short'),
      icon: Users,
      location: t('about.departments.dfas.location'),
      description: t('about.departments.dfas.description'),
    },
    {
      id: 'dtc',
      name: t('about.departments.dtc.name'),
      short: t('about.departments.dtc.short'),
      icon: MessageCircle,
      location: t('about.departments.dtc.location'),
      description: t('about.departments.dtc.description'),
    },
    {
      id: 'dj',
      name: t('about.departments.dj.name'),
      short: t('about.departments.dj.short'),
      icon: Users,
      location: t('about.departments.dj.location'),
      description: t('about.departments.dj.description'),
    },
    {
      id: 'dic',
      name: t('about.departments.dic.name'),
      short: t('about.departments.dic.short'),
      icon: Radio,
      location: t('about.departments.dic.location'),
      description: t('about.departments.dic.description'),
    },
    {
      id: 'bured',
      name: t('about.departments.bured.name'),
      short: t('about.departments.bured.short'),
      icon: Search,
      location: t('about.departments.bured.location'),
      description: t('about.departments.bured.description'),
    },
  ];

  const coordination = [
    {
      id: 'regional-offices',
      icon: Building,
      title: t('about.departments.regionalOffices'),
      body: t('about.departments.regionalOfficesText'),
    },
    {
      id: 'commissions',
      icon: Users,
      title: t('about.departments.commissions'),
      body: t('about.departments.commissionsText'),
    },
    {
      id: 'coordination',
      icon: MessageCircle,
      title: t('about.departments.coordination'),
      body: t('about.departments.coordinationText'),
    },
  ];

  return (
    <PageLayout>
      <PageHero
        eyebrow={t('navbar.departements')}
        title={t('about.departments.pageTitle')}
        lede={t('about.departments.pageSubtitle')}
        crumbs={[
          { label: t('navbar.home'), href: '/' },
          { label: t('navbar.aboutUs'), href: '/about' },
          { label: t('navbar.departements') },
        ]}
      >
        {/* The short names double as the page's index — eight jump links
            straight to the matching entry below. Existing copy, no new keys. */}
        <nav aria-label={t('about.departments.pageTitle')} className="mt-12 border-t border-white/10 pt-7">
          <ul className="flex flex-wrap gap-2">
            {departments.map((department, i) => (
              <li key={department.id}>
                <a
                  href={`#${department.id}`}
                  className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-ui text-sm text-plum-200 transition-colors duration-300 ease-spring hover:border-leaf-300/40 hover:text-leaf-300"
                >
                  <span className="font-mono text-[0.62rem] tracking-[0.14em] text-plum-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {department.short}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {/* The department index. Set as a numbered editorial register rather
          than a photo grid: name and place on the left, remit on the right,
          one hairline per entry. */}
      <PageSection tone="white">
        <ul className="border-t border-ink-200">
          {departments.map((department, i) => {
            const Icon = department.icon;

            return (
              <Reveal as="li" key={department.id} delay={Math.min(i, 8) * 60}>
                <article
                  id={department.id}
                  className="group grid scroll-mt-28 gap-x-10 gap-y-5 border-b border-ink-200 py-9 transition-colors duration-300 lg:grid-cols-12 lg:py-11"
                >
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white transition-colors duration-300 group-hover:border-leaf-300">
                        <Icon aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                      </span>
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-400">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h2 className="mt-6 font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-plum-700 lg:text-[1.7rem]">
                      {department.name}
                    </h2>

                    <p className="mt-4 flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-500">
                      <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ink-400" />
                      {department.location}
                    </p>
                  </div>

                  <p className="max-w-[52ch] text-base leading-relaxed text-ink-600 text-pretty lg:col-span-6 lg:col-start-7 lg:pt-1">
                    {department.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </PageSection>

      {/* How the eight are held together. The page closes here, on a light ground: the footer is
          already the closing dark band and paints its own top edge. */}
      <PageSection tone="tint" className="py-20 lg:py-28">
        <SectionHeading
          title={t('about.departments.departmentCoordination')}
          layout="stack"
        />

        <ul className="mt-11 grid gap-6 lg:grid-cols-3">
          {coordination.map((item, i) => {
            const Icon = item.icon;

            return (
              <Reveal as="li" key={item.id} delay={Math.min(i, 8) * 60}>
                <div className="flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-7">
                  <div className="flex items-start justify-between gap-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white">
                      <Icon aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                    </span>
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-xl font-semibold leading-tight tracking-tight text-ink-900">
                    {item.title}
                  </h3>

                  <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-ink-600 text-pretty">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </PageSection>
    </PageLayout>
  );
}
