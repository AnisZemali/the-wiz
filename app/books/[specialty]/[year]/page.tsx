import { redirect } from 'next/navigation';
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogueBrowser } from "@/components/catalogue/catalogue-browser";
import { CataloguePageHeader } from "@/components/catalogue/page-header";
import {
  booksByYear,
  getSpecialty,
  parseYearSlug,
  specialties,
  yearLabel,
  yearOrdinal,
  yearSlug,
  yearsOf,
} from "@/lib/catalogue";

type Params = { specialty: string; year: string };

export function generateStaticParams(): Params[] {
  return specialties.flatMap((specialty) =>
    yearsOf(specialty.slug).map((year) => ({
      specialty: specialty.slug,
      year: yearSlug(year),
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { specialty: slug, year: yearParam } = await params;
  const specialty = getSpecialty(slug);
  const year = parseYearSlug(yearParam);
  if (!specialty || year === null) return {};

  return {
    title: `${specialty.name}, ${yearLabel(year).toLowerCase()}`,
    description: `Every ${specialty.name.toLowerCase()} ${yearOrdinal(year)} subject as a Wiz notebook — summaries, diagrams, mnemonics and dedicated note pages.`,
    alternates: { canonical: `/books/${specialty.slug}/${yearSlug(year)}` },
  };
}

export default function LegacyBookPage() { redirect('/courses'); }
