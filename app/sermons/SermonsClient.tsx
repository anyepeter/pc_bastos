'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AudioLines,
  Calendar,
  Clock,
  Download,
  Loader2,
  MapPin,
  Mic,
  Play,
  X,
} from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import Reveal from '@/components/Reveal';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText, readTranslation } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';

export interface PublicSermon {
  id: string;
  title: unknown;
  description: unknown;
  location: unknown;
  date: string;
  duration: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
  thumbnail: string | null;
}

/** The sermon whose video is open in the overlay. The title labels the dialog. */
interface ActiveVideo {
  url: string;
  title: string;
}

/**
 * The sermon archive: a media library rather than a photo grid.
 *
 * Every row is one recording — a media tile carrying the play affordance, the
 * title, and the metadata (date, place, running time) set in mono so it reads
 * as data rather than prose. Sermons carry no photography of their own more
 * often than not, so the tile falls back to a painted plum panel instead of the
 * Unsplash stock this page used to hardcode.
 */
export default function SermonsClient({ sermons }: { sermons: PublicSermon[] }) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<string | null>(null);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const listenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hold the page behind the overlay, move focus onto the one control inside
  // it, and let Escape dismiss it — the overlay is the only modal on the page.
  useEffect(() => {
    if (!activeVideo) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveVideo(null);
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeVideo]);

  useEffect(
    () => () => {
      if (listenTimer.current) clearTimeout(listenTimer.current);
    },
    [],
  );

  const handleListenClick = (sermonId: string) => {
    setLoadingAudio(sermonId);
    if (listenTimer.current) clearTimeout(listenTimer.current);
    listenTimer.current = setTimeout(() => {
      setLoadingAudio(null);
      setActivePlayerId(sermonId);
    }, 1500);
  };

  const listenLabel = language === 'fr' ? 'Écouter' : 'Listen';
  const loadingLabel = language === 'fr' ? 'Chargement...' : 'Loading...';
  const downloadLabel = language === 'fr' ? 'Télécharger' : 'Download';
  const playVideoLabel = language === 'fr' ? 'Lire la vidéo' : 'Play video';
  const closeLabel = language === 'fr' ? 'Fermer' : 'Close';

  return (
    <>
      <PageHero
        eyebrow={t('sermons.listen')}
        title={language === 'fr' ? 'Prédications' : 'Sermons'}
        lede={
          language === 'fr'
            ? 'Des messages inspirants de nos responsables spirituels dans les Églises membres'
            : 'Inspiring messages from our spiritual leaders across member churches'
        }
        crumbs={[
          { label: t('navbar.home'), href: '/' },
          { label: t('navbar.sermons') },
        ]}
      />

      {/* The archive. No section heading: the hero already names the page, and
          repeating it above the first row reads as a mistake. */}
      <PageSection tone="tint">
        {sermons.length === 0 ? (
          <Reveal>
            <div className="card mx-auto max-w-xl rounded-2xl px-8 py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-ink-200 bg-white">
                <Mic aria-hidden="true" className="h-6 w-6 text-leaf-600" />
              </span>
              <p className="mx-auto mt-7 max-w-[36ch] text-base leading-relaxed text-ink-600 text-pretty">
                {language === 'fr'
                  ? 'Aucune prédication publiée pour le moment.'
                  : 'No sermons have been published yet.'}
              </p>
            </div>
          </Reveal>
        ) : (
          <ul className="grid gap-5">
            {sermons.map((sermon, index) => {
              const title = getTranslatedText(readTranslation(sermon.title), language);
              const description = getTranslatedText(readTranslation(sermon.description), language);
              const location = getTranslatedText(readTranslation(sermon.location), language);

              // Read into consts so the narrowing survives into the handlers.
              const { videoUrl, audioUrl, thumbnail } = sermon;
              const titleId = `sermon-${sermon.id}-title`;

              const isPlaying = activePlayerId === sermon.id;
              const isLoading = loadingAudio === sermon.id;

              // The tile is the primary play affordance: video where there is
              // one, otherwise the audio. It goes inert once audio is running,
              // since the transport below has taken over.
              let tileAction: { onClick: () => void; label: string } | null = null;
              if (videoUrl) {
                tileAction = {
                  onClick: () => setActiveVideo({ url: videoUrl, title }),
                  label: playVideoLabel,
                };
              } else if (audioUrl && !isPlaying) {
                tileAction = {
                  onClick: () => handleListenClick(sermon.id),
                  label: listenLabel,
                };
              }

              const tileClass =
                'group relative aspect-video w-full overflow-hidden rounded-xl bg-plum-950';

              const tileBody = (
                <>
                  {thumbnail ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbnail}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-105"
                      />
                      <span aria-hidden="true" className="absolute inset-0 bg-plum-950/40" />
                    </>
                  ) : (
                    <span aria-hidden="true" className="grain absolute inset-0 bg-plum-950" />
                  )}

                  {tileAction ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white ring-1 ring-plum-950/10 transition-transform duration-300 ease-spring group-hover:scale-110">
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin text-leaf-600" />
                        ) : (
                          <Play fill="currentColor" className="ml-0.5 h-5 w-5 text-leaf-600" />
                        )}
                      </span>
                    </span>
                  ) : (
                    !thumbnail && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <AudioLines className="h-7 w-7 text-leaf-300" />
                      </span>
                    )
                  )}
                </>
              );

              return (
                <Reveal as="li" key={sermon.id} delay={Math.min(index, 8) * 60}>
                  <article className="card rounded-2xl p-4 sm:p-5 lg:p-6">
                    <div className="grid gap-5 sm:grid-cols-12 sm:gap-6 lg:gap-8">
                      <div className="sm:col-span-5 lg:col-span-4 xl:col-span-3">
                        {tileAction ? (
                          <button
                            type="button"
                            onClick={tileAction.onClick}
                            aria-label={tileAction.label}
                            aria-describedby={titleId}
                            className={`focus-ring ${tileClass}`}
                          >
                            {tileBody}
                          </button>
                        ) : (
                          <div className={tileClass}>{tileBody}</div>
                        )}
                      </div>

                      <div className="min-w-0 sm:col-span-7 lg:col-span-8 xl:col-span-9">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-400">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span aria-hidden="true" className="h-px flex-1 bg-ink-200" />
                        </div>

                        <h2
                          id={titleId}
                          className="mt-4 font-display text-xl font-semibold leading-tight tracking-tight text-ink-900 text-balance lg:text-2xl"
                        >
                          {title}
                        </h2>

                        {description && (
                          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-600 text-pretty">
                            {description}
                          </p>
                        )}

                        <ul className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-500">
                          <li className="flex items-center gap-2">
                            <Calendar aria-hidden="true" className="h-3.5 w-3.5 text-leaf-600" />
                            {formatLongDate(sermon.date, language)}
                          </li>
                          {location && (
                            <li className="flex items-center gap-2">
                              <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-leaf-600" />
                              {location}
                            </li>
                          )}
                          {sermon.duration && (
                            <li className="flex items-center gap-2">
                              <Clock aria-hidden="true" className="h-3.5 w-3.5 text-leaf-600" />
                              {sermon.duration}
                            </li>
                          )}
                        </ul>

                        {audioUrl && (
                          <div className="mt-6 flex flex-wrap items-center gap-3">
                            {isPlaying ? (
                              <div className="min-w-0 flex-1">
                                <AudioPlayer src={audioUrl} />
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleListenClick(sermon.id)}
                                disabled={isLoading}
                                aria-busy={isLoading}
                                aria-describedby={titleId}
                                className="focus-ring inline-flex items-center gap-2 rounded-full bg-plum-700 px-5 py-2.5 font-ui text-sm font-medium text-white transition-colors duration-300 hover:bg-plum-800 disabled:cursor-wait disabled:opacity-70"
                              >
                                {isLoading ? (
                                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Play
                                    aria-hidden="true"
                                    fill="currentColor"
                                    className="h-4 w-4"
                                  />
                                )}
                                {isLoading ? loadingLabel : listenLabel}
                              </button>
                            )}

                            <a
                              href={audioUrl}
                              download
                              aria-label={downloadLabel}
                              aria-describedby={titleId}
                              className="focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink-200 bg-white text-leaf-600 transition-colors duration-300 hover:border-leaf-300"
                            >
                              <Download aria-hidden="true" className="h-4 w-4" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        )}
      </PageSection>

      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveVideo(null);
          }}
          className="fixed inset-0 z-overlay flex items-center justify-center bg-plum-950/90 p-4 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-plum-950 ring-1 ring-white/10">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setActiveVideo(null)}
              aria-label={closeLabel}
              className="focus-ring absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-leaf-300 backdrop-blur transition-colors duration-300 hover:bg-white/10"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>

            <video
              src={activeVideo.url}
              controls
              autoPlay
              className="h-auto max-h-[80vh] w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
