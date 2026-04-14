'use client';

import React from 'react';
import type { Theme } from '@/lib/themes';

interface ProfileHeaderProps {
  username: string;
  bio: string;
  avatarUrl?: string;
  displayName?: string;
  theme?: Theme;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, bio, avatarUrl, displayName, theme }) => {
  const t = theme?.vars;

  return (
    <div className="flex flex-col items-center gap-4 mb-8 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* 아바타 */}
      <div
        className="w-[72px] h-[72px] rounded-full overflow-hidden ring-[3px] shadow-md shrink-0"
        style={{ ringColor: t?.avatarRing, boxShadow: `0 0 0 3px ${t?.avatarRing || '#fff'}` }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-2xl font-black"
            style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #404040 100%)', color: '#fff' }}
          >
            {(username[0] || '?').toUpperCase()}
          </div>
        )}
      </div>

      {/* 텍스트 */}
      <div className="flex flex-col items-center gap-1">
        <h1
          className="text-[17px] font-black tracking-tight leading-tight"
          style={{ color: t?.text || '#0a0a0a' }}
        >
          {displayName || username}
        </h1>
        <p
          className="text-[11px] font-semibold tracking-wide"
          style={{ color: t?.textMuted || '#9ca3af' }}
        >
          @{username}
        </p>
        {bio && (
          <p
            className="text-[13px] max-w-[280px] text-center leading-relaxed mt-1.5 font-normal"
            style={{ color: t?.textSub || '#374151' }}
          >
            {bio}
          </p>
        )}
      </div>
    </div>
  );
};
