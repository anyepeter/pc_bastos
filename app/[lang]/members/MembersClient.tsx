'use client';

import Link from '@/components/LocalizedLink';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import ChurchLogoRibbon from '@/components/ChurchLogoRibbon';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { logoSrc } from '@/lib/site-settings';

export interface PublicChurch {
  id: string;
  slug: string;
  denomination: unknown;
  leader: unknown;
  location: unknown;
  founded: string | null;
  logo: string | null;
}

/**
 * The twelve member churches.
 *
 * Figures first, counted up, with the churches' emblems drifting past beneath
 * them; then the directory. Each card stands its emblem on a dotted plate with
 * the church's acronym large and outlined behind it — the acronyms are how the
 * churches are known (EEC, PCC, UEBC…) — and opens onto the church's page.
 */
export default function MembersClient({ churches }: { churches: PublicChurch[] }) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);
  const councilLogo = logoSrc(useSiteSettings());

  const figures = [
    { value: churches.length, suffix: '', label: t('members.memberChurches') },
    { value: 11.5, suffix: 'M', label: t('home.stats.believers') },
    { value: 15500, suffix: '', label: t('home.stats.congregations') },
  ];

  const ribbon = churches.map((church) => ({
    slug: church.slug,
    name: getTranslatedText(church.denomination as any, language),
    logo: church.logo,
  }));

  const spotlight = (event: React.MouseEvent<HTMLElement>) => {
    const r = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${event.clientX - r.left}px`);
    event.currentTarget.style.setProperty('--my', `${event.clientY - r.top}px`);
  };

  return (
    <>
      <PageHero
        title={t('members.pageTitle')}
        titleHighlight={t('members.pageTitleHighlight')}
        lede={t('members.pageSubtitle')}
      />

      {/* The council in figures, with the twelve emblems beneath. */}
      <PageSection tone="tint" className="lg:py-24">
        <SectionHeading title={t('members.unitedInFaith')} standfirst={t('members.servingTogether')} />

        {/* Three across at every width: stacked, the figures took a whole
            phone screen to say three numbers. */}
        <dl className="mt-10 grid grid-cols-3 border-t border-ink-200 pt-8 sm:mt-12 sm:pt-12">
          {figures.map((figure, i) => (
            <Reveal
              key={figure.label}
              delay={Math.min(i, 8) * 90}
              className={i > 0 ? 'border-l border-ink-200 pl-3 sm:pl-10' : 'pr-3 sm:pr-0'}
            >
              <dt className="sr-only">{figure.label}</dt>
              <dd>
                <span className="block font-display text-[clamp(1.85rem,6.4vw,4.6rem)] font-semibold leading-none tracking-tight text-ink-900">
                  <CountUp value={figure.value} suffix={figure.suffix} durationMs={1600} />
                </span>
                <span aria-hidden="true" className="grow-x mt-4 block h-px w-8 origin-left bg-leaf-500 sm:mt-5 sm:w-14" />
                <span aria-hidden="true" className="mt-3 block font-mono text-[0.56rem] uppercase leading-snug tracking-[0.14em] text-plum-700 sm:mt-4 sm:text-[0.64rem] sm:tracking-[0.2em]">
                  {figure.label}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>

        {ribbon.length > 0 && (
          <Reveal delay={200} className="mt-14">
            <ChurchLogoRibbon churches={ribbon} tone="light" />
          </Reveal>
        )}
      </PageSection>

      {/* The directory. */}
      <PageSection tone="white" className="lg:py-24">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {churches.map((member, i) => {
            const denomination = getTranslatedText(member.denomination as any, language);
            const leader = getTranslatedText(member.leader as any, language);
            const location = getTranslatedText(member.location as any, language);

            return (
              <Reveal as="li" key={member.id} delay={Math.min(i, 8) * 60}>
                <Link
                  href={`/members/${member.slug}`}
                  onMouseMove={spotlight}
                  className="spotlight card focus-ring group flex h-full flex-col overflow-hidden rounded-2xl transition-[transform,box-shadow] duration-500 ease-spring hover:-translate-y-1 hover:shadow-[0_30px_60px_-28px_rgb(93_50_166/0.4)]"
                >
                  {/* Emblem plate */}
                  <div className="relative flex h-44 items-center justify-center overflow-hidden border-b border-ink-200 bg-ink-50">
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-70"
                      style={{
                        backgroundImage: 'radial-gradient(rgb(91 50 166 / 0.14) 1px, transparent 1.2px)',
                        backgroundSize: '16px 16px',
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-1 right-4 select-none font-display text-[4.25rem] font-semibold uppercase leading-[0.8] tracking-tight text-outline text-plum-200 transition-transform duration-700 ease-spring group-hover:-translate-x-3 sm:text-[4.75rem] lg:text-[5rem]"
                    >
                      {member.slug}
                    </span>
                    <span aria-hidden="true" className="tnum absolute left-5 top-4 font-mono text-[0.66rem] tracking-[0.2em] text-ink-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white p-3 shadow-[0_14px_30px_-16px_rgb(45_27_90/0.45)] ring-1 ring-ink-200 transition-transform duration-700 ease-spring group-hover:-rotate-3 group-hover:scale-[1.08]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.logo || councilLogo}
                        alt={t('members.logoAlt', { name: denomination })}
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    </span>
                  </div>

                  {/* Facts */}
                  <div className="flex flex-1 flex-col p-6 lg:p-7">
                    <h2 className="font-display text-xl font-semibold leading-snug tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-plum-700">
                      {denomination}
                    </h2>

                    <ul className="mt-5 space-y-2.5">
                      {leader && (
                        <li className="flex items-start gap-2.5">
                          <Users aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
                          <span className="text-sm leading-snug text-ink-600">{leader}</span>
                        </li>
                      )}
                      {location && (
                        <li className="flex items-start gap-2.5">
                          <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
                          <span className="text-sm leading-snug text-ink-600">{location}</span>
                        </li>
                      )}
                      {member.founded && (
                        <li className="flex items-start gap-2.5">
                          <Calendar aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
                          <span className="text-sm leading-snug text-ink-600">
                            {t('members.founded')} <span className="tnum">{member.founded}</span>
                          </span>
                        </li>
                      )}
                    </ul>

                    <span className="mt-auto flex items-center justify-between gap-4 pt-7">
                      <span className="font-ui text-sm font-semibold text-plum-700">{t('members.viewDetails')}</span>
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-500 transition-all duration-500 ease-spring group-hover:-rotate-45 group-hover:border-leaf-600 group-hover:bg-leaf-600 group-hover:text-white"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </PageSection>
    </>
  );
}
