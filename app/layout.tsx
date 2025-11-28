import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Poppins } from 'next/font/google';
import { ClerkProvider,SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton, } from '@clerk/nextjs';
import StoreProvider from '@/components/StoreProvider';
import I18nProvider from '@/components/I18nProvider';


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const poppins = Poppins({ 
  subsets: ['latin'], 
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'Grace Community Church - Welcome Home',
  description: 'A place where faith grows, community thrives, and lives are transformed. Join us for worship, fellowship, and spiritual growth.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} ${playfair.variable} ${poppins.variable} font-sans antialiased`}>
          <StoreProvider>
            <I18nProvider>
              <main>{children}</main>
            </I18nProvider>
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}