import { CollectionRoute } from '@/components/catalogue/collection-route';
import type { Metadata } from 'next';
import { CataloguePageHeader } from '@/components/catalogue/page-header';
import { CourseLibrary } from '@/components/catalogue/course-library';
import { courses, courseYears } from '@/lib/courses';

export const metadata: Metadata = { title: 'THE WIZ book collection', description: 'Explore MedWIZ study books and course summaries organized by year according to the Algerian curriculum.', alternates: { canonical: '/courses' } };
export default function CoursesPage() {
  return <CollectionRoute path="/courses" locale="en"/>;
}
