export function slugify(text: string): string {
  return text
    .normalize('NFD') // separates letters from their accents: é → e + accent
    .replace(/[\u0300-\u036f]/g, '') // removes the accent marks.
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
