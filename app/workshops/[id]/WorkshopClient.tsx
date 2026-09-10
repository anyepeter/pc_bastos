'use client';

import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';

export interface PublicWorkshopDetail {
  id: string;
  slug: string;
  title: unknown;
  description: unknown;
  fullDescription: unknown;
  location: unknown;
  duration: unknown;
  capacity: unknown;
  date: string;
  images: string[];
}

/* The markdown body, styled from the palette instead of the global `.prose`
   rules — those set slate body text and a blue link colour, neither of which
   exists on this site. */
const PROSE = [
  'max-w-[68ch] text-base leading-relaxed text-ink-600',
  '[&>*+*]:mt-5',
  '[&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink-900',
  '[&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-ink-900',
  '[&_p]:text-pretty',
  '[&_strong]:font-semibold [&_strong]:text-ink-800',
  '[&_a]:font-medium [&_a]:text-plum-700 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-plum-800',
  '[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5',
  '[&_li]:mt-2 [&_li]:marker:text-leaf-600',
  '[&_blockquote]:border-l-2 [&_blockquote]:border-plum-300 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-ink-500',
  '[&_code]:rounded [&_code]:bg-ink-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-ink-800',
  '[&_hr]:my-9 [&_hr]:border-ink-200',
  '[&_img]:rounded-2xl',
].join(' ');

export default function WorkshopClient({
  workshop,
}: {
  workshop: PublicWorkshopDetail;
}) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  const title = getTranslatedText(workshop.title as any, language);
  const description = getTranslatedText(workshop.description as any, language);
  const fullDescription = getTranslatedText(workshop.fullDescription as any, language);
  const location = getTranslatedText(workshop.location as any, language);
  const duration = getTranslatedText(workshop.duration as any, language);
  const capacity = getTranslatedText(workshop.capacity as any, language);

  // The two headings below are hardcoded language ternaries in this file
  // rather than i18next keys. Kept verbatim — redesign only.
  const fr = language === 'fr';

  const [lead, ...rest] = workshop.images;
  const hasImages = Boolean(lead);

  // Date, place, length and size — the four facts a reader scans for. Set in
  // mono so they read as data rather than prose.
  const facts = [
    { id: 'date', icon: CalendarDays, value: formatLongDate(workshop.date, language), numeric: true },
    { id: 'location', icon: MapPin, value: location, numeric: false },
    { id: 'duration', icon: Clock, value: duration, numeric: false },
    { id: 'capacity', icon: Users, value: capacity, numeric: false },
  ].filter((fact) => Boolean(fact.value));

  return (
    <>
      <PageHero
        title={title}
        lede={description}
      />

      {/* The photographs the council actually uploaded, beside the facts
          panel. With no upload the panel simply widens — nothing is faked in
          to fill the column. */}
      <PageSection tone="white">
        <div className={hasImages ? 'grid gap-8 lg:grid-cols-12 lg:gap-10' : ''}>
          {hasImages && (
            <Reveal className="lg:col-span-7">
              <figure className="overflow-hidden rounded-2xl border border-ink-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lead}
                  alt={title}
                  className="aspect-[16/10] w-full object-cover"
                />
              </figure>

              {rest.length > 0 && (
                <ul className="mt-4 grid grid-cols-3 gap-4">
                  {rest.map((image, i) => (
                    <li key={`${image}-${i}`} className="overflow-hidden rounded-xl border border-ink-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          )}

          <Reveal
            delay={hasImages ? 80 : 0}
            className={hasImages ? 'lg:col-span-5 lg:col-start-8' : ''}
          >
            <div className="card rounded-2xl p-7 lg:p-8">
              <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900">
                {fr ? "Détails de l'atelier" : 'Workshop Details'}
              </h2>

              <ul
                className={`mt-7 border-t border-ink-200 ${
                  hasImages ? '' : 'sm:grid sm:grid-cols-2 sm:gap-x-10'
                }`}
              >
                {facts.map((fact) => {
                  const Icon = fact.icon;

                  return (
                    <li
                      key={fact.id}
                      className="flex items-start gap-3 border-b border-ink-200 py-4"
                    >
                      <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
                      <span
                        className={`font-mono text-sm leading-relaxed text-ink-700 ${
                          fact.numeric ? 'tnum' : ''
                        }`}
                      >
                        {fact.value}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </PageSection>

      {/* The full brief. Dropped entirely when the record has no long
          description, rather than leaving a heading over empty space. */}
      {fullDescription.trim().length > 0 && (
        <PageSection tone="tint">
          <SectionHeading
            title={fr ? 'À propos de cet atelier' : 'About This Workshop'}
            layout="stack"
            as="h2"
          />

          <Reveal delay={60}>
            <div className={`mt-11 ${PROSE}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{fullDescription}</ReactMarkdown>
            </div>
          </Reveal>
        </PageSection>
      )}
    </>
  );
}
