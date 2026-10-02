"use client";
import { useState } from 'react';
import { CourseCover } from '@/components/notebook/course-cover';
import { assetPath } from '@/lib/hosting';
import type { Course } from '@/lib/courses';
import { frenchYear, type Locale } from '@/lib/locale';
import { useCart } from '@/components/order/cart';

export function CourseProduct({ course, locale = 'en' }: { course: Course; locale?: Locale }) {
  const fr = locale === 'fr';
  const {add} = useCart();
  const [page, setPage] = useState(1);
  const [turned, setTurned] = useState(false);
  const [start, setStart] = useState<number | null>(null);
  const limit = Math.min(10, course.previewPages);
  const move = (step: number) => setPage(p => Math.max(1, Math.min(limit, p + step)));
  return <section className="shell pb-24">
    <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_1fr]">
      <div id="preview" className="scroll-mt-24 rounded-2xl border border-ink-12 bg-ink-04 p-5 sm:p-10">
        <div className="mb-7 flex flex-wrap justify-between gap-3 text-xs text-ink-56"><span>{fr ? 'EXEMPLAIRE À FEUILLETER' : 'LOOK INSIDE THE BOOK'}</span><span>{fr ? 'Spirale noire en plastique' : 'Black plastic spiral'}</span></div>
        <div className={`wiz-reader ${turned && page === 1 ? 'wiz-turned' : ''}`} tabIndex={0} role="group" aria-label={fr ? 'Aperçu du livre, flèches gauche et droite pour naviguer' : 'Book preview, use left and right arrow keys'} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1); } }} onTouchStart={e => setStart(e.touches[0].clientX)} onTouchEnd={e => { if (start !== null && Math.abs(start - e.changedTouches[0].clientX) > 45) move(start > e.changedTouches[0].clientX ? 1 : -1); setStart(null); }}>
          {page === 1 ? <CourseCover course={course} locale={locale} /> : <div className="wiz-page" key={page}><div className="wiz-coils" aria-hidden="true">{Array.from({length:13},(_,i)=><i key={i}/>)}</div><img src={assetPath(`/course-pages/${course.id}/${page}.webp`)} alt={`${course.title} — page ${page}`} width={1000} height={1414} /><span className="wiz-page-number">{page} / {limit}</span></div>}
        </div>
        <p aria-live="polite" className="mt-7 text-center text-sm">{page === 1 ? fr ? 'Couverture' : 'Cover' : `${fr ? 'Page' : 'Page'} ${page} / ${limit}`}</p>
        <div className="mt-4 grid grid-cols-3 gap-2"><button className="wiz-control" disabled={page === 1} onClick={()=>move(-1)} aria-label={fr ? 'Page précédente' : 'Previous page'}>←</button><button className="wiz-control" onClick={()=>setPage(1)}>{fr ? 'Couverture' : 'Cover'}</button><button className="wiz-control" disabled={page === limit} onClick={()=>move(1)} aria-label={fr ? 'Page suivante' : 'Next page'}>→</button></div>
        {page === 1 && <button className="mt-4 min-h-11 w-full text-sm underline underline-offset-4" onClick={()=>setTurned(!turned)}>{fr ? 'Faire pivoter le livre' : 'Rotate the book'} ↻</button>}
        <p className="mt-4 text-center text-xs leading-relaxed text-ink-56">{page === limit ? fr ? 'Fin de l’aperçu gratuit. Les pages suivantes ne sont pas accessibles.' : 'End of the free preview. Further pages are not accessible.' : fr ? 'Balayez ou utilisez les flèches pour feuilleter.' : 'Swipe or use the arrows to turn pages.'}</p>
        <a className="mt-4 block text-center text-xs underline underline-offset-4" href={course.previewUrl} target="_blank" rel="noreferrer">{fr ? 'Ouvrir le PDF de 10 pages' : 'Open the 10-page PDF'} ↗</a>
      </div>
      <div className="lg:sticky lg:top-28"><p className="type-eyebrow">THE WIZ · {course.category === 'Integrated units' ? 'UEI' : 'Module'}</p><h2 className="mt-5 text-3xl">{course.title}</h2><p className="mt-3 text-ink-56">{fr ? `${frenchYear(course.year)} médecine` : `Medicine · Year ${course.year}`}</p><dl className="mt-8 space-y-4 border-y border-ink-12 py-6"><div className="flex justify-between"><dt>{fr ? 'Livre complet' : 'Complete book'}</dt><dd>{course.pages} pages</dd></div><div className="flex justify-between"><dt>{fr ? 'Aperçu gratuit' : 'Free preview'}</dt><dd>{limit} pages</dd></div></dl>
      {course.category === 'Integrated units' && <p className="mt-6 text-sm leading-relaxed text-ink-56">{fr ? 'Unité d’enseignement intégrée : plusieurs disciplines réunies autour d’un même thème dans ce livre.' : 'Integrated teaching unit: several disciplines organized around one theme in this book.'}</p>}
      <button onClick={()=>{setPage(Math.min(2, limit)); document.getElementById('preview')?.scrollIntoView({behavior:'smooth',block:'start'});}} className="wiz-control mt-8 w-full">{fr ? 'Voir l’aperçu' : 'Preview book'}</button>
      <button onClick={()=>add(course.id)} className="mt-5 w-full rounded-full bg-ink p-4 text-paper">{fr ? 'Ajouter au panier' : 'Add to cart'}</button></div>
    </div>
  </section>;
}
