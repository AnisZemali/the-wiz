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
  return <><CataloguePageHeader crumbs={[{ label: 'The Wiz', href: '/' }, { label: 'Courses', href: '/courses' }, { label: `Year ${year}` }]} eyebrow="THE WIZ · Medicine" title={<>Year {year}.<br /><span className="text-ink-40">One course at a time.</span></>} intro="Browse the subjects for your year and read a 10-page preview before you go further." /><CourseLibrary year={year} /></>;
}
