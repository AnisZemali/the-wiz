import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
export const cookieName = 'wiz_admin';
export function configured() { return (process.env.WIZ_ADMIN_PASSWORD?.length || 0) >= 16; }
export function equal(a: string, b: string) { return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest()); }
const sign = (value: string) => createHmac('sha256', process.env.WIZ_ADMIN_PASSWORD!).update('wiz-admin-session:' + value).digest('hex');
export function sessionToken() { const expires = String(Date.now() + 8 * 3600000); return `${expires}.${sign(expires)}`; }
export function authorized(request: NextRequest) {
  if (!configured()) return false;
  const [expires, signature] = (request.cookies.get(cookieName)?.value || '').split('.');
  return /^\d+$/.test(expires || '') && Number(expires) > Date.now() && !!signature && equal(signature, sign(expires));
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !!origin && origin === new URL(request.url).origin;
}
export function json(data: unknown, status = 200) { return NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }); }
export async function body(request: Request): Promise<Record<string, unknown>> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Missing body');
  let length = 0; const chunks: Uint8Array[] = [];
  while (true) { const result = await reader.read(); if (result.done) break; length += result.value.byteLength; if (length > 8192) { await reader.cancel(); throw new Error('Body too large'); } chunks.push(result.value); }
  const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error('Invalid body');
  return value;
}
