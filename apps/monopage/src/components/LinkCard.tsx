'use client';

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Theme } from '@/lib/themes';

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
  theme?: Theme;
}

export const LinkCard: React.FC<LinkCardProps> = ({ title, url, favicon, domain, className, onClick, theme }) => {
  const [faviconError, setFaviconError] = useState(false);
  const sns = getSnsIcon(url);
  const t = theme?.vars;

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
      className={cn('flex items-center gap-3 w-full px-4 py-3.5 rounded-xl active:scale-[0.98] transition-all group cursor-pointer', className)}
      style={{
        backgroundColor: t?.cardBg || '#ffffff',
        border: `1px solid ${t?.cardBorder || '#e5e5e5'}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = t?.cardHover || '#f5f5f5'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = t?.cardBg || '#ffffff'; }}
    >
      {/* Icon — squircle */}
      <div
        className="w-10 h-10 shrink-0 flex items-center justify-center text-[14px] font-bold overflow-hidden"
        style={{
          backgroundColor: sns ? sns.color + '12' : (t?.cardBorder || '#f5f5f5'),
          borderRadius: '28%',
        }}
      >
        {sns ? (
          <span style={{ color: sns.color }}>{sns.emoji}</span>
        ) : favicon && !faviconError ? (
          <img src={favicon} alt="" className="w-5 h-5 object-contain" onError={() => setFaviconError(true)} />
        ) : (
          <span style={{ color: t?.textMuted || '#a3a3a3' }} className="text-[14px] font-bold">
            {(hostname?.[0] || '?').toUpperCase()}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold truncate leading-tight" style={{ color: t?.text || '#0a0a0a' }}>
          {title}
        </p>
        <p className="text-[14px] truncate font-normal mt-0.5" style={{ color: t?.textMuted || '#a3a3a3' }}>
          {hostname}
        </p>
      </div>

      <ArrowUpRight
        size={14}
        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
        style={{ color: t?.textMuted || '#d4d4d4' }}
      />
    </a>
  );
};
