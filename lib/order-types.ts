export const orderStatuses = ['new', 'confirmed', 'shipped', 'completed', 'cancelled'] as const;
export type OrderStatus = typeof orderStatuses[number];
export const statusLabels: Record<OrderStatus, string> = { new: 'Nouvelle', confirmed: 'Confirmée', shipped: 'Expédiée', completed: 'Terminée', cancelled: 'Annulée' };
export type OrderItem = { courseId: string; title: string; year: number; quantity: number; unitPrice?: number; lineTotal?: number };
export const orderItems = (order: Order): OrderItem[] => order.items ?? [{courseId:order.courseId,title:order.title,year:order.year,quantity:order.quantity}];
export type Order = {
  items?: OrderItem[];
  firstName?: string; lastName?: string; wilayaId?: string; deliveryMethod?: "home" | "stopdesk"; subtotal?: number; deliveryFee?: number; total?: number;
  id: string; reference: string; createdAt: string; updatedAt: string;
  courseId: string; title: string; year: number; quantity: number;
  name: string; phone: string; email: string; wilaya: string; address: string; note: string;
  status: OrderStatus;
};
