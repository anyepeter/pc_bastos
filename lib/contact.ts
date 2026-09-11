/**
 * Caps on the contact form's fields. The inputs' `maxLength` and the server's
 * check in `app/actions/contact.ts` both read these, so a visitor can never
 * type more than the server will accept.
 */
export const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  subject: 200,
  message: 5000,
} as const;
