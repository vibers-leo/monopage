'use client';

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Theme } from '@/lib/themes';

interface SnsIconDef {
  fa: string;   // Font Awesome class
  color: string;
  bg: string;
}

function getSnsIcon(url: string): SnsIconDef | null {
  if (url.includes('instagram.com')) return { fa: 'fa-brands fa-instagram', color: '#E1306C', bg: '#E1306C12' };
  if (url.includes('youtube.com') || url.includes('youtu.be')) return { fa: 'fa-brands fa-youtube', color: '#FF0000', bg: '#FF000010' };
  if (url.includes('tiktok.com')) return { fa: 'fa-brands fa-tiktok', color: '#010101', bg: '#01010110' };
  if (url.includes('twitter.com') || url.includes('x.com')) return { fa: 'fa-brands fa-x-twitter', color: '#000000', bg: '#00000010' };
  if (url.includes('github.com')) return { fa: 'fa-brands fa-github', color: '#24292e', bg: '#24292e10' };
  if (url.includes('linkedin.com')) return { fa: 'fa-brands fa-linkedin-in', color: '#0A66C2', bg: '#0A66C212' };
  if (url.includes('threads.net')) return { fa: 'fa-brands fa-threads', color: '#101010', bg: '#10101010' };
  if (url.includes('facebook.com')) return { fa: 'fa-brands fa-facebook-f', color: '#1877F2', bg: '#1877F212' };
  if (url.includes('blog.naver.com')) return { fa: 'fa-solid fa-pen-nib', color: '#03C75A', bg: '#03C75A12' };
  if (url.includes('place.naver.com') || url.includes('naver.me') || url.includes('map.naver.com')) return { fa: 'fa-solid fa-location-dot', color: '#03C75A', bg: '#03C75A12' };
  if (url.includes('kakao')) return { fa: 'fa-solid fa-comment', color: '#3C1E1E', bg: '#FEE50030' };
  if (url.startsWith('tel:')) return { fa: 'fa-solid fa-phone', color: '#16a34a', bg: '#16a34a12' };
  if (url.startsWith('mailto:')) return { fa: 'fa-solid fa-envelope', color: '#525252', bg: '#52525212' };
  if (url.includes('shop') || url.includes('store') || url.includes('smartstore')) return { fa: 'fa-solid fa-bag-shopping', color: '#525252', bg: '#52525210' };
  if (url.includes('discord')) return { fa: 'fa-brands fa-discord', color: '#5865F2', bg: '#5865F212' };
  if (url.includes('twitch')) return { fa: 'fa-brands fa-twitch', color: '#9146FF', bg: '#9146FF12' };
  if (url.includes('spotify')) return { fa: 'fa-brands fa-spotify', color: '#1DB954', bg: '#1DB95412' };
  if (url.includes('pinterest')) return { fa: 'fa-brands fa-pinterest', color: '#E60023', bg: '#E6002312' };
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
      className={cn('flex items-center gap-3 w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl active:scale-[0.98] transition-all group cursor-pointer', className)}
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
        className="w-10 h-10 shrink-0 flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: sns ? sns.bg : (t?.cardBorder || '#f5f5f5'),
          borderRadius: '28%',
        }}
      >
        {sns ? (
          <i className={`${sns.fa} text-[16px]`} style={{ color: sns.color }} />
        ) : favicon && !faviconError ? (
          <img src={favicon} alt="" className="w-5 h-5 object-contain" onError={() => setFaviconError(true)} />
        ) : (
          <i className="fa-solid fa-globe text-[16px]" style={{ color: t?.textMuted || '#a3a3a3' }} />
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
