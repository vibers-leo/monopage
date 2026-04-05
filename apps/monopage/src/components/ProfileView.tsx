'use client';

import React, { useEffect, useState } from 'react';
import { ProfileHeader } from '@/components/ProfileHeader';
import { LinkCard } from '@/components/LinkCard';
import { SnsGallery } from '@/components/SnsGallery';

interface ProfileViewProps {
  username: string;
}

export function ProfileView({ username }: ProfileViewProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking the response with Dynamic Theme & AI Bio:
    setTimeout(() => {
      setProfile({
        username: username,
        bio: 'Creating digital experiences at the intersection of art and code. 🚀', // AI Generated
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
        theme_config: {
          neon_color: '#00ffcc', // Extracted from photo
          bg_tone: '#ffffff'
        },
        links: [
          { id: 1, title: 'My Portfolio', url: 'https://example.com' },
          { id: 2, title: 'Shop My Prints', url: 'https://example.com/shop' }
        ],
        posts: [
          { id: '1', media_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113', permalink: '#', media_type: 'IMAGE' },
          { id: '2', media_url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0', permalink: '#', media_type: 'IMAGE' },
          { id: '3', media_url: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb', permalink: '#', media_type: 'VIDEO' }
        ]
      });
      setLoading(false);
    }, 800);
  }, [username]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div 
      className="min-h-screen transition-colors duration-1000"
      style={{ 
        backgroundColor: profile.theme_config.bg_tone,
        '--accent-neon': profile.theme_config.neon_color 
      } as React.CSSProperties}
    >
      <div className="max-w-xl mx-auto px-6 py-24 flex flex-col items-center">
        <ProfileHeader 
          username={profile.username as string} 
          bio={profile.bio} 
          avatarUrl={profile.avatar_url} 
        />

        <div className="w-full space-y-3">
          {profile.links.map((link: any) => (
            <LinkCard 
              key={link.id} 
              title={link.title} 
              url={link.url} 
              className="hover:border-[var(--accent-neon)] group transition-all"
            />
          ))}
        </div>

        <SnsGallery posts={profile.posts} />

        <div className="mt-20 opacity-20 text-center text-[10px] font-black uppercase tracking-widest">
          Created with Monopage
        </div>
      </div>
    </div>
  );
}
