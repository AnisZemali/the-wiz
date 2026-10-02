export const orderStatuses = ['new', 'confirmed', 'shipped', 'completed', 'cancelled'] as const;
export type OrderStatus = typeof orderStatuses[number];
export const statusLabels: Record<OrderStatus, string> = { new: 'Nouvelle', confirmed: 'Confirmée', shipped: 'Expédiée', completed: 'Terminée', cancelled: 'Annulée' };
export type Order = {
  id: string; reference: string; createdAt: string; updatedAt: string;
  courseId: string; title: string; year: number; quantity: number;
  name: string; phone: string; email: string; wilaya: string; address: string; note: string;
  status: OrderStatus;
};
