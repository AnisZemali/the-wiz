"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { isFrenchPath } from '@/lib/locale';

export function LanguageSwitch() {
  const pathname = usePathname();
  const french = isFrenchPath(pathname);
  const englishPath = (french ? pathname.slice(3) : pathname).replace(/\/$/, '') || '/';
  useEffect(() => { document.documentElement.lang = french ? 'fr' : 'en'; }, [french]);
  if (pathname.replace(/\/$/, '') === '/admin') return null;
  return <nav aria-label={french ? 'Langue' : 'Language'} className="flex shrink-0 items-center gap-2 text-xs">
    <Link href={englishPath} hrefLang="en" lang="en" aria-current={!french ? 'page' : undefined} className={!french ? 'font-semibold text-ink' : 'text-ink-56'}>EN</Link><span aria-hidden className="text-ink-24">/</span><Link href={`/fr${englishPath === '/' ? '' : englishPath}`} hrefLang="fr" lang="fr" aria-current={french ? 'page' : undefined} className={french ? 'font-semibold text-ink' : 'text-ink-56'}>FR</Link>
  </nav>;
}
