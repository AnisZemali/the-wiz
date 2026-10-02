import data from './courses.generated.json';
import { orderItems, type Order, type OrderItem } from './order-types';
export function validateOrder(input: Record<string, unknown>): Omit<Order, 'reference' | 'createdAt' | 'updatedAt' | 'status'> | null {
  const text = (key: string, min: number, max: number) => typeof input[key] === 'string' && input[key].trim().length >= min && input[key].trim().length <= max ? input[key].trim() : null;
  const id = text('id', 36, 36), name = text('name', 2, 100), phone = text('phone', 7, 24), wilaya = text('wilaya', 2, 80), address = text('address', 5, 300);
  const email = text('email', 0, 150), note = text('note', 0, 1000);
  const rawItems = input.items === undefined ? [{courseId:input.courseId,quantity:input.quantity}] : input.items;
  if (!Array.isArray(rawItems) || rawItems.length < 1 || rawItems.length > 30) return null;
  const items: OrderItem[] = [];
  for (const raw of rawItems) {
    if (!raw || typeof raw !== 'object') return null;
    const course = data.find(c => c.id === raw.courseId);
    if (!course || !Number.isInteger(raw.quantity) || raw.quantity < 1 || raw.quantity > 20 || items.some(i=>i.courseId===course.id)) return null;
    items.push({courseId:course.id,title:course.title,year:course.year,quantity:raw.quantity});
  }
  const course = items[0];
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) || !course || !name || !phone || !/^[+\d ()-]{7,24}$/.test(phone) || phone.replace(/\D/g, '').length < 7 || !wilaya || !address || email === null || note === null || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) || input.consent !== true || input.website) return null;
  return { id, items, courseId: course.courseId, title: items.map(i=>i.title).join(', '), year: course.year, quantity: items.reduce((n,i)=>n+i.quantity,0), name, phone, email, wilaya, address, note };
}
export function ordersCsv(orders: Order[]) {
  const cell = (value: unknown) => {
    let text = String(value ?? '');
    if (/^[\s\u0000-\u001f]*[=+\-@]/.test(text) || /^[0+]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  };
  const rows = [['Référence','Date UTC','Livre','Année','Quantité','Nom','Téléphone','Email','Wilaya','Adresse','Note','Statut'], ...orders.flatMap(o => orderItems(o).map(i => [o.reference,o.createdAt,i.title,i.year,i.quantity,o.name,o.phone,o.email,o.wilaya,o.address,o.note,o.status]))];
  return '\uFEFF' + rows.map(row => row.map(cell).join(';')).join('\r\n');
}
