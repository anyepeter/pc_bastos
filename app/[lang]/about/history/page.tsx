import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import HistoryClient from './HistoryClient';
import { languageOf, pageTrail, staticPageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, graph } from '@/lib/structured-data';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return staticPageMetadata('history', languageOf(params));
}

export default function Page({ params }: { params: { lang: string } }) {
  const language = languageOf(params);
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd(language, pageTrail(language, 'about', 'history')))} />
      <HistoryClient />
    </>
  );
}
