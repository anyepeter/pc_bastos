import { Inter, Playfair_Display, Outfit, JetBrains_Mono } from 'next/font/google';

/** Body text (Tailwind `font-sans`). */
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

/** Headlines (`font-display`, `font-serif`). */
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  // The true italic, for mottos, quotes and accented words — a browser's
  // slanted imitation of the roman looks broken at display sizes.
  style: ['normal', 'italic'],
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

/** The font variables for <body>, shared by the site and dashboard layouts. */
export const fontVariables = `${inter.variable} ${playfair.variable} ${outfit.variable} ${jetbrains.variable}`;
