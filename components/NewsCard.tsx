'use client';

import Link from '@/components/LocalizedLink';
import { ArrowUpRight } from 'lucide-react';

interface NewsCardProps {
  href: string;
  title: string;
  excerpt: string;
  category?: string | null;
  date: string;
  imageUrl?: string | null;
  readLabel: string;
}

/**
 * One news card: image, date, headline, standfirst, read link.
 *
 * The shape follows the reference the council pointed at — the Cameroon Baptist
 * Convention's news index — where each card is image / date / headline /
 * excerpt / "Read article →". The typography and palette are ours.
 *
 * Used by both `/news` and the home page band, so the two cannot drift apart.
 * Without a featured image the card is purely typographic — a thin accent rule
 * in place of the photo — rather than borrowing stock photography.
 */
export default function NewsCard({
  href,
  title,
  excerpt,
  category,
  date,
  imageUrl,
  readLabel,
}: NewsCardProps) {
  return (
    <Link href={href} className="card card-hover focus-ring group flex h-full flex-col overflow-hidden">
      {imageUrl ? (
        <span className="block overflow-hidden border-b border-ink-200 bg-ink-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="aspect-[16/9] w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.04]"
          />
        </span>
      ) : (
        /* No media block at all without a photograph. Reserving an empty 16:9
           plate made the card mostly blank box, and there is no stock imagery
           to fall back on. */
        <span aria-hidden="true" className="block h-1 bg-leaf-600" />
      )}

      <span className="flex flex-1 flex-col p-6">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6rem] uppercase tracking-[0.2em]">
          <span className="tnum text-ink-400">{date}</span>
          {category && (
            <>
              <span aria-hidden="true" className="h-px w-4 bg-ink-300" />
              <span className="text-plum-700">{category}</span>
            </>
          )}
        </span>

        <span className="mt-4 font-display text-xl font-semibold leading-snug tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-plum-700">
          {title}
        </span>

        <span className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-600 text-pretty">
          {excerpt}
        </span>

        <span className="mt-auto inline-flex items-center gap-2 pt-6 font-ui text-sm font-medium text-plum-700">
          {readLabel}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}
