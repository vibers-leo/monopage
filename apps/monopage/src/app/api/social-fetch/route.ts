import { NextRequest, NextResponse } from 'next/server';

const SOCIALCRAWL_API_KEY = process.env.SOCIALCRAWL_API_KEY || 'sc_2WK52rPxWjrBYBaQMWlqJbZekar2Nyx3QkJvBtxTJHM';
const BASE_URL = 'https://www.socialcrawl.dev';

export async function POST(req: NextRequest) {
  try {
    const { platform, handle } = await req.json();

    if (!handle) {
      return NextResponse.json({ error: 'handle을 입력해주세요' }, { status: 400 });
    }

    // Instagram 게시물 가져오기
    if (platform === 'instagram') {
      const res = await fetch(
        `${BASE_URL}/v1/instagram/profile/posts?handle=${encodeURIComponent(handle)}`,
        { headers: { 'x-api-key': SOCIALCRAWL_API_KEY } }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return NextResponse.json({
          error: err?.data?.code === 'RESOURCE_NOT_FOUND'
            ? '해당 계정을 찾을 수 없어요. username을 확인해주세요.'
            : '게시물을 가져오지 못했어요. 잠시 후 다시 시도해볼게요.'
        }, { status: res.status });
      }

      const data = await res.json();
      const items = data?.data?.items || [];

      // 이미지 URL + 캡션 추출
      const posts = items.map((item: any) => {
        const imageUrl =
          item.image_versions2?.candidates?.[0]?.url ||
          item.display_uri ||
          item.carousel_media?.[0]?.image_versions2?.candidates?.[0]?.url ||
          '';
        const caption = item.caption?.text || item.accessibility_caption || '';
        const permalink = item.url || '';

        return { image_url: imageUrl, caption, permalink };
      }).filter((p: any) => p.image_url);

      return NextResponse.json({
        posts,
        credits_remaining: data.credits_remaining,
        total: posts.length,
      });
    }

    return NextResponse.json({ error: '지원하지 않는 플랫폼이에요' }, { status: 400 });
  } catch (error) {
    console.error('Social fetch error:', error);
    return NextResponse.json({ error: '게시물을 가져오지 못했어요' }, { status: 500 });
  }
}
