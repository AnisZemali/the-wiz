import rates from './delivery-rates.json';
import { courses } from './courses';
export const deliveryRates=rates;
export type DeliveryMethod='home'|'stopdesk';
export type CartItem={courseId:string;quantity:number};
export function quote(items:CartItem[],wilayaId:string,method:DeliveryMethod){
 if(!Array.isArray(items)||!items.length||items.length>courses.length)return null;
 const seen=new Set<string>();
 const lines=[];
 for(const item of items){
  if(!item||typeof item!=='object')return null;
  const course=courses.find(c=>c.id===item.courseId);
  if(!course||!course.available||seen.has(course.id)||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>20)return null;
  seen.add(course.id);lines.push({courseId:course.id,title:course.title,year:course.year,quantity:item.quantity,unitPrice:course.price,lineTotal:course.price*item.quantity});
 }
 const rate=deliveryRates.find(r=>r.id===wilayaId);
 if(!rate||!rate.available||!['home','stopdesk'].includes(method)||rate[method]===null)return null;
 const subtotal=lines.reduce((sum,i)=>sum+i.lineTotal,0),deliveryFee=rate[method]!;
 return {items:lines,subtotal,deliveryFee,total:subtotal+deliveryFee,wilayaId:rate.id,wilaya:rate.name.fr,deliveryMethod:method};
}
