'use client';

import Link from '@/components/LocalizedLink';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Globe,
  Mail,
  Map as MapIcon,
  MapPin,
  Phone,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText, readTranslation } from '@/lib/translations';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import MetaRail from '@/components/MetaRail';
import MediaGallery from '@/components/MediaGallery';
import DepartmentProse from '@/components/DepartmentProse';
import DepartmentActivityCard from '@/components/DepartmentActivityCard';
import {
  departmentIcon,
  parseKeyFigures,
  splitPhoneNumbers,
  type PublicActivity,
  type PublicDepartment,
} from '@/lib/departments';

interface DepartmentDetailClientProps {
  department: PublicDepartment;
  /** Split on the server, by the council's own calendar day. */
  upcoming: PublicActivity[];
  recent: PublicActivity[];
  projects: PublicActivity[];
}

type Tone = 'white' | 'tint';

/** A "+" closing a figure is set in the accent, the way the home figures read. */
function FigureValue({ value }: { value: string }) {
  if (!value.endsWith('+')) return <>{value}</>;
  return (
    <>
      {value.slice(0, -1)}
      <span className="text-leaf-300">+</span>
    </>
  );
}

/**
 * One council department.
 *
 * Every section is optional and simply absent when the department has not
 * written it, so a department with a single paragraph and one with a full
 * dossier both read as finished pages — nothing here is a placeholder.
 *
 * Light bands alternate white and tint in whatever order they end up in; the
 * figures band is the one dark punctuation, directly under the title, and the
 * page always closes on a light band because the footer is the closing dark
 * one (DESIGN_SYSTEM.md).
 */
