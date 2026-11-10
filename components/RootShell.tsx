import StoreProvider from '@/components/StoreProvider';
import I18nProvider from '@/components/I18nProvider';
import SiteSettingsProvider from '@/components/SiteSettingsProvider';
import { getSiteSettings } from '@/app/actions/settings';
import { fontVariables } from '@/lib/fonts';
import type { Language } from '@/lib/translations';

const SKIP_LINK: Record<Language, string> = {
  en: 'Skip to content',
  fr: 'Aller au contenu',
};

/**
 * The <html> document shared by the two root layouts: the bilingual site
 * (app/[lang]/layout.tsx, in the address's language) and the dashboard
 * (app/admin/layout.tsx and app/sign-in/layout.tsx, in English).
 */
export default async function RootShell({
  language,
  children,
}: {
  language: Language;
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  // The inline script in <body> adds `class="js"` to <html> before hydration,
  // which React would otherwise report as an extra server attribute — the exact
  // warning .bolt/prompt forbids. That element's attributes are script-owned,
  // so hydration checking is suppressed on it.
  return (
    <html lang={language} suppressHydrationWarning>
      <body className={`${fontVariables} font-sans antialiased`}>
        {/* Marks that scripting is available, before anything paints. The
            scroll-reveal styles hide content only under `.js`, so if this
            never runs the page renders fully visible instead of blank. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {/* Keyed by language: switching language builds a fresh store. */}
        <StoreProvider key={language} language={language}>
          <I18nProvider language={language}>
            <SiteSettingsProvider value={settings}>
              {/* Keyboard users can jump the 30-odd nav links. */}
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-plum-600 focus:px-5 focus:py-2.5 focus:font-ui focus:text-sm focus:font-semibold focus:text-white"
              >
                {SKIP_LINK[language]}
              </a>
              <main id="main">{children}</main>
            </SiteSettingsProvider>
          </I18nProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
