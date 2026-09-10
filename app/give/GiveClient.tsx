'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  Copy,
  Church,
  HandHeart,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import { BANK_TRANSFER, MOBILE_MONEY, givingDetailsMissing } from '@/lib/giving';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import type { PublicCharityProgram } from '@/app/charity/CharityClient';

interface GiveClientProps {
  /** Published charity programs — what a gift actually funds. */
  programs: PublicCharityProgram[];
}

/**
 * Small inline copy-to-clipboard control for account numbers.
 *
 * The confirmation is a change of glyph (copy → check), not a change of
 * colour: the icon carries the site's single icon colour in both states, so
 * the feedback survives for anyone who cannot separate the two hues.
 */
function CopyValue({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied) — the value is still
      // on screen to copy by hand, so there is nothing to recover from.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label}: ${value}`}
      className="focus-ring -mx-2 inline-flex max-w-full items-center gap-2 rounded-lg px-2 py-1 text-left transition-colors duration-300 hover:bg-plum-50"
    >
      {/* Account and phone numbers are set in tabular figures so the digits
          line up column-to-column and never shift width. */}
      <span className="tnum truncate font-mono text-sm font-semibold text-ink-900">
        {value}
      </span>
      {copied ? (
        <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-leaf-600" />
      ) : (
        <Copy aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-leaf-600" />
      )}
    </button>
  );
}

