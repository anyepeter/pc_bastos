'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import type { PublicCharityProgram } from '@/app/charity/CharityClient';

interface CharitySectionProps {
  /** Published programs, fetched by the page. The section hides itself when empty. */
  programs: PublicCharityProgram[];
}

export default function CharitySection({ programs }: CharitySectionProps) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setVisibleCards(programs.map((program) => program.id));
    }, 400);
    return () => clearTimeout(timer);
  }, [programs]);

  // Nothing published yet — don't render an empty band on the home page.
  if (programs.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`mb-14 text-center transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 className="font-serif text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            {t('charity.title')}{' '}
            <span className="text-purple-600">{t('charity.titleHighlight')}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-600">
            {t('charity.subtitle')}
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {programs.slice(0, 3).map((program, index) => {
            const title = getTranslatedText(program.title as any, language);
            const description = getTranslatedText(program.description as any, language);
            const impact = getTranslatedText(program.impact as any, language);
            const beneficiaries = getTranslatedText(program.beneficiaries as any, language);
            const location = getTranslatedText(program.location as any, language);
            const cover = program.images[0];

            return (
              <Link
                key={program.id}
                href={`/charity/${program.slug}`}
                className={`group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-gray-900/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(13,148,136,0.25)] ${
                  visibleCards.includes(program.id)
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-teal-500 via-cyan-500 to-emerald-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {beneficiaries && (
                    // right-4 + max-w-fit keeps the chip inside the card and
                    // lets a long value ellipsis instead of clipping mid-word.
                    <span className="absolute bottom-4 left-4 right-4 inline-flex max-w-fit items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur">
                      <Users className="h-3.5 w-3.5 shrink-0 text-teal-600" />
                      <span className="truncate">{beneficiaries}</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-7">
                  {impact && (
                    <p className="mb-3 truncate text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
                      {impact}
                    </p>
                  )}

                  <h3 className="line-clamp-2 font-playfair text-xl font-bold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-teal-700 sm:text-2xl">
                    {title}
                  </h3>

                  <p className="mt-3 line-clamp-3 flex-1 font-inter leading-relaxed text-gray-600">
                    {description}
                  </p>

                  {/* Both halves stay on a single line; the location gives up
                      space first, and each ellipsises rather than wrapping. */}
                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
                    {location ? (
                      <span className="flex min-w-0 flex-1 items-center gap-1.5 text-sm text-gray-500">
                        <MapPin className="h-4 w-4 shrink-0 text-teal-500" />
                        <span className="truncate">{location}</span>
                      </span>
                    ) : (
                      <span className="flex-1" />
                    )}
                    <span className="flex min-w-0 max-w-[60%] shrink-0 items-center gap-2 text-sm font-semibold text-teal-700">
                      <span className="truncate">{t('charity.viewDetails')}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div
          className={`text-center transform transition-all duration-1000 ease-out delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <Link
            href="/charity"
            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-green-700 hover:shadow-xl"
          >
            {t('charity.viewAllPrograms')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
