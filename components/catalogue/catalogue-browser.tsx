"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { BookCard } from "@/components/catalogue/book-card";
import {
  specialties,
  yearLabel,
  yearsOf,
  type Book,
} from "@/lib/catalogue";
import { cn } from "@/lib/utils";
import { frenchYear, type Locale } from '@/lib/locale';

const EASE = [0.22, 1, 0.36, 1] as const;

type Filter = string | null;

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2 text-[0.8125rem] transition-[background-color,color,border-color] duration-300",
        active
          ? "border-ink bg-ink text-paper"
          : "border-ink-12 text-ink-56 hover:border-ink-24 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Catalogue with specialty and year filters. Filtering is client-side over a
 * list that ships with the page — no request, no spinner.
 */
export function CatalogueBrowser({
  books,
  lockedSpecialty,
  lockedYear,
  locale = 'en',
}: {
  books: readonly Book[];
  /** Set on a specialty page, where the specialty filter is redundant. */
  lockedSpecialty?: string;
  lockedYear?: number;
  locale?: Locale;
}) {
  const fr = locale === 'fr';
  const specialtyLabels: Record<string, string> = { medicine: 'Médecine', pharmacy: 'Pharmacie', 'dental-surgery': 'Médecine dentaire' };
  const [specialty, setSpecialty] = useState<Filter>(lockedSpecialty ?? null);
  const [year, setYear] = useState<number | null>(lockedYear ?? null);

  const years = useMemo(
    () => (specialty ? yearsOf(specialty) : []),
    [specialty],
  );

  const visible = useMemo(
    () =>
      books.filter(
        (book) =>
          (!specialty || book.specialty === specialty) &&
          (!year || book.year === year),
      ),
    [books, specialty, year],
  );

  return (
    <div>
      {/* filters */}
      <div className="flex flex-col gap-5 border-y border-ink-08 py-6">
        {!lockedSpecialty ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="type-eyebrow mr-2 text-[0.625rem]">{fr ? 'Spécialité' : 'Specialty'}</span>
            <Pill
              active={specialty === null}
              onClick={() => {
                setSpecialty(null);
                setYear(null);
              }}
            >
              {fr ? 'Toutes' : 'All'}
            </Pill>
            {specialties.map((entry) => (
              <Pill
                key={entry.slug}
                active={specialty === entry.slug}
                onClick={() => {
                  setSpecialty(entry.slug);
                  setYear(null);
                }}
              >
                {fr ? specialtyLabels[entry.slug] : entry.name}
              </Pill>
            ))}
          </div>
        ) : null}

        {specialty && !lockedYear ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="type-eyebrow mr-2 text-[0.625rem]">{fr ? 'Année' : 'Year'}</span>
            <Pill active={year === null} onClick={() => setYear(null)}>
              {fr ? 'Toutes' : 'All'}
            </Pill>
            {years.map((entry) => (
              <Pill
                key={entry}
                active={year === entry}
                onClick={() => setYear(entry)}
              >
                {fr ? frenchYear(entry) : yearLabel(entry)}
              </Pill>
            ))}
          </div>
        ) : null}
      </div>

      <p className="mt-6 text-[0.8125rem] text-ink-40" aria-live="polite">
        {visible.length} {fr ? visible.length === 1 ? 'édition' : 'éditions' : visible.length === 1 ? "edition" : "editions"}
      </p>

      <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((book) => (
            <motion.li
              key={book.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <BookCard book={book} locale={locale} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {visible.length === 0 ? (
        <p className="py-20 text-center text-[0.9375rem] text-ink-40">
          {fr ? 'Aucune édition pour le moment.' : 'Nothing here yet.'}
        </p>
      ) : null}
    </div>
  );
}
