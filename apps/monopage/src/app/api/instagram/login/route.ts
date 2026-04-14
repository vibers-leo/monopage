import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID || '1342970281185278';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://monopage.kr';

export async function GET(request: NextRequest) {
  const redirectUri = `${APP_URL}/api/instagram/callback`;

  const url = new URL('https://www.instagram.com/oauth/authorize');
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', 'instagram_business_basic,instagram_business_content_publish');
  url.searchParams.set('response_type', 'code');

  const state = request.nextUrl.searchParams.get('token') || '';
  url.searchParams.set('state', state);

  return NextResponse.redirect(url.toString());
}