export default function DepartmentDetailClient({
  department,
  upcoming,
  recent,
  projects,
}: DepartmentDetailClientProps) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  // Values from Prisma `Json` columns: a legacy row may hold a bare string,
  // and rendering the raw object as a React child crashes the page.
  const read = (value: unknown) => getTranslatedText(readTranslation(value), language).trim();

  const name = read(department.name);
  const tagline = read(department.tagline);
  const summary = read(department.summary);
  const vision = read(department.vision);
  const mission = read(department.mission);
  const objectives = read(department.objectives);
  const services = read(department.services);
  const structures = read(department.structures);
  const support = read(department.support);
  const coverage = read(department.coverage);
  const location = read(department.location);
  const headTitle = read(department.headTitle);
  const figures = parseKeyFigures(read(department.keyFigures));
  const phones = splitPhoneNumbers(department.phone);
  const Icon = departmentIcon(department.acronym);

  // The summary leads the hero unless there is a tagline to do it, in which
  // case it opens the profile instead — it is never shown twice.
  const lede = tagline || summary;
  const standfirst = tagline ? summary : '';

  const heroMeta = [
    { key: 'location', icon: MapPin, label: t('departments.location'), value: location },
    { key: 'coverage', icon: MapIcon, label: t('departments.coverage'), value: coverage },
  ].filter((item) => item.value);

  const contact = [
    department.address && {
      key: 'address',
      icon: MapPin,
      label: t('departments.address'),
      value: <span>{department.address}</span>,
    },
    phones.length > 0 && {
      key: 'phone',
      icon: Phone,
      label: t('departments.phone'),
      value: (
        <span className="flex flex-col gap-1">
          {phones.map((phone) => (
            <a
              key={phone}
              href={`tel:${phone.replace(/[^\d+]/g, '')}`}
              className="focus-ring tnum rounded underline-offset-4 transition-colors duration-300 hover:text-plum-700 hover:underline"
            >
              {phone}
            </a>
          ))}
        </span>
      ),
    },
    department.email && {
      key: 'email',
      icon: Mail,
      label: t('departments.email'),
      value: (
        <a
          href={`mailto:${department.email}`}
          className="focus-ring break-all rounded underline-offset-4 transition-colors duration-300 hover:text-plum-700 hover:underline"
        >
          {department.email}
        </a>
      ),
    },
    department.website && {
      key: 'website',
      icon: Globe,
      label: t('departments.website'),
      value: (
        <a
          href={department.website}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring break-all rounded underline-offset-4 transition-colors duration-300 hover:text-plum-700 hover:underline"
        >
          {department.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </a>
      ),
    },
  ].filter(Boolean) as { key: string; icon: typeof MapPin; label: string; value: React.ReactNode }[];

  const hasHead = Boolean(department.headName);
  const hasAside = hasHead || contact.length > 0;
  const hasProfile = Boolean(standfirst || vision || mission || hasAside || department.coverImage);

  const headInitials = (department.headName || '')
    .replace(/^(rev(erend)?|dr|mr|mrs|ms|prof|pst|pasteur|mgr)\.?\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  /* ------------------------------------------------------------ sections */

  /* Each band is built as a function of its ground, so white and tint can be
     dealt out in whatever order the department's sections end up in. The
     last band also carries the way back to the list (`closing`). */
  const sections: {
    key: string;
    render: (tone: Tone, closing: React.ReactNode) => React.ReactNode;
  }[] = [];

  const closingRow = (closing: React.ReactNode) =>
    closing ? <Reveal className="mt-14 lg:mt-16">{closing}</Reveal> : null;

  /* A written chapter: heading on the left, text on the right. */
  const chapterBody = (eyebrow: string, title: string, body: string) => (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-4">
        <SectionHeading eyebrow={eyebrow} title={title} layout="stack" />
      </div>
      <Reveal delay={120} className="lg:col-span-8 lg:pt-12">
        <DepartmentProse>{body}</DepartmentProse>
      </Reveal>
    </div>
  );

  // With no card beside it, the mandate reads as the first chapter rather
  // than a narrow column with an empty half-page next to it.
  const missionAsChapter = Boolean(mission) && !hasAside;
  const numberOffset = missionAsChapter ? 1 : 0;

  const standfirstBlock = standfirst && (
    <Reveal>
      <p className="max-w-[52ch] font-display text-[clamp(1.35rem,2.2vw,1.75rem)] font-medium leading-snug tracking-tight text-ink-900 text-pretty">
        {standfirst}
      </p>
    </Reveal>
  );

  const visionBlock = vision && (
    <Reveal delay={60} className={standfirst ? 'mt-12' : ''}>
      <figure className="relative max-w-[62ch] border-l-2 border-leaf-500 pl-6 sm:pl-8">
        <figcaption className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-700">
          {t('departments.vision')}
        </figcaption>
        <blockquote className="mt-4 font-display text-[clamp(1.15rem,1.8vw,1.4rem)] italic leading-relaxed text-ink-800 text-pretty">
          {vision}
        </blockquote>
      </figure>
    </Reveal>
  );

  if (hasProfile) {
    sections.push({
      key: 'profile',
      render: (tone, closing) => (
        <PageSection key="profile" tone={tone}>
          {department.coverImage && (
            <Reveal as="figure" className="mb-12 overflow-hidden rounded-2xl bg-ink-100 lg:mb-16">
              <div className="aspect-[16/9] w-full sm:aspect-[21/9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={department.coverImage} alt={name} className="h-full w-full object-cover" />
              </div>
            </Reveal>
          )}

          {!hasAside && (
            <>
              {(standfirstBlock || visionBlock) && (
                <div className={missionAsChapter ? 'mb-16 lg:mb-20' : ''}>
                  {standfirstBlock}
                  {visionBlock}
                </div>
              )}
              {missionAsChapter && chapterBody('01', t('departments.mission'), mission)}
            </>
          )}

          {hasAside && (
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-7 xl:col-span-8">
                {standfirstBlock}
                {visionBlock}

                {mission && (
                  <div className={standfirst || vision ? 'mt-14' : ''}>
                    <Reveal>
                      <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight tracking-tight text-ink-900">
                        {t('departments.mission')}
                      </h2>
                    </Reveal>
                    <Reveal delay={80}>
                      <DepartmentProse className="mt-6">{mission}</DepartmentProse>
                    </Reveal>
                  </div>
                )}
              </div>

              {/* Not sticky, and not wrapped in <Reveal>: PageSection carries
                  `overflow-hidden` to clip its glow, which would pin a sticky
                  card to the section rather than the viewport. */}
              <aside className="lg:col-span-5 xl:col-span-4">
                <div className="card rounded-2xl p-6 lg:p-7">
                  <div className="flex items-center gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-ink-200 bg-white">
                      {department.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={department.logo}
                          alt={`${name} logo`}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <Icon aria-hidden="true" className="h-6 w-6 text-leaf-600" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-plum-700">
                        {department.acronym}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-ink-600">{name}</p>
                    </div>
                  </div>

                  {hasHead && (
                    <div className="mt-6 border-t border-ink-200 pt-6">
                      <h2 className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-500">
                        {t('departments.leadership')}
                      </h2>
                      <div className="mt-4 flex items-center gap-4">
                        {department.headPhoto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={department.headPhoto}
                            alt={department.headName || ''}
                            className="h-16 w-16 shrink-0 rounded-full border border-ink-200 object-cover"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-plum-50 font-display text-xl font-semibold text-plum-700 ring-1 ring-inset ring-plum-100"
                          >
                            {headInitials}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="font-display text-lg font-semibold leading-snug tracking-tight text-ink-900">
                            {department.headName}
                          </p>
                          {headTitle && (
                            <p className="mt-1 text-sm leading-snug text-ink-600">{headTitle}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {contact.length > 0 && (
                    <div id="contact" className="mt-6 scroll-mt-28 border-t border-ink-200 pt-6">
                      <h2 className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-500">
                        {t('departments.contact')}
                      </h2>
                      <dl className="mt-4 space-y-4">
                        {contact.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <div key={item.key}>
                              {/* The glyph carries the label visually. */}
                              <dt className="sr-only">{item.label}</dt>
                              <dd className="flex items-start gap-3 text-sm leading-relaxed text-ink-800">
                                <ItemIcon
                                  aria-hidden="true"
                                  className="mt-[0.2rem] h-4 w-4 shrink-0 text-leaf-600"
                                />
                                <span className="min-w-0">{item.value}</span>
                              </dd>
                            </div>
                          );
                        })}
                      </dl>

                      {department.website && (
                        <a
                          href={department.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-leaf-600 px-5 py-3 font-ui text-sm font-semibold text-white transition-all duration-300 ease-spring hover:bg-leaf-700 active:translate-y-px"
                        >
                          <Globe aria-hidden="true" className="h-4 w-4" />
                          {t('departments.visitWebsite')}
                          <ArrowUpRight
                            aria-hidden="true"
                            className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </aside>
            </div>
          )}

          {closingRow(closing)}
        </PageSection>
      ),
    });
  }

  /* The longer written chapters: heading on the left, text on the right. */
  const chapters = [
    { key: 'objectives', title: t('departments.objectives'), body: objectives },
    { key: 'services', title: t('departments.services'), body: services },
    { key: 'structures', title: t('departments.structures'), body: structures },
  ].filter((chapter) => chapter.body);

  chapters.forEach((chapter, i) => {
    sections.push({
      key: chapter.key,
      render: (tone, closing) => (
        <PageSection key={chapter.key} tone={tone} id={chapter.key}>
          {chapterBody(String(i + 1 + numberOffset).padStart(2, '0'), chapter.title, chapter.body)}
          {closingRow(closing)}
        </PageSection>
      ),
    });
  });

  if (upcoming.length > 0) {
    sections.push({
      key: 'upcoming',
      render: (tone, closing) => (
        <PageSection key="upcoming" tone={tone} id="upcoming">
          <SectionHeading title={t('departments.upcoming')} layout="stack" />
          <ul className="mt-11 grid gap-5">
            {upcoming.map((activity, i) => (
              <Reveal as="li" key={activity.id} delay={Math.min(i, 8) * 60}>
                <DepartmentActivityCard
                  activity={activity}
                  departmentSlug={department.slug}
                  layout="row"
                  upcoming
                />
              </Reveal>
            ))}
          </ul>
          {closingRow(closing)}
        </PageSection>
      ),
    });
  }

  const tileGrid = (items: PublicActivity[]) => (
    <ul
      className={`mt-11 grid gap-6 sm:grid-cols-2 ${
        items.length >= 3 ? 'lg:grid-cols-3' : 'lg:max-w-5xl'
      }`}
    >
      {items.map((activity, i) => (
        <Reveal as="li" key={activity.id} delay={Math.min(i, 8) * 60} className="h-full">
          <DepartmentActivityCard activity={activity} departmentSlug={department.slug} />
        </Reveal>
      ))}
    </ul>
  );

  if (recent.length > 0) {
    sections.push({
      key: 'recent',
      render: (tone, closing) => (
        <PageSection key="recent" tone={tone} id="activities">
          <SectionHeading title={t('departments.recent')} layout="stack" />
          {tileGrid(recent)}
          {closingRow(closing)}
        </PageSection>
      ),
    });
  }

  if (projects.length > 0) {
    sections.push({
      key: 'projects',
      render: (tone, closing) => (
        <PageSection key="projects" tone={tone} id="projects">
          <SectionHeading title={t('departments.projects')} layout="stack" />
          {tileGrid(projects)}
          {closingRow(closing)}
        </PageSection>
      ),
    });
  }

  if (department.images.length > 0) {
    sections.push({
      key: 'gallery',
      render: (tone, closing) => (
        <PageSection key="gallery" tone={tone} id="gallery">
          <SectionHeading title={t('departments.gallery')} layout="stack" />
          <Reveal className="mt-11 max-w-5xl">
            <MediaGallery
              images={department.images}
              alt={name}
              labels={{
                enlarge: t('home.gallery.view'),
                close: t('home.gallery.close'),
                previous: t('home.gallery.previous'),
                next: t('home.gallery.next'),
              }}
            />
          </Reveal>
          {closingRow(closing)}
        </PageSection>
      ),
    });
  }

  /* The way back to the list, set at the foot of whichever band is last. */
  const backLink = (
    <Link
      href="/departments"
      className="focus-ring group inline-flex items-center gap-2.5 rounded-full border border-ink-200 bg-white px-6 py-3 font-ui text-sm font-medium text-ink-700 transition-all duration-300 ease-spring hover:border-plum-400 hover:text-plum-700"
    >
      <ArrowLeft
        aria-hidden="true"
        className="h-4 w-4 text-leaf-600 transition-transform duration-300 ease-spring group-hover:-translate-x-0.5"
      />
      {t('departments.allDepartments')}
    </Link>
  );

  /* The department's call for support, where it has one: a dark panel inside
     a light band, not a dark band — the footer is the page's closing dark
     band, and a page must end on a light one. The same light band stands in
     when a department has written nothing else, so the page still closes on
     it after the figures. */
  const supportHref = department.email ? `mailto:${department.email}` : '/contact';
  if (support || sections.length === 0) {
    sections.push({
      key: 'close',
      render: (tone, closing) => (
        <PageSection key="close" tone={tone} glow={false}>
          {support && (
            <Reveal>
              <div className="grain relative overflow-hidden rounded-2xl bg-plum-950 px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-plum-800/60 blur-[110px]"
                />
                <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-8">
                    <div className="flex items-center gap-3">
                      <span aria-hidden="true" className="h-px w-10 bg-leaf-400" />
                      <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-leaf-300">
                        {department.acronym}
                      </p>
                    </div>
                    <h2 className="mt-6 font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold leading-[1.06] tracking-tight text-white text-balance">
                      {t('departments.support')}
                    </h2>
                    <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-plum-200 text-pretty">
                      {support}
                    </p>
                  </div>
                  <div className="lg:col-span-4 lg:flex lg:justify-end">
                    <a
                      href={supportHref}
                      className="focus-ring group inline-flex items-center gap-2.5 rounded-full bg-leaf-600 px-6 py-3.5 font-ui text-sm font-semibold text-white transition-all duration-300 ease-spring hover:bg-leaf-500 active:translate-y-px"
                    >
                      {department.email && <Mail aria-hidden="true" className="h-4 w-4" />}
                      {department.email ? t('departments.writeToUs') : t('departments.contactCouncil')}
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-0.5"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
          {support ? closingRow(closing) : closing && <Reveal>{closing}</Reveal>}
        </PageSection>
      ),
    });
  }

  // One or two figures read as a statement beside the heading; more than that
  // need the full width of the band.
  const compactFigures = figures.length <= 2;

  return (
    <>
      <PageHero title={name} lede={lede}>
        {heroMeta.length > 0 && <MetaRail items={heroMeta} className="mt-8" />}
      </PageHero>

      {figures.length > 0 && (
        /* The hero keeps only a sliver of bottom padding, which is less than
           the height of the paint this band throws upward; without the spacer
           the bristles run through the hero's fact rail. */
        <div aria-hidden="true" className="h-16 bg-white lg:h-20" />
      )}

      {figures.length > 0 && (
        <PageSection
          tone="dark"
          paint
          className={compactFigures ? 'py-16 lg:py-24' : 'py-20 lg:py-28'}
          innerClassName={compactFigures ? 'grid gap-12 lg:grid-cols-12 lg:items-end' : ''}
        >
          <SectionHeading
            tone="dark"
            eyebrow={t('departments.figuresEyebrow')}
            title={t('departments.figuresTitle')}
            titleHighlight={t('departments.figuresTitleHighlight')}
            layout="stack"
            className={compactFigures ? 'lg:col-span-6' : ''}
          />

          <dl
            className={`grid gap-x-10 gap-y-10 ${
              compactFigures
                ? `lg:col-span-5 lg:col-start-8 ${figures.length === 2 ? 'sm:grid-cols-2' : ''}`
                : figures.length === 3
                  ? 'mt-12 sm:grid-cols-3'
                  : 'mt-12 grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {figures.map((figure, i) => (
              /* Label first in the markup so it is read before the number;
                 shown underneath it. */
              <Reveal
                key={`${figure.value}-${i}`}
                delay={Math.min(i, 8) * 60}
                className="flex h-full flex-col-reverse justify-end border-t border-white/10 pt-6"
              >
                <dt className="mt-3 max-w-[28ch] text-sm leading-snug text-plum-200 text-pretty">
                  {figure.label}
                </dt>
                <dd
                  className={`tnum font-display font-semibold leading-none tracking-tight text-white ${
                    compactFigures
                      ? 'text-[clamp(2.75rem,5vw,4.25rem)]'
                      : 'text-[clamp(2rem,3.8vw,3.1rem)]'
                  }`}
                >
                  <FigureValue value={figure.value} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </PageSection>
      )}

      {sections.map((section, i) =>
        section.render(
          i % 2 === 0 ? 'white' : 'tint',
          i === sections.length - 1 ? backLink : null
        )
      )}
    </>
  );
}
