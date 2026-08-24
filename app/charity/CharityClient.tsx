'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, HeartHandshake, MapPin, Users } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';

export interface PublicCharityProgram {
  id: string;
  slug: string;
  title: unknown;
  description: unknown;
  impact: unknown;
  beneficiaries: unknown;
  location: unknown;
  images: string[];
}

export default function CharityClient({
  programs,
}: {
  programs: PublicCharityProgram[];
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);
  const language = useAppSelector((state) => state.blog.language);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setVisibleCards(programs.map((program) => program.id));
    }, 400);
    return () => clearTimeout(timer);
  }, [programs]);

  const copy =
    language === 'fr'
      ? {
          eyebrow: 'Notre action',
          title: 'Programmes caritatifs',
          subtitle:
            'Transformer des vies par une action solidaire et un développement communautaire durable',
          count: (n: number) =>
            `${n} programme${n > 1 ? 's' : ''} en cours`,
          view: 'Découvrir le programme',
          empty: 'Aucun programme caritatif publié pour le moment.',
          emptyHint: 'Revenez bientôt pour découvrir nos actions.',
        }
      : {
          eyebrow: 'Our work',
          title: 'Charity Programs',
          subtitle:
            'Transforming lives through compassionate outreach and sustainable community development',
          count: (n: number) => `${n} programme${n > 1 ? 's' : ''} running`,
          view: 'Explore this program',
          empty: 'No charity programs have been published yet.',
          emptyHint: 'Check back soon to see the work under way.',
        };

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      {/* Header */}
      <div className="relative overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&h=600&fit=crop&auto=format")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 md:pb-20 md:pt-36 lg:px-8">
          <div
            className={`max-w-3xl transform transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-100 backdrop-blur-sm">
              <HeartHandshake className="h-3.5 w-3.5" />
              {copy.eyebrow}
            </span>

            <h1 className="mt-6 font-playfair text-4xl font-bold leading-[1.05] sm:text-6xl">
              {copy.title}
            </h1>

            <p className="mt-5 max-w-2xl font-inter text-lg leading-relaxed text-gray-200 sm:text-xl">
              {copy.subtitle}
            </p>

            {programs.length > 0 && (
              <p className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-teal-200">
                <span className="h-px w-8 bg-teal-300/60" />
                {copy.count(programs.length)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Programs */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        {programs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <HeartHandshake className="mx-auto h-12 w-12 text-teal-300" />
            <p className="mt-5 text-lg font-medium text-gray-800">{copy.empty}</p>
            <p className="mt-1 text-sm text-gray-500">{copy.emptyHint}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {programs.map((program, index) => {
              const title = getTranslatedText(program.title as any, language);
              const description = getTranslatedText(program.description as any, language);
              const impact = getTranslatedText(program.impact as any, language);
              const beneficiaries = getTranslatedText(
                program.beneficiaries as any,
                language
              );
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
                  style={{ transitionDelay: `${index * 120}ms` }}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

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
                        <span className="truncate">{copy.view}</span>
                        <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
