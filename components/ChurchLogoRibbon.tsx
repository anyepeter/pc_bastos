'use client';

import Image from 'next/image';
import Marquee from '@/components/motion/Marquee';

export interface RibbonChurch {
  slug: string;
  name: string;
  logo: string | null;
}

/**
 * The member churches' emblems drifting past on a dark band — a quiet,
 * truthful way to show that the "12" above is twelve real churches. A church
 * without a logo shows its acronym instead. Decorative: the list itself lives
 * on /members, so the ribbon is hidden from assistive technology.
 */
export default function ChurchLogoRibbon({ churches, tone = 'dark' }: { churches: RibbonChurch[]; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  if (!churches.length) return null;

  return (
    <Marquee duration={60} className="py-2">
      <ul className="flex items-center gap-5 pr-5 sm:gap-7 sm:pr-7">
        {churches.map((church) => (
          <li key={church.slug} className={`flex shrink-0 items-center gap-3 rounded-full border py-2 pl-2 pr-5 ${dark ? 'border-white/10 bg-white/5' : 'border-ink-200 bg-white'}`}>
            <span className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white ${dark ? '' : 'ring-1 ring-ink-200'}`}>
              {church.logo ? (
                <Image src={church.logo} alt="" fill sizes="44px" className="object-contain p-1.5" />
              ) : (
                <span className="font-mono text-[0.6rem] font-semibold uppercase text-plum-800">{church.slug}</span>
              )}
            </span>
            {/* The whole name: the ribbon moves, so a long name has the room. */}
            <span className={`whitespace-nowrap font-ui text-sm ${dark ? 'text-plum-100' : 'text-ink-700'}`}>{church.name}</span>
          </li>
        ))}
      </ul>
    </Marquee>
  );
}
