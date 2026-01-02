'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function MemberNotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 pt-20 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('members.memberNotFound')}</h1>
        <Link href="/members" className="text-purple-600 hover:text-purple-700">
          {t('members.returnToMembers')}
        </Link>
      </div>
    </div>
  );
}