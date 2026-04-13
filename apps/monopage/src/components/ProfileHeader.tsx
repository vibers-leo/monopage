'use client';

import React from 'react';

interface ProfileHeaderProps {
  username: string;
  bio: string;
  avatarUrl?: string;
  displayName?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, bio, avatarUrl, displayName }) => {
  return (
    <div className="flex flex-col items-center gap-5 mb-10 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white text-3xl font-black">
              {(username[0] || '?').toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <h1 className="text-xl font-black tracking-tight">
          {displayName || username}
        </h1>
        <p className="text-gray-400 text-xs font-bold">@{username}</p>
        {bio && (
          <p className="text-gray-500 text-sm max-w-xs text-center font-medium leading-relaxed mt-1">
            {bio}
          </p>
        )}
      </div>
    </div>
  );
};
