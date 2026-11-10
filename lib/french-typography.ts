/**
 * French typographic spacing, applied when French text is rendered.
 *
 * French sets a no-break space before ? ! ; : % and », after «, and between
 * the digit groups of a number ("15 500"), so none of them can wrap onto a line
 * of their own. Editors type an ordinary space, as they would anywhere, and
 * this turns it into a no-break space at render time. A straight apostrophe
 * between two letters (l'Église) becomes the typographic one (l’Église).
 *
 * Why U+00A0 and not the thinner U+202F that print typography uses before
 * ? ! ; — none of the four site fonts (Google's latin subsets of Inter,
 * Playfair Display, Outfit, JetBrains Mono) contains U+202F, so the browser
 * would borrow it from a fallback font, and on some systems draw a box.
 *
 * It only ever REPLACES whitespace that is already there — it never inserts a
 * space — so URLs (https://…), times (14:30), {{placeholders}} and markdown
 * syntax pass through untouched. Markdown table rows (lines starting with |)
 * and fenced code blocks are skipped entirely.
 *
 * Applied by the French i18next instance (lib/i18n.ts), getTranslatedText and
 * inLanguage for French, and pageMetadata. The admin editors read raw values
 * with readTranslation, so editors always see exactly what they typed.
 */

const NBSP = '\u00A0';
const SPACES = '[ \\u00A0\\u202F]+';

const BEFORE_MARK = new RegExp(`${SPACES}([?!;»])`, 'g');
const BEFORE_COLON = new RegExp(`${SPACES}:`, 'g');
const AFTER_GUILLEMET = new RegExp(`«${SPACES}`, 'g');
// "1 580", "15 500", "13 000 000" — a space between digit groups.
const DIGIT_GROUP = /(\d) (?=\d{3}(?!\d))/g;
const BEFORE_PERCENT = /(\d) (?=%)/g;
const APOSTROPHE = /(\p{L})'(?=\p{L})/gu;

function spaceLine(line: string): string {
  return line
    .replace(BEFORE_MARK, `${NBSP}$1`)
    .replace(BEFORE_COLON, `${NBSP}:`)
    .replace(AFTER_GUILLEMET, `«${NBSP}`)
    .replace(DIGIT_GROUP, `$1${NBSP}`)
    .replace(BEFORE_PERCENT, `$1${NBSP}`)
    .replace(APOSTROPHE, '$1’');
}

export function frenchTypography(text: string): string {
  if (!text || !/[?!;:»«'\d]/.test(text)) return text;

  let inFence = false;
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trimStart();
      if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
        inFence = !inFence;
        return line;
      }
      if (inFence || trimmed.startsWith('|')) return line;
      return spaceLine(line);
    })
    .join('\n');
}
