'use client';

import Marquee from '@/components/motion/Marquee';
import enTranslation from '@/public/locales/en/translation.json';
import frTranslation from '@/public/locales/fr/translation.json';
import { useAppSelector } from '@/store/hooks';

/**
 * The council's motto as an endless ribbon, in BOTH of its languages at once —
 * CEPCA is a bilingual council, and the two forms side by side say so better
 * than either alone. The English runs outlined, the French solid, divided by a
 * small cross.
 *
 * Read from the locale files themselves, so it never drifts from the copy used
 * elsewhere. The motion copies are hidden from assistive technology; the label
 * carries the motto once, in the page's language.
 */
const MOTTO = {
  en: `${enTranslation.welcome.title} ${enTranslation.welcome.titleHighlight}`,
  fr: `${frTranslation.welcome.title} ${frTranslation.welcome.titleHighlight}`,
};

function Cross({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 16" aria-hidden="true" className={`shrink-0 ${className}`} fill="currentColor">
      <rect x="5" y="0" width="2" height="16" rx="0.6" />
      <rect x="0.5" y="4.5" width="11" height="2" rx="0.6" />
    </svg>
  );
}

interface MottoRibbonProps {
  tone?: 'light' | 'dark';
  className?: string;
}

export default function MottoRibbon({ tone = 'light', className = '' }: MottoRibbonProps) {
  const language = useAppSelector((state) => state.blog.language);
  const dark = tone === 'dark';

  const item = (
    <>
      <span lang="en" className={`text-outline px-[0.35em] ${dark ? 'text-plum-300' : 'text-plum-500'}`}>
        {MOTTO.en}
      </span>
      <Cross className={`h-[0.42em] w-[0.32em] ${dark ? 'text-leaf-300' : 'text-leaf-500'}`} />
      <span lang="fr" className={`px-[0.35em] ${dark ? 'text-white' : 'text-ink-900'}`}>
        {MOTTO.fr}
      </span>
      <Cross className={`h-[0.42em] w-[0.32em] ${dark ? 'text-leaf-300' : 'text-leaf-500'}`} />
    </>
  );

  return (
    <div
      className={`relative border-y py-6 sm:py-8 ${dark ? 'border-white/10 bg-plum-950' : 'border-ink-200 bg-ink-50'} ${className}`}
    >
      <Marquee duration={46} label={MOTTO[language] ?? MOTTO.en}>
        <span className="flex items-center whitespace-nowrap font-display text-[clamp(2.6rem,7vw,6.25rem)] font-semibold italic leading-none tracking-tight">
          {item}
          {item}
        </span>
      </Marquee>
    </div>
  );
}
