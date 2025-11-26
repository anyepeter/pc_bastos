'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLanguage } from '@/store/blogSlice';
import { Language } from '@/lib/translations';

export default function LanguageSelector() {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.blog.language);

  const handleLanguageChange = (newLanguage: Language) => {
    dispatch(setLanguage(newLanguage));
  };

  return (
    <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-1 space-x-1">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          language === 'en'
            ? 'bg-white text-purple-700 shadow-sm'
            : 'text-white hover:bg-white/20'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('fr')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          language === 'fr'
            ? 'bg-white text-purple-700 shadow-sm'
            : 'text-white hover:bg-white/20'
        }`}
      >
        FR
      </button>
    </div>
  );
}
