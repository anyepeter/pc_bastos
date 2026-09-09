'use client';

import Link from 'next/link';
import { ArrowUpRight, Calendar, MapPin, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

export interface PublicChurch {
  id: string;
  slug: string;
  denomination: unknown;
  leader: unknown;
  location: unknown;
  founded: string | null;
  logo: string | null;
}

export default function MembersClient({ churches }: { churches: PublicChurch[] }) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  /* Figures are rendered as literal strings rather than through <CountUp>:
     `15,500` is separated copy, and toLocaleString() would re-punctuate it
     per browser locale. */
  const figures = [
    { value: String(churches.length), label: t('members.memberChurches') },
    { value: '13M+', label: t('welcome.stats.believers') },
    { value: '15,500', label: 'Congregations' },
  ];

  return (
    <>
      <PageHero
        eyebrow={t('members.memberChurches')}
        title={t('members.pageTitle')}
        titleHighlight={t('members.pageTitleHighlight')}
        lede={t('members.pageSubtitle')}
        crumbs={[
          { label: t('navbar.home'), href: '/' },
          { label: t('members.memberChurches') },
        ]}
      />

      {/* The council in figures. Kept ahead of the directory, as it was, so the
          twelve arrive with their scale already established. */}
      <PageSection tone="tint">
        <SectionHeading
          title={t('members.unitedInFaith')}
          standfirst={t('members.servingTogether')}
        />

        <dl className="mt-11 grid grid-cols-1 gap-x-10 gap-y-10 border-t border-ink-200 pt-11 sm:grid-cols-3">
          {figures.map((figure, i) => (
            <Reveal key={figure.label} delay={Math.min(i, 8) * 60}>
              <dt className="sr-only">{figure.label}</dt>
              <dd>
                <span className="tnum block font-display text-[clamp(2.4rem,4.4vw,3.5rem)] font-semibold leading-none tracking-tight text-ink-900">
                  {figure.value}
                </span>
                <span className="mt-3 block font-mono text-[0.62rem] uppercase tracking-[0.2em] text-plum-700">
                  {figure.label}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </PageSection>

      {/* The directory itself — the landing page's tile language, opened out
          far enough to carry each church's leader, seat and founding year. */}
      <PageSection tone="white">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {churches.map((member, i) => {
            const denomination = getTranslatedText(member.denomination as any, language);
            const leader = getTranslatedText(member.leader as any, language);
            const location = getTranslatedText(member.location as any, language);

            return (
              <Reveal as="li" key={member.id} delay={Math.min(i, 8) * 60}>
                <Link
                  href={`/members/${member.slug}`}
                  className="card card-hover focus-ring group flex h-full flex-col p-6 lg:p-7"
                >
                  <div className="flex items-start gap-5">
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-ink-200 bg-white p-2 transition-colors duration-300 group-hover:border-leaf-300">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.logo || '/images/logo_CEPCA.png'}
                        alt={`${denomination} logo`}
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    </span>

                    <h2 className="font-display text-lg font-semibold leading-snug tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-plum-700">
                      {denomination}
                    </h2>
                  </div>

                  <ul className="mt-6 space-y-3 border-t border-ink-200 pt-5">
                    {leader && (
                      <li className="flex items-start gap-2.5">
                        <Users
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600"
                        />
                        <span className="text-sm leading-snug text-ink-600">{leader}</span>
                      </li>
                    )}
                    {location && (
                      <li className="flex items-start gap-2.5">
                        <MapPin
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600"
                        />
                        <span className="text-sm leading-snug text-ink-600">{location}</span>
                      </li>
                    )}
                    {member.founded && (
                      <li className="flex items-start gap-2.5">
                        <Calendar
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600"
                        />
                        <span className="text-sm leading-snug text-ink-600">
                          {t('members.founded')} <span className="tnum">{member.founded}</span>
                        </span>
                      </li>
                    )}
                  </ul>

                  <span className="mt-auto inline-flex items-center gap-2 pt-7 font-ui text-sm font-medium text-plum-700">
                    {t('members.viewDetails')}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </PageSection>
    </>
  );
}
