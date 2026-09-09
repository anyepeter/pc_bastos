'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import ImageSlider from './ImageSlider';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText, readTranslation } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

export interface PublicCharityDetail {
  id: string;
  slug: string;
  title: unknown;
  description: unknown;
  fullDescription: unknown;
  impact: unknown;
  beneficiaries: unknown;
  location: unknown;
  date: string | null;
  images: string[];
}

/**
 * Markdown body. The global `.prose` rules predate the palette and hardcode
 * grey text with blue links, so the body is styled here instead — on-palette,
 * and scoped to this element rather than to a global class.
 */
const BODY_PROSE = [
  'max-w-[68ch] text-base leading-relaxed text-ink-600',
  '[&>*+*]:mt-5',
  '[&_h1]:mt-10 [&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-ink-900',
  '[&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink-900',
  '[&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-ink-900',
  '[&_h4]:mt-8 [&_h4]:font-ui [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-ink-900',
  '[&_strong]:font-semibold [&_strong]:text-ink-900',
  '[&_a]:font-medium [&_a]:text-plum-700 [&_a]:underline [&_a]:underline-offset-4',
  '[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-2 [&_li]:pl-1',
  '[&_blockquote]:border-l-2 [&_blockquote]:border-leaf-300 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-ink-500',
  '[&_code]:rounded [&_code]:bg-ink-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-plum-700',
  '[&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-ink-900 [&_pre]:p-5 [&_pre]:text-sm [&_pre]:text-ink-100',
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit',
  '[&_hr]:border-ink-200',
  '[&_img]:rounded-xl',
  '[&_table]:w-full [&_table]:border-collapse [&_table]:text-sm',
  '[&_th]:border [&_th]:border-ink-200 [&_th]:bg-ink-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-ui [&_th]:font-semibold [&_th]:text-ink-900',
  '[&_td]:border [&_td]:border-ink-200 [&_td]:px-3 [&_td]:py-2',
].join(' ');

/**
 * One programme.
 *
 * The hero this replaced stretched the programme's own cover photo behind the
 * title under three stacked black scrims, and fell back to a teal gradient
 * when there was none. The cover is now shown as itself, at full width, under
 * a typographic header — and a programme without one simply opens on type.
 */
export default function CharityDetailClient({
  charity,
}: {
  charity: PublicCharityDetail;
}) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  // Prisma `Json` columns may still hold a bare legacy string; `readTranslation`
  // normalises that before it reaches React.
  const read = (value: unknown) => getTranslatedText(readTranslation(value), language);

  const title = read(charity.title);
  const description = read(charity.description);
  const fullDescription = read(charity.fullDescription);
  const impact = read(charity.impact);
  const beneficiaries = read(charity.beneficiaries);
  const location = read(charity.location);
  const cover = charity.images[0];
  const gallery = charity.images.slice(1);

  const copy =
    language === 'fr'
      ? {
          back: 'Tous les programmes',
          about: 'À propos du programme',
          started: 'Depuis',
          where: 'Lieu',
          who: 'Bénéficiaires',
          gallery: 'En images',
          ctaTitle: 'Faites la différence',
          ctaBody:
            'Votre soutien permet à ce programme de toucher davantage de familles dans nos communautés.',
          ctaButton: 'Soutenir ce programme',
        }
      : {
          back: 'All programs',
          about: 'About this program',
          started: 'Since',
          where: 'Location',
          who: 'Beneficiaries',
          gallery: 'In pictures',
          ctaTitle: 'Make a difference',
          ctaBody:
            'Your support lets this program reach more families across our communities.',
          ctaButton: 'Support this program',
        };

  const facts = [
    charity.date && {
      icon: Calendar,
      label: copy.started,
      value: formatLongDate(charity.date, language),
    },
    location && { icon: MapPin, label: copy.where, value: location },
    beneficiaries && { icon: Users, label: copy.who, value: beneficiaries },
  ].filter(Boolean) as { icon: typeof Calendar; label: string; value: string }[];

  return (
    <>
      <PageHero
        // The impact headline is optional; the section label stands in for it
        // so the hero never opens on a missing line.
        eyebrow={impact || t('navbar.charity')}
        title={title}
        lede={description || undefined}
        crumbs={[
          { label: t('navbar.home'), href: '/' },
          { label: t('navbar.charity'), href: '/charity' },
          { label: title },
        ]}
      >
        {facts.length > 0 && (
          <dl className="mt-12 grid gap-x-10 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-3">
            {facts.map((fact) => {
              const Icon = fact.icon;

              return (
                <div key={fact.label} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <Icon aria-hidden="true" className="h-4 w-4 text-leaf-300" />
                  </span>
                  <div className="min-w-0">
                    <dt className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-plum-300">
                      {fact.label}
                    </dt>
                    <dd className="mt-1.5 truncate font-ui text-sm font-medium text-white">
                      {fact.value}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        )}
      </PageHero>

      <PageSection tone="white">
        {cover && (
          <Reveal>
            <figure className="overflow-hidden rounded-2xl border border-ink-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt={title}
                className="aspect-[21/9] w-full object-cover"
              />
            </figure>
          </Reveal>
        )}

        <SectionHeading title={copy.about} className={cover ? 'mt-14 lg:mt-16' : ''} />

        <Reveal delay={80}>
          <div className={`mt-11 ${BODY_PROSE}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{fullDescription}</ReactMarkdown>
          </div>
        </Reveal>
      </PageSection>

      {gallery.length > 0 && (
        <PageSection tone="tint">
          <SectionHeading title={copy.gallery} />

          <Reveal delay={80} className="mt-11">
            <div className="overflow-hidden rounded-2xl border border-ink-200">
              <ImageSlider images={gallery} alt={title} />
            </div>
          </Reveal>
        </PageSection>
      )}

      {/* The page closes on the ask, as a painted dark band rather than a
          sidebar card — the sidebar left the CTA stranded beside a short body
          on programmes with little text. */}
      <PageSection tone="white" className="py-20 lg:py-28">
        <SectionHeading title={copy.ctaTitle} standfirst={copy.ctaBody}  />

        <Reveal delay={200}>
          <div className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/give"
              className="focus-ring group inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3 font-ui text-sm font-semibold text-plum-900 transition-colors duration-300 ease-spring hover:bg-plum-100"
            >
              {copy.ctaButton}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              href="/charity"
              className="focus-ring group inline-flex items-center gap-2 font-ui text-sm font-medium text-ink-600 transition-colors duration-300 hover:text-leaf-600"
            >
              <ArrowLeft
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:-translate-x-0.5"
              />
              {copy.back}
            </Link>
          </div>
        </Reveal>
      </PageSection>
    </>
  );
}
