import Link from 'next/link';
import { fontVariables } from '@/lib/fonts';

/**
 * Last-resort 404 for addresses outside the public site (an unknown dashboard
 * page). The root layout passes children through, so this page brings its own
 * <html>. Public addresses get the bilingual one in app/[lang]/not-found.tsx.
 */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body className={`${fontVariables} font-sans antialiased`}>
        <div className="flex min-h-screen items-center justify-center bg-ink-50 px-5">
          <div className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-plum-600">404</p>
            <h1 className="mt-4 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold tracking-tight text-ink-900">
              Page not found · Page introuvable
            </h1>
            <Link
              href="/"
              className="mt-7 inline-flex items-center rounded-full border border-ink-200 bg-white px-5 py-2.5 font-ui text-sm font-medium text-ink-700 hover:border-plum-400 hover:text-plum-700"
            >
              cepcacameroun.com
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
