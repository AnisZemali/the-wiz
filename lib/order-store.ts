import { getStore } from '@netlify/blobs';
import { mkdir, readFile, writeFile, readdir, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import type { Order } from './order-types';

const local = () => process.env.ORDERS_STORAGE === 'local' && !process.env.NETLIFY;
const root = () => path.join(process.cwd(), '.data', process.env.ORDERS_TEST_MODE === 'true' ? 'order-tests' : 'orders');
const store = () => getStore({ name: process.env.CONTEXT && process.env.CONTEXT !== 'production' ? `wiz-orders-${process.env.CONTEXT}` : 'wiz-orders', consistency: 'strong' });
function safeKey(key: string) { if (!/^[a-zA-Z0-9/_-]+$/.test(key)) throw new Error('Invalid key'); return key; }
export async function getValue<T>(key: string): Promise<T | null> {
  safeKey(key);
  if (!local()) return store().get(key, { type: 'json' });
  try { return JSON.parse(await readFile(path.join(root(), key + '.json'), 'utf8')); }
  catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null; throw e; }
}
export async function putValue(key: string, value: unknown, onlyIfNew = false) {
  safeKey(key);
  if (!local()) return (await store().setJSON(key, value, { onlyIfNew })).modified;
  const file = path.join(root(), key + '.json');
  await mkdir(path.dirname(file), { recursive: true });
  if (onlyIfNew) {
    try { await writeFile(file, JSON.stringify(value), { flag: 'wx', mode: 0o600 }); return true; }
    catch (e) { if ((e as NodeJS.ErrnoException).code === 'EEXIST') return false; throw e; }
  }
  const temp = file + '.' + randomUUID() + '.tmp';
  await writeFile(temp, JSON.stringify(value), { mode: 0o600 });
  await rename(temp, file); return true;
}
export async function listOrders() {
  let keys: string[];
  if (local()) {
    try { keys = (await readdir(path.join(root(), 'orders'))).filter(n => n.endsWith('.json')).map(n => 'orders/' + n.slice(0, -5)); }
    catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') return []; throw e; }
  } else { keys = (await store().list({ prefix: 'orders/' })).blobs.map(b => b.key); }
  const orders: Order[] = [];
  for (let i = 0; i < keys.length; i += 20) {
    const batch = await Promise.all(keys.slice(i, i + 20).map(key => getValue<Order>(key)));
    orders.push(...batch.filter((o): o is Order => o !== null));
  }
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function allowAttempt(request: Request, action: string, max: number) {
  const ip = process.env.NETLIFY ? request.headers.get('x-nf-client-connection-ip') || 'unknown' : 'local';
  const hash = createHash('sha256').update(ip).digest('hex');
  const hour = Math.floor(Date.now() / 3600000);
  for (let i = 0; i < max; i++) if (await putValue(`limits/${action}-${hour}-${hash}-${i}`, { at: Date.now() }, true)) return true;
  return false;
}

export async function deleteValue(key:string){
 safeKey(key);
 if(!local()){await store().delete(key);return;}
 try{await unlink(path.join(root(),key+'.json'));}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
}
