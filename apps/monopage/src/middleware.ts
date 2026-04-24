import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // 서브도메인 감지: {username}.monopage.kr → /username 으로 rewrite
  if (hostname.endsWith('.monopage.kr') && !hostname.startsWith('www.')) {
    const subdomain = hostname.replace('.monopage.kr', '');

    // 정적 파일, API, _next 등은 그대로
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/favicon') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    // 루트 접속 시 → /{subdomain} 프로필 페이지로 rewrite
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = `/${subdomain}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
