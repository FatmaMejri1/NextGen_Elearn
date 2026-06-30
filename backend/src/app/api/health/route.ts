import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, service: 'NextGen Elearn API', timestamp: new Date().toISOString() });
}