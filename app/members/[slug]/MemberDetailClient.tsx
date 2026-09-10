'use client';

import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Calendar, Globe, Mail, MapPin, Phone, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MediaGallery from '@/components/MediaGallery';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

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

export default function MemberDetailClient({ member }: MemberDetailClientProps) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  const denomination = getTranslatedText(member.denomination as any, language);
  const leader = getTranslatedText(member.leader as any, language);
  const location = getTranslatedText(member.location as any, language);
  const history = getTranslatedText(member.history as any, language);

  /* Identity first, then contact — one list, since they now live in a single
     card. Anything the record does not carry is dropped rather than shown as a
     dash. */
  const details = [
    { key: 'founded', icon: Calendar, label: t('members.founded'), value: member.founded, href: null },
    { key: 'location', icon: MapPin, label: t('members.location'), value: location, href: null },
    { key: 'leadership', icon: User, label: t('members.leadership'), value: leader, href: null },
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
      <PageHero title={denomination} />

      {/* A profile, not a centred stack. The identity card holds the mark, the
          facts and every way to reach the church in one place on the left; the
          photographs and the history run down the right. Previously each of
          these sat alone in the middle of the page with a large gap under it,
          which is what made the page feel like loose parts. */}
      <PageSection tone="white">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Not sticky, and not wrapped in <Reveal>. `PageSection` carries
              `overflow-hidden` to clip its glow, which makes it the scroll box
              for any `position: sticky` descendant — the card pinned itself
              112px below the section's top straight away instead of tracking
              the scroll, leaving it misaligned with the gallery beside it. */}
          <aside className="lg:col-span-4">
            <div className="card rounded-2xl p-6 lg:p-7">
              <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-ink-200 bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.logo || '/images/logo_CEPCA.png'}
                  alt={`${denomination} logo`}
                  className="h-full w-full object-contain"
                />
              </span>

              {member.website && (
                <a
                  href={member.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-leaf-600 px-5 py-3 font-ui text-sm font-semibold text-white transition-all duration-300 ease-spring hover:bg-leaf-700 active:translate-y-px"
                >
                  <Globe aria-hidden="true" className="h-4 w-4" />
                  {t('members.visitWebsite')}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
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
                <MediaGallery
                  images={member.images}
                  alt={denomination}
                  labels={{
                    enlarge: t('home.gallery.view'),
                    close: t('home.gallery.close'),
                    previous: t('home.gallery.previous'),
                    next: t('home.gallery.next'),
                  }}
                />
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
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{history}</ReactMarkdown>
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
