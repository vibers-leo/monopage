'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SnsIconBarProps {
  links: { id: number; title: string; url: string }[];
  style?: 'circle' | 'pill';
}

const SNS_ICONS: Record<string, { icon: string; color: string }> = {
  instagram: { icon: '📸', color: '#E4405F' },
  youtube: { icon: '▶️', color: '#FF0000' },
  tiktok: { icon: '🎵', color: '#000000' },
  twitter: { icon: '𝕏', color: '#000000' },
  x: { icon: '𝕏', color: '#000000' },
  facebook: { icon: '👤', color: '#1877F2' },
  threads: { icon: '🧵', color: '#000000' },
  github: { icon: '💻', color: '#333333' },
  linkedin: { icon: '💼', color: '#0A66C2' },
  naver: { icon: '📝', color: '#03C75A' },
  blog: { icon: '📝', color: '#03C75A' },
  kakao: { icon: '💬', color: '#FEE500' },
};

function detectSnsType(url: string): string | null {
  const lower = url.toLowerCase();
  for (const key of Object.keys(SNS_ICONS)) {
    if (lower.includes(key)) return key;
  }
  return null;
}

export function SnsIconBar({ links, style = 'circle' }: SnsIconBarProps) {
  const snsLinks = links
    .map(link => ({ ...link, snsType: detectSnsType(link.url) }))
    .filter(link => link.snsType !== null);

  if (snsLinks.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-3 w-full my-4">
      {snsLinks.map((link, i) => {
        const sns = SNS_ICONS[link.snsType!];
        return (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
              style === 'pill'
                ? 'px-4 py-2 rounded-full bg-gray-50 border border-gray-100 gap-2'
                : 'w-11 h-11 rounded-full bg-gray-50 border border-gray-100'
            }`}
            title={link.title}
          >
            <span className="text-lg">{sns.icon}</span>
            {style === 'pill' && (
              <span className="text-[10px] font-black uppercase tracking-wider">{link.snsType}</span>
            )}
          </motion.a>
        );
      })}
    </div>
  );
}
