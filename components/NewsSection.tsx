'use client';

import Link from '@/components/LocalizedLink';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText, readTranslation } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';
import Reveal from '@/components/Reveal';
import NewsCard from '@/components/NewsCard';
import type { PublicNewsArticle } from '@/app/[lang]/news/NewsClient';

interface NewsSectionProps {
  /** Published articles, fetched by the page. Hides itself when empty. */
  articles: PublicNewsArticle[];
}

/**
 * Latest council news on the home page.
 *
 * Both comparable bodies lead their homepage with news — it is the signal that
 * an organisation is active. Three cards, the same component the `/news` index
 * uses, so the two can never drift apart.
 */
export default function NewsSection({ articles }: NewsSectionProps) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  if (articles.length === 0) return null;

  const read = (value: unknown) => getTranslatedText(readTranslation(value) as any, language);

  return (
    <section className="grain relative overflow-hidden bg-white py-14 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 h-[28rem] w-[28rem] rounded-full bg-plum-50 blur-[130px]"
      />

      <div className="shell relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-10 bg-plum-500" />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-plum-700">
                  {t('home.sections.news')}
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-7 font-display text-[clamp(2.1rem,4.2vw,3.4rem)] font-semibold leading-[1.04] tracking-tight text-ink-900 text-balance">
                {t('home.news.title')}{' '}
                <span className="text-leaf-600">{t('home.news.titleHighlight')}</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={140} className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-[48ch] text-base leading-relaxed text-ink-600 text-pretty lg:pb-2">
              {t('news.pageSubtitle')}
            </p>
          </Reveal>
        </div>

        <ul className="mt-11 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.slice(0, 3).map((article, i) => (
            <Reveal as="li" key={article.id} delay={Math.min(i, 8) * 60}>
              <NewsCard
                href={`/news/${article.slug}`}
                title={read(article.title)}
                excerpt={read(article.excerpt)}
                category={article.category ? read(article.category) : null}
                date={formatLongDate(article.date, language)}
                imageUrl={article.imageUrl}
                readLabel={t('news.readArticle')}
              />
            </Reveal>
          ))}
        </ul>

        <Reveal delay={220}>
          <Link
            href="/news"
            className="focus-ring group mt-10 inline-flex items-center gap-2.5 rounded-full border border-ink-200 bg-white px-6 py-3 font-ui text-sm font-medium text-ink-700 transition-all duration-300 ease-spring hover:border-plum-400 hover:text-plum-700"
          >
            {t('news.allNews')}
            <ArrowRight className="h-4 w-4 text-leaf-600 transition-transform duration-300 ease-spring group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
