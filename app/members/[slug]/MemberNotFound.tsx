'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MemberNotFound() {
  const { t } = useTranslation();

  return (
    <div className="grain flex min-h-screen items-center justify-center bg-ink-50 px-5 pt-20">
      <div className="text-center">
        <h1 className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold tracking-tight text-ink-900 text-balance">
          {t('members.memberNotFound')}
        </h1>
        <Link
          href="/members"
          className="focus-ring group mt-7 inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-5 py-2.5 font-ui text-sm font-medium text-ink-700 transition-all duration-300 ease-spring hover:border-plum-400 hover:text-plum-700"
        >
          <ArrowLeft
            aria-hidden="true"
            className="h-4 w-4 text-leaf-600 transition-transform duration-300 ease-spring group-hover:-translate-x-0.5"
          />
          {t('members.returnToMembers')}
        </Link>
      </div>
    </div>
  );
}
