import { CollectionRoute } from '@/components/catalogue/collection-route';
import { CourseProduct } from '@/components/catalogue/course-product';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CataloguePageHeader } from '@/components/catalogue/page-header';
import { courses, courseHref, courseTitle } from '@/lib/courses';

type Params = { year: string; subject: string };
export const dynamicParams = false;
export function generateStaticParams() { return courses.map(c => ({ year: `year-${c.year}`, subject: c.slug })); }
async function resolve(params: Promise<Params>) { const { year, subject } = await params; return courses.find(c => `year-${c.year}` === year && c.slug === subject); }
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const course = await resolve(params);
  return course ? { title: `${courseTitle(course,'en')} · THE WIZ preview`, description: `Explore ${courseTitle(course,'en')} course summaries, medicine year ${course.year}, following the Algerian curriculum.`, alternates: { canonical: courseHref(course) } } : {};
}
export default async function CoursePage({ params }: { params: Promise<Params> }) {
  const course = await resolve(params);
  if (!course) notFound();
  return <CollectionRoute path={courseHref(course)} locale="en"/>;
}
