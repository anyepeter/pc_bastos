'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Check,
  Copy,
  Church,
  HandHeart,
  Heart,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  Sparkles,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import { BANK_TRANSFER, MOBILE_MONEY, givingDetailsMissing } from '@/lib/giving';
import type { PublicCharityProgram } from '@/app/charity/CharityClient';

interface GiveClientProps {
  /** Published charity programs — what a gift actually funds. */
  programs: PublicCharityProgram[];
}

/** Small inline copy-to-clipboard control for account numbers. */
function CopyValue({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
      className="group inline-flex max-w-full items-center gap-2 rounded-lg px-2 py-1 -mx-2 text-left transition-colors hover:bg-emerald-50"
    >
      <span className="truncate font-mono text-sm font-semibold text-gray-900">
        {value}
      </span>
      {copied ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
      ) : (
        <Copy className="h-3.5 w-3.5 shrink-0 text-gray-400 transition-colors group-hover:text-emerald-600" />
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

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      {/* Hero */}
      <section className="relative overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1920&h=900&fit=crop&auto=format")',
          }}
        />
        <div className="absolute inset-0" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 md:pb-28 md:pt-36 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100 backdrop-blur-sm">
              <Heart className="h-3.5 w-3.5" />
              {copy.eyebrow}
            </span>

            <h1 className="mt-6 font-playfair text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
              {copy.title}
            </h1>

            <p className="mt-6 max-w-2xl font-inter text-lg leading-relaxed text-gray-200 sm:text-xl">
              {copy.lead}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#ways-to-give"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-emerald-900/30 transition-all duration-300 hover:bg-emerald-400 hover:shadow-xl"
              >
                <HandHeart className="h-5 w-5" />
                {copy.ctaWays}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              >
                {copy.ctaTalk}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Verse */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <Sparkles className="mx-auto h-5 w-5 text-emerald-500" />
          <blockquote className="mt-4 font-playfair text-xl italic leading-relaxed text-gray-800 sm:text-2xl">
            {copy.verse}
          </blockquote>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
            {copy.verseRef}
          </p>
        </div>
      </section>

      {/* Why give */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <h2 className="text-center font-playfair text-3xl font-bold text-gray-900 sm:text-4xl">
          {copy.reasonsTitle}
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {copy.reasons.map((reason) => (
            <div
              key={reason.title}
              className="rounded-3xl bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-gray-900/5 transition-shadow duration-300 hover:shadow-lg"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                <reason.icon className="h-6 w-6 text-emerald-600" />
              </span>
              <h3 className="mt-5 font-playfair text-xl font-bold text-gray-900">
                {reason.title}
              </h3>
              <p className="mt-2 font-inter leading-relaxed text-gray-600">
                {reason.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What your gift funds — only when programs are published */}
      {programs.length > 0 && (
        <section className="border-y border-gray-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-playfair text-3xl font-bold text-gray-900 sm:text-4xl">
                  {copy.programsTitle}
                </h2>
                <p className="mt-3 max-w-2xl font-inter text-gray-600">
                  {copy.programsLead}
                </p>
              </div>
              <Link
                href="/charity"
                className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                {copy.programsAll}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.slice(0, 3).map((program) => {
                const title = getTranslatedText(program.title as any, language);
                const impact = getTranslatedText(program.impact as any, language);
                const beneficiaries = getTranslatedText(
                  program.beneficiaries as any,
                  language
                );
                const cover = program.images[0];

                return (
                  <Link
                    key={program.id}
                    href={`/charity/${program.slug}`}
                    className="group overflow-hidden rounded-3xl bg-[#fbfbfa] ring-1 ring-gray-900/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt={title}
                          className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-emerald-500 to-teal-500" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                      {beneficiaries && (
                        <span className="absolute bottom-3 left-3 right-3 inline-flex max-w-fit items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-gray-800">
                          <Users className="h-3 w-3 shrink-0 text-emerald-600" />
                          <span className="truncate">{beneficiaries}</span>
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      {impact && (
                        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
                          {impact}
                        </p>
                      )}
                      <h3 className="mt-1.5 line-clamp-2 font-playfair text-lg font-bold text-gray-900 group-hover:text-emerald-700">
                        {title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Ways to give */}
      <section id="ways-to-give" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-playfair text-3xl font-bold text-gray-900 sm:text-4xl">
              {copy.waysTitle}
            </h2>
            <p className="mt-3 font-inter text-gray-600">{copy.waysLead}</p>
          </div>

          {detailsMissing ? (
            /* No account details configured yet — never invent them. */
            <div className="mt-10 rounded-3xl border border-dashed border-emerald-300 bg-emerald-50/60 p-8 sm:p-10">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white ring-1 ring-emerald-100">
                <HandHeart className="h-6 w-6 text-emerald-600" />
              </span>
              <h3 className="mt-5 font-playfair text-2xl font-bold text-gray-900">
                {copy.pending}
              </h3>
              <p className="mt-3 max-w-2xl font-inter leading-relaxed text-gray-700">
                {copy.pendingBody}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex min-w-0 items-center justify-center gap-2 rounded-full border border-emerald-300 bg-white px-6 py-3 font-semibold text-emerald-800 transition-colors hover:bg-emerald-50"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{email}</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {BANK_TRANSFER && (
                <div className="rounded-3xl bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-gray-900/5">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                    <Building2 className="h-6 w-6 text-emerald-600" />
                  </span>
                  <h3 className="mt-5 font-playfair text-2xl font-bold text-gray-900">
                    {copy.bank}
                  </h3>
                  <p className="mt-2 font-inter text-gray-600">{copy.bankBody}</p>

                  <dl className="mt-6 space-y-3 border-t border-gray-100 pt-5">
                    {[
                      [copy.bankName, BANK_TRANSFER.bankName],
                      [copy.accountName, BANK_TRANSFER.accountName],
                      [copy.accountNumber, BANK_TRANSFER.accountNumber],
                      ...(BANK_TRANSFER.swift
                        ? [[copy.swift, BANK_TRANSFER.swift]]
                        : []),
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-4"
                      >
                        <dt className="shrink-0 text-sm text-gray-500">{label}</dt>
                        <dd className="min-w-0">
                          <CopyValue value={value} label={label} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {MOBILE_MONEY.length > 0 && (
                <div className="rounded-3xl bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-gray-900/5">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-100">
                    <Smartphone className="h-6 w-6 text-amber-600" />
                  </span>
                  <h3 className="mt-5 font-playfair text-2xl font-bold text-gray-900">
                    {copy.momo}
                  </h3>
                  <p className="mt-2 font-inter text-gray-600">{copy.momoBody}</p>

                  <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
                    {MOBILE_MONEY.map((account) => (
                      <div key={`${account.provider}-${account.number}`}>
                        <p className="text-sm font-semibold text-gray-900">
                          {account.provider}
                        </p>
                        <CopyValue value={account.number} label={copy.number} />
                        <p className="text-xs text-gray-500">{account.accountName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* In person — always true, needs no account details */}
          <div className="mt-6 flex flex-col gap-5 rounded-3xl bg-gradient-to-br from-purple-900 to-indigo-900 p-8 text-white sm:flex-row sm:items-center sm:p-10">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <Church className="h-6 w-6 text-purple-100" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-playfair text-2xl font-bold">{copy.inPerson}</h3>
              <p className="mt-2 font-inter text-purple-100">{copy.inPersonBody}</p>
              <p className="mt-3 inline-flex items-start gap-2 text-sm text-purple-200">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{address}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="flex flex-col gap-8 rounded-3xl bg-[#fbfbfa] p-8 ring-1 ring-gray-900/5 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-playfair text-2xl font-bold text-gray-900 sm:text-3xl">
                {copy.contactTitle}
              </h2>
              <p className="mt-3 font-inter leading-relaxed text-gray-600">
                {copy.contactBody}
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3">
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-3 ring-1 ring-gray-900/5 transition-shadow hover:shadow-md"
              >
                <Phone className="h-4 w-4 shrink-0 text-emerald-600" />
                <span className="font-poppins text-sm text-gray-800">{phone}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-flex min-w-0 items-center gap-3 rounded-2xl bg-white px-5 py-3 ring-1 ring-gray-900/5 transition-shadow hover:shadow-md"
              >
                <Mail className="h-4 w-4 shrink-0 text-emerald-600" />
                <span className="min-w-0 break-words font-poppins text-sm text-gray-800">
                  {email}
                </span>
              </a>
            </div>
          </div>

          <p className="mt-10 text-center font-playfair text-lg italic text-gray-500">
            {copy.thanks}
          </p>
        </div>
      </section>
    </div>
  );
}
