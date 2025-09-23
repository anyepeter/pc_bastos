'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 active:text-purple-900 transition-colors mb-4 sm:mb-6 p-2 -ml-2 rounded-lg hover:bg-purple-50 active:bg-purple-100"
    >
      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="text-sm sm:text-base font-semibold font-poppins tracking-wide">Back</span>
    </button>
  );
}