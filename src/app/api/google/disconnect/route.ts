import { NextResponse } from 'next/server';
import { currentAdminEmail, disconnect } from '@/lib/google';

export const runtime = 'nodejs';

export async function POST() {
  if (!(await currentAdminEmail())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await disconnect();
  return NextResponse.json({ ok: true });
}
