"use client";
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect} from 'react';
import {localeFromPath,basePath,localizedPath,locales,tr} from '@/lib/locale';
export function LanguageSwitch(){const pathname=usePathname(),locale=localeFromPath(pathname);useEffect(()=>{document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';},[locale]);if(basePath(pathname)==='/admin')return null;return <nav dir="ltr" aria-label={tr(locale,'Language','Langue','اللغة')} className="flex shrink-0 items-center gap-2 text-xs">{locales.map(l=><Link key={l} href={localizedPath(basePath(pathname),l)} hrefLang={l} lang={l} aria-current={locale===l?'page':undefined} className={locale===l?'font-semibold text-ink':'text-ink-56'}>{l==='ar'?'العربية':l.toUpperCase()}</Link>)}</nav>}
