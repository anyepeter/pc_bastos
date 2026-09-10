'use client';

import Link from 'next/link';
import { ArrowUpRight, CalendarDays, GraduationCap, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import Reveal from '@/components/Reveal';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';

/** Shared with the landing page's WorkshopsSection — keep the shape stable. */
export interface PublicWorkshop {
  id: string;
  slug: string;
  title: unknown;
  description: unknown;
  location: unknown;
  date: string;
  images: string[];
}

export default function WorkshopsClient({
  workshops,
}: {
  workshops: PublicWorkshop[];
}) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  // The page title, lede and the two UI strings below were never lifted into
  // `public/locales`; they live here as language ternaries. Kept verbatim —
  // this is a visual redesign and the copy is not ours to change.
  const fr = language === 'fr';
  const read = (value: unknown) => getTranslatedText(value as any, language);

  return (
    <>
      <PageHero
        title={fr ? 'Ateliers et' : 'Workshops &'}
        titleHighlight={fr ? 'Formations' : 'Training'}
        lede={
          fr
            ? 'Renforcer notre communauté par des programmes de formation complets et le développement des compétences'
            : 'Empowering our community through comprehensive training programs and skill development workshops'
        }
      />

      {/* The register of workshops. The landing page shows three of these in a
          tighter three-up; here they run two-up so the date, place and summary
          all have room. A workshop with no uploaded photograph falls back to a
          typographic plate rather than borrowed stock. */}
      <PageSection tone="white">
        {workshops.length === 0 ? (
          <Reveal>
            <div className="card flex flex-col items-center rounded-2xl px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-ink-200 bg-white">
                <GraduationCap aria-hidden="true" className="h-6 w-6 text-leaf-600" />
              </span>
              <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-ink-600 text-pretty">
                {fr
                  ? "Aucun atelier n'est programmé pour le moment."
                  : 'No workshops are scheduled at the moment.'}
              </p>
            </div>
          </Reveal>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {workshops.map((workshop, i) => {
              const title = read(workshop.title);
              const cover = workshop.images[0];

              return (
                <Reveal as="li" key={workshop.id} delay={Math.min(i, 8) * 60} className="h-full">
                  <Link
                    href={`/workshops/${workshop.slug}`}
                    className="card card-hover focus-ring group flex h-full flex-col overflow-hidden rounded-2xl"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt={title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-end bg-ink-50 p-6">
                          <span
                            aria-hidden="true"
                            className="absolute right-5 top-5 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-400"
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <GraduationCap aria-hidden="true" className="h-9 w-9 text-leaf-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6 lg:p-7">
                      <p className="tnum inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-plum-700">
                        <CalendarDays aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                        {formatLongDate(workshop.date, language)}
                      </p>

                      <h2 className="mt-3 font-display text-xl font-medium leading-snug tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-plum-700 lg:text-2xl">
                        {title}
                      </h2>

                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-600 text-pretty">
                        {read(workshop.description)}
                      </p>

                      <div className="mt-auto pt-7">
                        <p className="flex min-w-0 items-center gap-2 border-t border-ink-200 pt-5 font-mono text-xs leading-relaxed text-ink-500">
                          <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-leaf-600" />
                          <span className="truncate">{read(workshop.location)}</span>
                        </p>

                        <span className="mt-5 inline-flex items-center gap-2 font-ui text-sm font-medium text-plum-700">
                          {fr ? 'En savoir plus' : 'Learn More'}
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        )}
      </PageSection>
    </>
  );
}
