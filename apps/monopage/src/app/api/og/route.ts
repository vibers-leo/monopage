import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Monopage/1.0)' },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();

    const getTag = (name: string) => {
      const match =
        html.match(new RegExp(`<meta[^>]+property=["']og:${name}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${name}["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'));
      return match?.[1] || null;
    };

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = getTag('title') || titleMatch?.[1]?.trim() || null;
    const description = getTag('description');
    const image = getTag('image');

    const hostname = new URL(url).hostname.replace(/^www\./, '');

    // favicon: try og:image favicon first, then Google favicon service
    const faviconMatch =
      html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i) ||
      html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/i);
    let favicon = faviconMatch?.[1] || null;
    if (favicon && !favicon.startsWith('http')) {
      const base = new URL(url);
      favicon = favicon.startsWith('/') ? `${base.protocol}//${base.host}${favicon}` : `${base.protocol}//${base.host}/${favicon}`;
    }
    if (!favicon) {
      favicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    }

    return NextResponse.json({ title, description, image, hostname, favicon });
  } catch {
    try {
      const hostname = new URL(url).hostname.replace(/^www\./, '');
      return NextResponse.json({ title: null, description: null, image: null, hostname });
    } catch {
      return NextResponse.json({ title: null, description: null, image: null, hostname: url });
    }
  }
}
