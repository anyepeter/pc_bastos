/**
 * Links typed into the admin and rendered as an `href` on the public site.
 *
 * Only a page on this site ("/members/mpe") or a full web address is allowed.
 * Anything else — `javascript:`, a bare word, a protocol-relative `//host` —
 * is refused, because it would run or go somewhere unexpected when clicked.
 */
export function safeLink(value: unknown): string | null {
  const link = typeof value === 'string' ? value.trim() : '';
  if (!link) return null;
  if (link.startsWith('/') && !link.startsWith('//') && !/\s/.test(link)) return link;
  if (/^https?:\/\/[^\s/]+\.[^\s]+$/i.test(link)) return link;
  return null;
}

/** The message for a non-empty link that `safeLink` refuses, or null. */
export function linkError(value: unknown, label = 'link'): string | null {
  const link = typeof value === 'string' ? value.trim() : '';
  if (!link || safeLink(link)) return null;
  return `The ${label.toLowerCase()} must be a page on this site, like /members/mpe, or a full address starting with https://`;
}
