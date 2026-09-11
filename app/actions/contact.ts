'use server';

import { headers } from 'next/headers';
import type { ActionOutcome } from '@/lib/auth/roles';
import { CONTACT_LIMITS } from '@/lib/contact';
import { getSiteSettings } from '@/app/actions/settings';

/**
 * Delivers the public contact form to the secretariat's inbox through Brevo's
 * transactional email API.
 *
 * Plain `fetch` rather than an SDK, as in `translate.ts`. The key is
 * `BREVO_API_KEY` and must be set in every environment; without it the action
 * reports failure and the page offers the address to write to instead.
 */

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

/**
 * Every enquiry is sent FROM this address and delivered TO the email set in
 * /admin/settings. The sender is fixed because Brevo refuses any sender not
 * verified in the account; this one is, on the authenticated
 * `cepcacameroun.com` domain. The recipient can be any inbox.
 */
const SENDER = 'info@cepcacameroun.com';

const SEND_FAILED = 'Your message could not be sent.';

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  requestType?: string;
  /** Honeypot. Hidden from people; bots fill in every field they find. */
  website?: string;
}

/* A public form spending a daily sending quota needs a brake. In-memory, so
   like the login brake in `auth.ts` it only holds on a single instance. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, { count: number; first: number }>();

function overLimit(key: string): boolean {
  const now = Date.now();

  if (recent.size > 500) {
    recent.forEach((entry, k) => {
      if (now - entry.first > WINDOW_MS) recent.delete(k);
    });
  }

  const entry = recent.get(key);
  if (!entry || now - entry.first > WINDOW_MS) {
    recent.set(key, { count: 1, first: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

/** Collapses line breaks too, so nothing typed can reach a header. */
const oneLine = (value: unknown, max: number) =>
  String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

export async function sendContactMessage(input: ContactMessage): Promise<ActionOutcome> {
  // Report success to a bot so it has no reason to try again.
  if (input.website) return { success: true };

  const name = oneLine(input.name, CONTACT_LIMITS.name);
  const email = oneLine(input.email, CONTACT_LIMITS.email);
  const phone = oneLine(input.phone, CONTACT_LIMITS.phone);
  const topic = oneLine(input.subject, CONTACT_LIMITS.subject);
  const message = String(input.message ?? '').trim().slice(0, CONTACT_LIMITS.message);
  const prayer = input.requestType === 'prayer';

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Please fill in your name, email address and message.' };
  }

  const ip = headers().get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (overLimit(ip)) {
    return { success: false, error: 'Too many messages. Wait a few minutes and try again.' };
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('[contact] BREVO_API_KEY is not set — the contact form cannot send.');
    return { success: false, error: SEND_FAILED };
  }

  const kind = prayer ? 'Prayer request' : 'General enquiry';
  const subject = `[Website] ${prayer ? 'Prayer request' : topic || 'Contact form'} — ${name}`;
  const rows: Array<[string, string]> = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone || '—'],
    ['Type', kind],
    ['Subject', topic || '—'],
  ];

  const textContent = [
    'New message from the contact form on the CEPCA website.',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    message,
    '',
    `Reply to this email to answer ${name} directly.`,
  ].join('\n');

  const htmlContent = `
    <p>New message from the contact form on the CEPCA website.</p>
    <table cellpadding="4" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="color:#666">${label}</td><td><strong>${escapeHtml(value)}</strong></td></tr>`,
        )
        .join('')}
    </table>
    <p style="white-space:pre-wrap;border-left:3px solid #7c4dc4;padding-left:12px">${escapeHtml(message)}</p>
    <p style="color:#666">Reply to this email to answer ${escapeHtml(name)} directly.</p>`;

  const { email: inbox } = await getSiteSettings();

  try {
    const response = await fetch(BREVO_URL, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'CEPCA website', email: SENDER },
        to: [{ email: inbox, name: 'CEPCA' }],
        // So the secretariat's Reply goes to the visitor, not back to itself.
        replyTo: { email, name },
        subject,
        textContent,
        htmlContent,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      // Brevo's reason only — never the visitor's message.
      console.error('[contact] Brevo refused the message:', response.status, await response.text());
      return { success: false, error: SEND_FAILED };
    }

    return { success: true };
  } catch (error) {
    console.error('[contact] Could not reach Brevo:', error);
    return { success: false, error: SEND_FAILED };
  }
}
