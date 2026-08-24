'use server';

import { Language } from '@/lib/translations';

/**
 * Machine translation helper used by the admin editor.
 *
 * Uses Google's public translate endpoint over plain fetch. The `free-translate`
 * package in package.json does the same thing through Puppeteer, which cannot run
 * in a Next.js server action on a serverless host — so we call the endpoint directly.
 *
 * Output is a DRAFT: the admin always reviews/edits before publishing.
 */

const ENDPOINT = 'https://translate.googleapis.com/translate_a/single';

// The endpoint is a GET, so the text has to fit comfortably inside a URL.
const MAX_PIECE = 1200;

export interface TranslateResult {
  success: boolean;
  data?: { title: string; description: string };
  error?: string;
}

export interface TranslateManyResult {
  success: boolean;
  /** Same keys as the input, with translated values. */
  data?: Record<string, string>;
  error?: string;
}

/**
 * Split a paragraph that is too long for one request into pieces that
 * concatenate back into the original string (no separator added).
 */
function splitLongBlock(block: string): string[] {
  const pieces: string[] = [];
  let rest = block;

  while (rest.length > MAX_PIECE) {
    let cut = rest.lastIndexOf('\n', MAX_PIECE);
    if (cut < MAX_PIECE / 2) cut = rest.lastIndexOf('. ', MAX_PIECE);
    if (cut < MAX_PIECE / 2) cut = rest.lastIndexOf(' ', MAX_PIECE);
    if (cut <= 0) cut = MAX_PIECE;
    else cut += 1;

    pieces.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }

  if (rest) pieces.push(rest);
  return pieces;
}

async function translatePiece(text: string, from: Language, to: Language): Promise<string> {
  const url =
    `${ENDPOINT}?client=gtx&sl=${from}&tl=${to}&dt=t&ie=UTF-8&oe=UTF-8` +
    `&q=${encodeURIComponent(text)}`;

  const response = await fetch(url, {
    headers: {
      // The endpoint rejects requests without a browser-ish user agent.
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Translation service responded with ${response.status}`);
  }

  const payload = await response.json();

  if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
    throw new Error('Unexpected response from translation service');
  }

  return payload[0]
    .map((segment: unknown) => (Array.isArray(segment) ? segment[0] ?? '' : ''))
    .join('');
}

/**
 * Translate a single string, preserving the paragraph structure of the markdown.
 * Blank input short-circuits so we never spend a request on it.
 */
async function translateString(text: string, from: Language, to: Language): Promise<string> {
  if (!text.trim()) return '';

  // Keep paragraph breaks intact so markdown structure survives the round trip.
  const blocks = text.split(/\n{2,}/);
  const translatedBlocks: string[] = [];

  for (const block of blocks) {
    if (!block.trim()) {
      translatedBlocks.push(block);
      continue;
    }

    const pieces = block.length > MAX_PIECE ? splitLongBlock(block) : [block];
    const translatedPieces: string[] = [];

    for (const piece of pieces) {
      translatedPieces.push(await translatePiece(piece, from, to));
    }

    // Google sometimes echoes trailing newlines; the join below adds them back.
    translatedBlocks.push(translatedPieces.join('').replace(/\n+$/, ''));
  }

  return translatedBlocks.join('\n\n');
}

/**
 * Translate an arbitrary set of named fields in one round trip.
 * Used by the generic admin editor (events, announcements, workshops, ...).
 */
export async function translateFields(input: {
  texts: Record<string, string>;
  from: Language;
  to: Language;
}): Promise<TranslateManyResult> {
  const { texts, from, to } = input;
  const entries = Object.entries(texts).filter(([, text]) => text.trim().length > 0);

  if (entries.length === 0) {
    return { success: false, error: 'There is nothing to translate yet' };
  }

  try {
    const translated: Record<string, string> = {};

    for (const [name, text] of entries) {
      translated[name] = await translateString(text, from, to);
    }

    return { success: true, data: translated };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? `Automatic translation failed (${error.message}). Please type the translation manually.`
          : 'Automatic translation failed. Please type the translation manually.',
    };
  }
}

/**
 * Translate a blog post's title and content in one round trip.
 * Used by the "Translate from ..." button in the admin editor.
 */
export async function translateBlogContent(input: {
  title: string;
  description: string;
  from: Language;
  to: Language;
}): Promise<TranslateResult> {
  const { title, description, from, to } = input;

  if (!title.trim() && !description.trim()) {
    return { success: false, error: 'There is nothing to translate yet' };
  }

  try {
    const [translatedTitle, translatedDescription] = [
      await translateString(title, from, to),
      await translateString(description, from, to),
    ];

    return {
      success: true,
      data: { title: translatedTitle, description: translatedDescription },
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? `Automatic translation failed (${error.message}). Please type the translation manually.`
          : 'Automatic translation failed. Please type the translation manually.',
    };
  }
}
