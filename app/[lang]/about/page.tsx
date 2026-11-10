import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import AboutClient from './AboutClient';
import { getPublishedChurches } from '@/app/actions/churches';
import { languageOf, pageTrail, staticPageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, graph } from '@/lib/structured-data';
import { getTranslatedText, readTranslation } from '@/lib/translations';

export const revalidate = 3600;

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return staticPageMetadata('about', languageOf(params));
}

export default async function Page({ params }: { params: { lang: string } }) {
  const language = languageOf(params);
  const result = await getPublishedChurches();
  const churches = (result.success && Array.isArray(result.data) ? result.data : []).map((church) => ({
    slug: String(church.slug),
    name: getTranslatedText(readTranslation(church.denomination), language),
    logo: typeof church.logo === 'string' && church.logo ? church.logo : null,
  }));

  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd(language, pageTrail(language, 'about')))} />
      <AboutClient churches={churches} />
    </>
  );
}
