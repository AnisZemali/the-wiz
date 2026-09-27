import { redirect } from 'next/navigation';
import type { Metadata } from "next";
import Link from "next/link";

import { CatalogueBrowser } from "@/components/catalogue/catalogue-browser";
import { CataloguePageHeader } from "@/components/catalogue/page-header";
import { Reveal } from "@/components/ui/reveal";
import { books, catalogueStats, specialties } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "All books",
  description:
    "Every edition of The Wiz — structured handwritten summaries with dedicated note pages, across medicine, pharmacy and dental medicine, year by year and subject by subject.",
  alternates: { canonical: "/books" },
};

export default function LegacyBookPage() { redirect('/courses'); }
