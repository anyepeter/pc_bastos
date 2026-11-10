'use client';

import { useState } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/components/PageLayout';
import Image from 'next/image';
import SplitReveal from '@/components/motion/SplitReveal';
import Parallax from '@/components/motion/Parallax';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import { useSiteSettings } from '@/components/SiteSettingsProvider';
import { useAppSelector } from '@/store/hooks';
import { sendContactMessage } from '@/app/actions/contact';
import { CONTACT_LIMITS } from '@/lib/contact';
import { inLanguage, mapEmbedSrc, telHref, whatsappHref } from '@/lib/site-settings';

const FIELDS = ['name', 'email', 'phone', 'subject', 'message'] as const;
type FieldName = (typeof FIELDS)[number];

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  requestType: 'general',
};

/**
 * Field chrome. The invalid state changes the border *and* the ground, and is
 * always accompanied by an icon and a message — colour never carries the
 * signal on its own.
 *
 * Note the invalid tint is plum, not red. The palette has exactly three ramps,
 * and the only red in the project (`--destructive`, ~3.8:1 on white) fails the
 * 4.5:1 floor for body copy — so the message carries an icon and text, and the
 * ground shift is only a supporting cue.
 */
const fieldClass = (invalid: boolean) =>
  `focus-ring w-full rounded-xl border px-4 py-3 font-ui text-[15px] text-ink-900 placeholder:text-ink-400 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
    invalid
      ? 'border-plum-500 bg-plum-50'
      : 'border-ink-200 bg-white hover:border-ink-300 focus:border-plum-400'
  }`;

const labelClass = 'block font-ui text-[13px] font-semibold tracking-wide text-ink-700';

