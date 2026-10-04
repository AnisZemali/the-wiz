import {createHash} from 'node:crypto';
import { NextRequest } from 'next/server';
import { body, configured, sameOrigin, json } from '@/lib/admin-auth';
import { validateOrder } from '@/lib/order-validation';
import { getValue, putValue, allowAttempt } from '@/lib/order-store';
import type { Order } from '@/lib/order-types';
export const runtime = 'nodejs';
export async function GET() { return json({ available: configured() }); }
export async function POST(request: NextRequest) {
 if (!sameOrigin(request)) return json({error:'Invalid origin'},403);
 if (!configured()) return json({error:'Ordering is not configured yet'},503);
 let input;
 try { input = validateOrder(await body(request)); } catch { return json({error:'Invalid request'},400); }
 if (!input) return json({error:'Invalid order details'},400);
 try {
   const requestHash=createHash('sha256').update(JSON.stringify(input)).digest('hex');
   const existing=await getValue<Order>(`orders/${input.id}`);
   if (existing) { const matches=existing.requestHash?existing.requestHash===requestHash:Object.entries(input).every(([key,value])=>JSON.stringify(existing[key as keyof Order])===JSON.stringify(value)); return matches ? json({reference:existing.reference}) : json({error:'Order reference already used'},409); }
   if (!await allowAttempt(request,'order',20)) return json({error:'Too many requests'},429);
   const now=new Date().toISOString();
   const order:Order={...input,requestHash,reference:'WZ-'+input.id,createdAt:now,updatedAt:now,status:'new'};
   const created=await putValue(`orders/${input.id}`,order,true);
   if(!created)return json({error:'Order already submitted; retry to retrieve confirmation'},409);
   return json({reference:order.reference},201);
 } catch { return json({error:'Order could not be saved. Please try again later.'},503); }
}
