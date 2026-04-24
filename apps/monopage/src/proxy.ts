import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  // artway.monopage.kr → /{subdomain} 으로 rewrite
  const subdomain = hostname.split('.')[0];
  const isSubdomain =
    hostname.includes('.monopage.') &&
    !['www', 'monopage'].includes(subdomain);

  if (isSubdomain) {
    // /admin → 어드민 페이지 (해당 유저 관리)
    if (url.pathname === '/admin') {
      return NextResponse.rewrite(new URL(`/admin?user=${subdomain}`, request.url));
    }
    // 루트 → 프로필 페이지
    if (url.pathname === '/') {
      return NextResponse.rewrite(new URL(`/${subdomain}`, request.url));
    }
  }

  return NextResponse.next();
}

export const proxyConfig = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
