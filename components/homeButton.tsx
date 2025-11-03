'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function HomeButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/')}
      className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors p-2 -ml-2"
    >
      <ArrowLeft className="w-4 h-4 text-white sm:w-5 sm:h-5" />
      <span className="text-sm text-white sm:text-base font-semibold font-poppins tracking-wide">Back</span>
    </button>
  );
}