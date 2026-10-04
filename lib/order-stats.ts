import {orderItems,type Order} from './order-types';
export const bookCount=(order:Order)=>orderItems(order).reduce((sum,item)=>sum+item.quantity*(item.includedBooks?.reduce((n,b)=>n+b.quantity,0)??1),0);
export function orderStats(orders:Order[]){
 const commercial=orders.filter(o=>o.kind!=='gift'),gifts=orders.filter(o=>o.kind==='gift'),paid=commercial.filter(o=>o.status==='completed');
 return {commercial:commercial.length,newOrders:commercial.filter(o=>o.status==='new').length,sales:paid.reduce((n,o)=>n+bookCount(o),0),gifts:gifts.reduce((n,o)=>n+bookCount(o),0),produced:orders.filter(o=>o.kind==='gift'||o.status==='shipped'||o.status==='completed').reduce((n,o)=>n+bookCount(o),0),revenue:paid.reduce((n,o)=>n+(o.total??0),0)};
}
