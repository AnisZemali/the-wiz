import { NextRequest } from 'next/server';
import { authorized, configured, cookieName, equal, sessionToken, sameOrigin, body, json } from '@/lib/admin-auth';
import { allowAttempt } from '@/lib/order-store';
export const runtime = 'nodejs';
export async function GET(request: NextRequest) { return json({ authenticated: authorized(request), configured: configured() }); }
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return json({ error: 'Origine refusée.' }, 403);
  if (!configured()) return json({ error: 'Configurez WIZ_ADMIN_PASSWORD sur le serveur (16 caractères minimum).' }, 503);
  try {
    if (!await allowAttempt(request, 'login', 15)) return json({ error: 'Trop de tentatives. Réessayez dans une heure.' }, 429);
    const input = await body(request);
    if (typeof input.password !== 'string' || !equal(input.password, process.env.WIZ_ADMIN_PASSWORD!)) return json({ error: 'Mot de passe incorrect.' }, 401);
    const response = json({ authenticated: true });
    response.cookies.set(cookieName, sessionToken(), { httpOnly: true, sameSite: 'strict', secure: new URL(request.url).protocol === 'https:', path: '/', maxAge: 8 * 3600 });
    return response;
  } catch { return json({ error: 'Connexion indisponible. Vérifiez la configuration du stockage.' }, 503); }
}
export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return json({ error: 'Origine refusée.' }, 403);
  const response = json({ authenticated: false }); response.cookies.delete(cookieName); return response;
}