export default function GiveClient({ programs }: GiveClientProps) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  const phone = t('footer.phone');
  const email = t('footer.email');
  const address = t('footer.address');

  /**
   * Nothing on this page takes a payment. `lib/giving.ts` holds the council's
   * real account details and is deliberately empty until the secretariat fills
   * it in, so today this is always true and the page offers the office's phone
   * and email instead. There is no form, no card field and no processor —
   * inventing one would be a promise the site cannot keep.
   */
  const detailsMissing = givingDetailsMissing();

  const copy =
    language === 'fr'
      ? {
          eyebrow: 'Faire un don',
          title: 'Votre générosité fait vivre la mission',
          lead: "Chaque don soutient les Églises membres du CEPCA et les communautés qu'elles servent à travers le Cameroun — éducation, santé, eau potable et accompagnement pastoral.",
          ctaWays: 'Comment donner',
          ctaTalk: 'Parler à quelqu’un',
          verse:
            '« Que chacun donne comme il l’a résolu en son cœur, sans tristesse ni contrainte ; car Dieu aime celui qui donne avec joie. »',
          verseRef: '2 Corinthiens 9.7',
          reasonsTitle: 'Pourquoi votre don compte',
          reasons: [
            {
              icon: Users,
              title: 'Des communautés servies',
              body: 'Vos dons financent des programmes concrets menés par nos Églises membres auprès des familles les plus vulnérables.',
            },
            {
              icon: Church,
              title: 'Des Églises accompagnées',
              body: 'Formations, rencontres et appui aux responsables pour renforcer la vie des communautés locales.',
            },
            {
              icon: HandHeart,
              title: 'Une gestion responsable',
              body: 'Les fonds sont administrés par le secrétariat général et rendus visibles à travers nos programmes.',
            },
          ],
          programsTitle: 'Ce que votre don finance',
          programsLead:
            'Voici les programmes actuellement soutenus par le conseil.',
          programsAll: 'Voir tous les programmes',
          waysTitle: 'Comment donner',
          waysLead:
            'Choisissez le moyen qui vous convient le mieux. Pour toute question, le secrétariat est à votre disposition.',
          bank: 'Virement bancaire',
          bankBody:
            'Pour les dons ponctuels ou réguliers, depuis le Cameroun ou depuis l’étranger.',
          momo: 'Mobile Money',
          momoBody: 'Le moyen le plus rapide de donner depuis votre téléphone.',
          inPerson: 'Sur place',
          inPersonBody:
            'Vous pouvez remettre votre don pendant le culte ou directement au secrétariat général.',
          pending: 'Coordonnées à venir',
          pendingBody:
            'Les coordonnées de don ne sont pas encore publiées en ligne. Contactez le secrétariat général et nous vous les transmettrons directement.',
          contactTitle: 'Une question sur les dons ?',
          contactBody:
            'Le secrétariat général vous répond et peut vous accompagner pour un don important ou un legs.',
          bankName: 'Banque',
          accountName: 'Titulaire',
          accountNumber: 'Numéro de compte',
          swift: 'Code SWIFT',
          provider: 'Opérateur',
          number: 'Numéro',
          thanks: 'Merci pour votre soutien',
        }
      : {
          eyebrow: 'Give',
          title: 'Your generosity keeps the mission alive',
          lead: 'Every gift supports CEPCA member churches and the communities they serve across Cameroon — education, healthcare, clean water and pastoral care.',
          ctaWays: 'Ways to give',
          ctaTalk: 'Talk to someone',
          verse:
            '"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."',
          verseRef: '2 Corinthians 9:7',
          reasonsTitle: 'Why your gift matters',
          reasons: [
            {
              icon: Users,
              title: 'Communities served',
              body: 'Your gift funds practical programs run by our member churches among the families who need them most.',
            },
            {
              icon: Church,
              title: 'Churches strengthened',
              body: 'Training, gatherings and leadership support that build up local congregations across the country.',
            },
            {
              icon: HandHeart,
              title: 'Faithful stewardship',
              body: 'Funds are administered by the general secretariat and accounted for through the programs we publish.',
            },
          ],
          programsTitle: 'What your gift funds',
          programsLead: 'These are the programs the council is supporting right now.',
          programsAll: 'See all programs',
          waysTitle: 'Ways to give',
          waysLead:
            'Choose whichever suits you best. If you have any questions, the secretariat is glad to help.',
          bank: 'Bank transfer',
          bankBody:
            'For one-off or regular gifts, from within Cameroon or from abroad.',
          momo: 'Mobile Money',
          momoBody: 'The quickest way to give straight from your phone.',
          inPerson: 'In person',
          inPersonBody:
            'You are welcome to give during a service, or at the general secretariat.',
          pending: 'Details coming soon',
          pendingBody:
            'Our giving details are not published online yet. Please contact the general secretariat and we will send them to you directly.',
          contactTitle: 'Questions about giving?',
          contactBody:
            'The general secretariat can help, including with major gifts and legacies.',
          bankName: 'Bank',
          accountName: 'Account name',
          accountNumber: 'Account number',
          swift: 'SWIFT code',
          provider: 'Provider',
          number: 'Number',
          thanks: 'Thank you for your support',
        };

  const telHref = `tel:${phone.replace(/\s/g, '')}`;

  return (
    <>
      <PageHero
        title={copy.title}
        lede={copy.lead}
      >
        {/* One obvious primary action — down to the giving details — and one
            quiet alternative for anyone who would rather speak to a person. */}
        <div className="mt-12 flex flex-col items-center gap-3 border-t border-ink-200 pt-9 sm:flex-row sm:justify-center">
          <a
            href="#ways-to-give"
            className="focus-ring group inline-flex items-center justify-center gap-2.5 rounded-full bg-leaf-600 px-7 py-3.5 font-ui text-sm font-semibold text-ink-900 transition-all duration-300 ease-spring hover:bg-leaf-500 hover:shadow-[0_18px_40px_-14px_rgba(39,113,78,0.85)] active:translate-y-px"
          >
            <HandHeart aria-hidden="true" className="h-4 w-4" />
            {copy.ctaWays}
          </a>
          <Link
            href="/contact"
            className="focus-ring inline-flex items-center justify-center gap-2.5 rounded-full border border-ink-200 bg-white px-7 py-3.5 font-ui text-sm font-semibold text-ink-900 transition-all duration-300 ease-spring hover:border-plum-400 hover:text-plum-700 active:translate-y-px"
          >
            {copy.ctaTalk}
          </Link>
        </div>
      </PageHero>

      {/* The scripture opens the page as an epigraph rather than as a boxed
          "verse card", then the three reasons follow under one hairline. */}
      <PageSection tone="white">
        <Reveal>
          <figure className="mx-auto max-w-[56ch] text-center">
            <span aria-hidden="true" className="mx-auto block h-px w-10 bg-plum-500" />
            <blockquote className="mt-7 font-display text-[clamp(1.3rem,2.6vw,1.9rem)] font-medium italic leading-snug text-ink-800 text-balance">
              {copy.verse}
            </blockquote>
            <figcaption className="mt-6 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-plum-700">
              {copy.verseRef}
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-16 border-t border-ink-200 pt-16 lg:mt-20 lg:pt-20">
          <SectionHeading title={copy.reasonsTitle} layout="stack" />

          <ul className="mt-11 grid gap-6 lg:grid-cols-3">
            {copy.reasons.map((reason, i) => {
              const Icon = reason.icon;

              return (
                <Reveal as="li" key={reason.title} delay={Math.min(i, 8) * 60}>
                  <div className="card flex h-full flex-col rounded-2xl p-7">
                    <div className="flex items-start justify-between gap-5">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white">
                        <Icon aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                      </span>
                      <span className="tnum font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ink-400">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="mt-6 font-display text-xl font-semibold leading-tight tracking-tight text-ink-900">
                      {reason.title}
                    </h3>

                    <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-ink-600 text-pretty">
                      {reason.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </PageSection>

      {/* What a gift actually funds. A painted dark band, matching the way the
          same programs are set on the landing page — and the only place on
          this page where photography appears, because it is the council's
          own. Rendered only when something is published. */}
      {programs.length > 0 && (
        <PageSection tone="dark" paint className="py-20 lg:py-28">
          <SectionHeading
            title={copy.programsTitle}
            standfirst={copy.programsLead}
            tone="dark"
          />

          <ul className="mt-11 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {programs.slice(0, 3).map((program, i) => {
              const title = getTranslatedText(program.title as any, language);
              const impact = getTranslatedText(program.impact as any, language);
              const beneficiaries = getTranslatedText(
                program.beneficiaries as any,
                language
              );
              const cover = program.images[0];

              return (
                <Reveal as="li" key={program.id} delay={Math.min(i, 8) * 60} className="h-full">
                  <Link
                    href={`/charity/${program.slug}`}
                    className="focus-ring group flex h-full flex-col"
                  >
                    <div className="relative overflow-hidden rounded-2xl">
                      <div className="aspect-[4/3] w-full">
                        {cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cover}
                            alt={title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-1000 ease-spring group-hover:scale-[1.05]"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-plum-800 to-plum-900" />
                        )}
                      </div>
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum-950/70 via-transparent to-transparent"
                      />

                      {beneficiaries && (
                        <span className="absolute bottom-4 left-4 right-4 inline-flex max-w-fit items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-medium text-ink-800">
                          <Users aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-leaf-600" />
                          <span className="truncate">{beneficiaries}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col pt-6">
                      {impact && (
                        <p className="truncate font-mono text-[0.6rem] uppercase tracking-[0.2em] text-leaf-300">
                          {impact}
                        </p>
                      )}

                      <h3 className="mt-3 line-clamp-2 font-display text-xl font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-plum-200">
                        {title}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </ul>

          <Reveal delay={160}>
            <div className="mt-11 border-t border-white/10 pt-9">
              <Link
                href="/charity"
                className="focus-ring group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-ui text-sm font-semibold text-white transition-all duration-300 ease-spring hover:border-leaf-300/40 hover:bg-white/10 active:translate-y-px"
              >
                {copy.programsAll}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </PageSection>
      )}

      {/* Ways to give — the page's working end. Deliberately plain: no
          gimmicks, no gradients and no ornament around money. */}
      <PageSection tone="tint" id="ways-to-give">
        <SectionHeading title={copy.waysTitle} standfirst={copy.waysLead} />

        {detailsMissing ? (
          /* No account details configured yet — never invent them. The dashed
             rule says "provisional" without dressing it up as an error. */
          <Reveal>
            <div className="mt-11 rounded-2xl border border-dashed border-ink-300 bg-white p-7 lg:p-9">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink-200 bg-white">
                <HandHeart aria-hidden="true" className="h-5 w-5 text-leaf-600" />
              </span>

              <h3 className="mt-6 font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900">
                {copy.pending}
              </h3>

              <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-ink-600 text-pretty">
                {copy.pendingBody}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={telHref}
                  className="focus-ring inline-flex items-center justify-center gap-2.5 rounded-full bg-leaf-600 px-6 py-3.5 font-ui text-sm font-semibold text-white transition-all duration-300 ease-spring hover:bg-leaf-500 active:translate-y-px"
                >
                  <Phone aria-hidden="true" className="h-4 w-4 shrink-0" />
                  <span className="tnum font-mono">{phone}</span>
                </a>
                <a
                  href={`mailto:${email}`}
                  className="focus-ring inline-flex min-w-0 items-center justify-center gap-2.5 rounded-full border border-ink-300 bg-white px-6 py-3.5 font-ui text-sm font-semibold text-ink-800 transition-all duration-300 ease-spring hover:border-plum-400 hover:bg-plum-50 active:translate-y-px"
                >
                  <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-leaf-600" />
                  <span className="truncate">{email}</span>
                </a>
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="mt-11 grid gap-6 lg:grid-cols-2">
            {BANK_TRANSFER && (
              <Reveal>
                <div className="card flex h-full flex-col rounded-2xl p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink-200 bg-white">
                    <Building2 aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                  </span>

                  <h3 className="mt-6 font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900">
                    {copy.bank}
                  </h3>

                  <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-ink-600 text-pretty">
                    {copy.bankBody}
                  </p>

                  <dl className="mt-7 space-y-3 border-t border-ink-200 pt-6">
                    {[
                      [copy.bankName, BANK_TRANSFER.bankName],
                      [copy.accountName, BANK_TRANSFER.accountName],
                      [copy.accountNumber, BANK_TRANSFER.accountNumber],
                      ...(BANK_TRANSFER.swift
                        ? [[copy.swift, BANK_TRANSFER.swift]]
                        : []),
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-4">
                        <dt className="shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-500">
                          {label}
                        </dt>
                        <dd className="min-w-0">
                          <CopyValue value={value} label={label} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            )}

            {MOBILE_MONEY.length > 0 && (
              <Reveal delay={60}>
                <div className="card flex h-full flex-col rounded-2xl p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink-200 bg-white">
                    <Smartphone aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                  </span>

                  <h3 className="mt-6 font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900">
                    {copy.momo}
                  </h3>

                  <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-ink-600 text-pretty">
                    {copy.momoBody}
                  </p>

                  <ul className="mt-7 space-y-5 border-t border-ink-200 pt-6">
                    {MOBILE_MONEY.map((account) => (
                      <li key={`${account.provider}-${account.number}`}>
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-500">
                          {account.provider}
                        </p>
                        <div className="mt-1.5">
                          <CopyValue value={account.number} label={copy.number} />
                        </div>
                        <p className="mt-1 text-sm text-ink-500">{account.accountName}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>
        )}

        {/* In person — always true, and needs no account details. */}
        <Reveal delay={120}>
          <div className="mt-6 flex flex-col gap-6 rounded-2xl bg-plum-950 p-8 sm:flex-row sm:items-start sm:p-10">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              <Church aria-hidden="true" className="h-5 w-5 text-leaf-300" />
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-white">
                {copy.inPerson}
              </h3>

              <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-plum-200 text-pretty">
                {copy.inPersonBody}
              </p>

              <p className="mt-5 inline-flex items-start gap-2 border-t border-white/10 pt-5 text-sm leading-relaxed text-plum-200">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-leaf-300" />
                <span>{address}</span>
              </p>
            </div>
          </div>
        </Reveal>
      </PageSection>

      {/* Who to ask. The two contact routes are the same ones offered above,
          repeated here for anyone who read to the end. */}
      <PageSection tone="white">
        <SectionHeading title={copy.contactTitle} standfirst={copy.contactBody} />

        <ul className="mt-11 grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <Reveal as="li">
            <a
              href={telHref}
              className="card card-hover focus-ring flex h-full items-center gap-4 rounded-2xl p-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white">
                <Phone aria-hidden="true" className="h-4 w-4 text-leaf-600" />
              </span>
              <span className="tnum min-w-0 truncate font-mono text-sm font-medium text-ink-900">
                {phone}
              </span>
            </a>
          </Reveal>

          <Reveal as="li" delay={60}>
            <a
              href={`mailto:${email}`}
              className="card card-hover focus-ring flex h-full items-center gap-4 rounded-2xl p-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white">
                <Mail aria-hidden="true" className="h-4 w-4 text-leaf-600" />
              </span>
              <span className="min-w-0 break-words font-ui text-sm font-medium text-ink-900">
                {email}
              </span>
            </a>
          </Reveal>
        </ul>

        <Reveal delay={120}>
          <p className="mt-16 flex items-center gap-3 border-t border-ink-200 pt-9 font-display text-lg italic text-ink-500">
            {copy.thanks}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-leaf-600" />
          </p>
        </Reveal>
      </PageSection>
    </>
  );
}
