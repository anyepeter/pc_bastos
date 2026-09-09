import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Poppins, Outfit, JetBrains_Mono } from 'next/font/google';
import StoreProvider from '@/components/StoreProvider';
import I18nProvider from '@/components/I18nProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

/** Display face — headlines and nav. Carries the four weights the scale uses. */
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

/** Eyebrow labels, counters and figures. */
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cepca.org'),
  title: {
    default: 'CEPCA — Council of Protestant Churches of Cameroon',
    template: '%s · CEPCA',
  },
  description:
    'Twelve Protestant churches, one voice. CEPCA coordinates health, education and pastoral work across Cameroon on behalf of 13 million believers.',
  keywords: ['CEPCA', 'CPCC', 'Protestant churches', 'Cameroon', 'ecumenical council', 'église protestante'],
  openGraph: {
    type: 'website',
    siteName: 'CEPCA',
    title: 'CEPCA — Council of Protestant Churches of Cameroon',
    description:
      'Twelve Protestant churches, one voice. Health, education and pastoral work across Cameroon.',
    images: [{ url: '/images/hero-image.jpg', width: 1200, height: 630, alt: 'CEPCA member churches gathered in worship' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CEPCA — Council of Protestant Churches of Cameroon',
    description: 'Twelve Protestant churches, one voice.',
    images: ['/images/hero-image.jpg'],
  },
  icons: {
    icon: '/images/logo_CEPCA.png',
    apple: '/images/logo_CEPCA.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The inline script in <body> adds `class="js"` to <html> before hydration,
  // which React would otherwise report as an extra server attribute — the exact
  // warning .bolt/prompt forbids. That element's attributes are script-owned,
  // so hydration checking is suppressed on it.
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${poppins.variable} ${outfit.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        {/* Marks that scripting is available, before anything paints. The
            scroll-reveal styles hide content only under `.js`, so if this
            never runs the page renders fully visible instead of blank. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <StoreProvider>
          <I18nProvider>
            {/* Keyboard users can jump the 30-odd nav links. */}
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-plum-600 focus:px-5 focus:py-2.5 focus:font-ui focus:text-sm focus:font-semibold focus:text-white"
            >
              Skip to content
            </a>
            <main id="main">{children}</main>
          </I18nProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
