'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MarkdownLink from '@/components/MarkdownLink';

/* Markdown, styled on-palette. Deliberately not the global `.prose` class:
   that sheet is written in Tailwind default greys and a blue link colour, and
   the site has three ramps. Bullets are small leaf dots rather than the
   browser's discs, so the long attribution lists the departments write read
   as a set rather than a wall. */
const PROSE =
  'max-w-[68ch] text-base leading-relaxed text-ink-600 text-pretty ' +
  '[&>*:first-child]:mt-0 [&_p]:mt-5 ' +
  '[&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-snug [&_h2]:tracking-tight [&_h2]:text-ink-900 ' +
  '[&_h3]:mt-10 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-snug [&_h3]:tracking-tight [&_h3]:text-ink-900 ' +
  '[&_h4]:mt-8 [&_h4]:font-ui [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-ink-900 ' +
  '[&_strong]:font-semibold [&_strong]:text-ink-900 ' +
  '[&_a]:font-medium [&_a]:text-plum-700 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-plum-800 ' +
  '[&_ul]:mt-5 [&_li]:mt-3 [&_ul>li]:relative [&_ul>li]:pl-6 ' +
  "[&_ul>li]:before:absolute [&_ul>li]:before:left-0.5 [&_ul>li]:before:top-[0.62em] [&_ul>li]:before:h-1.5 [&_ul>li]:before:w-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-leaf-600 [&_ul>li]:before:content-[''] " +
  '[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol>li]:pl-2 [&_ol>li]:marker:font-mono [&_ol>li]:marker:text-sm [&_ol>li]:marker:text-plum-700 ' +
  '[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-plum-300 [&_blockquote]:pl-5 [&_blockquote]:text-ink-700 ' +
  '[&_hr]:mt-8 [&_hr]:border-ink-200 ' +
  '[&_table]:mt-6 [&_table]:w-full [&_table]:text-sm ' +
  '[&_th]:border-b [&_th]:border-ink-300 [&_th]:py-2 [&_th]:pr-4 [&_th]:text-left [&_th]:font-ui [&_th]:font-semibold [&_th]:text-ink-900 ' +
  '[&_td]:border-b [&_td]:border-ink-200 [&_td]:py-2 [&_td]:pr-4';

export default function DepartmentProse({
  children,
  className = '',
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={`${PROSE} ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: MarkdownLink }}>{children}</ReactMarkdown>
    </div>
  );
}
