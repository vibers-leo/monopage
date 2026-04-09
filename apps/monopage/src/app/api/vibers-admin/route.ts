import { NextResponse } from 'next/server';

function verifyAdminSecret(request: Request): boolean {
  const secret = process.env.VIBERS_ADMIN_SECRET;
  if (!secret) return false;
  return request.headers.get('x-vibers-admin-secret') === secret;
}

export async function GET(request: Request) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({
    projectId: 'monopage',
    projectName: '모노페이지',
    stats: { totalUsers: 0, mau: 0, contentCount: 0, recentSignups: 0 },
    recentActivity: [],
    health: 'healthy',
  });
}

export async function POST(request: Request) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
