import type { Metadata } from 'next';
import { AdminOrders } from '@/components/order/admin-orders';
export const metadata: Metadata = { title: 'Administration — Commandes', robots: { index: false, follow: false } };
export default function AdminPage() { return <AdminOrders />; }
