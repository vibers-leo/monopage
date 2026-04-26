'use client';

import React, { useState } from 'react';
import {
  ArrowUpRight, Camera, Play, Music, Code, Briefcase,
  MessageCircle, MapPin, Phone, Globe, Mail, ShoppingBag, Newspaper,
  AtSign, Hash, Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Theme } from '@/lib/themes';

interface SnsIconDef {
  icon: React.ReactNode;
  color: string;
  bg: string;
}

function getSnsIcon(url: string): SnsIconDef | null {
  const s = 16;
  if (url.includes('instagram.com')) return { icon: <Camera size={s} />, color: '#E1306C', bg: '#E1306C15' };
  if (url.includes('youtube.com') || url.includes('youtu.be')) return { icon: <Play size={s} />, color: '#FF0000', bg: '#FF000012' };
  if (url.includes('tiktok.com')) return { icon: <Music size={s} />, color: '#010101', bg: '#01010110' };
  if (url.includes('twitter.com') || url.includes('x.com')) return { icon: <Hash size={s} />, color: '#000000', bg: '#00000010' };
  if (url.includes('github.com')) return { icon: <Code size={s} />, color: '#24292e', bg: '#24292e10' };
  if (url.includes('linkedin.com')) return { icon: <Briefcase size={s} />, color: '#0A66C2', bg: '#0A66C212' };
  if (url.includes('threads.net')) return { icon: <AtSign size={s} />, color: '#101010', bg: '#10101010' };
  if (url.includes('facebook.com')) return { icon: <Users size={s} />, color: '#1877F2', bg: '#1877F212' };
  if (url.includes('blog.naver.com')) return { icon: <Newspaper size={s} />, color: '#03C75A', bg: '#03C75A12' };
  if (url.includes('place.naver.com') || url.includes('naver.me') || url.includes('map.naver.com')) return { icon: <MapPin size={s} />, color: '#03C75A', bg: '#03C75A12' };
  if (url.includes('kakao')) return { icon: <MessageCircle size={s} />, color: '#3C1E1E', bg: '#FEE50030' };
  if (url.startsWith('tel:')) return { icon: <Phone size={s} />, color: '#16a34a', bg: '#16a34a12' };
  if (url.startsWith('mailto:')) return { icon: <Mail size={s} />, color: '#525252', bg: '#52525212' };
  if (url.includes('shop') || url.includes('store') || url.includes('smartstore')) return { icon: <ShoppingBag size={s} />, color: '#525252', bg: '#52525210' };
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
          color: sns ? sns.color : (t?.textMuted || '#a3a3a3'),
        }}
      >
        {sns ? (
          sns.icon
        ) : favicon && !faviconError ? (
          <img src={favicon} alt="" className="w-5 h-5 object-contain" onError={() => setFaviconError(true)} />
        ) : (
          <Globe size={16} style={{ color: t?.textMuted || '#a3a3a3' }} />
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
