"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SectionLink } from "@/components/layout/section-link";
import { ButtonLink } from "@/components/ui/button";
import { nav, site } from "@/lib/content";
import { cn } from "@/lib/utils";
import { LanguageSwitch } from './language-switch';
import { isFrenchPath, frenchNav } from '@/lib/locale';

export function Nav() {
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const french = isFrenchPath(pathname);
  const localPath = (french ? pathname.slice(3) : pathname).replace(/\/$/, '') || '/';
  const [lifted, setLifted] = useState(false);

  // Book pages carry their own #order panel; everywhere else, go home for it.
  const hasLocalOrder = localPath === "/" || (localPath.startsWith("/courses/") && localPath.split("/").length === 4) || (localPath.startsWith("/books/") && localPath.split("/").length === 5);
  const orderHref = hasLocalOrder ? "#order" : french ? "/fr/#order" : "/#order";

  useMotionValueEvent(scrollY, "change", (value) => {
    setLifted(value > 24);
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "absolute inset-0 -z-10 border-b transition-[opacity,background-color,border-color] duration-500",
          lifted
            ? "border-ink-08 bg-paper/80 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      />
      <nav className="shell flex h-[4.5rem] items-center justify-between gap-3 md:h-20">
        <SectionLink
          href="#top"
          className="type-display text-[1.0625rem] tracking-[-0.02em] md:text-lg"
          aria-label={`${site.name} — home`}
        >
          THE WIZ
        </SectionLink>

        <ul className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <SectionLink
                href={item.href}
                className="group relative inline-block py-1 text-[0.9375rem] text-ink-56 transition-colors duration-300 hover:text-ink"
              >
                {french ? frenchNav[item.label] : item.label}
                <span className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
              </SectionLink>
            </li>
          ))}
        </ul>

        <SectionLink href="/courses" className="ml-auto text-sm lg:hidden">Collections</SectionLink>
        <LanguageSwitch />
        <ButtonLink href={orderHref} size="md" className="h-10 px-5 text-sm">
          {french ? 'Commander' : 'Order'}
        </ButtonLink>
      </nav>
    </motion.header>
  );
}
