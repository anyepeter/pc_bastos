'use client';

import { Newspaper } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText, readTranslation } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import Reveal from '@/components/Reveal';
import NewsCard from '@/components/NewsCard';

export interface PublicNewsArticle {
  id: string;
  slug: string;
  title: unknown;
  excerpt: unknown;
  category: unknown;
  date: string;
  imageUrl: string | null;
}

export default function NewsClient({ articles }: { articles: PublicNewsArticle[] }) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);

  const read = (value: unknown) => getTranslatedText(readTranslation(value) as any, language);

  return (
    <>
      <PageHero title={t('news.pageTitle')} lede={t('news.pageSubtitle')} />

      <PageSection tone="white">
        {articles.length === 0 ? (
          <Reveal>
            <div className="card mx-auto max-w-xl rounded-2xl p-10 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-ink-200 bg-white">
                <Newspaper aria-hidden="true" className="h-5 w-5 text-leaf-600" />
              </span>
              <p className="mt-5 text-base leading-relaxed text-ink-600">{t('news.empty')}</p>
            </div>
          </Reveal>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article, i) => (
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
        )}
      </PageSection>
    </>
  );
}
