import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://49.50.138.93:4110';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { social_account_id, access_token } = await request.json();

    // Fetch media from Instagram Graph API
    const mediaRes = await fetch(
      `https://graph.instagram.com/v21.0/me/media?fields=id,caption,media_url,permalink,timestamp,media_type,thumbnail_url&limit=20&access_token=${access_token}`
    );

    if (!mediaRes.ok) {
      const err = await mediaRes.text();
      return NextResponse.json({ error: 'Instagram API failed', details: err }, { status: 502 });
    }

    const { data: posts } = await mediaRes.json();

    // Save posts to Rails backend via sync endpoint
    // The Rails sync_service will handle this, but we pass the data directly
    const saveRes = await fetch(`${API_URL}/api/v1/social_accounts/${social_account_id}/sync`, {
      method: 'GET',
      headers: { Authorization: authHeader },
    });

    return NextResponse.json({
      synced: posts?.length || 0,
      posts: posts?.map((p: any) => ({
        external_id: p.id,
        media_url: p.media_url || p.thumbnail_url,
        permalink: p.permalink,
        caption: p.caption,
        media_type: p.media_type,
        published_at: p.timestamp,
      })),
    });
  } catch (err) {
    console.error('Instagram sync error:', err);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
