import { CourseProduct } from '@/components/catalogue/course-product';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CataloguePageHeader } from '@/components/catalogue/page-header';
import { courses, courseHref } from '@/lib/courses';

type Params = { year: string; subject: string };
export const dynamicParams = false;
export function generateStaticParams() { return courses.map(c => ({ year: `year-${c.year}`, subject: c.slug })); }
async function resolve(params: Promise<Params>) { const { year, subject } = await params; return courses.find(c => `year-${c.year}` === year && c.slug === subject); }
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const course = await resolve(params);
  return course ? { title: `${course.title} · THE WIZ preview`, description: `Read the first ${course.previewPages} pages of ${course.title}, medicine year ${course.year}.`, alternates: { canonical: courseHref(course) } } : {};
}
export default async function CoursePage({ params }: { params: Promise<Params> }) {
  const course = await resolve(params);
  if (!course) notFound();
  return <><CataloguePageHeader crumbs={[{ label: 'The Wiz', href: '/' }, { label: 'Courses', href: '/courses' }, { label: `Year ${course.year}`, href: `/courses/year-${course.year}` }, { label: course.title }]} eyebrow={`THE WIZ · Year ${course.year} · ${course.category}`} title={<span lang="fr">{course.title}</span>} intro={`A look inside: pages 1–${course.previewPages} of ${course.pages}. Take your time, get a feel for the notes, and make your next study session count.`} />
    <CourseProduct course={course} /></>;
}
