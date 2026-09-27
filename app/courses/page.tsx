import type { Metadata } from 'next';
import { CataloguePageHeader } from '@/components/catalogue/page-header';
import { CourseLibrary } from '@/components/catalogue/course-library';
import { courses, courseYears } from '@/lib/courses';

export const metadata: Metadata = { title: 'THE WIZ book collection', description: 'Explore MedWIZ medical courses by year. Read the first 10 pages of every course.', alternates: { canonical: '/courses' } };
export default function CoursesPage() {
  return <><CataloguePageHeader crumbs={[{ label: 'The Wiz', href: '/' }, { label: 'Courses' }]} eyebrow={`THE WIZ collection · ${courses.length} courses · ${courseYears.length} years`} title={<>Your year.<br /><span className="text-ink-40">Your next chapter.</span></>} intro="Find your course, take a look inside. Explore the first 10 pages of our original medical notes, organized around your year." /><CourseLibrary /></>;
}
