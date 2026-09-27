import { frenchYear, type Locale } from '@/lib/locale';
import type { Course } from '@/lib/courses';

export function CourseCover({ course, locale = 'en' }: { course: Course; locale?: Locale }) {
  const fr = locale === 'fr';
  return <div className="wiz-cover">
    <div className="wiz-coils" aria-hidden="true">{Array.from({length: 13}, (_, i) => <i key={i} />)}</div>
    <div className="wiz-cover-brand">THE WIZ <span>{fr ? 'COLLECTION MÉDECINE' : 'MEDICINE COLLECTION'}</span></div>
    <div className="wiz-cover-title"><p>{fr ? frenchYear(course.year) : `Year ${course.year}`} · {course.category === 'Integrated units' ? 'UEI' : 'Module'}</p><h2 lang="fr">{course.title}</h2><div className="wiz-cover-rule" /></div>
    <div className="wiz-cover-bottom"><span>{fr ? 'Un livre. Une matière.' : 'One book. One subject.'}</span><span>{course.pages} pages</span></div>
  </div>;
}
