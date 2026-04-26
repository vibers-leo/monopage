'use client';

import React from 'react';
import type { Theme } from '@/lib/themes';

interface SnsIconBarProps {
  links: { id: number; title: string; url: string }[];
  style?: 'circle' | 'pill';
  theme?: Theme;
}

const SNS_MAP: Record<string, { fa: string; label: string }> = {
  instagram: { fa: 'fa-brands fa-instagram', label: 'Instagram' },
  youtube: { fa: 'fa-brands fa-youtube', label: 'YouTube' },
  tiktok: { fa: 'fa-brands fa-tiktok', label: 'TikTok' },
  twitter: { fa: 'fa-brands fa-x-twitter', label: 'X' },
  x: { fa: 'fa-brands fa-x-twitter', label: 'X' },
  facebook: { fa: 'fa-brands fa-facebook-f', label: 'Facebook' },
  threads: { fa: 'fa-brands fa-threads', label: 'Threads' },
  github: { fa: 'fa-brands fa-github', label: 'GitHub' },
  linkedin: { fa: 'fa-brands fa-linkedin-in', label: 'LinkedIn' },
  naver: { fa: 'fa-solid fa-pen-nib', label: 'Naver' },
  blog: { fa: 'fa-solid fa-pen-nib', label: 'Blog' },
  kakao: { fa: 'fa-solid fa-comment', label: 'KakaoTalk' },
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
            <i className={`${sns.fa} text-[16px]`} />
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
