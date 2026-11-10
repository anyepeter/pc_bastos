import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import ContactClient from './ContactClient';
import { getSiteSettings } from '@/app/actions/settings';
import { languageOf, pageTrail, staticPageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, graph, organizationJsonLd } from '@/lib/structured-data';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return staticPageMetadata('contact', languageOf(params));
}

export default async function Page({ params }: { params: { lang: string } }) {
  const language = languageOf(params);
  const settings = await getSiteSettings();

  return (
    <>
      {/* The council's contact details as structured data, from site settings. */}
      <JsonLd
        data={graph(
          organizationJsonLd({ language, settings }),
          breadcrumbJsonLd(language, pageTrail(language, 'contact'))
        )}
      />
      <ContactClient />
    </>
  );
}
