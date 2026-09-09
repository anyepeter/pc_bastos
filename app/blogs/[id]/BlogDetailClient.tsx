'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentPost } from '@/store/blogSlice';
import type { PublicBlogPost } from '@/app/actions/blog-public';
import { getTranslatedText } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import Reveal from '@/components/Reveal';

interface BlogDetailClientProps {
  /** Server-fetched post. Rendered directly so the page never flashes empty. */
  post: PublicBlogPost;
}

/**
 * Covers are uploaded through `app/actions/upload.ts` and live on Cloudinary,
 * the only host `next.config.js` allows. Anything else — a legacy row still
 * holding one of the template's stock URLs — is dropped rather than rendered:
 * `next/image` would throw on it, and borrowed photography is exactly what the
 * redesign removes.
 */
function coverImage(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    return new URL(url).hostname === 'res.cloudinary.com' ? url : null;
  } catch {
    return null;
  }
}

const isoDate = (value: string | Date): string => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
};

/**
 * The rendered post. Every element is set explicitly — the global `.prose`
 * rules in `globals.css` are hardcoded greys and a blue link, which belong to
 * neither this palette nor this type scale.
 *
 * `h1` deliberately renders an `<h2>`: the page's only `h1` is the title in
 * `PageHero`, and a post whose markdown opens with `#` must not add a second.
 */
const markdown: Components = {
  h1: ({ children }) => (
    <h2 className="mt-14 font-display text-[clamp(1.6rem,2.6vw,2.15rem)] font-semibold leading-tight tracking-tight text-ink-900 text-balance first:mt-0">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="mt-14 font-display text-[clamp(1.6rem,2.6vw,2.15rem)] font-semibold leading-tight tracking-tight text-ink-900 text-balance first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-11 font-display text-xl font-semibold leading-snug tracking-tight text-ink-900 lg:text-2xl">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-9 font-ui text-sm font-semibold uppercase tracking-[0.14em] text-ink-800">
      {children}
    </h4>
  ),
  p: ({ children }) => <p className="mt-6 leading-[1.85] text-pretty first:mt-0">{children}</p>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="focus-ring font-medium text-plum-700 underline decoration-plum-300 underline-offset-4 transition-colors duration-300 hover:text-plum-800 hover:decoration-plum-500"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-ink-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="mt-6 list-disc space-y-2.5 pl-5 marker:text-leaf-600">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-6 list-decimal space-y-2.5 pl-5 marker:font-mono marker:text-ink-400">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1.5 leading-[1.8] [&_p]:!mt-0">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-10 border-l-2 border-leaf-300 pl-6 font-display text-xl italic leading-relaxed text-ink-800 lg:text-[1.45rem] [&_p+p]:!mt-4 [&_p]:!mt-0">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded-md border border-ink-200 bg-ink-50 px-1.5 py-0.5 font-mono text-[0.85em] text-plum-700">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mt-8 overflow-x-auto rounded-2xl bg-plum-950 p-5 font-mono text-sm leading-relaxed text-plum-100 [&_code]:!border-0 [&_code]:!bg-transparent [&_code]:!p-0 [&_code]:!text-inherit">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-12 h-px border-0 bg-ink-200" />,
  table: ({ children }) => (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-ink-300 pb-3 pr-6 font-mono text-[0.62rem] font-normal uppercase tracking-[0.2em] text-ink-500">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-ink-200 py-3 pr-6 align-top leading-relaxed text-ink-700">
      {children}
    </td>
  ),
  img: ({ src, alt }) => (
    // Markdown can reference any host, and `next/image` only accepts the one
    // configured in next.config.js — a plain <img> is the safe renderer here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === 'string' ? src : ''}
      alt={alt || ''}
      className="my-8 w-full rounded-2xl border border-ink-200"
    />
  ),
};

export default function BlogDetailClient({ post }: BlogDetailClientProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  // Language comes from the shared root store, the same one the nav's
  // LanguageSelector writes to — that is what makes switching work here.
  const language = useAppSelector((state) => state.blog.language);
  const currentPost = post;

  // Keep the store in sync so the post is cached for later navigations.
  useEffect(() => {
    dispatch(setCurrentPost(post));
  }, [dispatch, post]);

  if (!currentPost) {
    return (
      <PageSection tone="white">
        <p className="max-w-[48ch] text-base leading-relaxed text-ink-600 text-pretty">
          {t('blogDetail.notFound')}
        </p>
      </PageSection>
    );
  }

  const translatedTitle = getTranslatedText(currentPost.title, language);
  const translatedDescription = getTranslatedText(currentPost.description, language);
  const cover = coverImage(currentPost.imageUrl);

  return (
    <>
      <PageHero
        eyebrow={t('navbar.blogs')}
        title={translatedTitle}
        crumbs={[
          { label: t('navbar.home'), href: '/' },
          { label: t('navbar.blogs'), href: '/blogs' },
          { label: translatedTitle },
        ]}
      >
        <div className="mt-9 flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-plum-200">
          <Calendar aria-hidden="true" className="h-4 w-4 text-leaf-300" />
          <time dateTime={isoDate(currentPost.createdAt)} className="tnum">
            {formatLongDate(currentPost.createdAt, language)}
          </time>
        </div>
      </PageHero>

      <PageSection tone="white">
        <article>
          {cover && (
            <Reveal>
              <figure className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-ink-200 bg-ink-50 lg:aspect-[21/9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover}
                  alt={translatedTitle}
                  loading="eager"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </figure>
            </Reveal>
          )}

          {/* A measured column: ~68 characters is the width long-form text is
              actually comfortable to read, whatever the shell can hold. */}
          <Reveal delay={80}>
            <div
              className={`mx-auto max-w-[68ch] text-[1.0625rem] text-ink-700 [&>p:first-child]:!text-[1.2rem] [&>p:first-child]:!leading-[1.75] [&>p:first-child]:!text-ink-800 ${
                cover ? 'mt-12 lg:mt-16' : ''
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdown}>
                {translatedDescription}
              </ReactMarkdown>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="mx-auto mt-14 max-w-[68ch] border-t border-ink-200 pt-8">
              <Link
                href="/blogs"
                className="focus-ring group inline-flex items-center gap-2 font-ui text-sm font-medium text-plum-700 transition-colors duration-300 hover:text-plum-800"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:-translate-x-0.5" />
                {t('navbar.blogs')}
              </Link>
            </div>
          </Reveal>
        </article>
      </PageSection>
    </>
  );
}
