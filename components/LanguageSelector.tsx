'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLanguage } from '@/store/blogSlice';
import { Language } from '@/lib/translations';

const LANGUAGES: { code: Language; label: string; aria: string }[] = [
  { code: 'en', label: 'EN', aria: 'Switch to English' },
  { code: 'fr', label: 'FR', aria: 'Passer au français' },
];

export default function LanguageSelector({ onDark = false }: { onDark?: boolean }) {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.blog.language);

  return (
    <div
      role="group"
      aria-label="Language"
      className={`relative inline-flex items-center rounded-full border p-0.5 transition-colors duration-300 ${
        onDark ? 'border-white/25 bg-white/10' : 'border-ink-200 bg-ink-50'
      }`}
    >
      {LANGUAGES.map(({ code, label, aria }) => {
        const active = language === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => dispatch(setLanguage(code))}
            aria-label={aria}
            aria-pressed={active}
            className={`focus-ring relative rounded-full px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.1em] transition-colors duration-300 ${
              active
                ? 'text-white'
                : onDark
                  ? 'text-white/70 hover:text-white'
                  : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            {/* The pill slides between the two options rather than snapping. */}
            {active && (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-plum-600 transition-transform duration-300 ease-spring"
              />
            )}
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
