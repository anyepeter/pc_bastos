'use client';

import Link from '@/components/LocalizedLink';
import { ArrowRight, Building, MapPin, MessageCircle, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText, readTranslation } from '@/lib/translations';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import {
  DEPARTMENTS,
  departmentIcon,
  type PublicDepartmentSummary,
} from '@/lib/departments';

interface Entry {
  key: string;
  /** In-page anchor for the hero index. */
  anchor: string;
  /** The department's own page; null while the list comes from the fallback. */
  href: string | null;
  Icon: ReturnType<typeof departmentIcon>;
  logo: string | null;
  acronym: string;
  short: string;
  name: string;
  location: string;
  description: string;
}

export default function DepartmentsClient({
  departments,
}: {
  departments: PublicDepartmentSummary[];
}) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);
  const read = (value: unknown) => getTranslatedText(readTranslation(value), language).trim();

  /* The short label for the hero index. The eight founding departments keep
     their existing short names; any department added later shows its
     acronym. */
  const shortFor = (acronym: string) => {
    const known = DEPARTMENTS.find((entry) => entry.acronym === acronym.toUpperCase());
    return known ? t(`about.departments.${known.id}.short`) : acronym;
  };

  // Eight departments, differentiated by number, name and place — never by
  // colour. They come from the database; until it has any (or when it cannot
  // be reached) the page falls back to the council's original list in the
  // locale files, without links, rather than rendering an empty register.
  const entries: Entry[] =
    departments.length > 0
      ? departments.map((department) => ({
          key: department.id,
          anchor: department.slug,
          href: `/departments/${department.slug}`,
          Icon: departmentIcon(department.acronym),
          logo: department.logo,
          acronym: department.acronym,
          short: shortFor(department.acronym),
          name: read(department.name),
          location: read(department.location),
          description: read(department.summary),
        }))
      : DEPARTMENTS.map(({ id, acronym, Icon }) => ({
          key: id,
          anchor: id,
          href: null,
          Icon,
          logo: null,
          acronym,
          short: t(`about.departments.${id}.short`),
          name: t(`about.departments.${id}.name`),
          location: t(`about.departments.${id}.location`),
          description: t(`about.departments.${id}.description`),
        }));

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
    <>
      <PageHero
        title={t('about.departments.pageTitle')}
        lede={t('about.departments.pageSubtitle')}
      >
        <div className="mt-5 flex justify-center">
          <Link
            href="/about/general-secretariat"
            className="focus-ring group inline-flex items-center gap-2 rounded font-ui text-sm font-medium text-plum-700 transition-colors duration-300 hover:text-plum-800"
          >
            {t('about.generalSecretariat.attachedTo')}
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 text-leaf-600 transition-transform duration-300 ease-spring group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* The short names double as the page's index — one jump link per
            entry straight to the matching row below. */}
        <nav aria-label={t('about.departments.pageTitle')} className="mt-12 border-t border-ink-200 pt-7">
          <ul className="flex flex-wrap justify-center gap-2">
            {entries.map((entry, i) => (
              <li key={entry.key}>
                <a
                  href={`#${entry.anchor}`}
                  className="focus-ring inline-flex items-center gap-2 rounded-full border border-ink-200 bg-ink-50 px-4 py-2 font-ui text-sm text-ink-600 transition-colors duration-300 ease-spring hover:border-leaf-300/40 hover:text-leaf-600"
                >
                  <span className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {entry.short}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {/* The department index. Set as a numbered editorial register rather
          than a photo grid: name and place on the left, remit on the right,
          one hairline per entry. Each row is one link to the department's own
          page — the name carries it and stretches over the whole row. */}
      <PageSection tone="white">
        <ul className="border-t border-ink-200">
          {entries.map((entry, i) => {
            const Icon = entry.Icon;

            return (
              <Reveal as="li" key={entry.key} delay={Math.min(i, 8) * 60}>
                <article
                  id={entry.anchor}
                  className="group relative grid scroll-mt-28 gap-x-10 gap-y-5 border-b border-ink-200 py-9 lg:grid-cols-12 lg:items-center lg:py-12"
                >
                  {/* Hover sweep: a tinted ground that grows in from the left. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-4 -right-4 origin-left scale-x-0 rounded-2xl bg-ink-50 transition-transform duration-700 ease-spring group-hover:scale-x-100 sm:-left-6 sm:-right-6"
                  />

                  <div className="relative flex items-center gap-5 lg:col-span-3 lg:block">
                    <span
                      aria-hidden="true"
                      className="block font-display text-[clamp(2.6rem,4.6vw,4.4rem)] font-semibold leading-none tracking-tight text-outline text-plum-300 transition-colors duration-500 group-hover:text-plum-700 group-hover:[-webkit-text-fill-color:currentColor]"
                    >
                      {entry.acronym}
                    </span>
                    <span className="flex items-center gap-3 lg:mt-5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink-200 bg-white transition-colors duration-300 group-hover:border-leaf-300">
                        {entry.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={entry.logo} alt="" aria-hidden="true" className="h-full w-full object-contain p-1.5" />
                        ) : (
                          <Icon aria-hidden="true" className="h-4 w-4 text-leaf-600" />
                        )}
                      </span>
                      <span className="tnum font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-400">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </span>
                  </div>

                  <div className="relative lg:col-span-4">
                    <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-plum-700 lg:text-[1.7rem]">
                      {entry.href ? (
                        <Link
                          href={entry.href}
                          className="focus-ring rounded after:absolute after:inset-0 after:content-['']"
                        >
                          {entry.name}
                        </Link>
                      ) : (
                        entry.name
                      )}
                    </h2>
                    {entry.location && (
                      <p className="mt-4 flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-500">
                        <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ink-400" />
                        {entry.location}
                      </p>
                    )}
                  </div>

                  <div className="relative flex items-start justify-between gap-6 lg:col-span-5">
                    <p className="max-w-[52ch] text-base leading-relaxed text-ink-600 text-pretty">
                      {entry.description}
                      {entry.href && <span className="sr-only"> {t('departments.visit')}</span>}
                    </p>
                    {entry.href && (
                      <span
                        aria-hidden="true"
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-500 transition-all duration-500 ease-spring group-hover:-rotate-45 group-hover:border-leaf-600 group-hover:bg-leaf-600 group-hover:text-white"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    )}
                  </div>
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
    </>
  );
}
