'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Calendar, Expand, Globe, Mail, MapPin, Phone, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MarkdownLink from '@/components/MarkdownLink';
import PhotoCarousel, { PhotoViewer } from '@/components/PhotoCarousel';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { logoSrc } from '@/lib/site-settings';
import { faceAvatar } from '@/lib/cloudinary-image';

export interface PublicChurchDetail {
  id: string;
  slug: string;
  denomination: unknown;
  leader: unknown;
  location: unknown;
  history: unknown;
  images: string[];
  founded: string | null;
  logo: string | null;
  /** Portrait of the church's head; without one the name stays in the list. */
  leaderPhoto: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  website: string | null;
}

interface MemberDetailClientProps {
  member: PublicChurchDetail;
}

/* Markdown, styled on-palette. Deliberately not the global `.prose` class:
   that sheet is written in Tailwind default greys and a blue link colour, and
   this page has three ramps. */
const PROSE =
  'max-w-[68ch] text-base leading-relaxed text-ink-600 text-pretty ' +
  '[&_p]:mt-5 [&>p:first-child]:mt-0 ' +
  '[&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink-900 ' +
  '[&_h3]:mt-9 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-ink-900 ' +
  '[&_h4]:mt-8 [&_h4]:font-ui [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-ink-900 ' +
  '[&_strong]:font-semibold [&_strong]:text-ink-900 ' +
  '[&_a]:font-medium [&_a]:text-plum-700 [&_a]:underline [&_a]:underline-offset-4 ' +
  '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-2 ' +
  '[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-plum-300 [&_blockquote]:pl-5 [&_blockquote]:text-ink-700 ' +
  '[&_hr]:mt-8 [&_hr]:border-ink-200';

/**
 * The head's line is written « name, title » (« Rév. DEBSIA DABAH Alvius,
 * président national »). The title becomes the label above the name — so a
 * president reads PRESIDENT, a moderator MODERATOR — and a line with no title
 * (a caretaker committee) keeps the generic label.
 */
function splitLeader(line: string): { name: string; title: string } {
  const cut = line.lastIndexOf(', ');
  if (cut === -1) return { name: line, title: '' };
  return { name: line.slice(0, cut).trim(), title: line.slice(cut + 2).trim() };
}

