// Run with ORDERS_TEST_MODE=true on port 3101. Only synthetic test records are removed.
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFile,unlink} from 'node:fs/promises';
process.loadEnvFile('.env.local');
const base='http://localhost:3101',ids=[];
const request=(path,method='GET',data,cookie)=>fetch(base+path,{method,headers:{Origin:base,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(data?{body:JSON.stringify(data)}:{})});
const fresh=()=>{const id=randomUUID();ids.push(id);return id;};
const order={id:fresh(),items:[{courseId:'1-anatomie',quantity:1},{courseId:'1-biochimie',quantity:1}],firstName:'=SUM(1+1)',lastName:'Test',phone:'0555000000',email:'test@example.com',wilayaId:'31',deliveryMethod:'home',address:'Adresse de test uniquement',note:'Test é et "guillemets"',consent:true,website:'',expectedTotal:2300};
try{
 assert.equal((await request('/api/admin/orders')).status,401);
 assert.equal((await request('/api/admin/orders?export=csv')).status,401);
 assert.equal((await request('/api/admin/orders','GET',undefined,'wiz_admin=9999999999999.forged')).status,401);
 for(const fields of [{items:[]},{items:[{courseId:'invalid',quantity:1}]},{items:[order.items[0],order.items[0]]},{items:[{courseId:'1-anatomie',quantity:0}]},{consent:false},{email:''},{firstName:''},{phone:'letters'},{address:''},{deliveryMethod:'invalid'},{wilayaId:'50'},{wilayaId:'54'},{wilayaId:'56'},{expectedTotal:1}])assert.equal((await request('/api/order','POST',{...order,...fields})).status,400,JSON.stringify(fields));
 assert.equal((await fetch(base+'/api/order',{method:'POST',headers:{Origin:'https://attacker.example','Content-Type':'application/json'},body:JSON.stringify(order)})).status,403);
 assert.equal((await request('/api/order','POST',{...order,subtotal:1,deliveryFee:0,total:1})).status,201);
 assert.equal((await request('/api/order','POST',order)).status,200);
 assert.equal((await request('/api/order','POST',{...order,firstName:'Changed'})).status,409);
 const login=await request('/api/admin/session','POST',{password:process.env.WIZ_ADMIN_PASSWORD});assert.equal(login.status,200);
 const cookie=login.headers.get('set-cookie').split(';')[0];assert.match(login.headers.get('set-cookie'),/HttpOnly/i);assert.match(login.headers.get('set-cookie'),/SameSite=strict/i);
 const orders=async()=>(await(await request('/api/admin/orders','GET',undefined,cookie)).json()).orders;
 let saved=(await orders()).find(o=>o.id===order.id);assert.equal(saved.subtotal,1700);assert.equal(saved.deliveryFee,600);assert.equal(saved.total,2300);assert.equal(saved.items[0].unitPrice,1000);assert.equal(saved.items[1].lineTotal,700);assert.equal(saved.firstName,order.firstName);assert.equal(saved.lastName,'Test');
 const pickup={...order,id:fresh(),deliveryMethod:'stopdesk',address:'',expectedTotal:2000};assert.equal((await request('/api/order','POST',pickup)).status,201);saved=(await orders()).find(o=>o.id===pickup.id);assert.equal(saved.total,2000);assert.equal(saved.deliveryFee,300);assert.equal(saved.address,'');
 const multiple={...order,id:fresh(),items:[{courseId:'1-anatomie',quantity:1},{courseId:'5-pediatrie',quantity:1},{courseId:'6-dermatologie',quantity:2}],expectedTotal:3900};assert.equal((await request('/api/order','POST',multiple)).status,201);saved=(await orders()).find(o=>o.id===multiple.id);assert.equal(saved.subtotal,3300);assert.equal(saved.deliveryFee,600);assert.equal(saved.total,3900);
 assert.equal((await request('/api/admin/orders','PATCH',{id:order.id,status:'confirmed'},cookie)).status,200);
 assert.equal((await request('/api/order','POST',order)).status,200);
 const csv=await(await request('/api/admin/orders?export=csv','GET',undefined,cookie)).text();assert.ok(csv.includes("'=SUM(1+1)"));assert.ok(csv.includes('confirmed'));assert.ok(csv.includes('é'));assert.ok(csv.includes('""guillemets""'));assert.equal(csv.split('\r\n').filter(line=>line.includes(order.id)).length,2);assert.equal(csv.split('\r\n').filter(line=>line.includes(order.id)&&line.includes('"2300"')).length,1);
 const rates=JSON.parse(await readFile('lib/delivery-rates.json','utf8'));assert.equal(rates.length,58);assert.deepEqual(rates.filter(r=>!r.available).map(r=>r.id),['50','54','56']);assert.equal(rates.find(r=>r.id==='27').home,450);assert.equal(rates.find(r=>r.id==='27').stopdesk,250);
 const details=JSON.parse(await readFile('lib/book-details.json','utf8'));assert.equal(Object.keys(details).length,49);assert.equal(details['3-anatomopathologie'].price,600);assert.equal(details['3-anatomopathologie'].title.fr,'Anatomie');
 assert.equal((await request('/api/admin/orders','PATCH',{id:order.id,status:'invalid'},cookie)).status,400);
 assert.equal((await request('/api/admin/session','DELETE',undefined,cookie)).status,200);
 console.log('PASS: server-authoritative prices; Oran home 2300 / stopdesk 2000; multiple books; one delivery fee; unavailable destinations; required home address; required customer data; tampered totals; retry protection; admin authorization; historical status updates; Excel prices and totals; 58 rates and 49 priced books.');
}finally{await Promise.all(ids.map(id=>unlink(`.data/order-tests/orders/${id}.json`).catch(()=>{})));}
