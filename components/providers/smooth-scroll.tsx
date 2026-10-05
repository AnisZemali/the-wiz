"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ScrollLock = {
  /** Freeze the page — used while a modal is open. */
  lock: () => void;
  unlock: () => void;
};

const ScrollLockContext = createContext<ScrollLock>({
  lock: () => {},
  unlock: () => {},
});

export const useScrollLock = () => useContext(ScrollLockContext);

/**
 * Inertial scrolling for the whole document.
 * Skipped entirely when the user prefers reduced motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const [, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
      wheelMultiplier: 0.9,
    });
    lenisRef.current = lenis;
    setReady(true);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // The shared layout survives navigation; discard the previous page's
  // inertial target so it cannot pull the new page back down.
  useEffect(() => {
    const reset = () => {
      const lenis = lenisRef.current;
      lenis?.resize();
      let target: HTMLElement | null = null;
      try {
        target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      } catch { /* Invalid fragments fall back to the top. */ }
      const top = target
        ? Math.max(0, target.getBoundingClientRect().top + window.scrollY - 96)
        : 0;
      if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
      else window.scrollTo({ top, left: 0, behavior: 'instant' });
    };
    reset();
    const frame = requestAnimationFrame(reset);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  // In-page anchors: eased when Lenis is live, native otherwise.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href]',
      ) as HTMLAnchorElement | null;
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href);
      if (url.origin !== location.origin || url.pathname.replace(/\/$/, '') !== location.pathname.replace(/\/$/, '') || url.search !== location.search) return;
      const hash = url.hash;
      if (!hash || hash === "#") return;

      let target: HTMLElement | null = null;
      try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
      if (!target) return;

      const lenis = lenisRef.current;


      event.preventDefault();
      if (lenis) lenis.scrollTo(target, {offset:-96});
      else window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+window.scrollY-96),behavior:'instant'});
      history.replaceState(history.state, "", hash);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const value = useMemo<ScrollLock>(
    () => ({
      lock: () => {
        lenisRef.current?.stop();
        document.documentElement.style.overflow = "hidden";
      },
      unlock: () => {
        lenisRef.current?.start();
        document.documentElement.style.overflow = "";
      },
    }),
    [],
  );

  return (
    <ScrollLockContext.Provider value={value}>
      {children}
    </ScrollLockContext.Provider>
  );
}
