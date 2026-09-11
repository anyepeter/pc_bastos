'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText, readTranslation } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import MetaRail from '@/components/MetaRail';
import Reveal from '@/components/Reveal';

export interface PublicNewsDetail {
  id: string;
  slug: string;
  title: unknown;
  excerpt: unknown;
  body: unknown;
  category: unknown;
  date: string;
  imageUrl: string | null;
}

/* Markdown on-palette. Deliberately not the global `.prose` sheet, which is
   written in Tailwind default greys and a blue link colour. */
const PROSE =
  'text-base leading-relaxed text-ink-600 text-pretty ' +
  '[&_p]:mt-5 [&>p:first-child]:mt-0 ' +
  '[&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink-900 ' +
  '[&_h3]:mt-9 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-ink-900 ' +
  '[&_strong]:font-semibold [&_strong]:text-ink-900 ' +
  '[&_a]:font-medium [&_a]:text-plum-700 [&_a]:underline [&_a]:underline-offset-4 ' +
  '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-2 [&_li]:marker:text-leaf-600 ' +
  '[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-plum-300 [&_blockquote]:pl-5 [&_blockquote]:text-ink-700 ' +
  '[&_hr]:mt-8 [&_hr]:border-ink-200';

export default function NewsDetailClient({ article }: { article: PublicNewsDetail }) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  const read = (value: unknown) => getTranslatedText(readTranslation(value) as any, language);
  const title = read(article.title);
  const category = article.category ? read(article.category) : '';

  const meta = [
    { key: 'date', icon: Calendar, label: t('news.date'), value: formatLongDate(article.date, language) },
    ...(category ? [{ key: 'category', icon: Tag, label: t('news.category'), value: category }] : []),
  ];

  return (
    <>
      <PageHero title={title} lede={read(article.excerpt)}>
        <MetaRail items={meta} className="mt-8" />
      </PageHero>

      <PageSection tone="white">
        <div className="mx-auto max-w-3xl">
          {article.imageUrl && (
            <Reveal className="mb-10">
              <figure className="overflow-hidden rounded-2xl border border-ink-200 bg-ink-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.imageUrl} alt={title} className="aspect-[16/9] w-full object-cover" />
              </figure>
            </Reveal>
          )}

          <Reveal delay={80}>
            <div className={PROSE}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{read(article.body)}</ReactMarkdown>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <Link
              href="/news"
              className="focus-ring group mt-12 inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-5 py-2.5 font-ui text-sm font-medium text-ink-700 transition-all duration-300 ease-spring hover:border-plum-400 hover:text-plum-700"
            >
              <ArrowLeft className="h-4 w-4 text-leaf-600 transition-transform duration-300 ease-spring group-hover:-translate-x-0.5" />
              {t('news.allNews')}
            </Link>
          </Reveal>
        </div>
      </PageSection>
    </>
  );
}
