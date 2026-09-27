import { NextResponse } from 'next/server';
import { site } from '@/lib/content';
export async function POST() {
  return NextResponse.json({ error: `Please request your book by email at ${site.email}. Price, availability and delivery are confirmed directly.` }, { status: 410 });
}
