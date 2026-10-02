export type Locale = 'en' | 'fr';
export const isFrenchPath = (path: string) => path === '/fr' || path.startsWith('/fr/');
export const localizedPath = (path: string, locale: Locale) => locale === 'fr' ? `/fr${path === '/' ? '' : path}` : path;
export const frenchNav: Record<string, string> = { Collections: 'Collections', Why: 'Pourquoi', Inside: 'À découvrir', Books: 'Livres', FAQ: 'FAQ' };
export const frenchYear = (year: number) => `${year}${year === 1 ? 're' : 'e'} année`;
