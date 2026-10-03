import { type Locale } from '@/lib/locale';
import { assetPath } from '@/lib/hosting';
import { courseTitle, type Course } from '@/lib/courses';

export function CourseCover({ course, locale = 'en' }: { course: Course; locale?: Locale }) {
  const fr = locale === 'fr';
  return <div className="wiz-cover wiz-pdf-cover">
    <div className="wiz-coils" aria-hidden="true">{Array.from({length: 13}, (_, i) => <i key={i} />)}</div>
    <img src={assetPath(`/course-pages/${course.id}/1.webp`)} alt={`${courseTitle(course,locale)} — ${locale==='ar'?'الغلاف الأصلي للكتاب':fr ? 'couverture originale du PDF' : 'original PDF cover'}`} width={1000} height={1414} loading="lazy" />
  </div>;
}
