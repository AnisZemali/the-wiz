import { CollectionRoute } from '@/components/catalogue/collection-route';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CataloguePageHeader } from '@/components/catalogue/page-header';
import { CourseLibrary } from '@/components/catalogue/course-library';
import { courseYears } from '@/lib/courses';

export const dynamicParams = false;
export function generateStaticParams() { return courseYears.map(year => ({ year: `year-${year}` })); }
function resolve(value: string) { return courseYears.find(year => value === `year-${year}`); }
export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  return { title: `THE WIZ · Year ${resolve(year) ?? ''}`, alternates: { canonical: `/courses/${year}` } };
}
export default async function YearPage({ params }: { params: Promise<{ year: string }> }) {
  const year = resolve((await params).year);
  if (!year) notFound();
  return <CollectionRoute path={`/courses/year-${year}`} locale="en"/>;
}
