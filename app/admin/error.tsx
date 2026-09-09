'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Anything that throws while rendering the dashboard lands here. Without this,
 * a failed session lookup showed only "An error occurred in the Server
 * Components render but no message was provided", which says nothing useful.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[admin] render failed:', error);
  }, [error]);

  const looksLikeAuth = /auth|session|account/i.test(error.message);

  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-200">
        <AlertTriangle className="h-7 w-7 text-amber-600" />
      </span>

      <h1 className="mt-6 text-2xl font-bold text-gray-900">
        The dashboard could not load
      </h1>

      <p className="mt-3 text-gray-600">
        {looksLikeAuth
          ? 'We could not confirm your account just now. This is usually temporary — try again, or sign in afresh.'
          : 'Something went wrong while loading this page.'}
      </p>

      {error.message && (
        <p className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-left font-mono text-xs text-gray-600">
          {error.message}
          {error.digest && (
            <>
              <br />
              digest: {error.digest}
            </>
          )}
        </p>
      )}

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={reset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to the site</Link>
        </Button>
      </div>
    </div>
  );
}
