import { notFound } from 'next/navigation';

/**
 * Catches every address no page matches, so the 404 renders inside the site's
 * layout and language (app/[lang]/not-found.tsx) with a real 404 status.
 */
export default function Missing() {
  notFound();
}
