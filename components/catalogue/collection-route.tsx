import {notFound} from 'next/navigation';
import {CataloguePageHeader} from './page-header';
import {CourseLibrary} from './course-library';
import {CourseProduct} from './course-product';
import {courses,courseHref,courseTitle,bookDescription} from '@/lib/courses';
import {localizedPath,yearName,yearSlogan,tr,type Locale} from '@/lib/locale';
export function CollectionRoute({path,locale}:{path:string;locale:Locale}){
 const parts=path.split('/'),year=parts[2]?Number(parts[2].replace('year-','')):undefined;
 const course=courses.find(c=>courseHref(c)===path);
 if((year&&![1,2,3,4,5,6].includes(year))||(parts[3]&&!course))notFound();
 const href=(p:string)=>localizedPath(p,locale);
 const crumbs=[{label:'THE WIZ',href:href('/')},{label:tr(locale,'Collections','Collections','المجموعات'),href:href('/courses')},...(year?[{label:yearName(year,locale),href:href(`/courses/year-${year}`)}]:[]),...(course?[{label:courseTitle(course,locale)}]:[])];
 return <div lang={locale} dir={locale==='ar'?'rtl':'ltr'}><CataloguePageHeader locale={locale} crumbs={crumbs} eyebrow={tr(locale,'MEDWIZ COLLECTION · MEDICINE','COLLECTION MEDWIZ · MÉDECINE','مجموعة MEDWIZ · الطب')} title={course?courseTitle(course,locale):year?<>{yearName(year,locale)}.<br/><span className="text-ink-40">{yearSlogan(year,locale)}</span></>:<>{tr(locale,'Your year.','Votre année.','سنتك الدراسية.')}<br/><span className="text-ink-40">{tr(locale,'Your courses. Your book.','Vos cours. Votre livre.','دروسك. كتابك.')}</span></>} intro={course?bookDescription[locale]:tr(locale,'Discover THE WIZ collections, designed to support your studies. Explore course summaries organized according to the Algerian curriculum, alongside space for your own notes. Preview each book before ordering.','Découvrez les collections THE WIZ, conçues pour accompagner votre parcours d’études. Retrouvez des résumés de cours classés selon le programme algérien, ainsi que des pages dédiées à vos propres notes. Feuilletez les premières pages de chaque livre avant de commander.','اكتشف مجموعات THE WIZ المصممة لمرافقتك في مسارك الدراسي. ملخصات دروس مرتبة وفق البرنامج الجزائري، مع صفحات مخصصة لملاحظاتك. تصفح معاينة كل كتاب قبل الطلب.')}/>{course?<CourseProduct course={course} locale={locale}/>:<CourseLibrary year={year} locale={locale}/>}</div>;
}
