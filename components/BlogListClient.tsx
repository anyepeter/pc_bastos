'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchBlogPosts, invalidateCache, setPosts } from '@/store/blogSlice';
import type { PublicBlogPost } from '@/app/actions/blog-public';
import { getTranslatedText } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import Reveal from '@/components/Reveal';

interface BlogListClientProps {
  /** Server-fetched posts, used until the shared store is hydrated. */
  initialPosts?: PublicBlogPost[];
}

/**
 * Cover images are uploaded through `app/actions/upload.ts`, which stores them
 * on Cloudinary — the only host allowed in `next.config.js`. A legacy row may
 * still hold a URL from somewhere else (the template shipped stock-photo links);
 * `next/image` would throw on those, and no stock photograph belongs here
 * anyway, so anything off-host degrades to the typographic plate instead.
 */
function coverImage(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    return new URL(url).hostname === 'res.cloudinary.com' ? url : null;
  } catch {
    return null;
  }
}

/**
 * Posts are written in markdown, so the raw text carries `#`, `**` and link
 * syntax. Strip the punctuation before clipping, or the index shows source
 * code where it should show a sentence.
 */
function excerpt(markdown: string, limit: number): string {
  const text = (markdown || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}[-*+]\s+/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= limit) return text;

  const clipped = text.slice(0, limit);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${(lastSpace > limit * 0.6 ? clipped.slice(0, lastSpace) : clipped).replace(/[,;:.]$/, '')}…`;
}

/**
 * The category is inferred from the text — there is no category column. Kept
 * from the page this replaces, but resolved through the locale files rather
 * than inline ternaries, and rendered in one colour: the old version gave each
 * category its own coloured chip, which is exactly what the palette forbids.
 */
function categoryKey(description: string): 'faith' | 'community' | 'hope' | 'service' {
  const lower = (description || '').toLowerCase();

  if (
    lower.includes('faith') || lower.includes('trust') || lower.includes('believe') ||
    lower.includes('foi') || lower.includes('confiance') || lower.includes('croire')
  ) return 'faith';

  if (
    lower.includes('community') || lower.includes('fellowship') || lower.includes('together') ||
    lower.includes('communauté') || lower.includes('fraternité') || lower.includes('ensemble')
  ) return 'community';

  if (
    lower.includes('hope') || lower.includes('encouragement') ||
    lower.includes('espoir')
  ) return 'hope';

  if (
    lower.includes('service') || lower.includes('serve') || lower.includes('help') ||
    lower.includes('servir') || lower.includes('aider')
  ) return 'service';

  return 'faith';
}

const isoDate = (value: string | Date): string => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
};

export default function BlogListClient({ initialPosts = [] }: BlogListClientProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  // Reads from the shared root store, the same one the nav's LanguageSelector
  // writes to — that is what makes switching language re-render the posts.
  const { posts: storePosts, loading, error, language } = useAppSelector(
    (state) => state.blog
  );

  const hydratedRef = useRef(false);

  // Render server data straight away, then follow the store once it is seeded.
  const posts = storePosts.length > 0 ? storePosts : initialPosts;

  // Seed the store with the server-rendered posts on first mount; only fall
  // back to a client fetch when the server gave us nothing.
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    if (initialPosts.length > 0) {
      dispatch(setPosts(initialPosts));
    } else {
      dispatch(fetchBlogPosts());
    }
  }, [dispatch, initialPosts]);

  // `blogList.pageSubtitle` is stored as a `{ en, fr }` pair inside the locale
  // file, so the leaf has to be addressed by language.
  const hero = (
    <PageHero
      eyebrow={t('navbar.blogs')}
      title={t('blogList.pageTitle')}
      lede={t(`blogList.pageSubtitle.${language}`)}
      crumbs={[{ label: t('navbar.home'), href: '/' }, { label: t('navbar.blogs') }]}
    />
  );

  if (loading && posts.length === 0) {
    return (
      <>
        {hero}
        <PageSection tone="white">
          <div aria-hidden="true" className="animate-pulse space-y-6">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="h-64 rounded-2xl bg-ink-100 lg:col-span-7 lg:h-80" />
              <div className="space-y-4 lg:col-span-5">
                <div className="h-3 w-40 rounded bg-ink-100" />
                <div className="h-10 rounded bg-ink-100" />
                <div className="h-4 rounded bg-ink-100" />
                <div className="h-4 w-3/4 rounded bg-ink-100" />
              </div>
            </div>
          </div>
        </PageSection>
      </>
    );
  }

  // Only take over the page when there is nothing to show; a failed background
  // refresh should not hide posts the server already rendered.
  if (error && posts.length === 0) {
    return (
      <>
        {hero}
        <PageSection tone="white">
          <div className="max-w-[48ch]">
            <p className="text-base leading-relaxed text-ink-600 text-pretty">{error}</p>
            <button
              type="button"
              onClick={() => {
                dispatch(invalidateCache());
                dispatch(fetchBlogPosts());
              }}
              className="focus-ring mt-7 inline-flex items-center gap-2.5 rounded-full bg-plum-600 px-6 py-3.5 font-ui text-sm font-semibold text-white transition-colors duration-300 ease-spring hover:bg-plum-700 active:translate-y-px"
            >
              Try Again
            </button>
          </div>
        </PageSection>
      </>
    );
  }

  if (posts.length === 0) {
    return (
      <>
        {hero}
        <PageSection tone="white">
          <p className="max-w-[48ch] text-base leading-relaxed text-ink-600 text-pretty">
            {t('blogList.noPostsAvailable')}
          </p>
        </PageSection>
      </>
    );
  }

  const [lead, ...rest] = posts;
  const leadTitle = getTranslatedText(lead.title, language);
  const leadBody = getTranslatedText(lead.description, language);
  const leadImage = coverImage(lead.imageUrl);

  return (
    <>
      {hero}

      {/* The lead. One post set large, so the index opens with an article
          rather than with a wall of equal cards. */}
      <PageSection tone="white">
        <Reveal as="article">
          <Link
            href={`/blogs/${lead.slug}`}
            className="focus-ring group grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12"
          >
            {leadImage ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-ink-200 bg-ink-50 lg:col-span-7">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={leadImage}
                  alt={leadTitle}
                  loading="eager"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.03]"
                />
              </div>
            ) : (
              /* No cover: a typographic plate rather than a borrowed
                 photograph. The council has no stock library and the
                 template's stock fallback is gone. */
              <div className="relative flex aspect-[16/10] items-end overflow-hidden rounded-2xl border border-ink-200 bg-ink-50 p-8 lg:col-span-7">
                <span
                  aria-hidden="true"
                  className="absolute -right-2 -top-6 font-display text-[10rem] leading-none text-ink-200"
                >
                  01
                </span>
                <span className="relative font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-700">
                  {t(`blogList.categories.${categoryKey(leadBody)}`)}
                </span>
              </div>
            )}

            <div className="lg:col-span-5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.24em]">
                <time dateTime={isoDate(lead.createdAt)} className="tnum text-ink-500">
                  {formatLongDate(lead.createdAt, language)}
                </time>
                <span aria-hidden="true" className="h-px w-6 bg-ink-300" />
                <span className="text-plum-700">
                  {t(`blogList.categories.${categoryKey(leadBody)}`)}
                </span>
              </div>

              <h2 className="mt-6 font-display text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.06] tracking-tight text-ink-900 text-balance transition-colors duration-300 group-hover:text-plum-700">
                {leadTitle}
              </h2>

              <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-ink-600 text-pretty">
                {excerpt(leadBody, 220)}
              </p>

              <span className="mt-8 inline-flex items-center gap-2 font-ui text-sm font-medium text-plum-700">
                {t('common.readMore')}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </Reveal>
      </PageSection>

      {/* The rest of the archive. No section heading: the hero already names
          this page, and repeating "Blogs" over the grid reads as a mistake. */}
      {rest.length > 0 && (
        <PageSection tone="tint">
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((post, i) => {
              const title = getTranslatedText(post.title, language);
              const body = getTranslatedText(post.description, language);
              const image = coverImage(post.imageUrl);
              const ordinal = String(i + 2).padStart(2, '0');

              return (
                <Reveal as="li" key={post.id} delay={Math.min(i, 8) * 60}>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="card card-hover focus-ring group flex h-full flex-col overflow-hidden rounded-2xl"
                  >
                    {image ? (
                      <div className="relative aspect-[16/9] overflow-hidden border-b border-ink-200 bg-ink-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt={title}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.04]"
                        />
                      </div>
                    ) : (
                      <div className="relative flex aspect-[16/9] items-end overflow-hidden border-b border-ink-200 bg-ink-50 p-6">
                        <span
                          aria-hidden="true"
                          className="absolute -right-1 -top-5 font-display text-[7rem] leading-none text-ink-200"
                        >
                          {ordinal}
                        </span>
                        <span className="relative font-mono text-[0.62rem] uppercase tracking-[0.24em] text-plum-700">
                          {t(`blogList.categories.${categoryKey(body)}`)}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-6 lg:p-7">
                      <div className="flex items-center justify-between gap-4 font-mono text-[0.62rem] uppercase tracking-[0.24em]">
                        <time dateTime={isoDate(post.createdAt)} className="tnum text-ink-500">
                          {formatLongDate(post.createdAt, language)}
                        </time>
                        <span aria-hidden="true" className="text-ink-400">
                          {ordinal}
                        </span>
                      </div>

                      <h3 className="mt-5 font-display text-xl font-semibold leading-tight tracking-tight text-ink-900 text-pretty transition-colors duration-300 group-hover:text-plum-700 lg:text-2xl">
                        {title}
                      </h3>

                      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink-600 text-pretty">
                        {excerpt(body, 160)}
                      </p>

                      <span className="mt-auto inline-flex items-center gap-2 pt-7 font-ui text-sm font-medium text-plum-700">
                        {t('common.readMore')}
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </PageSection>
      )}
    </>
  );
}
