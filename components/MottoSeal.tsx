'use client';

import enTranslation from '@/public/locales/en/translation.json';
import frTranslation from '@/public/locales/fr/translation.json';

/**
 * A round seal: the motto in both languages running around a small cross,
 * turning slowly. Decorative — hidden from assistive technology.
 */
const RING = `${enTranslation.welcome.title} ${enTranslation.welcome.titleHighlight} · ${frTranslation.welcome.title} ${frTranslation.welcome.titleHighlight} · `.toUpperCase();

export default function MottoSeal({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative grid place-items-center rounded-full bg-plum-900 shadow-[0_18px_40px_-16px_rgb(31_19_56/0.7)] ${className}`}>
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full animate-[spin_28s_linear_infinite]">
        <defs>
          <path id="seal-ring" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text className="fill-plum-100 font-mono" style={{ fontSize: 8.4, letterSpacing: '0.12em' }}>
          <textPath href="#seal-ring" textLength="272" lengthAdjust="spacingAndGlyphs">
            {RING}
          </textPath>
        </text>
      </svg>
      <svg viewBox="0 0 12 16" className="h-[24%] w-[18%] text-leaf-300" fill="currentColor">
        <rect x="5" y="0" width="2" height="16" rx="0.6" />
        <rect x="0.5" y="4.5" width="11" height="2" rx="0.6" />
      </svg>
    </div>
  );
}
