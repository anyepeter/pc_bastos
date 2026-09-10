'use client';

import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Heart,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/components/PageLayout';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

/** The council's own map pin. Linked out rather than proxied — the footer does the same. */
const MAPS_URL = 'https://maps.app.goo.gl/ehjxm8QprKj2Jpv16';

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

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  /**
   * There is no submit target. This project has no API routes and no mailer —
   * every server round-trip goes through a Server Action in `app/actions/`,
   * and none of them accepts a contact enquiry. The original page faked the
   * send with a `setTimeout` and an `alert()`; that behaviour is kept exactly,
   * with the confirmation moved out of the modal alert and into the polite
   * live region below the button so assistive technology hears it in place.
   *
   * When a real endpoint exists, replace the timeout — nothing else here
   * needs to change.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSent(false);

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
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setFormData(EMPTY_FORM);
    setIsSubmitting(false);
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

  const handlePrayerRequest = () => {
    setFormData((current) => ({
      ...current,
      requestType: 'prayer',
      subject: 'Prayer Request',
    }));
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * The four ways to reach the council. Values match the footer exactly — one
   * set of numbers and one address across the site.
   */
  const channels = [
    {
      id: 'visit',
      Icon: MapPin,
      title: t('contact.visitUs.title'),
      body: t('contact.visitUs.address'),
      links: [{ href: MAPS_URL, label: t('contact.visitUs.getDirections'), external: true }],
      note: undefined,
    },
    {
      id: 'call',
      Icon: Phone,
      title: t('contact.callUs.title'),
      body: undefined,
      links: [{ href: 'https://wa.me/237242657608', label: '+237 242 657 608', external: true }],
      note: t('contact.callUs.hours'),
    },
    {
      id: 'email',
      Icon: Mail,
      title: t('contact.emailUs.title'),
      body: undefined,
      links: [
        {
          href: 'mailto:generalsecretarycepca@gmail.com',
          label: 'generalsecretarycepca@gmail.com',
          external: false,
        },
      ],
      note: t('contact.emailUs.response'),
    },
    {
      id: 'whatsapp',
      Icon: MessageCircle,
      title: t('contact.whatsapp.title'),
      body: undefined,
      links: [
        { href: 'https://wa.me/237677875300', label: '+237 677 875 300', external: true },
        { href: 'https://wa.me/237656779874', label: '+237 656 779 874', external: true },
      ],
      note: t('contact.whatsapp.quickResponses'),
    },
  ];

  const required = t('contact.form.required');

  return (
    <PageLayout>
      <PageHero
        title={t('contact.pageTitle')}
        titleHighlight={t('contact.pageTitleHighlight')}
        lede={t('contact.pageSubtitle')}
      />

      {/* The channels and the form, side by side. The form takes the wider
          column: it is the reason most people open this page. */}
      <PageSection tone="white">
        <SectionHeading
          title={t('contact.weAreHere')}
          standfirst={t('contact.description')}
          layout="split"
        />

        <div className="mt-11 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {channels.map((channel, i) => {
              const { Icon } = channel;

              return (
                <Reveal as="li" key={channel.id} delay={Math.min(i, 8) * 60}>
                  <div className="card card-hover flex h-full gap-5 rounded-2xl p-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white">
                      <Icon aria-hidden="true" className="h-5 w-5 text-leaf-600" />
                    </span>

                    <div className="min-w-0">
                      <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-ink-900">
                        {channel.title}
                      </h3>

                      {channel.body && (
                        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-600">
                          {channel.body}
                        </p>
                      )}

                      <ul className="mt-3 space-y-1">
                        {channel.links.map((link) => (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              {...(link.external
                                ? { target: '_blank', rel: 'noopener noreferrer' }
                                : {})}
                              className="focus-ring inline-block break-words rounded font-ui text-sm font-medium text-plum-700 transition-colors duration-300 hover:text-plum-600"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>

                      {channel.note && (
                        <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-ink-500">
                          {channel.note}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>

          <Reveal delay={120} className="lg:col-span-7">
            <div id="contact-form" className="card scroll-mt-28 rounded-2xl p-6 sm:p-8 lg:p-10">
              <div className="flex items-start gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white">
                  <Heart aria-hidden="true" className="h-5 w-5 text-leaf-600" />
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="focus-ring flex w-full items-center justify-center gap-2.5 rounded-xl bg-plum-600 px-6 py-3.5 font-ui text-[15px] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(93,50,166,0.7)] transition-all duration-300 ease-spring hover:bg-plum-700 hover:shadow-[0_18px_36px_-14px_rgba(93,50,166,0.8)] active:translate-y-px disabled:cursor-not-allowed disabled:bg-plum-400 disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send aria-hidden="true" className="h-4 w-4" />
                      Send Message
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
                      <span>Thank you for your message! We&apos;ll get back to you soon.</span>
                    </p>
                  )}
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </PageSection>

      {/* Prayer. A painted dark band so the invitation punctuates the page
          instead of reading as one more card. */}
      <PageSection tone="dark" paint className="py-20 lg:py-28">
        <SectionHeading
          title={t('contact.prayer.title')}
          standfirst={t('contact.prayer.description')}
          tone="dark"
          layout="split"
        />

        <Reveal delay={200} className="mt-11">
          <button
            type="button"
            onClick={handlePrayerRequest}
            className="focus-ring inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 font-ui text-sm font-semibold text-plum-900 transition-all duration-300 ease-spring hover:bg-leaf-100 active:translate-y-px"
          >
            <Heart aria-hidden="true" className="h-4 w-4" />
            {t('contact.prayer.submitRequest')}
          </button>
        </Reveal>
      </PageSection>

      {/* Where to find the secretariat. The embed is kept as it was; the two
          links below it are the reliable route, and they are the same pin the
          footer uses. */}
      <PageSection tone="tint">
        <SectionHeading
          title={t('contact.map.title')}
          standfirst={t('contact.map.description')}
          layout="split"
        />

        <Reveal className="mt-11">
          <div className="card overflow-hidden rounded-2xl">
            <iframe
              title={t('contact.map.title')}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.8947!2d11.5021!3d3.8480!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf1a1a1a1a1a%3A0x1a1a1a1a1a1a1a1a!2sPresbyterian%20Church%2C%20Bastos%2C%20Yaound%C3%A9%2C%20Cameroon!5e0!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block h-[380px] w-full border-0 lg:h-[440px]"
            />
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center justify-center gap-2.5 rounded-full bg-plum-600 px-7 py-3.5 font-ui text-sm font-semibold text-white shadow-[0_14px_30px_-14px_rgba(93,50,166,0.7)] transition-all duration-300 ease-spring hover:bg-plum-700 active:translate-y-px"
            >
              <MapPin aria-hidden="true" className="h-4 w-4" />
              Get Directions
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center justify-center gap-2.5 rounded-full border border-ink-300 bg-white px-7 py-3.5 font-ui text-sm font-semibold text-ink-800 transition-all duration-300 ease-spring hover:border-plum-400 hover:bg-plum-50 active:translate-y-px"
            >
              {t('contact.map.viewOnGoogleMaps')}
            </a>
          </div>
        </Reveal>
      </PageSection>
    </PageLayout>
  );
}
