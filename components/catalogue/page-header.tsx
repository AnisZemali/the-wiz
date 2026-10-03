import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";

export type Crumb = { label: string; href?: string };

/** Shared masthead for every catalogue route. */
export function CataloguePageHeader({
  crumbs,
  eyebrow,
  title,
  intro,
  locale = 'en',
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  locale?: 'en' | 'fr' | 'ar';
}) {
  return (
    <header className="shell pt-32 pb-16 md:pt-44 md:pb-20">
      <Reveal distance={12}>
        <nav aria-label={locale === "ar" ? "مسار التنقل" : locale === "fr" ? "Fil d’Ariane" : "Breadcrumb"}>
          <ol className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-ink-40">
            {crumbs.map((crumb, index) => (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden className="text-ink-24">
                    /
                  </span>
                ) : null}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors duration-300 hover:text-ink"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-ink-72">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </Reveal>

      <Reveal delay={0.06}>
        <p className="type-eyebrow mt-12">{eyebrow}</p>
      </Reveal>

      <Reveal delay={0.12}>
        <h1 className="type-display mt-6 text-[clamp(2.5rem,6.5vw,5.5rem)]">
          {title}
        </h1>
      </Reveal>

      {intro ? (
        <Reveal delay={0.18}>
          <p className="type-lead mt-8 max-w-xl">{intro}</p>
        </Reveal>
      ) : null}
    </header>
  );
}