export default function MemberDetailClient({ member }: MemberDetailClientProps) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);
  const councilLogo = logoSrc(useSiteSettings());
  const [portraitOpen, setPortraitOpen] = useState(false);

  const denomination = getTranslatedText(member.denomination as any, language);
  const leader = getTranslatedText(member.leader as any, language);
  const head = splitLeader(leader);
  const headLabel = head.title || t('members.leadership');
  const location = getTranslatedText(member.location as any, language);
  const history = getTranslatedText(member.history as any, language);

  /* Identity first, then contact — one list, since they now live in a single
     card. Anything the record does not carry is dropped rather than shown as a
     dash. */
  const details = [
    { key: 'founded', icon: Calendar, label: t('members.founded'), value: member.founded, href: null },
    { key: 'location', icon: MapPin, label: t('members.location'), value: location, href: null },
    // With a portrait, the head gets a block of their own above this list.
    {
      key: 'leadership',
      icon: User,
      label: headLabel,
      value: member.leaderPhoto ? '' : head.name,
      href: null,
    },
    {
      key: 'phone',
      icon: Phone,
      label: t('members.phone'),
      value: member.phone,
      href: member.phone ? `tel:${member.phone.replace(/\s+/g, '')}` : null,
    },
    {
      key: 'email',
      icon: Mail,
      label: t('members.email'),
      value: member.email,
      href: member.email ? `mailto:${member.email}` : null,
    },
    { key: 'address', icon: MapPin, label: t('members.address'), value: member.address, href: null },
    {
      key: 'website',
      icon: Globe,
      label: t('members.website'),
      value: member.website,
      href: member.website,
    },
  ].filter((item) => Boolean(item.value));

  return (
    <>
      <PageHero
        title={denomination}
        mark={
          <span className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white p-4 shadow-[0_0_0_10px_rgb(91_50_166/0.05),0_0_0_22px_rgb(91_50_166/0.03),0_20px_40px_-20px_rgb(45_27_90/0.5)] ring-1 ring-ink-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={member.logo || councilLogo} alt={t('members.logoAlt', { name: denomination })} className="h-full w-full object-contain" />
          </span>
        }
      />

      {/* A profile, not a centred stack. The identity card holds the mark, the
          facts and every way to reach the church in one place on the left; the
          photographs and the history run down the right. Previously each of
          these sat alone in the middle of the page with a large gap under it,
          which is what made the page feel like loose parts. */}
      <PageSection tone="white">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* The identity card follows the reader down the page on wide
              screens. Possible since PageSection clips with overflow-x: clip,
              which — unlike overflow: hidden — does not capture sticky. Not
              wrapped in <Reveal>: a transform would break the sticky. */}
          <aside className="lg:col-span-4">
            <div className="card rounded-2xl p-6 lg:sticky lg:top-28 lg:p-7 [&>div:first-child]:mt-0 [&>div:first-child]:border-t-0 [&>div:first-child]:pt-0 [&>dl:first-child]:mt-0 [&>dl:first-child]:border-t-0 [&>dl:first-child]:pt-0">
              {member.website && (
                <a
                  href={member.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring group flex w-full items-center justify-center gap-2 rounded-full bg-leaf-600 px-5 py-3 font-ui text-sm font-semibold text-white transition-all duration-300 ease-spring hover:bg-leaf-700 active:translate-y-px"
                >
                  <Globe aria-hidden="true" className="h-4 w-4" />
                  {t('members.visitWebsite')}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}

              {member.leaderPhoto && leader && (
                <div className="mt-7 flex items-center gap-4 border-t border-ink-200 pt-6">
                  {/* The portrait opens whole, uncropped, in the gallery's viewer. */}
                  <button
                    type="button"
                    onClick={() => setPortraitOpen(true)}
                    aria-label={t('members.viewPortrait', { name: head.name })}
                    className="focus-ring group/portrait relative h-20 w-20 shrink-0 cursor-zoom-in rounded-full"
                  >
                    <Image
                      src={faceAvatar(member.leaderPhoto)}
                      alt=""
                      width={160}
                      height={160}
                      className="h-20 w-20 rounded-full border border-ink-200 object-cover object-top transition-transform duration-500 ease-spring group-hover/portrait:scale-[1.04]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-leaf-600 text-white transition-transform duration-300 ease-spring group-hover/portrait:scale-110"
                    >
                      <Expand className="h-3 w-3" />
                    </span>
                  </button>
                  <div className="min-w-0">
                    <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-plum-700">{headLabel}</p>
                    <p className="mt-1 font-display text-base font-semibold leading-snug tracking-tight text-ink-900 text-pretty">
                      {head.name}
                    </p>
                  </div>
                  {portraitOpen && (
                    <PhotoViewer
                      images={[member.leaderPhoto]}
                      alt={`${head.name}${head.title ? `, ${head.title}` : ''}`}
                      start={0}
                      onClose={() => setPortraitOpen(false)}
                    />
                  )}
                </div>
              )}

              {details.length > 0 && (
                <dl className="mt-7 space-y-5 border-t border-ink-200 pt-6">
                  {details.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.key} className="flex items-start gap-3">
                        <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
                        <div className="min-w-0">
                          <dt className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ink-400">
                            {item.label}
                          </dt>
                          {item.href ? (
                            <dd>
                              <a
                                href={item.href}
                                className="focus-ring mt-1 block break-words rounded text-sm leading-relaxed text-ink-800 underline-offset-4 transition-colors duration-300 hover:text-plum-700 hover:underline"
                              >
                                {item.value}
                              </a>
                            </dd>
                          ) : (
                            <dd className="mt-1 break-words text-sm leading-relaxed text-ink-800">
                              {item.value}
                            </dd>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </dl>
              )}
            </div>
          </aside>

          <div className="lg:col-span-8">
            {member.images.length > 0 && (
              <Reveal className="mb-10 lg:mb-12">
                <PhotoCarousel images={member.images} alt={denomination} />
              </Reveal>
            )}

            {history && (
              <>
                <Reveal>
                  <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight tracking-tight text-ink-900">
                    {t('members.history')}
                  </h2>
                </Reveal>
                <Reveal delay={80}>
                  <div className={`mt-6 ${PROSE}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: MarkdownLink }}>{history}</ReactMarkdown>
                  </div>
                </Reveal>
              </>
            )}
          </div>
        </div>
      </PageSection>
    </>
  );
}
