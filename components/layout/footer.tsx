"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { frenchNav, isFrenchPath } from '@/lib/locale';
import { SectionLink } from "@/components/layout/section-link";
import {
  IconArrow,
  IconInstagram,
  IconMail,
  IconTikTok,
} from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { nav, site } from "@/lib/content";

const socials = [
  {
    label: "Instagram",
    handle: site.instagramHandle,
    href: site.instagram,
    Icon: IconInstagram,
  },
  {
    label: "TikTok",
    handle: site.tiktokHandle,
    href: site.tiktok,
    Icon: IconTikTok,
  },
  {
    label: "Email",
    handle: site.email,
    href: `mailto:${site.email}`,
    Icon: IconMail,
  },
];

export function Footer() {
  const french = isFrenchPath(usePathname());
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-ink-08 pt-24 md:pt-32">
      <div className="shell">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal distance={14}>
              <p className="type-eyebrow">{french ? 'Contactez-nous' : 'Get in touch'}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="type-heading mt-6 max-w-sm text-[clamp(1.5rem,2.6vw,2rem)] font-normal">
                {french ? 'Une question, une commande groupée ou un groupe de promotion dans votre faculté ?' : 'Questions, bulk orders, or a promo group at your faculty?'}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <a
                href={`mailto:${site.email}`}
                className="group mt-8 inline-flex items-center gap-3 text-[0.9375rem] text-ink"
              >
                <span className="border-b border-ink-24 pb-1 transition-colors duration-500 group-hover:border-ink">
                  {site.email}
                </span>
                <IconArrow className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>

          <nav
            aria-label={french ? 'Pied de page' : 'Footer'}
            className="md:col-span-3 md:col-start-8"
          >
            <p className="type-eyebrow">Sections</p>
            <ul className="mt-6 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <SectionLink
                    href={item.href}
                    className="text-[0.9375rem] text-ink-56 transition-colors duration-300 hover:text-ink"
                  >
                    {french ? frenchNav[item.label] : item.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className="type-eyebrow">{french ? 'Suivez-nous' : 'Follow'}</p>
            <ul className="mt-6 space-y-3">
              {socials.map(({ label, handle, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={
                      href.startsWith("mailto:")
                        ? undefined
                        : "noreferrer noopener"
                    }
                    className="group inline-flex items-center gap-3 text-[0.9375rem] text-ink-56 transition-colors duration-300 hover:text-ink"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                    <span className="sr-only">— {handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Oversized wordmark, cropped at the baseline. */}
        <Reveal delay={0.1} distance={40}>
          <p
            aria-hidden
            className="type-display mt-24 w-full overflow-hidden text-center text-[clamp(3.5rem,19vw,17rem)] leading-[0.8] text-ink md:mt-32"
          >
            THE WIZ
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-4 border-t border-ink-08 py-8 text-[0.8125rem] text-ink-40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. {french ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
          <p>{french ? 'Créé par un étudiant en médecine, pour les étudiants en médecine.' : 'Made by a medical student, for medical students.'}</p>
          <Link href="/admin" className="underline underline-offset-4">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
