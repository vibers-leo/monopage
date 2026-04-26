'use client';

import React from 'react';
import { Heart, MessageCircle, Repeat2, ExternalLink } from 'lucide-react';
import type { Theme } from '@/lib/themes';

interface TimelinePost {
  text: string;
  image_url?: string;
  video_url?: string;
  username: string;
  avatar_url?: string;
  verified?: boolean;
  likes: number;
  replies: number;
  reposts: number;
  permalink?: string;
  published_at?: string;
  media_type?: string;
}

interface SnsTimelineProps {
  posts: TimelinePost[];
  theme?: Theme;
  showPermalink?: boolean;
  count?: number;
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  return new Date(dateStr).toLocaleDateString('ko', { month: 'short', day: 'numeric' });
}

function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function SnsTimeline({ posts, theme, showPermalink = true, count = 5 }: SnsTimelineProps) {
  const t = theme?.vars;

  if (!posts || posts.length === 0) return null;

  const visible = posts.slice(0, count);

  return (
    <div className="w-full mt-6 flex flex-col">
      {visible.map((post, i) => (
        <div
          key={i}
          className="py-4 flex gap-3"
          style={{ borderBottom: i < visible.length - 1 ? `1px solid ${t?.cardBorder || '#e5e5e5'}` : 'none' }}
        >
          {/* 아바타 */}
          <div className="shrink-0">
            {post.avatar_url ? (
              <img src={post.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold" style={{ backgroundColor: t?.cardBg || '#f5f5f5', color: t?.textMuted || '#a3a3a3' }}>
                {(post.username?.[0] || '?').toUpperCase()}
              </div>
            )}
          </div>

          {/* 본문 */}
          <div className="flex-1 min-w-0">
            {/* 헤더 */}
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[15px] font-bold truncate" style={{ color: t?.text || '#0a0a0a' }}>
                @{post.username}
              </span>
              {post.verified && <span className="text-blue-500 text-[12px]">✓</span>}
              <span className="text-[13px]" style={{ color: t?.textMuted || '#a3a3a3' }}>
                · {timeAgo(post.published_at || '')}
              </span>
            </div>

            {/* 텍스트 */}
            <p className="text-[15px] leading-[1.6] whitespace-pre-wrap mb-2" style={{ color: t?.text || '#0a0a0a' }}>
              {post.text.length > 200 ? post.text.slice(0, 200) + '...' : post.text}
            </p>

            {/* 이미지 */}
            {post.image_url && (
              <div className="rounded-xl overflow-hidden mb-2" style={{ border: `1px solid ${t?.cardBorder || '#e5e5e5'}` }}>
                <img src={post.image_url} alt="" className="w-full max-h-[300px] object-cover" loading="lazy" />
              </div>
            )}

            {/* 영상 */}
            {post.media_type === 'video' && post.video_url && (
              <div className="rounded-xl overflow-hidden mb-2">
                <video src={post.video_url} controls playsInline className="w-full max-h-[300px]" />
              </div>
            )}

            {/* 하단 액션 */}
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1 text-[13px]" style={{ color: t?.textMuted || '#a3a3a3' }}>
                <Heart size={14} /> {formatCount(post.likes)}
              </span>
              <span className="flex items-center gap-1 text-[13px]" style={{ color: t?.textMuted || '#a3a3a3' }}>
                <MessageCircle size={14} /> {formatCount(post.replies)}
              </span>
              <span className="flex items-center gap-1 text-[13px]" style={{ color: t?.textMuted || '#a3a3a3' }}>
                <Repeat2 size={14} /> {formatCount(post.reposts)}
              </span>
              {showPermalink && post.permalink && (
                <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="ml-auto" style={{ color: t?.textMuted || '#a3a3a3' }}>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
