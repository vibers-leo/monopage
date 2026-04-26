import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.SCRAPECREATORS_API_KEY || '';
const BASE_URL = 'https://api.scrapecreators.com';

export async function POST(req: NextRequest) {
  try {
    const { platform, handle } = await req.json();

    if (!handle) {
      return NextResponse.json({ error: 'handle을 입력해주세요' }, { status: 400 });
    }

    if (platform === 'instagram') {
      const res = await fetch(
        `${BASE_URL}/v2/instagram/user/posts?handle=${encodeURIComponent(handle.replace('@', ''))}`,
        { headers: { 'x-api-key': API_KEY } }
      );

      if (!res.ok) {
        return NextResponse.json({ error: '게시물을 가져오지 못했어요. username을 확인해주세요.' }, { status: res.status });
      }

      const data = await res.json();
      if (!data.success) {
        return NextResponse.json({ error: data.message || '가져오기에 실패했어요' }, { status: 400 });
      }

      const items = data.items || [];

      const posts = items.map((item: any) => {
        const imageUrl =
          item.image_versions2?.candidates?.[0]?.url ||
          item.carousel_media?.[0]?.image_versions2?.candidates?.[0]?.url || '';
        const caption = typeof item.caption === 'object'
          ? item.caption?.text || ''
          : String(item.caption || '');
        const code = item.code || '';

        return {
          image_url: imageUrl,
          caption: caption.split('\n')[0].slice(0, 60), // 첫 줄, 60자
          permalink: code ? `https://instagram.com/p/${code}/` : '',
        };
      }).filter((p: any) => p.image_url);

      return NextResponse.json({
        posts,
        profile: {
          username: data.user?.username,
          full_name: data.user?.full_name,
          profile_pic_url: data.user?.profile_pic_url,
        },
        credits_remaining: data.credits_remaining,
        total: posts.length,
      });
    }

    // YouTube (향후)
    if (platform === 'youtube') {
      return NextResponse.json({ error: 'YouTube 지원은 준비 중이에요' }, { status: 400 });
    }

    // TikTok (향후)
    if (platform === 'tiktok') {
      return NextResponse.json({ error: 'TikTok 지원은 준비 중이에요' }, { status: 400 });
    }

    return NextResponse.json({ error: '지원하지 않는 플랫폼이에요' }, { status: 400 });
  } catch (error) {
    console.error('Social fetch error:', error);
    return NextResponse.json({ error: '게시물을 가져오지 못했어요' }, { status: 500 });
  }
}
