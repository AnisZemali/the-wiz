"use client";
import {useState} from 'react';
import { type Locale } from '@/lib/locale';
import { assetPath } from '@/lib/hosting';
import { courseTitle, type Course } from '@/lib/courses';

export function CourseCover({ course, locale = 'en' }: { course: Course; locale?: Locale }) {
  const [loaded,setLoaded]=useState(false);
  const fr = locale === 'fr';
  return <div className="wiz-cover wiz-pdf-cover" style={{aspectRatio:"1000 / 1414",background:"#f3f3f3"}} aria-busy={!loaded}>
    <div className="wiz-coils" aria-hidden="true">{Array.from({length: 13}, (_, i) => <i key={i} />)}</div>
    <img onLoad={()=>setLoaded(true)} onError={()=>setLoaded(true)} style={{opacity:loaded?1:0,transition:"opacity .2s"}} ref={node=>{if(node?.complete)setLoaded(true)}} src={assetPath(`/course-pages/${course.id}/1.webp`)} alt={`${courseTitle(course,locale)} — ${locale==='ar'?'الغلاف الأصلي للكتاب':fr ? 'couverture originale du PDF' : 'original PDF cover'}`} width={1000} height={1414} loading="lazy" />
  </div>;
}
