'use client';

import { Calendar, Clock, MapPin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText, readTranslation } from '@/lib/translations';
import { formatLongDate, formatTime } from '@/lib/format';
import PageHero from '@/components/PageHero';
import MetaRail from '@/components/MetaRail';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import type { PublicEvent } from '../EventsClient';

/**
 * Markdown body styling, scoped to this element.
 *
 * The global `.prose` rules predate the design system and hardcode grey body
 * text and blue links; they are shared, so they are styled around here rather
 * than edited.
 */
const BODY =
  'text-base leading-relaxed text-ink-600 text-pretty ' +
  '[&>*:first-child]:mt-0 [&_p]:mt-5 ' +
  '[&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink-900 ' +
  '[&_h3]:mt-9 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-ink-900 ' +
  '[&_h4]:mt-8 [&_h4]:font-ui [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-ink-900 ' +
  '[&_strong]:font-semibold [&_strong]:text-ink-900 ' +
  '[&_a]:font-medium [&_a]:text-plum-700 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-plum-800 ' +
  '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-2 [&_li]:pl-1 ' +
  '[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-plum-200 [&_blockquote]:pl-5 [&_blockquote]:text-ink-700 ' +
  '[&_code]:rounded [&_code]:bg-ink-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-ink-800 ' +
  '[&_pre]:mt-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-ink-900 [&_pre]:p-5 [&_pre]:text-sm [&_pre]:text-ink-100 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-ink-100 ' +
  '[&_hr]:mt-8 [&_hr]:border-ink-200 ' +
  '[&_img]:mt-6 [&_img]:rounded-xl ' +
  '[&_table]:mt-6 [&_table]:w-full [&_table]:text-sm ' +
  '[&_th]:border-b [&_th]:border-ink-300 [&_th]:py-2 [&_th]:pr-4 [&_th]:text-left [&_th]:font-ui [&_th]:font-semibold [&_th]:text-ink-900 ' +
  '[&_td]:border-b [&_td]:border-ink-200 [&_td]:py-2 [&_td]:pr-4';

/**
 * One event.
 *
 * The when and where are the point of the page, so they sit in the hero as a
 * mono data rail rather than in a row of tinted boxes below the title; the
 * description then runs as a single measured column underneath.
 */
export default function EventDetailClient({ event }: { event: PublicEvent }) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  // Prisma `Json` columns: a legacy row may hold a bare string.
  const read = (value: unknown) => getTranslatedText(readTranslation(value), language);

  const title = read(event.title);
  const description = read(event.description);
  const location = read(event.location);
  const category = read(event.category);

  const meta = [
    {
      key: 'date',
      icon: Calendar,
      label: language === 'fr' ? 'Date' : 'Date',
      value: formatLongDate(event.date, language),
    },
    {
      key: 'time',
      icon: Clock,
      label: language === 'fr' ? 'Heure' : 'Time',
      value: event.time ? formatTime(event.time, language) : '',
    },
    {
      key: 'location',
      icon: MapPin,
      label: language === 'fr' ? 'Lieu' : 'Location',
      value: location,
    },
  ].filter((item) => item.value);

  return (
    <>
      <PageHero
        title={title}
      >
        <MetaRail items={meta} className="mt-8" />
      </PageHero>

      <PageSection tone="white">
        {/* The event's own uploaded image where there is one; no stock
            photograph stands in where there is not. */}
        {event.imageUrl && (
          <Reveal as="figure" className="mb-14 overflow-hidden rounded-2xl bg-ink-100">
            <div className="aspect-[16/9] w-full sm:aspect-[21/9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.imageUrl} alt={title} className="h-full w-full object-cover" />
            </div>
          </Reveal>
        )}

        <SectionHeading
          as="h2"
          layout="stack"
          title={language === 'fr' ? 'À propos de cet événement' : 'About This Event'}
        />

        <Reveal className={`mt-11 max-w-[68ch] ${BODY}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
        </Reveal>
      </PageSection>
    </>
  );
}
