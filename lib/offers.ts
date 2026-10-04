import {courses} from './courses';
import {yearName,type Locale} from './locale';
const prices=[6000,4500,6000,4000,5000,5500];
const normalPrices=prices.map((_,index)=>courses.filter(c=>c.year===index+1).reduce((sum,c)=>sum+c.price,0));
export const offers=[...prices.map((price,index)=>({id:`pack-year-${index+1}`,year:index+1,price,normalPrice:normalPrices[index],books:courses.filter(c=>c.year===index+1)})),{id:'pack-complete',year:0,price:31000,normalPrice:courses.reduce((sum,c)=>sum+c.price,0),books:courses}];
export const offerTitle=(offer:{year:number},locale:Locale)=>offer.year?`${locale==='ar'?'باقة':'Pack'} ${yearName(offer.year,locale)}`:({en:'Complete collection · Years 1–6',fr:'Collection complète · 1re → 6e année',ar:'المجموعة الكاملة · السنوات الأولى إلى السادسة'})[locale];
export const products=[...courses.map(c=>({id:c.id,year:c.year,title:c.title,titles:c.titles,price:c.price,available:c.available,image:c.image,books:[c]})),...offers.map(o=>({id:o.id,year:o.year,title:offerTitle(o,'fr'),titles:{en:offerTitle(o,'en'),fr:offerTitle(o,'fr'),ar:offerTitle(o,'ar')},price:o.price,available:o.books.every(c=>c.available),image:o.books[0].image,books:o.books}))];
export const productTitle=(product:(typeof products)[number],locale:Locale)=>product.titles[locale];
