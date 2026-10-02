"use client";
import {createContext,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import {courses} from '@/lib/courses';
import {assetPath} from '@/lib/hosting';
import {isFrenchPath} from '@/lib/locale';
import {CourseOrderForm} from './course-order-form';
type Item={courseId:string;quantity:number};
const CartContext=createContext<{add:(id:string)=>void}>({add:()=>{}});
export const useCart=()=>useContext(CartContext);
export function CartProvider({children}:{children:ReactNode}) {
 const pathname=usePathname(),fr=isFrenchPath(pathname);
 const [items,setItems]=useState<Item[]>([]),[loaded,setLoaded]=useState(false),[checkout,setCheckout]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem('wiz-cart')||'[]');if(Array.isArray(saved))setItems(saved.filter((i:Item)=>i&&courses.some(c=>c.id===i.courseId)&&Number.isInteger(i.quantity)&&i.quantity>0&&i.quantity<=20).filter((i:Item,n:number,a:Item[])=>a.findIndex(j=>j.courseId===i.courseId)===n));}catch{}setLoaded(true);},[]);
 useEffect(()=>{if(loaded)try{localStorage.setItem('wiz-cart',JSON.stringify(items));}catch{}},[items,loaded]);
 function open(){setCheckout(false);dialog.current?.showModal();}
 function add(id:string){setItems(old=>old.some(i=>i.courseId===id)?old.map(i=>i.courseId===id?{...i,quantity:Math.min(20,i.quantity+1)}:i):[...old,{courseId:id,quantity:1}]);open();}
 const count=items.reduce((n,i)=>n+i.quantity,0);
 return <CartContext.Provider value={{add}}>{children}{pathname!=='/admin'&&<button onClick={open} disabled={!loaded} className="fixed bottom-5 right-5 z-40 rounded-full bg-ink px-6 py-4 text-paper shadow-xl" aria-label={`${fr?'Ouvrir le panier':'Open cart'} (${count})`}>{fr?'Panier':'Cart'} · {count}</button>}
 <dialog data-lenis-prevent ref={dialog} className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-3xl bg-paper p-6 text-ink shadow-2xl backdrop:bg-black/40 sm:p-8" aria-labelledby="cart-title">
 <div className="flex items-center justify-between gap-4"><h2 id="cart-title" className="text-2xl">{fr?'Votre panier':'Your cart'}</h2><button className="wiz-control" onClick={()=>dialog.current?.close()} aria-label={fr?'Fermer le panier':'Close cart'}>✕</button></div>
 {checkout?<><button className="mt-5 text-sm underline" onClick={()=>setCheckout(false)}>{fr?'Retour au panier':'Back to cart'}</button>{items.length>0&&<ul className="mt-5 rounded-xl bg-ink-04 p-4 text-sm">{items.map(i=><li key={i.courseId} className="py-1">{courses.find(c=>c.id===i.courseId)?.title} × {i.quantity}</li>)}</ul>}<CourseOrderForm locale={fr?'fr':'en'} items={items} onSaved={()=>setItems([])}/></>:!items.length?<div className="py-12 text-center"><p>{fr?'Votre panier est vide.':'Your cart is empty.'}</p><Link className="mt-6 inline-block underline" href={fr?'/fr/courses':'/courses'} onClick={()=>dialog.current?.close()}>{fr?'Découvrir les cours':'Browse courses'}</Link></div>:<>
 <ul className="mt-6 divide-y divide-ink-12">{items.map(item=>{const course=courses.find(c=>c.id===item.courseId)!;return <li key={item.courseId} className="flex gap-4 py-5"><img src={assetPath(`/course-pages/${course.id}/1.webp`)} alt="" width={64} height={90} className="h-24 w-16 rounded object-cover"/><div className="min-w-0 flex-1"><h3 className="font-medium">{course.title}</h3><p className="mt-1 text-sm text-ink-56">{fr?'Année':'Year'} {course.year}</p><div className="mt-3 flex flex-wrap items-center gap-4"><label className="text-sm">{fr?'Quantité':'Quantity'} <select aria-label={`${fr?'Quantité':'Quantity'} — ${course.title}`} value={item.quantity} onChange={e=>setItems(old=>old.map(i=>i.courseId===item.courseId?{...i,quantity:Number(e.target.value)}:i))} className="rounded-lg border border-ink-24 p-2">{Array.from({length:20},(_,n)=><option key={n+1}>{n+1}</option>)}</select></label><button onClick={()=>setItems(old=>old.filter(i=>i.courseId!==item.courseId))} className="text-sm underline" aria-label={`${fr?'Retirer':'Remove'} ${course.title}`}>{fr?'Retirer':'Remove'}</button></div></div></li>})}</ul>
 <div className="mt-5 border-t border-ink-12 pt-5"><p className="font-medium">{count} {fr?'livre(s)':'book(s)'}</p><p className="mt-3 text-sm text-ink-56">{fr?'Le prix et les frais de livraison seront confirmés par notre équipe. Aucun paiement en ligne.':'Our team will confirm prices and delivery costs. No online payment.'}</p><button onClick={()=>setCheckout(true)} className="mt-5 w-full rounded-full bg-ink p-4 text-paper">{fr?'Passer la commande':'Proceed to checkout'}</button><button onClick={()=>dialog.current?.close()} className="mt-3 w-full p-3 text-sm underline">{fr?'Continuer mes achats':'Continue shopping'}</button></div></>}
 </dialog></CartContext.Provider>;
}
