import data from './courses.generated.json';
import details from './book-details.json';
import { assetPath } from './hosting';
import type { Locale } from './locale';
const catalogue=details as Record<string,{title:Record<Locale,string>;price:number;available:boolean}>;
export const courses = data.map(course => {
 const detail=catalogue[course.id];
 if(!detail)throw new Error(`Missing book details: ${course.id}`);
 const {previewUrl,...publicCourse}=course;
 return {...publicCourse,...detail,title:detail.title.fr,titles:detail.title,image:assetPath(`/course-pages/${course.id}/1.webp`)};
}).sort((a,b)=>a.year-b.year||a.title.localeCompare(b.title,'fr'));
export type Course = (typeof courses)[number];
export const courseTitle=(course:Course,locale:Locale)=>course.titles[locale];
export const courseYears=[1,2,3,4,5,6];
export const courseHref=(course:Course)=>`/courses/year-${course.year}/${course.slug}`;
export const bookDescription = {
 en:'A MedWIZ revision book with course summaries based on the Algerian curriculum, contents that become a progress tracker, facing notes pages and Extra Notes.',
 fr:'Un livre de révision MedWIZ : résumés de cours selon le programme algérien, sommaire qui devient un tracker, pages de notes en face et Extra Notes.',
 ar:'كتاب مراجعة من MedWIZ يضم ملخصات وفق البرنامج الجزائري، وفهرسًا يتحول إلى متتبع للتقدم، وصفحات ملاحظات مقابل الملخصات وقسم ملاحظات إضافية.',
};
