import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {courses,courseYears,courseHref,courseTitle} from '@/lib/courses';
import {CollectionRoute} from '@/components/catalogue/collection-route';
import {ArabicHome} from '@/components/arabic-home';
const paths=['/', '/courses',...courseYears.map(n=>`/courses/year-${n}`),...courses.map(courseHref)];
export const dynamicParams=false;
export function generateStaticParams(){return paths.map(path=>({path:path==='/'?[]:path.slice(1).split('/')}))}
type Params={path?:string[]};
export async function generateMetadata({params}:{params:Promise<Params>}):Promise<Metadata>{const path='/'+((await params).path??[]).join('/'),course=courses.find(c=>courseHref(c)===path);return {title:course?`${courseTitle(course,'ar')} — THE WIZ`:'THE WIZ — مجموعات كتب المراجعة',description:'ملخصات دروس وفق البرنامج الجزائري، فهرس لمتابعة التقدم وصفحات للملاحظات.',alternates:{canonical:`/ar${path==='/'?'':path}`,languages:{en:path,fr:`/fr${path==='/'?'':path}`,ar:`/ar${path==='/'?'':path}`}}}}
export default async function ArabicPage({params}:{params:Promise<Params>}){const path='/'+((await params).path??[]).join('/');if(!paths.includes(path))notFound();return path==='/'?<ArabicHome/>:<CollectionRoute path={path} locale="ar"/>}
