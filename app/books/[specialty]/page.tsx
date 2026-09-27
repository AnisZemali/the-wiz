import { redirect } from 'next/navigation';
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogueBrowser } from "@/components/catalogue/catalogue-browser";
import { CataloguePageHeader } from "@/components/catalogue/page-header";
import { booksBySpecialty, getSpecialty, specialties } from "@/lib/catalogue";

type Params = { specialty: string };

export function generateStaticParams(): Params[] {
  return specialties.map((specialty) => ({ specialty: specialty.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { specialty: slug } = await params;
  const specialty = getSpecialty(slug);
  if (!specialty) return {};

  return {
    title: `${specialty.name} books`,
    description: `The Wiz for ${specialty.name.toLowerCase()} — handwritten summaries, diagrams and note pages across all ${specialty.studyYears} taught years.`,
    alternates: { canonical: `/books/${specialty.slug}` },
  };
}

export default function LegacyBookPage() { redirect('/courses'); }