export default function ContactPage() {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);
  const settings = useSiteSettings();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  /**
   * Validated here, then handed to the `sendContactMessage` Server Action,
   * which emails it to the secretariat through Brevo. The outcome is announced
   * in the polite live region below the button. A failed send keeps what was
   * typed and offers the address to write to directly.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSent(false);
    setFailed(false);

    // Constraint validation, reported inline. The messages come from the
    // browser itself, so they arrive already translated into the user's
    // locale — this page has no locale keys of its own for them.
    const found: Partial<Record<FieldName, string>> = {};
    FIELDS.forEach((name) => {
      const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);
      if (el && !el.checkValidity()) found[name] = el.validationMessage;
    });

    if (Object.keys(found).length > 0) {
      setErrors(found);
      const first = FIELDS.find((name) => found[name]);
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const honeypot = form.querySelector<HTMLInputElement>('[name="website"]')?.value ?? '';
    const result = await sendContactMessage({ ...formData, website: honeypot }).catch(() => null);
    setIsSubmitting(false);

    if (!result?.success) {
      setFailed(true);
      return;
    }

    setFormData(EMPTY_FORM);
    setSent(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
    // Clear the message as soon as the field is being corrected.
    setErrors((current) => {
      if (!(name in current)) return current;
      const next = { ...current };
      delete next[name as FieldName];
      return next;
    });
  };

  /**
   * The ways to reach the council, all from /admin/settings — the same
   * numbers and address the footer shows. A channel with nothing set is left
   * out rather than shown empty.
   */
  const channels = [
    {
      id: 'visit',
      Icon: MapPin,
      title: t('contact.visitUs.title'),
      body: inLanguage(settings.address, language),
      links: settings.mapsUrl
        ? [{ href: settings.mapsUrl, label: t('contact.visitUs.getDirections'), external: true }]
        : [],
      note: undefined,
    },
    {
      id: 'call',
      Icon: Phone,
      title: t('contact.callUs.title'),
      body: undefined,
      links: [{ href: telHref(settings.phone), label: settings.phone, external: false }],
      note: inLanguage(settings.officeHours, language) || undefined,
    },
    {
      id: 'email',
      Icon: Mail,
      title: t('contact.emailUs.title'),
      body: undefined,
      links: [{ href: `mailto:${settings.email}`, label: settings.email, external: false }],
      note: t('contact.emailUs.response'),
    },
    {
      id: 'whatsapp',
      Icon: MessageCircle,
      title: t('contact.whatsapp.title'),
      body: undefined,
      links: settings.whatsapp.map((number) => ({
        href: whatsappHref(number),
        label: number,
        external: true,
      })),
      note: t('contact.whatsapp.quickResponses'),
    },
  ].filter((channel) => channel.id !== 'whatsapp' || channel.links.length > 0);

  const required = t('contact.form.required');

  const quick = [
    { id: 'call', Icon: Phone, href: telHref(settings.phone), label: settings.phone, external: false },
    { id: 'email', Icon: Mail, href: `mailto:${settings.email}`, label: settings.email, external: false },
    ...settings.whatsapp.slice(0, 1).map((number) => ({
      id: 'whatsapp',
      Icon: MessageCircle,
      href: whatsappHref(number),
      label: 'WhatsApp',
      external: true,
    })),
  ];

  return (
    <PageLayout>
      {/* Hero: the invitation on the left, the Secretariat itself on the
          right with its address pinned to the photograph like a card. */}
      <section className="relative isolate overflow-hidden bg-white pb-20 pt-28 sm:pt-32 lg:pb-24 lg:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-24 -z-10 h-[30rem] w-[30rem] rounded-full bg-plum-100/60 blur-[120px]"
        />
        <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="grow-x h-px w-10 origin-left bg-plum-500" />
                <p className="font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.2em] text-plum-700 text-balance sm:text-[0.68rem] sm:tracking-[0.28em]">
                  {t('home.eyebrow')}
                </p>
              </div>
            </Reveal>
            <SplitReveal
              as="h1"
              delay={120}
              className="mt-7 block font-display text-[clamp(2.9rem,6.4vw,5.6rem)] font-semibold leading-[0.98] tracking-tightest text-ink-900 text-balance"
              text={[
                { text: t('contact.pageTitle') },
                { text: t('contact.pageTitleHighlight'), className: 'italic text-leaf-600' },
              ]}
            />
            <Reveal delay={360}>
              <p className="mt-7 max-w-[48ch] text-lg leading-relaxed text-ink-600 text-pretty">{t('contact.pageSubtitle')}</p>
            </Reveal>
            <Reveal delay={440}>
              {/* On a phone the three ways in are equal rows, each the full
                  width; from sm up they sit side by side as pills. */}
              <ul className="mt-9 grid gap-3 sm:flex sm:flex-wrap">
                {quick.map(({ id, Icon, href, label, external }) => (
                  <li key={id}>
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="focus-ring group flex w-full items-center gap-3 rounded-full border border-ink-200 bg-white py-2 pl-2 pr-4 font-ui text-sm font-semibold text-ink-800 shadow-[0_10px_24px_-18px_rgb(45_27_90/0.5)] transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:border-leaf-300 hover:shadow-[0_18px_30px_-18px_rgb(39_113_78/0.6)] active:translate-y-px sm:inline-flex sm:w-auto sm:pr-5"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-white transition-transform duration-500 ease-spring group-hover:rotate-[-12deg]">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 truncate sm:max-w-[16rem]">{label}</span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="ml-auto h-4 w-4 shrink-0 text-ink-400 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:hidden"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="relative pb-10 lg:col-span-6">
            <Reveal variant="wipe" delay={200}>
              <Parallax strength={70} className="aspect-[4/3] rounded-2xl bg-ink-100">
                <Image
                  src="/images/hero-image.jpg"
                  alt={t('about.photos.headquartersAlt')}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </Parallax>
            </Reveal>
            <Reveal delay={700} className="absolute bottom-0 left-4 right-4 sm:left-auto sm:right-8 sm:w-[22rem]">
              <div className="panel rounded-2xl p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white">
                    <MapPin aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-plum-700">{t('contact.visitUs.title')}</p>
                    <p className="mt-2 whitespace-pre-line font-display text-lg font-semibold leading-snug text-ink-900">
                      {inLanguage(settings.address, language)}
                    </p>
                    {settings.mapsUrl && (
                      <a
                        href={settings.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring mt-3 inline-flex items-center gap-1.5 rounded font-ui text-sm font-semibold text-plum-700 transition-colors duration-300 hover:text-plum-600"
                      >
                        {t('contact.visitUs.getDirections')}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The channels and the form, side by side. The form takes the wider
          column: it is the reason most people open this page. */}
      <PageSection tone="tint" className="lg:py-28">
        <SectionHeading
          title={t('contact.weAreHere')}
          standfirst={t('contact.description')}
          layout="split"
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <ul className="divide-y divide-ink-200 border-y border-ink-200 lg:sticky lg:top-28">
              {channels.map((channel, i) => {
                const { Icon } = channel;
                return (
                  <Reveal as="li" key={channel.id} delay={Math.min(i, 8) * 70}>
                    <div className="group flex gap-5 py-6">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white transition-all duration-500 ease-spring group-hover:-rotate-6 group-hover:border-leaf-300">
                        <Icon aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-ink-900">{channel.title}</h3>
                        {channel.body && (
                          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-600">{channel.body}</p>
                        )}
                        <ul className="mt-2 space-y-1">
                          {channel.links.map((link) => (
                            <li key={link.href}>
                              <a
                                href={link.href}
                                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                className="focus-ring inline-block break-words rounded font-ui text-base font-semibold text-plum-700 transition-colors duration-300 hover:text-plum-600"
                              >
                                {link.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                        {channel.note && (
                          <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-ink-500">{channel.note}</p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>

          <Reveal delay={120} className="lg:col-span-7">
            <div id="contact-form" className="card scroll-mt-28 rounded-2xl p-6 sm:p-8 lg:p-10">
              <div className="flex items-start gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white">
                  <Send aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900">
                    {t('contact.form.title')}
                  </h3>
                  <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-ink-600 text-pretty">
                    {t('contact.form.subtitle')}
                  </p>
                </div>
              </div>

              {/* `noValidate` so the inline messages below are what the user
                  sees — the native bubbles cannot be described by
                  `aria-describedby` and vanish on the next keystroke. */}
              <form onSubmit={handleSubmit} noValidate className="mt-9 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className={labelClass}>
                      {t('contact.form.fullName')} {required}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      autoComplete="name"
                      required
                      maxLength={CONTACT_LIMITS.name}
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      placeholder={t('contact.form.namePlaceholder')}
                      className={fieldClass(Boolean(errors.name))}
                    />
                    {errors.name && (
                      <p
                        id="name-error"
                        className="flex items-start gap-2 font-ui text-[13px] leading-relaxed text-plum-700"
                      >
                        <AlertCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className={labelClass}>
                      {t('contact.form.emailAddress')} {required}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      inputMode="email"
                      autoComplete="email"
                      spellCheck={false}
                      required
                      maxLength={CONTACT_LIMITS.email}
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      placeholder={t('contact.form.emailPlaceholder')}
                      className={fieldClass(Boolean(errors.email))}
                    />
                    {errors.email && (
                      <p
                        id="email-error"
                        className="flex items-start gap-2 font-ui text-[13px] leading-relaxed text-plum-700"
                      >
                        <AlertCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className={labelClass}>
                    {t('contact.form.phoneNumber')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={CONTACT_LIMITS.phone}
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    placeholder={t('contact.form.phonePlaceholder')}
                    className={fieldClass(Boolean(errors.phone))}
                  />
                  {errors.phone && (
                    <p
                      id="phone-error"
                      className="flex items-start gap-2 font-ui text-[13px] leading-relaxed text-plum-700"
                    >
                      <AlertCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className={labelClass}>
                    {t('contact.form.subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    autoComplete="off"
                    maxLength={CONTACT_LIMITS.subject}
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    aria-invalid={errors.subject ? true : undefined}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                    placeholder={t('contact.form.subjectPlaceholder')}
                    className={fieldClass(Boolean(errors.subject))}
                  />
                  {errors.subject && (
                    <p
                      id="subject-error"
                      className="flex items-start gap-2 font-ui text-[13px] leading-relaxed text-plum-700"
                    >
                      <AlertCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{errors.subject}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className={labelClass}>
                    {t('contact.form.message')} {required}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    maxLength={CONTACT_LIMITS.message}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    placeholder={t('contact.form.messagePlaceholder')}
                    className={`${fieldClass(Boolean(errors.message))} resize-y`}
                  />
                  {errors.message && (
                    <p
                      id="message-error"
                      className="flex items-start gap-2 font-ui text-[13px] leading-relaxed text-plum-700"
                    >
                      <AlertCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Honeypot. Out of sight, out of the tab order and hidden
                    from assistive tech — only a bot fills it in, and the
                    server then drops the message. */}
                <div aria-hidden="true" className="sr-only">
                  <label htmlFor="website">Website</label>
                  <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="focus-ring flex w-full items-center justify-center gap-2.5 rounded-xl bg-leaf-600 px-6 py-3.5 font-ui text-[15px] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(39,113,78,0.7)] transition-all duration-300 ease-spring hover:bg-leaf-700 hover:shadow-[0_18px_36px_-14px_rgba(39,113,78,0.8)] active:translate-y-px disabled:cursor-not-allowed disabled:bg-leaf-400 disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    <>
                      <Send aria-hidden="true" className="h-4 w-4" />
                      {t('contact.form.send')}
                    </>
                  )}
                </button>

                {/* The outcome, announced politely. Present in the DOM from
                    first render — and never `display:none`, which stops some
                    screen readers announcing the insertion — so what gets read
                    out is the message arriving. */}
                <div aria-live="polite">
                  {sent && (
                    <p className="flex items-start gap-2.5 rounded-xl border border-leaf-200 bg-leaf-50 px-4 py-3 font-ui text-sm leading-relaxed text-leaf-800">
                      <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{t('contact.form.success')}</span>
                    </p>
                  )}
                  {failed && (
                    <p className="flex items-start gap-2.5 rounded-xl border border-plum-200 bg-plum-50 px-4 py-3 font-ui text-sm leading-relaxed text-plum-800">
                      <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>
                        {t('contact.form.sendError')}{' '}
                        <a
                          href={`mailto:${settings.email}`}
                          className="focus-ring break-words rounded font-semibold underline underline-offset-4"
                        >
                          {settings.email}
                        </a>
                        .
                      </span>
                    </p>
                  )}
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </PageSection>

      {/* Where to find the secretariat: the map fills the frame and the
          directions sit on an opaque card inside it (below it on phones). */}
      <section className="bg-white py-16 lg:py-24">
        <div className="shell">
          <Reveal variant="wipe">
            <div className="relative overflow-hidden rounded-2xl border border-ink-200 bg-ink-100">
              <iframe
                title={t('contact.map.title')}
                src={mapEmbedSrc(settings.address)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="block h-[340px] w-full border-0 sm:h-[420px] lg:h-[520px]"
              />
              <div className="panel m-4 rounded-2xl p-6 sm:p-7 lg:absolute lg:left-6 lg:top-6 lg:m-0 lg:w-[27rem]">
                <h2 className="font-display text-[clamp(1.8rem,3vw,2.4rem)] font-semibold leading-tight tracking-tight text-ink-900">
                  {t('contact.map.title')}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600 text-pretty">{t('contact.map.description')}</p>
                {/* The card said "come and see us" without saying where or when. */}
                <dl className="mt-5 space-y-3 border-t border-ink-200 pt-5">
                  {inLanguage(settings.address, language) && (
                    <div className="flex items-start gap-3">
                      <dt className="sr-only">{t('contact.visitUs.title')}</dt>
                      <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
                      <dd className="whitespace-pre-line text-sm font-medium leading-relaxed text-ink-800">
                        {inLanguage(settings.address, language)}
                      </dd>
                    </div>
                  )}
                  {inLanguage(settings.officeHours, language) && (
                    <div className="flex items-start gap-3">
                      <dt className="sr-only">{t('contact.map.hours')}</dt>
                      <Clock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
                      <dd className="whitespace-pre-line text-sm leading-relaxed text-ink-700">
                        {inLanguage(settings.officeHours, language)}
                      </dd>
                    </div>
                  )}
                </dl>
                {settings.mapsUrl && (
                  <div className="mt-6 flex flex-col gap-3 whitespace-nowrap sm:flex-row">
                    <a
                      href={settings.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring inline-flex items-center justify-center gap-2.5 rounded-full bg-leaf-600 px-6 py-3 font-ui text-sm font-semibold text-white transition-all duration-300 ease-spring hover:bg-leaf-700 active:translate-y-px"
                    >
                      <MapPin aria-hidden="true" className="h-4 w-4" />
                      {t('contact.visitUs.getDirections')}
                    </a>
                    <a
                      href={settings.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring inline-flex items-center justify-center gap-2.5 rounded-full border border-ink-300 bg-white px-6 py-3 font-ui text-sm font-semibold text-ink-800 transition-all duration-300 ease-spring hover:border-plum-400 hover:bg-plum-50 active:translate-y-px"
                    >
                      {t('contact.map.viewOnGoogleMaps')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageLayout>
  );
}
