'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from '@/components/LocalizedLink';

/**
 * The site's 404, in the page's language. Used by app/[lang]/not-found.tsx for
 * any unknown address; the members and departments keep their own wording.
 */
export default function PageNotFound() {
  const { t } = useTranslation();

  return (
    <div className="grain flex min-h-screen items-center justify-center bg-ink-50 px-5 pt-20">
      <div className="max-w-xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-plum-600">404</p>
        <h1 className="mt-4 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold tracking-tight text-ink-900 text-balance">
          {t('common.notFound.title')}
        </h1>
        <p className="mt-4 font-ui text-[15px] leading-relaxed text-ink-500 text-pretty">
          {t('common.notFound.text')}
        </p>
        <Link
          href="/"
          className="focus-ring group mt-7 inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-5 py-2.5 font-ui text-sm font-medium text-ink-700 transition-all duration-300 ease-spring hover:border-plum-400 hover:text-plum-700"
        >
          <ArrowLeft
            aria-hidden="true"
            className="h-4 w-4 text-leaf-600 transition-transform duration-300 ease-spring group-hover:-translate-x-0.5"
          />
          {t('common.notFound.home')}
        </Link>
      </div>
    </div>
  );
}
