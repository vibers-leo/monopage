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
    <div className="flex flex-col items-center gap-4 mb-8 w-full">
      {/* Avatar */}
      <div
        className="w-[80px] h-[80px] rounded-full overflow-hidden shrink-0"
        style={{ boxShadow: `0 0 0 2px ${t?.avatarRing || '#e5e5e5'}` }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-xl font-bold"
            style={{ background: '#0a0a0a', color: '#fff' }}
          >
            {(username[0] || '?').toUpperCase()}
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-1">
        <h1
          className="text-[16px] font-bold tracking-tight leading-tight"
          style={{ color: t?.text || '#0a0a0a', fontFamily: "'Paperlogy', 'Pretendard', sans-serif" }}
        >
          {displayName || username}
        </h1>
        <p
          className="text-[15px] font-medium"
          style={{ color: t?.textMuted || '#a3a3a3' }}
        >
          @{username}
        </p>
        {bio && (
          <p
            className="text-[15px] max-w-[300px] text-center leading-[1.6] mt-2 font-normal"
            style={{ color: t?.textSub || '#525252' }}
          >
            {bio}
          </p>
        )}
      </div>
    </div>
  );
};
