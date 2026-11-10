import './globals.css';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * The top of the tree only passes its children through. The <html> element
 * comes from one of the two real root layouts below it:
 *
 *   app/[lang]/layout.tsx       the public site, in the address's language
 *   app/admin/layout.tsx        the dashboard (English)
 *   app/sign-in/layout.tsx      its login page (English)
 *
 * This file exists so that app/not-found.tsx can catch addresses no route
 * matches, and so metadataBase applies everywhere.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function PassThroughLayout({ children }: { children: React.ReactNode }) {
  return children;
}
