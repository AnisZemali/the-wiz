import { quote, type DeliveryMethod } from './commerce';
import { orderItems, type Order } from './order-types';
export function validateOrder(input: Record<string, unknown>): Omit<Order, 'reference' | 'createdAt' | 'updatedAt' | 'status'> | null {
 const text=(key:string,min:number,max:number)=>typeof input[key]==='string'&&input[key].trim().length>=min&&input[key].trim().length<=max?input[key].trim():null;
 const id=text('id',36,36),firstName=text('firstName',1,70),lastName=text('lastName',1,70),phone=text('phone',7,24),email=text('email',5,150),note=text('note',0,1000),address=text('address',input.deliveryMethod==='home'?5:0,300);
 if(!id||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)||!firstName||!lastName||!phone||!/^[+\d ()-]{7,24}$/.test(phone)||phone.replace(/\D/g,'').length<7||!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||note===null||address===null||input.consent!==true||input.website||!Array.isArray(input.items))return null;
 const pricing=quote(input.items, String(input.wilayaId),input.deliveryMethod as DeliveryMethod);
 if(!pricing||input.expectedTotal!==pricing.total)return null;
 return {id,...pricing,firstName,lastName,name:`${firstName} ${lastName}`,phone,email,address:input.deliveryMethod==='home'?address:'',note,courseId:pricing.items[0].courseId,title:pricing.items.map(i=>i.title).join(', '),year:pricing.items[0].year,quantity:pricing.items.reduce((sum,i)=>sum+i.quantity,0)};
}
export function ordersCsv(orders:Order[]){
 const cell=(value:unknown)=>{let text=String(value??'');if(/^[\s\u0000-\u001f]*[=+\-@]/.test(text)||/^[0+]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';};
 const rows=[['Référence','Date UTC','Livre','Année','Quantité','Prix unitaire DZD','Total ligne DZD','Prénom','Nom','Client','Téléphone','Email','Wilaya','Mode de livraison','Adresse','Sous-total livres DZD','Livraison DZD','Total commande DZD','Note','Statut'],...orders.flatMap(o=>orderItems(o).map((i,index)=>[o.reference,o.createdAt,i.title,i.year,i.quantity,i.unitPrice,i.lineTotal,o.firstName,o.lastName,o.name,o.phone,o.email,o.wilaya,o.deliveryMethod,o.address,index===0?o.subtotal:'',index===0?o.deliveryFee:'',index===0?o.total:'',o.note,o.status]))];
 return '\uFEFF'+rows.map(row=>row.map(cell).join(';')).join('\r\n');
}
