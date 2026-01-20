import { NextResponse } from 'next/server';
import { runAlertEngine } from '@/lib/alerts/engine';

export async function POST() {
  const result = await runAlertEngine();
  return NextResponse.json({ ok: true, result });
}
