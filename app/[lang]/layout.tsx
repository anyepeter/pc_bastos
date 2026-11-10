import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import RootShell from '@/components/RootShell';
import { getSiteSettings } from '@/app/actions/settings';
import { DEFAULT_LOGO, logoSrc } from '@/lib/site-settings';
import { isLanguage } from '@/lib/locale-path';
import { LANGUAGES } from '@/lib/translations';
import { languageOf, PAGE_COPY } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';

/**
 * Root layout of the public site. `lang` is 'en' or 'fr': middleware.ts rewrites
 * an unprefixed address to /en/… internally, and /fr/… arrives as is. Both
 * languages are prerendered.
 */
export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: '#5B32A6', // plum-700
};

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const language = languageOf(params);
  const logo = logoSrc(await getSiteSettings());

  // The bundled logo has square, sized icons cut from it; an uploaded logo is
  // used as is (the tab icon follows /admin/settings).
  const icons: Metadata['icons'] =
    logo === DEFAULT_LOGO
      ? {
          icon: [
            { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
            { url: '/images/icons/icon-96.png', type: 'image/png', sizes: '96x96' },
            { url: '/images/icons/icon-192.png', type: 'image/png', sizes: '192x192' },
          ],
          apple: { url: '/images/icons/apple-touch-icon.png', sizes: '180x180' },
        }
      : { icon: logo, apple: logo };

  return {
    title: {
      default: PAGE_COPY.home[language].title,
      template: `%s · ${SITE_NAME}`,
    },
    description: PAGE_COPY.home[language].description,
    applicationName: SITE_NAME,
    manifest: '/manifest.webmanifest',
    icons,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    // Phone numbers are marked up as tel: links where they appear.
    formatDetection: { telephone: false, address: false, email: false },
  };
}

export default function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isLanguage(params.lang)) notFound();

  return <RootShell language={params.lang}>{children}</RootShell>;
}
