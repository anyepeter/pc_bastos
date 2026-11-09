/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    // Accented letters become plain ones ("Yaoundé" -> "yaounde") rather
    // than being dropped by the \w filter below.
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
