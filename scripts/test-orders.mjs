// Run against a local test server with ORDERS_TEST_MODE=true on port 3101.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { unlink } from 'node:fs/promises';
process.loadEnvFile('.env.local');
const base = 'http://localhost:3101';
const request = (path, method='GET', data, cookie) => fetch(base+path, { method, headers: { Origin:base, 'Content-Type':'application/json', ...(cookie?{Cookie:cookie}:{}) }, ...(data?{body:JSON.stringify(data)}:{}) });
const id=randomUUID(), cartId=randomUUID();
const order={id,courseId:'1-biostatistiques',name:'=SUM(1+1)',phone:'0555000000',email:'test@example.com',wilaya:'Alger',address:'Adresse de test uniquement',quantity:2,note:'Test, accents é et "guillemets"',consent:true,website:''};
try {
  assert.equal((await request('/api/admin/orders')).status,401);
  assert.equal((await request('/api/admin/orders?export=csv')).status,401);
  assert.equal((await request('/api/admin/orders','GET',undefined,'wiz_admin=9999999999999.forged')).status,401);
  assert.equal((await request('/api/order','POST',{...order,courseId:'invalid'})).status,400);
  assert.equal((await request('/api/order','POST',{...order,quantity:0})).status,400);
  assert.equal((await request('/api/order','POST',{...order,consent:false})).status,400);
  assert.equal((await fetch(base+'/api/order',{method:'POST',headers:{Origin:'https://attacker.example','Content-Type':'application/json'},body:JSON.stringify(order)})).status,403);
  assert.equal((await request('/api/order','POST',order)).status,201);
  assert.equal((await request('/api/order','POST',order)).status,200);
  const login=await request('/api/admin/session','POST',{password:process.env.WIZ_ADMIN_PASSWORD});assert.equal(login.status,200);
  const cookie=login.headers.get('set-cookie').split(';')[0];
  assert.match(login.headers.get('set-cookie'),/HttpOnly/i);assert.match(login.headers.get('set-cookie'),/SameSite=strict/i);
  const orders=(await (await request('/api/admin/orders','GET',undefined,cookie)).json()).orders;
  assert.equal(orders.filter(o=>o.id===id).length,1);
  assert.equal(orders.find(o=>o.id===id).title,'Biostatistiques');
  assert.equal((await request('/api/admin/orders','PATCH',{id,status:'confirmed'},cookie)).status,200);
  const exported=await request('/api/admin/orders?export=csv','GET',undefined,cookie);assert.equal(exported.status,200);
  const csv=await exported.text();assert.ok(csv.includes("'=SUM(1+1)"));assert.ok(csv.includes('confirmed'));assert.ok(csv.includes('é'));assert.ok(csv.includes('""guillemets""'));
  assert.equal((await request('/api/admin/orders','PATCH',{id,status:'invalid'},cookie)).status,400);
  const courses=JSON.parse(await (await import('node:fs/promises')).readFile('lib/courses.generated.json','utf8'));
  const cart={...order,id:cartId,items:[{courseId:courses[0].id,quantity:2},{courseId:courses[1].id,quantity:3}]};
  assert.equal((await request('/api/order','POST',{...cart,items:[]})).status,400);
  assert.equal((await request('/api/order','POST',{...cart,items:[cart.items[0],cart.items[0]]})).status,400);
  assert.equal((await request('/api/order','POST',{...cart,items:[{courseId:'invalid',quantity:1}]})).status,400);
  assert.equal((await request('/api/order','POST',cart)).status,201);
  assert.equal((await request('/api/order','POST',cart)).status,200);
  const saved=(await (await request('/api/admin/orders','GET',undefined,cookie)).json()).orders.find(o=>o.id===cartId);
  assert.equal(saved.items.length,2);assert.equal(saved.quantity,5);
  const cartCsv=await (await request('/api/admin/orders?export=csv','GET',undefined,cookie)).text();
  assert.equal(cartCsv.split('\r\n').filter(line=>line.includes(cartId)).length,2);
  console.log('PASS: multi-book cart, quantities, single order, retries, invalid items, Excel line items.');
  const logout=await request('/api/admin/session','DELETE',undefined,cookie);assert.equal(logout.status,200);assert.match(logout.headers.get('set-cookie'),/expires=/i);
  console.log('PASS: save, persistence, duplicate prevention, validation, private admin/export, session cookie, CSRF, status updates, Excel-safe CSV and logout.');
} finally {
  // Only remove the synthetic order created by this test; never real orders.
  await Promise.all([id,cartId].map(key=>unlink(`.data/order-tests/orders/${key}.json`).catch(()=>{})));
}
