import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const redirectUri = `${request.nextUrl.origin}/api/instagram/callback`;

  const url = new URL('https://www.instagram.com/oauth/authorize');
  url.searchParams.set('client_id', clientId!);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', 'instagram_business_basic');
  url.searchParams.set('response_type', 'code');

  // state에 return URL을 담아서 콜백 후 리다이렉트
  const state = request.nextUrl.searchParams.get('token') || '';
  url.searchParams.set('state', state);

  return NextResponse.redirect(url.toString());
}
