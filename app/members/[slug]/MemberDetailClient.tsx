'use client';

import { useTranslation } from 'react-i18next';
import { Calendar, Mail, MapPin, Phone, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ImageSlider from './ImageSlider';
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

  /* The profile's identifying facts, as a definition list rather than a row of
     coloured chips. Anything the record does not carry is simply dropped. */
  const facts = [
    { key: 'founded', icon: Calendar, label: t('members.founded'), value: member.founded },
    { key: 'location', icon: MapPin, label: t('members.location'), value: location },
    { key: 'leadership', icon: User, label: t('members.leadership'), value: leader },
  ].filter((fact) => Boolean(fact.value));

  const contact = [
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
  ];

  return (
    <>
      <PageHero
        eyebrow={t('members.memberChurches')}
        title={denomination}
        crumbs={[
          { label: t('navbar.home'), href: '/' },
          { label: t('members.memberChurches'), href: '/members' },
          { label: denomination },
        ]}
      >
        {/* Identity rail: the church's own mark on a light tile — contained,
            never cropped — beside the facts that place it. */}
        <div className="mt-14 flex flex-col gap-9 border-t border-white/10 pt-10 lg:flex-row lg:items-start lg:gap-14">
          <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.logo || '/images/logo_CEPCA.png'}
              alt={`${denomination} logo`}
              className="h-full w-full object-contain"
            />
          </span>

          {facts.length > 0 && (
            <dl className="grid flex-1 gap-x-10 gap-y-7 sm:grid-cols-3">
              {facts.map((fact) => {
                const Icon = fact.icon;

                return (
                  <div key={fact.key}>
                    <dt className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-leaf-300">
                      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                      {fact.label}
                    </dt>
                    <dd className="mt-3 text-base leading-relaxed text-white">{fact.value}</dd>
                  </div>
                );
              })}
            </dl>
          )}
        </div>
      </PageHero>

      <PageSection tone="white">
        {member.images.length > 0 && (
          <Reveal className="mb-16 lg:mb-20">
            <figure className="group overflow-hidden rounded-2xl border border-ink-200">
              <ImageSlider images={member.images} alt={denomination} />
            </figure>
          </Reveal>
        )}

        <SectionHeading title={t('members.history')} />

        <Reveal delay={140}>
          <div className={`mt-11 ${PROSE}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{history}</ReactMarkdown>
          </div>
        </Reveal>
      </PageSection>

      <PageSection tone="tint">
        <SectionHeading title={t('members.contactInformation')} />

        <ul className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {contact.map((item, i) => {
            const Icon = item.icon;

            return (
              <Reveal as="li" key={item.key} delay={Math.min(i, 8) * 60}>
                <div className="card flex h-full items-start gap-4 rounded-2xl p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white">
                    <Icon aria-hidden="true" className="h-4 w-4 text-leaf-600" />
                  </span>

                  <div className="min-w-0">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-500">
                      {item.label}
                    </p>
                    {item.value && item.href ? (
                      <a
                        href={item.href}
                        className="focus-ring mt-2.5 block break-words rounded text-base leading-relaxed text-ink-800 underline-offset-4 transition-colors duration-300 hover:text-plum-700 hover:underline"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-2.5 break-words text-base leading-relaxed text-ink-800">
                        {item.value || '—'}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </PageSection>
    </>
  );
}
