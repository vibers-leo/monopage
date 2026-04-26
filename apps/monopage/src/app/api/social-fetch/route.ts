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
        const videoUrl = item.video_versions?.[0]?.url || '';
        const mediaType = item.media_type === 2 ? 'video' : item.media_type === 8 ? 'carousel' : 'image';
        const caption = typeof item.caption === 'object'
          ? item.caption?.text || ''
          : String(item.caption || '');
        const code = item.code || '';

        return {
          image_url: imageUrl,
          video_url: videoUrl,
          media_type: mediaType,
          caption: caption.split('\n')[0].slice(0, 60),
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

    // Threads
    if (platform === 'threads') {
      const res = await fetch(
        `${BASE_URL}/v1/threads/user/posts?handle=${encodeURIComponent(handle.replace('@', ''))}`,
        { headers: { 'x-api-key': API_KEY } }
      );

      if (!res.ok) {
        return NextResponse.json({ error: '게시물을 가져오지 못했어요. username을 확인해주세요.' }, { status: res.status });
      }

      const data = await res.json();
      if (!data.success) {
        return NextResponse.json({ error: data.message || '가져오기에 실패했어요' }, { status: 400 });
      }

      const rawPosts = data.posts || [];
      const posts = rawPosts.map((item: any) => {
        const text = item.caption?.text || '';
        const imageUrl = item.image_versions2?.candidates?.[0]?.url || '';
        const videoUrl = item.video_versions?.[0]?.url || '';
        const info = item.text_post_app_info || {};
        const user = item.user || {};

        return {
          text,
          image_url: imageUrl,
          video_url: videoUrl,
          username: user.username || handle,
          avatar_url: user.profile_pic_url || '',
          verified: user.is_verified || false,
          likes: item.like_count || 0,
          replies: info.direct_reply_count || 0,
          reposts: info.repost_count || 0,
          quotes: info.quote_count || 0,
          permalink: `https://www.threads.net/@${user.username || handle}/post/${item.code || ''}`,
          published_at: item.taken_at ? new Date(item.taken_at * 1000).toISOString() : '',
          media_type: item.media_type === 2 ? 'video' : item.media_type === 8 ? 'carousel' : imageUrl ? 'image' : 'text',
        };
      }).filter((p: any) => p.text);

      return NextResponse.json({
        posts,
        profile: {
          username: rawPosts[0]?.user?.username || handle,
          avatar_url: rawPosts[0]?.user?.profile_pic_url || '',
          verified: rawPosts[0]?.user?.is_verified || false,
        },
        credits_remaining: data.credits_remaining,
        total: posts.length,
      });
    }

    // YouTube
    if (platform === 'youtube') {
      const res = await fetch(
        `${BASE_URL}/v1/youtube/channel-videos?handle=${encodeURIComponent(handle.replace('@', ''))}`,
        { headers: { 'x-api-key': API_KEY } }
      );
      if (!res.ok) return NextResponse.json({ error: '영상을 가져오지 못했어요' }, { status: res.status });
      const data = await res.json();
      const items = data.videos || [];
      const posts = items.map((item: any) => ({
        image_url: item.thumbnail || '',
        video_url: item.url || '',
        media_type: 'video',
        caption: (item.title || '').slice(0, 60),
        permalink: item.url || '',
        views: item.viewCountInt || 0,
      })).filter((p: any) => p.image_url);
      return NextResponse.json({ posts, credits_remaining: data.credits_remaining, total: posts.length });
    }

    // TikTok
    if (platform === 'tiktok') {
      const res = await fetch(
        `${BASE_URL}/v3/tiktok/profile/videos?handle=${encodeURIComponent(handle.replace('@', ''))}`,
        { headers: { 'x-api-key': API_KEY } }
      );
      if (!res.ok) return NextResponse.json({ error: '영상을 가져오지 못했어요' }, { status: res.status });
      const data = await res.json();
      const items = data.videos || data.aweme_list || [];
      const posts = items.map((item: any) => ({
        image_url: item.video?.cover?.url_list?.[0] || item.video?.origin_cover?.url_list?.[0] || '',
        video_url: item.video?.play_addr?.url_list?.[0] || '',
        media_type: 'video',
        caption: (item.desc || '').split('\n')[0].slice(0, 60),
        permalink: item.share_url || '',
        likes: item.statistics?.digg_count || 0,
        views: item.statistics?.play_count || 0,
      })).filter((p: any) => p.image_url);
      return NextResponse.json({ posts, credits_remaining: data.credits_remaining, total: posts.length });
    }

    // X/Twitter
    if (platform === 'twitter' || platform === 'x') {
      const res = await fetch(
        `${BASE_URL}/v1/twitter/user-tweets?handle=${encodeURIComponent(handle.replace('@', ''))}`,
        { headers: { 'x-api-key': API_KEY } }
      );
      if (!res.ok) return NextResponse.json({ error: '트윗을 가져오지 못했어요' }, { status: res.status });
      const data = await res.json();
      const items = data.tweets || [];
      const posts = items.map((item: any) => {
        const legacy = item.legacy || {};
        const text = legacy.full_text || '';
        const media = legacy.entities?.media?.[0];
        return {
          text,
          image_url: media?.media_url_https || '',
          video_url: '',
          media_type: media ? 'image' : 'text',
          caption: text.split('\n')[0].slice(0, 60),
          permalink: `https://x.com/${handle}/status/${item.rest_id || ''}`,
          likes: legacy.favorite_count || 0,
          replies: legacy.reply_count || 0,
          reposts: legacy.retweet_count || 0,
          username: handle,
          published_at: legacy.created_at || '',
        };
      }).filter((p: any) => p.text);
      return NextResponse.json({ posts, credits_remaining: data.credits_remaining, total: posts.length });
    }

    return NextResponse.json({ error: '지원하지 않는 플랫폼이에요' }, { status: 400 });
  } catch (error) {
    console.error('Social fetch error:', error);
    return NextResponse.json({ error: '게시물을 가져오지 못했어요' }, { status: 500 });
  }
}
