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
  '/', '/courses', '/books',
  ...courseYears.map(year => `/courses/year-${year}`), ...courses.map(courseHref),
  ...specialties.flatMap(s => [`/books/${s.slug}`, ...yearsOf(s.slug).map(y => `/books/${s.slug}/year-${y}`)]),
  ...books.map(book => book.href),
];
export function generateStaticParams() { return frenchPaths.map(path => ({ path: path === '/' ? [] : path.slice(1).split('/') })); }

function pageTitle(path: string) {
  if (path === '/') return 'Des carnets pour mieux apprendre';
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
  return { title: pageTitle(path), description: 'Découvrez les carnets The Wiz et les cours MedWIZ, classés par année. Consultez les 10 premières pages de chaque cours.', alternates: { canonical, languages: { en: path, fr: canonical } }, openGraph: { title: `${pageTitle(path)} — The Wiz`, description: 'Des résumés clairs et des cours classés par année pour vos études de santé.', locale: 'fr_FR', url: `${site.url}${canonical}` } };
}
export default async function FrenchPage({ params }: { params: Promise<Params> }) {
  const path = '/' + ((await params).path ?? []).join('/');
  if (!frenchPaths.includes(path)) notFound();
  if (path === '/') return <div lang="fr"><FrenchHome /></div>;
  const parts = path.slice(1).split('/');
  if (parts[0] === 'courses') {
    const year = parts[1] ? Number(parts[1].replace('year-', '')) : undefined;
    const course = courses.find(c => courseHref(c) === path);
    const crumbs = [{ label: 'The Wiz', href: '/fr' }, { label: 'Cours', href: '/fr/courses' }, ...(year ? [{ label: frenchYear(year), href: `/fr/courses/year-${year}` }] : []), ...(course ? [{ label: course.title }] : [])];
    return <div lang="fr"><CataloguePageHeader locale="fr" crumbs={crumbs} eyebrow={course ? `THE WIZ · ${frenchYear(course.year)} · ${course.category === 'Integrated units' ? 'Unités d’enseignement intégrées' : 'Modules'}` : 'Collection THE WIZ · Médecine'} title={course ? course.title : year ? <>{frenchYear(year)}.<br /><span className="text-ink-40">Une matière à la fois.</span></> : <>Votre année.<br /><span className="text-ink-40">Votre prochain chapitre.</span></>} intro={course ? `Un livre indépendant à découvrir : les pages 1 à ${course.previewPages} sur ${course.pages}. Prenez le temps de découvrir les notes et de préparer votre prochaine séance de révision.` : 'Découvrez chaque livre de médecine, classé par année et par module ou UEI. Feuilletez les dix premières pages avant de commander.'} />
      {course ? <CourseProduct course={course} locale="fr" /> : <CourseLibrary year={year} locale="fr" />}
    </div>;
  }
  redirect('/fr/courses');
}
