import {Offers} from '@/components/offers';
import { CollectionRoute } from '@/components/catalogue/collection-route';
import { redirect } from 'next/navigation';
import { CourseProduct } from '@/components/catalogue/course-product';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FrenchHome } from '@/components/french/home';
import { CataloguePageHeader } from '@/components/catalogue/page-header';
import { CatalogueBrowser } from '@/components/catalogue/catalogue-browser';
import { CourseLibrary } from '@/components/catalogue/course-library';
import { BookCover } from '@/components/notebook/book-cover';
import { BookCard } from '@/components/catalogue/book-card';
import { courses, courseYears, courseHref } from '@/lib/courses';
import { books, specialties, yearsOf, formatPrice } from '@/lib/catalogue';
import { frenchBooks, specialtyNames, features } from '@/lib/french';
import { frenchYear } from '@/lib/locale';
import { site } from '@/lib/content';

type Params = { path?: string[] };
export const dynamicParams = false;
const frenchPaths = [
  '/', '/courses', '/books', '/offers',
  ...courseYears.map(year => `/courses/year-${year}`), ...courses.map(courseHref),
  ...specialties.flatMap(s => [`/books/${s.slug}`, ...yearsOf(s.slug).map(y => `/books/${s.slug}/year-${y}`)]),
  ...books.map(book => book.href),
];
export function generateStaticParams() { return frenchPaths.map(path => ({ path: path === '/' ? [] : path.slice(1).split('/') })); }

function pageTitle(path: string) {
  if (path === '/') return 'Des livres pour mieux apprendre';
  if (path === '/offers') return 'Offers — Packs THE WIZ';
  if (path === '/courses') return 'Collection de livres THE WIZ';
  if (path === '/books') return 'Tous les livres';
  const course = courses.find(c => courseHref(c) === path);
  if (course) return `${course.title} · Livre THE WIZ`;
  const book = frenchBooks.find(b => b.href === `/fr${path}`);
  if (book) return book.title;
  const parts = path.split('/');
  const year = Number(parts[3]?.replace('year-', '') || parts[2]?.replace('year-', ''));
  return `${parts[1] === 'courses' ? 'MedWIZ' : specialtyNames[parts[2]] ?? 'The Wiz'}${Number.isFinite(year) && year ? ` · ${frenchYear(year)}` : ''}`;
}
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const path = '/' + ((await params).path ?? []).join('/');
  const canonical = `/fr${path === '/' ? '' : path}`;
  return { title: pageTitle(path), description: 'Découvrez les livres de révision MedWIZ : résumés de cours selon le programme algérien, sommaire et tracker, notes et Extra Notes.', alternates: { canonical, languages: { en: path, fr: canonical } }, openGraph: { title: `${pageTitle(path)} — The Wiz`, description: 'Des résumés de cours classés par année pour vos études de santé.', locale: 'fr_FR', url: `${site.url}${canonical}` } };
}
export default async function FrenchPage({ params }: { params: Promise<Params> }) {
  const path = '/' + ((await params).path ?? []).join('/');
  if (!frenchPaths.includes(path)) notFound();
  if (path === '/') return <div lang="fr"><FrenchHome /></div>;
  if(path==='/offers')return <Offers locale="fr"/>;
  const parts = path.slice(1).split('/');
  if (parts[0] === 'courses') return <CollectionRoute path={path} locale="fr"/>;
  redirect('/fr/courses');
}
