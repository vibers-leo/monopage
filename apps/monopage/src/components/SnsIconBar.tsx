'use client';

import React from 'react';
import {
  Instagram, Youtube, Music, Github, Linkedin, Facebook,
  MessageCircle, MapPin, AtSign, Newspaper, Globe,
} from 'lucide-react';
import type { Theme } from '@/lib/themes';

interface SnsIconBarProps {
  links: { id: number; title: string; url: string }[];
  style?: 'circle' | 'pill';
  theme?: Theme;
}

const SNS_MAP: Record<string, { icon: React.ReactNode; label: string }> = {
  instagram: { icon: <Instagram size={16} />, label: 'Instagram' },
  youtube: { icon: <Youtube size={16} />, label: 'YouTube' },
  tiktok: { icon: <Music size={16} />, label: 'TikTok' },
  twitter: { icon: <AtSign size={16} />, label: 'X' },
  x: { icon: <AtSign size={16} />, label: 'X' },
  facebook: { icon: <Facebook size={16} />, label: 'Facebook' },
  threads: { icon: <AtSign size={16} />, label: 'Threads' },
  github: { icon: <Github size={16} />, label: 'GitHub' },
  linkedin: { icon: <Linkedin size={16} />, label: 'LinkedIn' },
  naver: { icon: <Newspaper size={16} />, label: 'Naver' },
  blog: { icon: <Newspaper size={16} />, label: 'Blog' },
  kakao: { icon: <MessageCircle size={16} />, label: 'KakaoTalk' },
};

function detectSnsType(url: string): string | null {
  const lower = url.toLowerCase();
  for (const key of Object.keys(SNS_MAP)) {
    if (lower.includes(key)) return key;
  }
  return null;
}

export function SnsIconBar({ links, style = 'circle', theme }: SnsIconBarProps) {
  const t = theme?.vars;
  const snsLinks = links
    .map(link => ({ ...link, snsType: detectSnsType(link.url) }))
    .filter(link => link.snsType !== null);

  if (snsLinks.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2.5 w-full my-4">
      {snsLinks.map((link) => {
        const sns = SNS_MAP[link.snsType!];
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={link.title}
            className={`flex items-center justify-center hover:scale-105 active:scale-95 transition-all ${
              style === 'pill' ? 'gap-1.5 px-3.5 py-2 rounded-full' : 'w-10 h-10 rounded-full'
            }`}
            style={{
              backgroundColor: t?.cardBg || '#f5f5f5',
              border: `1px solid ${t?.cardBorder || '#e5e5e5'}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              color: t?.text || '#0a0a0a',
            }}
          >
            {sns.icon}
            {style === 'pill' && (
              <span className="text-[14px] font-semibold" style={{ color: t?.textMuted || '#a3a3a3' }}>
                {sns.label}
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
}
