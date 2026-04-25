import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://49.50.138.93:4110';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await params);
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await params);
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await params);
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await params);
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await params);
}

async function proxy(req: NextRequest, params: { path: string[] }) {
  const path = params.path.join('/');
  const url = `${BACKEND_URL}/${path}${req.nextUrl.search}`;

  const headers: Record<string, string> = {};
  const auth = req.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;
  if (req.headers.get('content-type')) headers['Content-Type'] = req.headers.get('content-type')!;

  let body: ArrayBuffer | undefined;
  if (!['GET', 'HEAD', 'DELETE'].includes(req.method)) {
    body = await req.arrayBuffer();
  }

  const res = await fetch(url, { method: req.method, headers, body });

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await res.arrayBuffer();
  return new NextResponse(data, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' },
  });
}
