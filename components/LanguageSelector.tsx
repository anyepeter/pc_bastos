'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { Language } from '@/lib/translations';
import { localizePath, stripLanguage } from '@/lib/locale-path';
import { writeLanguageCookie } from '@/lib/language-cookie';

const LANGUAGES: { code: Language; label: string; aria: string }[] = [
  { code: 'en', label: 'EN', aria: 'Switch to English' },
  { code: 'fr', label: 'FR', aria: 'Passer au français' },
];

/**
 * Each option is a real link to the same page in the other language, so
 * readers and crawlers alike can follow it. Choosing one also stores the
 * choice in a cookie (see middleware.ts).
 */
export default function LanguageSelector({ onDark = false }: { onDark?: boolean }) {
  const language = useAppSelector((state) => state.blog.language);
  // Without the prefix, so server and browser agree whichever form they see.
  const path = stripLanguage(usePathname() || '/');

  return (
    <div
      role="group"
      aria-label={language === 'fr' ? 'Langue' : 'Language'}
      className={`relative inline-flex items-center rounded-full border p-0.5 transition-colors duration-300 ${
        onDark ? 'border-white/25 bg-white/10' : 'border-ink-200 bg-ink-50'
      }`}
    >
      {LANGUAGES.map(({ code, label, aria }) => {
        const active = language === code;
        return (
          <NextLink
            key={code}
            href={localizePath(path, code)}
            hrefLang={code}
            lang={code}
            prefetch={false}
            scroll={false}
            onClick={() => writeLanguageCookie(code)}
            aria-label={aria}
            aria-current={active ? 'true' : undefined}
            className={`focus-ring relative rounded-full px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.1em] transition-colors duration-300 ${
              active
                ? 'text-white'
                : onDark
                  ? 'text-white/70 hover:text-white'
                  : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            {/* The pill marks the current language. */}
            {active && (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-plum-600 transition-transform duration-300 ease-spring"
              />
            )}
            <span className="relative">{label}</span>
          </NextLink>
        );
      })}
    </div>
  );
}
