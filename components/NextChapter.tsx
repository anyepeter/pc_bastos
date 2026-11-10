'use client';

import Image from 'next/image';
import Link from '@/components/LocalizedLink';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/Reveal';

interface NextChapterProps {
  href: string;
  title: string;
  description?: string;
  image: string;
  /** Overrides the "Next chapter" label. */
  label?: string;
}

/**
 * The closing card on each About page: where to read next. Keeps the About
 * pages a sequence (history → mission → secretariat → structure → board)
 * instead of four dead ends. The whole card is the link.
 */
export default function NextChapter({ href, title, description, image, label }: NextChapterProps) {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="shell">
        <Reveal>
          <Link
            href={href}
            className="focus-ring group relative grid overflow-hidden rounded-2xl border border-ink-200 bg-ink-50 transition-colors duration-500 hover:border-plum-300 lg:grid-cols-12"
          >
            <div className="relative flex flex-col justify-center gap-5 p-7 sm:p-10 lg:col-span-7 lg:p-14">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-10 bg-plum-500 transition-all duration-500 ease-spring group-hover:w-16" />
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-700">
                  {label ?? t('about.nextChapter')}
                </span>
              </div>
              <span className="font-display text-[clamp(2rem,4.4vw,3.6rem)] font-semibold leading-[1.02] tracking-tight text-ink-900 transition-colors duration-500 group-hover:text-plum-700">
                {title}
              </span>
              {description && (
                <span className="max-w-[52ch] text-base leading-relaxed text-ink-600 text-pretty">{description}</span>
              )}
              <span
                aria-hidden="true"
                className="mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-leaf-600 text-white transition-transform duration-500 ease-spring group-hover:translate-x-2"
              >
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>

            <div className="relative min-h-[14rem] overflow-hidden lg:col-span-5 lg:min-h-[22rem]">
              <Image
                src={image}
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition-transform duration-1000 ease-spring group-hover:scale-105"
              />
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
