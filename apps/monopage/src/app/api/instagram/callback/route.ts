import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://49.50.138.93:4110';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const token = request.nextUrl.searchParams.get('state') || ''; // monopage JWT
  const redirectUri = `${request.nextUrl.origin}/api/instagram/callback`;

  if (!code) {
    return NextResponse.redirect(new URL('/admin?instagram=error&reason=no_code', request.url));
  }

  try {
    // 1. Exchange code for short-lived token
    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID!,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error('Instagram token exchange failed:', err);
      return NextResponse.redirect(new URL('/admin?instagram=error&reason=token_exchange', request.url));
    }

    const { access_token: shortToken, user_id } = await tokenRes.json();

    // 2. Exchange for long-lived token (60 days)
    const longRes = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${shortToken}`
    );

    if (!longRes.ok) {
      console.error('Instagram long-lived token exchange failed');
      return NextResponse.redirect(new URL('/admin?instagram=error&reason=long_token', request.url));
    }

    const { access_token: longToken, expires_in } = await longRes.json();

    // 3. Get user profile
    const profileRes = await fetch(
      `https://graph.instagram.com/v21.0/me?fields=username,account_type,profile_picture_url&access_token=${longToken}`
    );
    const igProfile = profileRes.ok ? await profileRes.json() : { username: user_id };

    // 4. Save to Rails backend
    const saveRes = await fetch(`${API_URL}/api/v1/social_accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        provider: 'instagram',
        uid: String(user_id),
        access_token: longToken,
        metadata: {
          username: igProfile.username,
          account_type: igProfile.account_type,
          profile_picture_url: igProfile.profile_picture_url,
          expires_in,
        },
      }),
    });

    if (!saveRes.ok) {
      console.error('Failed to save social account:', await saveRes.text());
    }

    // 5. Trigger initial sync
    const socialAccount = saveRes.ok ? await saveRes.json() : null;
    if (socialAccount?.id) {
      fetch(`${API_URL}/api/v1/social_accounts/${socialAccount.id}/sync`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).catch(() => {});
    }

    return NextResponse.redirect(
      new URL(`/admin?instagram=success&username=${igProfile.username || ''}`, request.url)
    );
  } catch (err) {
    console.error('Instagram callback error:', err);
    return NextResponse.redirect(new URL('/admin?instagram=error&reason=unknown', request.url));
  }
}
