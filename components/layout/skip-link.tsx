"use client";
import {usePathname} from 'next/navigation';
import {localeFromPath,tr} from '@/lib/locale';
export function SkipLink(){const locale=localeFromPath(usePathname());return <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-paper">{tr(locale,'Skip to content','Aller au contenu','انتقل إلى المحتوى')}</a>}
