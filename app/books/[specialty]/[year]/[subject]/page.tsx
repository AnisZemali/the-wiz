import { redirect } from 'next/navigation';
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookCard } from "@/components/catalogue/book-card";
import { CataloguePageHeader } from "@/components/catalogue/page-header";
import { BookCover } from "@/components/notebook/book-cover";
import { OrderPanel } from "@/components/order/order-panel";
import { IconCheck } from "@/components/ui/icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Section, SectionHeader } from "@/components/ui/section";
import {
  books,
  booksByYear,
  getBook,
  getSpecialty,
  parseYearSlug,
  yearLabel,
  yearOrdinal,
  yearSlug,
} from "@/lib/catalogue";
import { insideFeatures, site } from "@/lib/content";

type Params = { specialty: string; year: string; subject: string };

export function generateStaticParams(): Params[] {
  return books.map((book) => ({
    specialty: book.specialty,
    year: yearSlug(book.year),
    subject: book.slug,
  }));
}

async function resolve(params: Promise<Params>) {
  const { specialty: specialtySlug, year: yearParam, subject } = await params;
  const specialty = getSpecialty(specialtySlug);
  const year = parseYearSlug(yearParam);
  if (!specialty || year === null) return null;

  const book = getBook(specialty.slug, year, subject);
  if (!book) return null;

  return { specialty, year, book };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolved = await resolve(params);
  if (!resolved) return {};

  const { book } = resolved;
  return {
    title: book.title,
    description: book.summary,
    alternates: { canonical: book.href },
    openGraph: {
      type: "website",
      url: `${site.url}${book.href}`,
      title: `${book.title} — ${site.name}`,
      description: book.summary,
    },
  };
}

export default function LegacyBookPage() { redirect('/courses'); }
