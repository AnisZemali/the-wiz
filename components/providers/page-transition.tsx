"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let animation: Animation | undefined;
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname.replace(/\/$/, '') !== location.pathname.replace(/\/$/, '') || url.search !== location.search) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      animation?.cancel();
      animation = container.current?.animate([{opacity:.35},{opacity:1}], {duration:180,easing:'ease-out'});
    };
    document.addEventListener('click', onClick, true);
    return () => { document.removeEventListener('click', onClick, true); animation?.cancel(); };
  }, []);
  return <div ref={container} key={pathname} className="page-transition">{children}</div>;
}
