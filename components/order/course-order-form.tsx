"use client";
import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Course } from '@/lib/courses';
import type { Locale } from '@/lib/locale';
import { githubPages } from '@/lib/hosting';
import { site } from '@/lib/content';

export function CourseOrderForm({ course, locale, items, onSaved }: { course?: Course; locale: Locale; items?: {courseId:string;quantity:number}[]; onSaved?: () => void }) {
  const fr = locale === 'fr';
  const id = useRef('');
  const sending = useRef(false);
  const lastPayload = useRef('');
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [reference, setReference] = useState('');
  const [ready, setReady] = useState<boolean | null>(githubPages ? false : null);
  useEffect(() => { if (!githubPages) fetch('/api/order', { cache: 'no-store' }).then(r => r.json()).then(d => setReady(d.available === true)).catch(() => setReady(false)); }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (sending.current) return;
    sending.current = true; setBusy(true); setError('');
    const form = new FormData(e.currentTarget);
    const payload = { ...Object.fromEntries(form), ...(items ? {items} : {courseId: course?.id, quantity: Number(form.get('quantity'))}), consent: form.get('consent') === 'on' };
    const signature = JSON.stringify(payload);
    if (!id.current || signature !== lastPayload.current) id.current = crypto.randomUUID();
    lastPayload.current = signature;
    try {
      const response = await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, id: id.current }) });
      const result = await response.json();
      if (!response.ok) throw new Error(response.status === 429 ? fr ? 'Trop de demandes. Réessayez plus tard.' : 'Too many requests. Please try later.' : fr ? 'La commande n’a pas pu être enregistrée. Vérifiez les champs ou réessayez plus tard.' : 'Your order could not be saved. Check the fields or try again later.');
      setReference(result.reference); onSaved?.();
    } catch (e) { setError(e instanceof Error ? e.message : 'Erreur réseau'); }
    finally { sending.current = false; setBusy(false); }
  }
  return <div id="order" className="mt-6 scroll-mt-28 rounded-2xl border border-ink-12 p-6"><h3 className="text-xl">{fr ? 'Coordonnées de livraison' : 'Delivery details'}</h3>
    {ready === null ? <p role="status" className="mt-4 text-sm">{fr ? 'Chargement…' : 'Loading…'}</p> : !ready ? <><p className="mt-4 text-sm text-ink-56">{fr ? 'Le formulaire est actuellement indisponible. Vous pouvez envoyer votre demande par e-mail.' : 'The form is currently unavailable. You can send your request by email.'}</p><a className="mt-5 block rounded-full bg-ink p-4 text-center text-paper" href={`mailto:${site.email}?subject=${encodeURIComponent(`THE WIZ — ${items?.map(i=>`${i.courseId} x ${i.quantity}`).join(', ') ?? course?.title}`)}`}>{fr ? 'Commander par e-mail' : 'Order by email'}</a></> : reference ? <div role="status" className="mt-5 rounded-xl bg-ink-04 p-5"><p className="font-medium">{fr ? 'Votre demande a bien été enregistrée.' : 'Your request has been saved.'}</p><p className="mt-3 break-all">{fr ? 'Référence' : 'Reference'} : {reference}</p><p className="mt-3 text-sm text-ink-56">{fr ? 'Nous vous contacterons pour confirmer le prix, la disponibilité et la livraison. Aucun paiement n’a été effectué.' : 'We will contact you to confirm price, availability and delivery. No payment has been taken.'}</p></div> : <form onSubmit={submit} className="mt-5 space-y-4">
      <p className="text-sm leading-relaxed text-ink-56">{fr ? 'Remplissez votre demande. Nous confirmerons le prix, la disponibilité et la livraison avant validation. Aucun paiement en ligne.' : 'Submit your request. We will confirm price, availability and delivery before confirmation. No online payment.'}</p>
      {([['name', fr?'Nom complet':'Full name', 'text',true,100,'name'],['phone',fr?'Téléphone':'Phone','tel',true,24,'tel'],['email',fr?'Email (facultatif)':'Email (optional)','email',false,150,'email'],['wilaya','Wilaya','text',true,80,'address-level1'],['address',fr?'Commune et adresse de livraison':'Town and delivery address','text',true,300,'street-address']] as const).map(([name,label,type,required,maxLength,autoComplete])=><label key={name} className="block text-sm"><span className="mb-2 block">{label}{required?' *':''}</span><input name={name} type={type} required={required} maxLength={maxLength} autoComplete={autoComplete} className="w-full rounded-xl border border-ink-24 bg-paper p-3" /></label>)}
      <label hidden={!!items} className="block text-sm">{fr ? 'Quantité' : 'Quantity'}<input className="mt-2 block w-24 rounded-xl border border-ink-24 p-3" type="number" name="quantity" min="1" max="20" defaultValue="1" required /></label>
      <label className="block text-sm">{fr ? 'Note (facultative)' : 'Note (optional)'}<textarea name="note" maxLength={1000} rows={3} className="mt-2 w-full rounded-xl border border-ink-24 p-3" /></label>
      <label hidden aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="flex items-start gap-3 text-xs leading-relaxed text-ink-56"><input type="checkbox" name="consent" required className="mt-1"/>{fr ? 'J’accepte que THE WIZ utilise ces coordonnées pour traiter ma demande et me contacter. Elles sont accessibles uniquement à l’équipe et ne sont pas utilisées pour une liste publicitaire.' : 'I agree that THE WIZ may use these details to process and contact me about my request. They are only accessible to the team and are not used for a marketing list.'}</label>
      {error && <p role="alert" className="text-sm">{error}</p>}<button disabled={busy} className="w-full rounded-full bg-ink p-4 text-paper disabled:opacity-50">{busy ? fr?'Enregistrement…':'Saving…' : fr?'Envoyer la demande':'Submit order request'}</button>
    </form>}
  </div>;
}
