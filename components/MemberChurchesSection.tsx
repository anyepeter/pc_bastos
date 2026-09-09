'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import Reveal from '@/components/Reveal';
import type { PublicChurch } from '@/app/members/MembersClient';

interface MemberChurchesSectionProps {
  /** Published member churches, fetched by the page. Hides itself when empty. */
  churches: PublicChurch[];
}

/**
 * The council's membership, shown on the home page.
 *
 * Both comparable bodies — the World Council of Churches and the All Africa
 * Conference of Churches — lead with who belongs to them ("Member churches" is
 * a top-level nav item on each, and AACC's identity block opens with its member
 * count). It is the fact that distinguishes a council from a single church, and
 * it was missing from this home page entirely.
 */
export default function MemberChurchesSection({ churches }: MemberChurchesSectionProps) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  if (churches.length === 0) return null;

  return (
    <section className="grain relative overflow-hidden bg-white py-14 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-[28rem] w-[28rem] rounded-full bg-plum-50 blur-[120px]"
      />

      <div className="shell relative">
        {/* Header — title left, standfirst right */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-plum-500" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-700">
                  {t('members.memberChurches')}
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-7 font-display text-[clamp(2.1rem,4.2vw,3.4rem)] font-semibold leading-[1.04] tracking-tight text-ink-900 text-balance">
                {t('members.pageTitle')}{' '}
                <span className="text-leaf-600">{t('members.pageTitleHighlight')}</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={140} className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-[48ch] text-base leading-relaxed text-ink-600 text-pretty lg:pb-2">
              {t('members.pageSubtitle')}
            </p>
          </Reveal>
        </div>

        {/* The twelve, as a directory rather than a logo strip — each is a real
            destination, so each tile links to its own page. */}
        <ul className="mt-11 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {churches.map((church, i) => {
            const denomination = getTranslatedText(church.denomination as any, language);

            return (
              <Reveal as="li" key={church.id} delay={Math.min(i, 8) * 60}>
                <Link
                  href={`/members/${church.slug}`}
                  className="card card-hover focus-ring group flex h-full flex-col items-center gap-4 rounded-2xl p-5 text-center"
                >
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1.5 ring-1 ring-inset ring-ink-200 transition-colors duration-300 group-hover:ring-plum-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={church.logo || '/images/logo_CEPCA.png'}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <span className="line-clamp-3 font-display text-sm font-medium leading-snug text-ink-900 transition-colors duration-300 group-hover:text-plum-700">
                    {denomination}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={160}>
          <div className="mt-11 border-t border-ink-200 pt-9">
            <Link
              href="/members"
              className="focus-ring group inline-flex items-center gap-2.5 rounded-full border border-ink-300 bg-white px-6 py-3 font-ui text-sm font-semibold text-ink-800 transition-all duration-300 ease-spring hover:border-plum-400 hover:bg-plum-50 active:translate-y-px"
            >
              {t('members.exploreAllMembers')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
