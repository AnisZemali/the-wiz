import type { Metadata } from 'next';
import { CataloguePageHeader } from '@/components/catalogue/page-header';
import { CourseLibrary } from '@/components/catalogue/course-library';
import { courses, courseYears } from '@/lib/courses';

export const metadata: Metadata = { title: 'THE WIZ book collection', description: 'Explore MedWIZ study books and course summaries organized by year according to the Algerian curriculum.', alternates: { canonical: '/courses' } };
export default function CoursesPage() {
  return <><CataloguePageHeader crumbs={[{ label: 'The Wiz', href: '/' }, { label: 'Collections' }]} eyebrow={'MEDWIZ COLLECTION · MEDICINE'} title={<>Your year.<br /><span className="text-ink-40">Your courses. Your book.</span></>} intro="Discover THE WIZ collections, designed to support your studies. Explore course summaries organized according to the Algerian curriculum, alongside space for your own notes. Preview each book before ordering." /><CourseLibrary /></>;
}
