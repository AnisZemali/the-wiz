/**
 * The Wiz catalogue.
 *
 * A book is identified by specialty → year → subject. Books are derived from
 * the curricula below rather than listed one by one, so adding a year or a
 * subject is a one-line edit.
 *
 * ⚠ The subject lists are PLACEHOLDER curricula. Replace them with the real
 * programme for each specialty — everything downstream (routes, sitemap,
 * catalogue pages, SEO) regenerates automatically.
 */

export const currency = "DZD";

export const formatPrice = (value: number) =>
  `${new Intl.NumberFormat("en-US").format(value)} ${currency}`;

export type BookStatus = "available" | "coming-soon";

/** A `bundle` covers a whole year; a `subject` covers one module. */
export type BookKind = "bundle" | "subject";

export type Specialty = {
  slug: string;
  name: string;
  /** Total length of the degree, including any non-taught year. */
  degreeYears: number;
  /** Years that are taught — and therefore sellable. */
  studyYears: number;
  /** Explains the gap between degreeYears and studyYears, when there is one. */
  note?: string;
};

export type Book = {
  /** Stable identity: `${specialty}/${year}/${subject}`. */
  id: string;
  specialty: string;
  specialtyName: string;
  year: number;
  kind: BookKind;
  /** URL segment within its year. */
  slug: string;
  /** "Anatomy", or "Complete first year" for a bundle. */
  subject: string;
  /** Full product name. */
  title: string;
  status: BookStatus;
  /** Undefined until a book is priced. */
  price?: number;
  pages?: number;
  summary: string;
  href: string;
};

export const specialties: readonly Specialty[] = [
  {
    slug: "medicine",
    name: "Medicine",
    degreeYears: 7,
    studyYears: 6,
    note: "The seventh year is spent in hospital, so the series covers years one to six.",
  },
  {
    slug: "pharmacy",
    name: "Pharmacy",
    degreeYears: 5,
    studyYears: 5,
  },
  {
    slug: "dental-surgery",
    name: "Dental medicine",
    degreeYears: 5,
    studyYears: 5,
  },
] as const;

/**
 * Subjects per taught year, indexed from year one.
 * PLACEHOLDER — replace with the real programme.
 */
const curricula: Record<string, readonly (readonly string[])[]> = {
  medicine: [
    [
      "Anatomy",
      "Cytology",
      "Histology",
      "Embryology",
      "Biochemistry",
      "Biophysics",
      "Physiology",
    ],
    [
      "Anatomy",
      "Physiology",
      "Histology",
      "Biochemistry",
      "Genetics",
      "Immunology",
    ],
    [
      "Semiology",
      "Pathology",
      "Pharmacology",
      "Microbiology",
      "Parasitology",
      "Radiology",
    ],
    [
      "Cardiology",
      "Pulmonology",
      "Gastroenterology",
      "Nephrology",
      "Endocrinology",
      "Haematology",
      "Neurology",
    ],
    [
      "Paediatrics",
      "Gynaecology and obstetrics",
      "General surgery",
      "Psychiatry",
      "Infectious diseases",
      "Dermatology",
    ],
    [
      "Emergency medicine",
      "Oncology",
      "Public health",
      "Legal medicine",
      "Ophthalmology",
      "ENT",
    ],
  ],
  pharmacy: [
    ["Anatomy", "Biochemistry", "Botany", "Biophysics", "Cytology"],
    ["Physiology", "Organic chemistry", "Microbiology", "Immunology"],
    ["Pharmacology", "Galenic pharmacy", "Toxicology", "Analytical chemistry"],
    ["Clinical pharmacy", "Pharmacognosy", "Biochemistry", "Haematology"],
    ["Pharmaceutical legislation", "Hospital pharmacy", "Pharmacovigilance"],
  ],
  "dental-surgery": [
    ["Anatomy", "Histology", "Biochemistry", "Dental anatomy"],
    ["Physiology", "Microbiology", "Occlusodontics", "Biomaterials"],
    ["Restorative dentistry", "Periodontology", "Oral pathology"],
    ["Prosthodontics", "Oral surgery", "Orthodontics", "Endodontics"],
    ["Paediatric dentistry", "Implantology", "Oral medicine"],
  ],
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    // Strip combining marks so "Pédiatrie" becomes "pediatrie", not "p-diatrie".
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const yearSlug = (year: number) => `year-${year}`;

export const parseYearSlug = (slug: string): number | null => {
  const match = /^year-(\d+)$/.exec(slug);
  if (!match) return null;
  const year = Number(match[1]);
  return Number.isInteger(year) && year > 0 ? year : null;
};

const ordinals = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
];

