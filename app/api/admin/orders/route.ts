import { NextRequest } from 'next/server';
import { authorized, sameOrigin, json, body } from '@/lib/admin-auth';
import { listOrders, getValue, putValue } from '@/lib/order-store';
import { orderStatuses, type Order, type OrderStatus } from '@/lib/order-types';
import { ordersCsv } from '@/lib/order-validation';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  if (!authorized(request)) return json({ error: 'Connexion requise.' }, 401);
  try {
    const orders = await listOrders();
    if (request.nextUrl.searchParams.get('export') === 'csv') return new Response(ordersCsv(orders), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="the-wiz-commandes-${new Date().toISOString().slice(0,10)}.csv"`, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
    return json({ orders });
  } catch { return json({ error: 'Impossible de charger les commandes.' }, 503); }
}
export async function PATCH(request: NextRequest) {
  if (!authorized(request)) return json({ error: 'Connexion requise.' }, 401);
  if (!sameOrigin(request)) return json({ error: 'Origine refusée.' }, 403);
  try {
    const input = await body(request);
    if (typeof input.id !== 'string' || !/^[a-f0-9-]{36}$/i.test(input.id) || !orderStatuses.includes(input.status as OrderStatus)) return json({ error: 'Statut invalide.' }, 400);
    const order = await getValue<Order>(`orders/${input.id}`);
    if (!order) return json({ error: 'Commande introuvable.' }, 404);
    const updated = { ...order, status: input.status as OrderStatus, updatedAt: new Date().toISOString() };
    await putValue(`orders/${order.id}`, updated);
    return json({ order: updated });
  } catch { return json({ error: 'La modification n’a pas été enregistrée.' }, 503); }
}
