'use client';

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// SNS별 고정 아이콘 (favicon fetch 없이)
function getSnsIcon(url: string): { emoji: string; color: string } | null {
  if (url.includes('instagram.com')) return { emoji: '📸', color: '#E1306C' };
  if (url.includes('youtube.com') || url.includes('youtu.be')) return { emoji: '▶️', color: '#FF0000' };
  if (url.includes('tiktok.com')) return { emoji: '🎵', color: '#010101' };
  if (url.includes('twitter.com') || url.includes('x.com')) return { emoji: '𝕏', color: '#000000' };
  if (url.includes('github.com')) return { emoji: '⌨️', color: '#24292e' };
  if (url.includes('linkedin.com')) return { emoji: '💼', color: '#0A66C2' };
  if (url.includes('threads.net')) return { emoji: '🧵', color: '#101010' };
  if (url.includes('facebook.com')) return { emoji: 'f', color: '#1877F2' };
  if (url.includes('blog.naver.com')) return { emoji: 'N', color: '#03C75A' };
  if (url.includes('place.naver.com') || url.includes('naver.me')) return { emoji: '📍', color: '#03C75A' };
  if (url.includes('kakao')) return { emoji: '💬', color: '#FEE500' };
  return null;
}

interface LinkCardProps {
  title: string;
  url: string;
  favicon?: string;
  domain?: string;
  className?: string;
  onClick?: () => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ title, url, favicon, domain, className, onClick }) => {
  const [faviconError, setFaviconError] = useState(false);
  const sns = getSnsIcon(url);

  let hostname = domain;
  if (!hostname) {
    try { hostname = new URL(url).hostname.replace(/^www\./, ''); } catch { hostname = url; }
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3.5 w-full px-4 py-3.5 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-md active:scale-[0.98] transition-all group",
        className
      )}
    >
      {/* 아이콘 */}
      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-sm font-black"
        style={sns ? { backgroundColor: sns.color + '15' } : { backgroundColor: '#f3f4f6' }}>
        {sns ? (
          <span style={{ color: sns.color }}>{sns.emoji}</span>
        ) : favicon && !faviconError ? (
          <img
            src={favicon}
            alt=""
            className="w-6 h-6 object-contain"
            onError={() => setFaviconError(true)}
          />
        ) : (
          <span className="text-gray-400 text-xs font-black">
            {(hostname?.[0] || '?').toUpperCase()}
          </span>
        )}
      </div>

      {/* 텍스트 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate leading-snug">{title}</p>
        <p className="text-[11px] text-gray-400 truncate font-medium mt-0.5">{hostname}</p>
      </div>

      <ArrowUpRight
        size={15}
        className="text-gray-300 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
      />
    </a>
  );
};
