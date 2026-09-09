'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Bell, Calendar, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { Language, getTranslatedText } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import Reveal from '@/components/Reveal';

export interface PublicAnnouncement {
  id: string;
  title: unknown;
  description: unknown;
  fullContent: unknown;
  date: string;
  priority: string;
  imageUrl: string | null;
}

/** Relative age of an announcement, in the reader's language. */
function timeAgo(dateString: string, language: Language): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  const days = Math.max(
    1,
    Math.ceil(Math.abs(Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
  );

  if (language === 'fr') {
    if (days === 1) return 'il y a 1 jour';
    if (days < 7) return `il y a ${days} jours`;
    if (days < 30) return `il y a ${Math.floor(days / 7)} semaines`;
    return `il y a ${Math.floor(days / 30)} mois`;
  }

  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

const PRIORITY_LABELS: Record<string, { en: string; fr: string }> = {
  high: { en: 'Important', fr: 'Important' },
  medium: { en: 'Update', fr: 'Mise à jour' },
  low: { en: 'Notice', fr: 'Information' },
};

/**
 * Priority is emphasis, not a colour code. The page this replaced gave every
 * level its own chip — red / amber / grey — which read as an alert system
 * rather than a notice board. Here only the urgent level takes the accent;
 * everything else is set in the neutral, and the weight of the title does the
 * rest of the work.
 */
const urgentTone = { dot: 'bg-plum-600', text: 'text-plum-700' };
const quietTone = { dot: 'bg-ink-300', text: 'text-ink-500' };

export default function AnnouncementsClient({
  announcements,
}: {
  announcements: PublicAnnouncement[];
}) {
  const [selected, setSelected] = useState<PublicAnnouncement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  // One effect for the whole open state: lock the page behind the dialog,
  // close on Escape, and put the keyboard where the reader expects it.
  useEffect(() => {
    if (!selected) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [selected]);

  // Legacy rows can hold a bare string where a { en, fr } object is expected;
  // getTranslatedText reads both, so nothing can reach React as an object.
  const read = (value: unknown) => getTranslatedText(value as any, language);

  const labelFor = (priority: string) =>
    (PRIORITY_LABELS[priority] || PRIORITY_LABELS.medium)[language];

  const toneFor = (priority: string) => (priority === 'high' ? urgentTone : quietTone);

  // Ordered by date descending on the server: the head of the list is the
  // most recent notice and gets the board's top slot.
  const [lead, ...rest] = announcements;

  const priorityMark = (announcement: PublicAnnouncement) => {
    const tone = toneFor(announcement.priority);

    return (
      <span
        className={`inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] ${tone.text}`}
      >
        <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
        {labelFor(announcement.priority)}
      </span>
    );
  };

  return (
    <>
      <PageHero
        eyebrow={t('home.sections.announcements')}
        title={language === 'fr' ? 'Annonces' : 'Announcements'}
        lede={
          language === 'fr'
            ? 'Informations et nouvelles importantes du Conseil des Églises Protestantes'
            : 'Important updates and news from the Council of Protestant Churches'
        }
        crumbs={[
          { label: t('navbar.home'), href: '/' },
          { label: t('navbar.announcements') },
        ]}
      />

      {announcements.length === 0 ? (
        /* A board with nothing pinned to it still has to look deliberate. */
        <PageSection tone="white">
          <Reveal>
            <div className="card mx-auto flex max-w-[44ch] flex-col items-center rounded-2xl px-8 py-16 text-center lg:py-20">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-ink-200 bg-white">
                <Bell aria-hidden="true" className="h-6 w-6 text-leaf-600" />
              </span>
              <p className="mt-8 font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900 text-balance">
                {language === 'fr'
                  ? "Aucune annonce pour l'instant."
                  : 'No announcements yet.'}
              </p>
            </div>
          </Reveal>
        </PageSection>
      ) : (
        <>
          {/* The latest notice, set at the head of the board. */}
          <PageSection tone="white">
            <Reveal>
              <article className="group relative grid gap-x-12 gap-y-8 lg:grid-cols-12 lg:items-start">
                {lead.imageUrl && (
                  <div className="overflow-hidden rounded-2xl border border-ink-200 bg-ink-50 lg:col-span-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={lead.imageUrl}
                      alt=""
                      aria-hidden="true"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.03]"
                    />
                  </div>
                )}

                <div className={lead.imageUrl ? 'lg:col-span-6 lg:col-start-7' : 'lg:col-span-9'}>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <p className="tnum font-mono text-sm tracking-[0.08em] text-ink-900">
                      {formatLongDate(lead.date, language)}
                    </p>
                    <span aria-hidden="true" className="h-px w-6 bg-ink-300" />
                    {priorityMark(lead)}
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-400">
                      {timeAgo(lead.date, language)}
                    </span>
                  </div>

                  <h2 className="mt-6 font-display text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold leading-[1.08] tracking-tight text-ink-900 text-balance">
                    {/* The button carries the accessible name and stretches over
                        the whole entry, so the notice is one click target
                        without nesting flow content inside a <button>. */}
                    <button
                      type="button"
                      onClick={() => setSelected(lead)}
                      className="focus-ring text-left transition-colors duration-300 after:absolute after:inset-0 after:z-10 after:content-[''] group-hover:text-plum-700"
                    >
                      {read(lead.title)}
                    </button>
                  </h2>

                  <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-ink-600 text-pretty">
                    {read(lead.description)}
                  </p>

                  <span className="mt-7 inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white transition-colors duration-300 group-hover:border-plum-300">
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-5 w-5 text-ink-400 transition-all duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-plum-600"
                    />
                  </span>
                </div>
              </article>
            </Reveal>
          </PageSection>

          {/* Everything earlier, as a ruled register: date at the left margin,
              notice in the middle, one hairline per entry. */}
          {rest.length > 0 && (
            <PageSection tone="tint">
              <ul className="border-t border-ink-200">
                {rest.map((announcement, i) => (
                  <Reveal as="li" key={announcement.id} delay={Math.min(i, 8) * 60}>
                    <article className="group relative grid gap-x-10 gap-y-4 border-b border-ink-200 py-8 transition-colors duration-300 hover:bg-white lg:grid-cols-12 lg:py-10">
                      <div className="lg:col-span-3">
                        <p className="tnum font-mono text-sm tracking-[0.08em] text-ink-900">
                          {formatLongDate(announcement.date, language)}
                        </p>
                        <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-400">
                          {timeAgo(announcement.date, language)}
                        </p>
                        <p className="mt-4">{priorityMark(announcement)}</p>
                      </div>

                      <div className="lg:col-span-6">
                        <h2
                          className={`font-display font-semibold leading-snug tracking-tight text-ink-900 ${
                            announcement.priority === 'high'
                              ? 'text-2xl lg:text-[1.7rem]'
                              : 'text-xl lg:text-2xl'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setSelected(announcement)}
                            className="focus-ring text-left transition-colors duration-300 after:absolute after:inset-0 after:z-10 after:content-[''] group-hover:text-plum-700"
                          >
                            {read(announcement.title)}
                          </button>
                        </h2>

                        <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-ink-600 text-pretty">
                          {read(announcement.description)}
                        </p>
                      </div>

                      <div
                        className={`hidden items-start gap-5 lg:col-span-3 lg:flex lg:justify-end ${announcement.imageUrl ? 'sm:flex' : ''}`}
                      >
                        {announcement.imageUrl && (
                          <span className="h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-ink-200 bg-white">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={announcement.imageUrl}
                              alt=""
                              aria-hidden="true"
                              className="h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-105"
                            />
                          </span>
                        )}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="mt-1 hidden h-5 w-5 shrink-0 text-ink-400 transition-all duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-plum-600 lg:block"
                        />
                      </div>
                    </article>
                  </Reveal>
                ))}
              </ul>
            </PageSection>
          )}
        </>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* The backdrop is a real button so dismissing by click needs no
              handler on a non-interactive element; the labelled close control
              below is the one screen readers are offered. */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setSelected(null)}
            className="absolute inset-0 h-full w-full cursor-default bg-plum-950/[0.85] backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="announcement-dialog-title"
            className="panel relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl"
          >
            {selected.imageUrl && (
              <div className="shrink-0 border-b border-ink-200 bg-ink-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="h-52 w-full object-cover sm:h-64"
                />
              </div>
            )}

            <button
              ref={closeRef}
              type="button"
              onClick={() => setSelected(null)}
              aria-label={t('home.gallery.close')}
              className="focus-ring absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 transition-colors duration-300 hover:border-plum-300 hover:text-plum-700"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>

            <div className="overflow-y-auto p-7 sm:p-9">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pr-12 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-500">
                <span className="inline-flex items-center gap-2">
                  <Bell aria-hidden="true" className="h-3.5 w-3.5 text-leaf-600" />
                  {language === 'fr' ? 'Annonce' : 'Announcement'}
                </span>
                <span aria-hidden="true" className="h-px w-5 bg-ink-300" />
                <span className="tnum inline-flex items-center gap-2">
                  <Calendar aria-hidden="true" className="h-3.5 w-3.5 text-leaf-600" />
                  {formatLongDate(selected.date, language)}
                </span>
                <span aria-hidden="true" className="h-px w-5 bg-ink-300" />
                {priorityMark(selected)}
              </div>

              <h2
                id="announcement-dialog-title"
                className="mt-6 font-display text-[clamp(1.6rem,3vw,2.15rem)] font-semibold leading-tight tracking-tight text-ink-900 text-balance"
              >
                {read(selected.title)}
              </h2>

              <div className="prose mt-7 max-w-none text-ink-700 [&_a:hover]:text-plum-800 [&_a]:text-plum-700 [&_h1]:font-display [&_h1]:text-ink-900 [&_h2]:font-display [&_h2]:text-ink-900 [&_h3]:font-display [&_h3]:text-ink-900 [&_li]:text-ink-700 [&_p]:text-ink-700 [&_strong]:text-ink-900">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {read(selected.fullContent)}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
