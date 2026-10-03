"use client";
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {localeFromPath,localizedPath} from '@/lib/locale';
export function SectionLink({href,children,...props}:React.ComponentPropsWithoutRef<'a'>&{href:string}){const locale=localeFromPath(usePathname());return <Link href={href.startsWith('#')?`${localizedPath('/',locale)}${href}`:href.startsWith('/')?localizedPath(href,locale):href} {...props}>{children}</Link>}