export const yearLabel = (year: number) => `Year ${year}`;

export const yearOrdinal = (year: number) =>
  ordinals[year - 1] ? `${ordinals[year - 1]} year` : `year ${year}`;

/**
 * The one book that exists today. It predates the per-subject model and
 * covers a whole year, so it is modelled as a bundle rather than reshaped
 * into a subject it is not.
 */
const flagshipId = "medicine/1/complete-first-year";

const overrides: Record<string, Partial<Book>> = {
  [flagshipId]: {
    // Keeps the name the landing page and the printed cover already use.
    title: "The Wiz — First Year Medicine",
    status: "available",
    price: 4500,
    pages: 320,
  },
};

function buildBooks(): Book[] {
  const books: Book[] = [];

  for (const specialty of specialties) {
    const years = curricula[specialty.slug] ?? [];

    years.forEach((subjects, index) => {
      const year = index + 1;

      // Year bundles come first in the listing.
      const bundleSlug = `complete-${ordinals[year - 1] ?? `year-${year}`}-year`;
      const entries: Array<{
        kind: BookKind;
        slug: string;
        subject: string;
        title: string;
        summary: string;
      }> = [
        {
          kind: "bundle",
          slug: bundleSlug,
          subject: `Complete ${yearOrdinal(year)}`,
          title: `${specialty.name} — ${yearOrdinal(year)}, complete`,
          summary: `Every subject of the ${specialty.name.toLowerCase()} ${yearOrdinal(
            year,
          )} in one notebook: ${subjects.slice(0, 3).join(", ").toLowerCase()} and more, each chapter followed by your own note pages.`,
        },
        ...subjects.map((subject) => ({
          kind: "subject" as const,
          slug: slugify(subject),
          subject,
          title: `${subject} — ${specialty.name}, ${yearLabel(year).toLowerCase()}`,
          summary: `High-yield ${subject.toLowerCase()} summaries for ${specialty.name.toLowerCase()} ${yearLabel(
            year,
          ).toLowerCase()}, with diagrams, mnemonics and dedicated note pages after every chapter.`,
        })),
      ];

      for (const entry of entries) {
        const id = `${specialty.slug}/${year}/${entry.slug}`;
        books.push({
          id,
          specialty: specialty.slug,
          specialtyName: specialty.name,
          year,
          kind: entry.kind,
          slug: entry.slug,
          subject: entry.subject,
          title: entry.title,
          status: "coming-soon",
          summary: entry.summary,
          href: `/books/${specialty.slug}/${yearSlug(year)}/${entry.slug}`,
          ...overrides[id],
        });
      }
    });
  }

  return books;
}

export const books: readonly Book[] = buildBooks();

export const getSpecialty = (slug: string) =>
  specialties.find((specialty) => specialty.slug === slug);

export const getBook = (
  specialty: string,
  year: number,
  slug: string,
): Book | undefined =>
  books.find(
    (book) =>
      book.specialty === specialty && book.year === year && book.slug === slug,
  );

export const booksBySpecialty = (specialty: string) =>
  books.filter((book) => book.specialty === specialty);

export const booksByYear = (specialty: string, year: number) =>
  books.filter((book) => book.specialty === specialty && book.year === year);

export const availableBooks = books.filter(
  (book) => book.status === "available",
);

/** The book the landing page sells. */
export const flagship =
  books.find((book) => book.id === flagshipId) ?? books[0];

export const yearsOf = (specialty: string) => {
  const years = new Set(booksBySpecialty(specialty).map((book) => book.year));
  return [...years].sort((a, b) => a - b);
};

export const catalogueStats = {
  total: books.length,
  available: availableBooks.length,
  specialties: specialties.length,
};
